import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const transpile=s=>ts.transpile(s,{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022});
const url=s=>`data:text/javascript;base64,${Buffer.from(transpile(s)).toString('base64')}`;
const legacyUrl=url(readFileSync('src/legacy-data.ts','utf8'));
const data=await import(url(readFileSync('src/data.ts','utf8').replace("'./legacy-data'",JSON.stringify(legacyUrl))));
const expected=[[1,2,3,4,5],[6,7,8,9],[10,11,12,13,14,15,16,17],[18,19,20,21],[24,25,27,28,29,30,31]];
assert.equal(data.planets.length,5);assert.equal(data.requirements.length,31);assert.equal(new Set(data.requirements.map(r=>r.id)).size,31);
data.planets.forEach((p,i)=>assert.deepEqual(data.forPlanet(p.id).map(r=>r.id),expected[i]));
assert.equal(data.requirements.filter(r=>r.status==='completed').length,31);
assert.equal(data.requirements.reduce((n,r)=>n+r.evidences.length,0),28);
for(const id of [24,26,12,4,2]){assert.equal(data.requirements.find(r=>r.id===id).status,'completed');assert.ok(data.requirements.find(r=>r.id===id).summary)}
for(const planet of data.planets){
 for(const requirement of data.forPlanet(planet.id)){
  assert.equal(requirement.evidences.length,1);
  assert.match(requirement.evidences[0].url,/^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/view\?usp=/);
 }
}
assert.equal(data.forPlanet('pre-requisitos').length,7);
assert.deepEqual(data.requirements.map(r=>r.id),Array.from({length:31},(_,i)=>i+1));
const expectedFiles=['162OAX2PgrRv6pXFzy4naYHNQaZhKhHrV','1ppRs8vXKqcOg_ZqbBUZSSxVTShh5fyxO','1VCsYS_POg7l3zcEn-gx8IZ6FpAgvxpnI','1oxxtkwiq65vPNUGlCmYU9YC-fYuIZE72','1e1SReq0seiKuXmi1DgFDI0VX2CVeEIKN'];
expectedFiles.forEach((file,i)=>assert.ok(data.requirements[i].evidences[0].url.includes('/'+file+'/')));
assert.match(data.requirements[21].title,/Idade/);
assert.match(data.requirements[22].title,/Prazo/);
assert.ok(data.requirements[24].title.includes('fidelidade'));
assert.ok(data.requirements[25].title.includes('portf'));
for(const name of ['explorer','mentor']){
 const bytes=readFileSync(`public/models/characters/${name}.glb`);const buffer=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
 const gltf=await new GLTFLoader().parseAsync(buffer,'');let skinned;gltf.scene.traverse(o=>{if(o.isSkinnedMesh)skinned=o});assert.ok(skinned);assert.equal(skinned.skeleton.bones.length,8);assert.deepEqual(gltf.animations.map(a=>a.name),['idle','walking','running']);assert.ok(gltf.animations.every(a=>a.tracks.length>0));assert.ok(bytes.length<150000);
 console.log(`${name}: GLB validado, 8 ossos, 3 animações, ${bytes.length} bytes`);
}
console.log('Dados validados: 5 planetas, 31 IDs na ordem correta, conteúdo legado preservado, 28 evidencias vinculadas; 7 pre-requisitos publicos.');
