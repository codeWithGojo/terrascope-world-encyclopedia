import type {Boundary} from './types';

// Satellite imagery already shows the land. Build country meshes only when needed.
export function displayPolygons(features:Boundary[],interactive:boolean,mobile:boolean,selected:string,visited:string[],hasLayer:boolean):Boundary[]{
 if(!interactive)return [];
 if(!mobile||hasLayer)return features;
 const highlighted=new Set([...visited,selected]);
 return features.filter(feature=>highlighted.has(feature.properties.code));
}
