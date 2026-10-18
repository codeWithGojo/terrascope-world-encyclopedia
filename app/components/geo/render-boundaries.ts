import type {Feature,Geometry,Position} from 'geojson';

// Display-only simplification. Keep the original geometry for geographic picking.
// A fifth of a degree is below a pixel on the overview globe.
function simplifyRing(ring:Position[],tolerance:number):Position[]{
 if(ring.length<=4)return ring;
 const keep=new Uint8Array(ring.length),stack=[0,ring.length-1],limit=tolerance*tolerance;
 keep[0]=keep[ring.length-1]=1;
 while(stack.length){
  const end=stack.pop()!,start=stack.pop()!,a=ring[start],b=ring[end];
  const dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy;
  let furthest=-1,max=limit;
  for(let i=start+1;i<end;i++){
   const point=ring[i],t=length?Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dy)/length)):0;
   const x=point[0]-a[0]-t*dx,y=point[1]-a[1]-t*dy,distance=x*x+y*y;
   if(distance>max){max=distance;furthest=i;}
  }
  if(furthest>=0){keep[furthest]=1;stack.push(start,furthest,furthest,end);}
 }
 const result=ring.filter((_,i)=>keep[i]);
 // Tiny islands retain their full ring, including its closing coordinate.
 const area=(points:Position[])=>points.slice(1).reduce((sum,p,i)=>sum+points[i][0]*p[1]-p[0]*points[i][1],0);
 return result.length>=4&&area(result)*area(ring)>0?result:ring;
}
function extent(polygon:Position[][]){
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
 for(const p of polygon[0]){minX=Math.min(minX,p[0]);maxX=Math.max(maxX,p[0]);minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1]);}
 return Math.max(maxX-minX,maxY-minY);
}
export function renderBoundary<T extends Feature<Geometry>>(feature:T,tolerance=.2):T{
 const geometry=feature.geometry;
 if(geometry.type==='Polygon')return {...feature,geometry:{...geometry,coordinates:geometry.coordinates.map(ring=>simplifyRing(ring,tolerance))}};
 if(geometry.type==='MultiPolygon'){
  const sizes=geometry.coordinates.map(extent),largest=sizes.indexOf(Math.max(...sizes));
  // Omit subpixel offshore fragments, but retain every country's largest island.
  return {...feature,geometry:{...geometry,coordinates:geometry.coordinates.filter((_,i)=>i===largest||sizes[i]>tolerance*2).map(polygon=>polygon.map(ring=>simplifyRing(ring,tolerance)))}};
 }
 return feature;
}
