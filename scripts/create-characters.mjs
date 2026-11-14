import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { writeFile } from 'node:fs/promises';
// Node-compatible Blob reader used by the official Three.js GLTF exporter.
globalThis.FileReader=class { readAsArrayBuffer(blob){blob.arrayBuffer().then(value=>{this.result=value;this.onloadend?.()})} readAsDataURL(blob){blob.arrayBuffer().then(value=>{this.result=`data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;this.onloadend?.()})} };
async function build(mentor){
 const names=['Root','Hips','Spine','Head','LeftArm','RightArm','LeftLeg','RightLeg'];
 const bones=names.map(name=>{const b=new THREE.Bone();b.name=name;return b});
 bones[0].add(bones[1]);bones[1].position.y=.85;bones[1].add(bones[2],bones[6],bones[7]);bones[2].position.y=.4;bones[2].add(bones[3],bones[4],bones[5]);bones[3].position.y=.43;bones[4].position.set(-.33,.1,0);bones[5].position.set(.33,.1,0);bones[6].position.set(-.15,-.08,0);bones[7].position.set(.15,-.08,0);
 const materials=[new THREE.MeshStandardMaterial({color:mentor?'#b1b9a0':'#6a5142',roughness:.95}),new THREE.MeshStandardMaterial({color:mentor?'#8fa9b7':'#c9b49b',roughness:.9}),new THREE.MeshStandardMaterial({color:'#343237',roughness:.8}),new THREE.MeshStandardMaterial({color:mentor?'#405968':'#3a302b',roughness:.8}),new THREE.MeshStandardMaterial({color:'#d3b878',metalness:.55,roughness:.45})];
 const parts=[];const materialIds=[];
 function part(geometry,bone,position,scale=[1,1,1],material=0,rotation=[0,0,0]){geometry.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...position),new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),new THREE.Vector3(...scale)));const count=geometry.attributes.position.count;const indices=new Uint16Array(count*4);const weights=new Float32Array(count*4);for(let i=0;i<count;i++){indices[i*4]=bone;weights[i*4]=1}geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));parts.push(geometry);materialIds.push(material)}
 // Tunic, split robe, shoulder cape, sash, boots, face and hood, all actual skinned meshes.
 part(new THREE.CylinderGeometry(.27,.38,.73,12),2,[0,1.15,0],[1,1,.75]);
 for(const s of [-1,1]){
 const arm=s<0?4:5,leg=s<0?6:7;
 part(new THREE.CapsuleGeometry(.12,.4,4,8),arm,[s*.36,1.08,0],[1,1,1]);
 part(new THREE.SphereGeometry(.09,10,8),arm,[s*.38,.76,.03],[1,1,1],1);
 part(new THREE.CylinderGeometry(.14,.21,.6,8),leg,[s*.16,.52,0],[1,1,.9]);
 part(new THREE.CapsuleGeometry(.11,.25,4,8),leg,[s*.15,.23,0],[1,1,1],2);
 part(new THREE.BoxGeometry(.23,.15,.36),leg,[s*.15,.08,.08],[1,1,1],2);
 part(new THREE.BoxGeometry(.09,.65,.03),2,[s*.13,1.18,.24],[1,1,1],1,[0,0,s*-.12]);
 part(new THREE.SphereGeometry(.027,8,6),3,[s*.075,1.77,.19],[1,.65,.5],2);
 if(mentor)part(new THREE.SphereGeometry(.1,10,8),3,[s*.2,1.78,-.01],[.65,1.4,.65],1);
 }
 part(new THREE.SphereGeometry(.22,16,12),3,[0,1.77,0],[.85,1,1],1);
 part(new THREE.SphereGeometry(.235,16,10,0,Math.PI*2,0,Math.PI*.58),3,[0,1.8,-.035],[1,1,1],3);
 part(new THREE.SphereGeometry(.055,8,6),3,[0,1.74,.205],[.6,.75,1],1);
 part(new THREE.BoxGeometry(.58,.09,.43),2,[0,.92,0],[1,1,1],3);
 part(new THREE.BoxGeometry(.1,.11,.05),2,[0,.92,.23],[1,1,1],4);
 part(new THREE.CylinderGeometry(.33,.39,.28,12,1,true,0,Math.PI),2,[0,1.42,-.03],[1,1,1],3);
 if(mentor)part(new THREE.ConeGeometry(.13,.24,8),3,[0,1.52,.12],[1,1,.4],1);
 const geometry=mergeGeometries(parts,true);geometry.groups.forEach((group,i)=>group.materialIndex=materialIds[i]);
 const mesh=new THREE.SkinnedMesh(geometry,materials);mesh.name=mentor?'MentorOriginal':'ExploradorOriginal';mesh.add(bones[0]);mesh.bind(new THREE.Skeleton(bones));
 const scene=new THREE.Group();scene.add(mesh);
 const rotationTrack=(name,axis,amplitude,duration,phase=0)=>{const times=[0,duration*.25,duration*.5,duration*.75,duration];const values=times.flatMap(t=>{const e=new THREE.Euler();e[axis]=Math.sin(t/duration*Math.PI*2+phase)*amplitude;return new THREE.Quaternion().setFromEuler(e).toArray()});return new THREE.QuaternionKeyframeTrack(`${name}.quaternion`,times,values)};
 const animations=[new THREE.AnimationClip('idle',3,[rotationTrack('Spine','z',.025,3),rotationTrack('Head','y',.06,3)]),...['walking','running'].map((name,i)=>{const d=i?.55:1;return new THREE.AnimationClip(name,d,[rotationTrack('LeftArm','x',i?.65:.4,d),rotationTrack('RightArm','x',i?.65:.4,d,Math.PI),rotationTrack('LeftLeg','x',i?.65:.38,d,Math.PI),rotationTrack('RightLeg','x',i?.65:.38,d)])})];
 const glb=await new GLTFExporter().parseAsync(scene,{binary:true,animations});await writeFile(`public/models/characters/${mentor?'mentor':'explorer'}.glb`,Buffer.from(glb));console.log(`${mentor?'mentor':'explorer'}: ${glb.byteLength} bytes; ${animations.length} clips`);
}
await build(false);await build(true);
