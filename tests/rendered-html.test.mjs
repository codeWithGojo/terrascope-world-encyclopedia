import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders TerraScope's production homepage without development metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html=await response.text();
  assert.match(html, /TerraScope/);
  assert.match(html, /A little further/);
  assert.match(html, /Open the 3D Earth/);
  assert.doesNotMatch(html, developmentPreviewMeta);
});


test("refreshed country records, new city guides and the Fun planner render through the Worker",async()=>{
 const {default:worker}=await import(new URL('../dist/server/index.js',import.meta.url).href);
 const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
 const context={waitUntil(){},passThroughOnException(){}};
 for(const [path,patterns] of [
  ['/countries/nigeria',[/Economy &/,/Life expectancy at birth/,/Observation:/,/2026-09-30/,/Official leadership reference/]],
  ['/countries/vatican-city',[/882/,/Not available/,/No published value/]],
  ['/countries/bulgaria',[/Euro/,/Total area/]],
  ['/countries/nigeria/cities/osogbo',[/Osun-Osogbo/,/Rage room/,/Photography walk/,/UNESCO/]],
  ['/countries/egypt/cities/aswan',[/Philae/,/Unfinished Obelisk/,/Nubian Museum/]],
  ['/trips?destination=Nigeria&city=Lagos',[/Paintball/,/Swimming \/ pool day/,/Sip and paint/,/Shoothouse/,/Rage room/,/Movies/,/Pick activities for my budget/,/Indoor/,/Outdoor/]],
  ['/compare',[/Pro/,/A closer look/,/Payments are not open yet/]],
  ['/method',[/countries have at least one metric/,/detailed city guides/,/fun activity types/]],
  ['/escape',[/Somewhere else/,/360° panorama/,/photo journey/i,/exploration passport/]],
  ['/football-archive/greats',[/Club icons/,/League greats/,/The GOAT list/,/Manchester United/,/Subjective/]],
  ['/elections',[/Official polling date/,/expected|Expected/,/INEC/,/No.*date|Exact dates/]],
  ['/countries/nigeria',[/Places with/,/Osun-Osogbo Sacred Grove/,/Election/,/Six more|A little/]],
 ]){
  const response=await worker.fetch(new Request('http://localhost'+path,{headers:{accept:'text/html'}}),env,context);
  assert.equal(response.status,200,path);const html=await response.text();for(const pattern of patterns)assert.match(html,pattern,path);
 }
});
