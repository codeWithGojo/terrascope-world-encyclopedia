import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {cityGuides,cityGuideExtrasByPath,travelPlacesByCode} from '../app/country-content.ts';

const root=new URL('../',import.meta.url);
const required=['abuja','port-harcourt','asaba','ibadan','benin-city'];
const userAgents={
  desktop:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',
  mobile:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',
};

test('all detailed destinations have bundled images and complete planning records',()=>{
  assert.equal(cityGuides.length,20);
  for(const guide of cityGuides){
    const path=`${guide.countrySlug}/${guide.citySlug}`;
    assert.ok(guide.gallery.length,path);
    assert.ok(guide.overview&&guide.bestTime&&guide.gettingAround&&guide.safety,path);
    assert.ok(guide.attractions.length>=2,path);
    assert.equal(cityGuideExtrasByPath[path].itinerary.length,3,path);
    for(const photo of guide.gallery){
      assert.ok(photo.url.startsWith('/travel/'),photo.url);
      assert.ok(photo.alt&&photo.credit,photo.url);
      const relative=decodeURIComponent(photo.url).slice(1);
      for(const folder of ['public/','dist/client/']){
        const file=new URL(folder+relative,root);
        assert.ok(existsSync(file),file.pathname);
        assert.ok(readFileSync(file).length>1000,file.pathname);
      }
    }
  }
  for(const slug of required)assert.ok(cityGuides.some(g=>g.countrySlug==='nigeria'&&g.citySlug===slug),slug);
  for(const name of ['Giza pyramid complex','Saqqara','Abu Simbel','Valley of the Kings'])assert.ok(travelPlacesByCode.EG.some(p=>p.name===name),name);
});

test('mobile and desktop requests can browse the directory, countries, rankings and every city',async()=>{
  const {default:worker}=await import(new URL('../dist/server/index.js',import.meta.url).href);
  const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
  const context={waitUntil(){},passThroughOnException(){}};
  const request=async(path,userAgent)=>{
    const response=await worker.fetch(new Request('http://localhost'+path,{headers:{accept:'text/html','user-agent':userAgent}}),env,context);
    assert.equal(response.status,200,path);
    const html=await response.text();
    assert.doesNotMatch(html,/name="codex-preview"/);
    assert.match(html,/aria-controls="site-navigation"/,path);
    assert.match(html,/href="\/my-travels"/,path);
    assert.match(html,/name="viewport"/,path);
    return html;
  };
  for(const userAgent of Object.values(userAgents)){
    const home=await request('/',userAgent);assert.match(home,/href="\/countries"/);
    const directory=await request('/countries?q=Nigeria&region=Africa',userAgent);
    assert.match(directory,/href="\/countries\/nigeria"/);
    const nigeria=await request('/countries/nigeria',userAgent);
    for(const slug of required){
      assert.ok(nigeria.includes(`href="/countries/nigeria/cities/${slug}"`),slug);
      assert.ok(nigeria.includes(`src="/travel/destinations/nigeria-${slug}.webp"`),slug);
    }
    const egypt=await request('/countries/egypt',userAgent);
    assert.match(egypt,/Giza pyramid complex/);assert.match(egypt,/All%20Gizah%20Pyramids.jpg/);
    for(const slug of ['cairo','luxor','alexandria','aswan'])assert.ok(egypt.includes(`/countries/egypt/cities/${slug}`),slug);
    const rankings=await request('/rankings',userAgent);
    for(const label of ['World rankings','Choose overview ranking','Choose a ranking','Largest economies','Source'])assert.ok(rankings.includes(label),label);
    for(const path of ['/rankings/most-visited','/rankings/iq'])await request(path,userAgent);
    for(const guide of cityGuides){
      const html=await request(`/countries/${guide.countrySlug}/cities/${guide.citySlug}`,userAgent);
      assert.ok(html.includes(guide.gallery[0].url),guide.name);
      assert.match(html,/class="city-guide-cover"/);
      const tripLink=`/trips?destination=${encodeURIComponent(guide.country)}&amp;city=${encodeURIComponent(guide.name)}`;
      assert.ok(html.includes(tripLink),guide.name+' trip handoff');
      assert.ok(html.includes(`href="/countries/${guide.countrySlug}"`),guide.name+' back path');
      assert.ok(html.includes(`id="itinerary"`),guide.name+' itinerary');
    }
    const planner=await request('/trips?destination=Nigeria&city=Asaba',userAgent);
    assert.match(planner,/Asaba/);assert.match(planner,/Pick activities for my budget/);
  }
  const missing=await worker.fetch(new Request('http://localhost/countries/nigeria/cities/missing-city',{headers:{accept:'text/html'}}),env,context);
  assert.equal(missing.status,404);
});
