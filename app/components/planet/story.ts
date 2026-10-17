export const stops=[
 {label:'One shared home',title:['A world','within reach.'],caption:'Follow your curiosity. There is always somewhere new to begin.',lat:12,lng:-20,altitude:2.2},
 {label:'Fact #1 · Americas',title:['Two continents.','Endless stories.'],caption:'The Americas stretch from Arctic ice to the southern reaches of Patagonia.',lat:15,lng:-85,altitude:1.65},
 {label:'Fact #2 · Africa',title:['Where the human','story begins.'],caption:'An extraordinary diversity of peoples, landscapes and living cultures.',lat:6,lng:20,altitude:1.6},
 {label:'Fact #3 · Asia',title:['Life, on a','different scale.'],caption:'The world’s largest continent is home to almost three in five people.',lat:28,lng:95,altitude:1.65},
 {label:'Fact #4 · Australia',title:['An ancient land.','An open horizon.'],caption:'A continent shaped by deep time, with Aboriginal cultures spanning tens of thousands of years.',lat:-25,lng:134,altitude:1.55},
 {label:'Your planet awaits',title:['Somewhere','starts here.'],caption:'Drag the Earth. Choose a country. Follow a different perspective.',lat:9,lng:8,altitude:1.9}
];
export const normalizedProgress=(top:number,height:number,viewport:number)=>Math.max(0,Math.min(1,-top/Math.max(1,height-viewport)));
export const storyStep=(progress:number)=>Math.min(5,Math.max(0,Math.floor(progress*6)));
