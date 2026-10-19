import {canvasBlob} from '../components/planet/export-utils';
export async function mapImage(svg:SVGSVGElement,count:number,total:number,regions:number){
 const clone=svg.cloneNode(true) as SVGSVGElement;
 clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width','1440');clone.setAttribute('height','778');
 clone.querySelectorAll('path').forEach(path=>{path.setAttribute('fill',path.getAttribute('data-visited')==='true'?'#f47896':'#282d2c');path.setAttribute('stroke','#101514');path.setAttribute('stroke-width','0.8');});
 const source=new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(source);
 try{
  const image=new Image();image.src=url;await image.decode();
  const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1440;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Image export unavailable');
  ctx.fillStyle='#101514';ctx.fillRect(0,0,1600,1440);
  ctx.fillStyle='#f47896';ctx.font='600 24px Arial';ctx.fillText('TERRASCOPE  /  MY TRAVELS',80,100);
  ctx.fillStyle='#f5f6f3';ctx.font='66px Georgia';ctx.fillText('A world with my footprints.',80,206);
  ctx.drawImage(image,80,250,1440,778);
  const percent=total?Math.round(count/total*100):0;
  for(const [index,value,label] of [[0,`${count} / ${total}`,'COUNTRIES VISITED'],[1,`${percent}%`,'OF THE ATLAS'],[2,String(regions),'REGIONS EXPLORED']] as const){
   ctx.fillStyle='#f47896';ctx.font='600 68px Arial';ctx.fillText(value,80+index*500,1165);
   ctx.fillStyle='#a7b0ab';ctx.font='20px Arial';ctx.fillText(label,80+index*500,1210);
  }
  ctx.fillStyle='#a7b0ab';ctx.font='18px Arial';ctx.fillText('Made with TerraScope · My travels',80,1355);
  ctx.font='14px Arial';ctx.fillText('Borders: World Borders / ODbL · Map reflects personal travel marks.',80,1388);
  return canvasBlob(canvas);
 }finally{URL.revokeObjectURL(url);}
}
