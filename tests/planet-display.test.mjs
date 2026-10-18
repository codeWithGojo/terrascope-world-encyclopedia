import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {displayPolygons} from '../app/components/planet/display-polygons.ts';
const features=JSON.parse(fs.readFileSync('public/data/world-boundaries.json','utf8')).features;
test('the cinematic Earth carries no country overlays on either screen size',()=>{
 for(const mobile of [true,false])assert.deepEqual(displayPolygons(features,false,mobile,'NG',['JP'],true),[]);
});
test('mobile satellite view builds only selected and visited highlights',()=>{
 assert.deepEqual(displayPolygons(features,true,true,'',[],false),[]);
 assert.deepEqual(displayPolygons(features,true,true,'NG',['JP','NG'],false).map(f=>f.properties.code).sort(),['JP','NG']);
 assert.equal(features.length,195);
});
test('data layers and desktop exploration retain every country',()=>{
 assert.equal(displayPolygons(features,true,true,'NG',[],true),features);
 assert.equal(displayPolygons(features,true,false,'NG',[],false),features);
});
