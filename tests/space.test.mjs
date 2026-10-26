import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../app/space/planets.json',import.meta.url)));
test('solar register contains eight ordered worlds and complete profile content',()=>{assert.deepEqual(data.planets.map(p=>p.slug),['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune']);let previous=0;for(const p of data.planets){assert.equal(p.facts.length,10);assert.equal(new Set(p.facts).size,10);assert.ok(p.missions.length);assert.ok(p.distanceMillionKm>previous);previous=p.distanceMillionKm;for(const k of ['diameterKm','dayHours','yearDays','gravity'])assert.ok(Number.isFinite(p[k])&&p[k]>0);assert.ok(p.source.startsWith('https://science.nasa.gov/'))}});
test('Earth weight identity and outer-orbit proportions are finite',()=>{const earth=data.planets[2];assert.equal(70*earth.gravity/earth.gravity,70);assert.ok(data.planets[7].distanceMillionKm/earth.distanceMillionKm>30);for(const p of data.planets)assert.ok(Number.isFinite(70*p.gravity/earth.gravity))});
