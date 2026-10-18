import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {geoArea,geoContains} from 'd3-geo';
import {renderBoundary} from '../app/components/geo/render-boundaries.ts';
const original=JSON.parse(fs.readFileSync('public/data/world-boundaries.json','utf8')).features;
function points(value){return typeof value[0]==='number'?1:value.reduce((n,a)=>n+points(a),0);}
test('display boundaries reduce drawing work without changing original picking data',()=>{
 const snapshot=JSON.stringify(original),display=original.map(f=>renderBoundary(f));
 assert.equal(JSON.stringify(original),snapshot);
 assert.equal(display.length,195);
 assert.ok(display.reduce((n,f)=>n+points(f.geometry.coordinates),0)<original.reduce((n,f)=>n+points(f.geometry.coordinates),0)*.35);
 for(const feature of display){
  assert.ok(geoArea(feature)<Math.PI*2,feature.properties.code);
  const polygons=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:[];
  for(const polygon of polygons)for(const ring of polygon){assert.ok(ring.length>=4);assert.deepEqual(ring[0],ring.at(-1));}
 }
 for(const [code,location] of [['NG',[8,9]],['US',[-100,40]],['JP',[139,36]],['BR',[-52,-10]],['AU',[135,-25]],['IT',[12,43]]])assert.ok(geoContains(display.find(f=>f.properties.code===code),location),code);
});
test('tiny islands and non-polygon markers survive display simplification',()=>{
 const ring=[[0,0],[.001,0],[.001,.001],[0,.001],[0,0]],feature={type:'Feature',properties:{code:'tiny'},geometry:{type:'Polygon',coordinates:[ring]}};
 assert.deepEqual(renderBoundary(feature).geometry.coordinates,[ring]);
 const marker={type:'Feature',properties:{code:'marker'},geometry:{type:'Point',coordinates:[1,2]}};
 assert.equal(renderBoundary(marker),marker);
});
