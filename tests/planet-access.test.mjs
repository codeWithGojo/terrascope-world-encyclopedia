import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {UpgradePreview} from '../app/components/planet/UpgradePreview.tsx';
import {entitlements} from '../app/access.ts';
test('Planet uses the existing trusted account entitlements and denies forged browser metadata',()=>{
 assert.deepEqual(entitlements({user_metadata:{terrascope_pro:true}}),entitlements(null));
 const home=fs.readFileSync('app/page.tsx','utf8'),planet=fs.readFileSync('app/components/planet/ExplorePlanet.tsx','utf8');
 assert.match(home,/await getViewer\(\)/);assert.match(home,/<ExplorePlanet access=\{features\}/);
 assert.match(planet,/access\.compare\?<ComparePanel/);assert.match(planet,/access\.history\?<HistoryPanel/);
 assert.match(planet,/if\(hd&&!access\.hdExport\)/);assert.match(planet,/hd,!access\.pro\)/);
 assert.doesNotMatch(planet,/localStorage.*(?:isPro|terrascope_pro)|searchParams\.get\('pro'\)/);
});
test('all three locked previews have accessible dismiss controls and no checkout',()=>{
 for(const feature of ['compare','history','hdExport']){const html=renderToStaticMarkup(createElement(UpgradePreview,{feature,onClose(){}}));assert.match(html,/aria-label="Close Pro preview"/);assert.match(html,/href="\/pro"/);assert.match(html,/Payments are not open yet/);assert.match(html,/aria-hidden="true"/);}
});
