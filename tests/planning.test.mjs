import {funFor,funCatalogue} from '../app/fun-activities.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {activitiesFor,daysBetween,itineraryText,pickActivities,schedule} from '../app/trips/planning.ts';
const guide={name:'Lagos',country:'Nigeria',slug:'nigeria/cities/lagos',attractions:['Nike Art Gallery','Lekki Conservation Centre'],food:['Jollof rice'],neighbourhoods:[{name:'Onikan',note:'History and art'}],dayTrips:[{name:'Badagry',note:'Full-day history trip'}],transport:'Group nearby stops.',safety:'Confirm access.'};
test('picks stay within a shared budget, essentials allowance and date capacity',()=>{
 const options=activitiesFor(guide,'food nature',1000000);
 const picks=pickActivities(options,{},1500000,2,2);
 const selected=options.filter(a=>picks.includes(a.id));
 assert.ok(selected.some(a=>a.category==='Food & local flavours'));
 assert.ok(selected.reduce((s,a)=>s+a.perPerson*2,0)<=1500000);
 assert.ok(selected.reduce((s,a)=>s+a.slots,0)<=4);
 assert.equal(pickActivities(options,{},-1,1,2).length,0);
 const revised=pickActivities(options,{[options[2].id]:'99999'},1500000,2,2);
 assert.ok(!revised.includes(options[2].id));
});
test('schedule keeps every selected activity once and gives day trips a full day',()=>{
 const options=activitiesFor(guide,'history',1000);const days=schedule(options,'2026-10-01',3);
 assert.equal(days.flatMap(d=>d.activities).length,options.length);
 assert.equal(new Set(days.flatMap(d=>d.activities).map(a=>a.id)).size,options.length);
 for(const day of days)assert.ok(day.activities.reduce((s,a)=>s+a.slots,0)<=2);
 assert.equal(days.find(d=>d.activities.some(a=>a.category==='Day trip')).activities.length,1);
 assert.equal(days[2].date,'2026-10-03');
});
test('itinerary includes whole-group allowances, essentials, dates and quote limitations',()=>{
 const draft={destination:'Nigeria',city:'Lagos',startDate:'2026-10-01',endDate:'2026-10-02',travelers:2,budget:'100000',currency:'NGN',interests:'food',notes:'Slow pace',stay:'20000',transport:'10000',meals:'10000',reserve:'5000',allowance:'10000'};
 const selected=activitiesFor(guide,draft.interests,1000000).slice(0,2);
 const text=itineraryText(draft,guide,selected,{});
 assert.ok(text.includes('Day 2 · 2026-10-02'));assert.ok(text.includes('85,000'));assert.ok(text.includes('not verified venue prices'));assert.ok(text.includes('Slow pace'));assert.equal(daysBetween('2026-10-03','2026-10-01'),0);assert.equal(daysBetween('2026-02-30','2026-03-02'),0);
});

test('all requested fun types can be budgeted, while provider references remain separate from venue ideas',()=>{
 const fun=funFor('Nigeria','Lagos');assert.equal(fun.length,30);assert.equal(new Set(fun.map(a=>a.name)).size,fun.length);
 for(const name of ['Paintball','Swimming / pool day','Sip and paint (drink and paint)','Shoothouse / target-game simulation','Rage room','Movies'])assert.ok(fun.some(a=>a.name===name));
 const options=activitiesFor({...guide,funActivities:fun},'fun',1000000);
 const choices=pickActivities(options,{},5000000,2,2);const picked=options.filter(a=>choices.includes(a.id));
 assert.ok(picked.some(a=>a.category==='Fun'));assert.ok(picked.reduce((sum,a)=>sum+a.perPerson*2,0)<=5000000);assert.ok(picked.reduce((sum,a)=>sum+a.slots,0)<=4);
 assert.equal(options.find(a=>a.name==='Rage room').needsVenue,true);
 const paint=options.find(a=>a.name.startsWith('Sip and paint'));assert.equal(paint.provider,'Sip and Paint NG');assert.ok(paint.sourceUrl.startsWith('https://'));assert.equal(paint.needsVenue,false);
 assert.ok(funFor('France','Paris').every(a=>!a.provider));
 assert.ok(funCatalogue.every(a=>a.multiplier>0));
});
test('a quoted fun allowance changes selection and survives itinerary export',()=>{
 const options=activitiesFor({...guide,funActivities:funFor('Nigeria','Lagos')},'rage',1000000);
 const rage=options.find(a=>a.name==='Rage room');const prices={[rage.id]:'1000000'};
 assert.ok(!pickActivities(options,prices,5000000,2,2).includes(rage.id));
 const draft={destination:'Nigeria',city:'Lagos',startDate:'2026-10-01',endDate:'2026-10-01',travelers:2,budget:'100000',currency:'NGN',interests:'fun',notes:'',stay:'0',transport:'0',meals:'0',reserve:'0',allowance:'10000'};
 const paint=options.find(a=>a.name.startsWith('Sip and paint'));
 const text=itineraryText(draft,guide,[paint],{[paint.id]:'15000'});assert.ok(text.includes('30,000'));assert.ok(text.includes('https://sipandpaint.ng/'));assert.ok(text.includes('checked 2026-09-30'));
});
