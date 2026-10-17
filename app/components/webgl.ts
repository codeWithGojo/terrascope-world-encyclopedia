// Shared tiny renderer: the globe and panoramas load no third-party scripts.
export function createSurface(canvas: HTMLCanvasElement, fragment: string) {
  const gl = canvas.getContext("webgl", {alpha: true, antialias: true, powerPreference: "low-power"});
  if (!gl) throw new Error("WebGL unavailable");
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {gl.deleteShader(shader); throw new Error("Renderer unavailable");}
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, "attribute vec2 position; varying vec2 uv; void main(){ uv=position*.5+.5; gl_Position=vec4(position,0.,1.); }");
  const pixel = compile(gl.FRAGMENT_SHADER, "precision mediump float; varying vec2 uv; uniform sampler2D image; uniform float aspect; " + fragment);
  const program = gl.createProgram()!; gl.attachShader(program, vertex); gl.attachShader(program, pixel); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Renderer unavailable");
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "position"); gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  let disposed = false;
  return {
    load(src: string) {return new Promise<void>((resolve,reject) => {
      const photo = new Image();
      photo.onload = () => {if(disposed) return; const max=Math.min(4096,gl.getParameter(gl.MAX_TEXTURE_SIZE));let source:TexImageSource=photo;if(photo.width>max||photo.height>max){const scaled=document.createElement("canvas");const factor=max/Math.max(photo.width,photo.height);scaled.width=Math.round(photo.width*factor);scaled.height=Math.round(photo.height*factor);const context=scaled.getContext("2d");if(!context){reject(new Error("Image unavailable"));return;}context.drawImage(photo,0,0,scaled.width,scaled.height);source=scaled;} gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,source);if(gl.getError()!==gl.NO_ERROR){reject(new Error("Image unavailable"));return;}resolve();};
      photo.onerror = () => reject(new Error("Image unavailable")); photo.src = src;
    });},
    draw(values: Record<string,number>) {
      if(disposed) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1,Math.round(canvas.clientWidth*ratio)), height = Math.max(1,Math.round(canvas.clientHeight*ratio));
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
      gl.viewport(0,0,width,height); gl.uniform1f(gl.getUniformLocation(program,"aspect"),width/height);
      for(const [key,value] of Object.entries(values)) gl.uniform1f(gl.getUniformLocation(program,key),value);
      gl.drawArrays(gl.TRIANGLES,0,6);
    },
    dispose(){disposed=true;gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(pixel);}
  };
}
