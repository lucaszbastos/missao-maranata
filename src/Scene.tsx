import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, Line, OrbitControls, Stars, useGLTF, useAnimations } from '@react-three/drei';
import { Component, ReactNode, RefObject, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { forPlanet, PlanetData, planets } from './data';
export type Mode='home'|'galaxy'|'flight'|'planet';
export type Movement={forward:boolean;back:boolean;left:boolean;right:boolean};
type Props={stationLayer:RefObject<HTMLDivElement|null>;labelLayer:RefObject<HTMLDivElement|null>;mode:Mode;selected:PlanetData;origin:[number,number,number];onPlanet:(id:string)=>void;onArrive:()=>void;onStation:(index:number)=>void;onNear:(index:number|null)=>void;paused:boolean;reducedMotion:boolean;movement:Movement};
export function Ship({scale=1}:{scale?:number}){
 return <group scale={scale}>
 <mesh scale={[.7,.2,1.5]}><sphereGeometry args={[1,20,12]}/><meshStandardMaterial color="#b2c2d5" metalness={.8} roughness={.35}/></mesh>
 <mesh position={[0,.2,.5]} scale={[.34,.23,.6]}><sphereGeometry args={[1,16,8]}/><meshStandardMaterial color="#263e57" metalness={.8} roughness={.15}/></mesh>
 {[-1,1].map(s=><group key={s}><mesh position={[s*.9,-.06,-.3]} rotation={[0,0,s*.15]} scale={[1.2,.07,.6]}><octahedronGeometry/><meshStandardMaterial color="#72859b" metalness={.7}/></mesh><mesh position={[s*.55,0,-1.1]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.12,.18,.45,12]}/><meshStandardMaterial color="#a6ecff" emissive="#44bfff" emissiveIntensity={3}/></mesh></group>)}
 <mesh position={[0,0,-1.4]}><sphereGeometry args={[.14,12,8]}/><meshBasicMaterial color="#c0f6ff"/></mesh></group>
}
function HomeShip({reduced}:{reduced:boolean}){
 const ref=useRef<THREE.Group>(null);
 const pointer=useRef(new THREE.Vector2());
 const active=useRef(false);
 const ray=useMemo(()=>new THREE.Raycaster(),[]);
 const plane=useMemo(()=>new THREE.Plane(new THREE.Vector3(0,0,1),-2),[]);
 const target=useMemo(()=>new THREE.Vector3(),[]);
 const aim=useMemo(()=>new THREE.Object3D(),[]);
 const resting=useMemo(()=>new THREE.Quaternion().setFromEuler(new THREE.Euler(.2,.5,-.18)),[]);
 useEffect(()=>{
  if(reduced)return;
  const move=(event:PointerEvent)=>{
   if(event.pointerType==='touch')return;
   pointer.current.set(event.clientX/window.innerWidth*2-1,1-event.clientY/window.innerHeight*2);
   active.current=true;
  };
  const reset=()=>{active.current=false};
  window.addEventListener('pointermove',move);
  document.documentElement.addEventListener('pointerleave',reset);
  window.addEventListener('blur',reset);
  return()=>{window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',reset);window.removeEventListener('blur',reset);active.current=false};
 },[reduced]);
 useFrame(({camera},dt)=>{
  if(!ref.current||reduced)return;
  const smoothing=1-Math.exp(-Math.min(dt,.05)*5);
  if(active.current){
   ray.setFromCamera(pointer.current,camera);
   if(ray.ray.intersectPlane(plane,target)){
    aim.position.copy(ref.current.position);
    aim.up.copy(camera.up);
    aim.lookAt(target);
    ref.current.quaternion.slerp(aim.quaternion,smoothing);
   }
  }else ref.current.quaternion.slerp(resting,smoothing);
 });
 return <group ref={ref} position={[3,0,0]} rotation={[.2,.5,-.18]}><Ship scale={2}/></group>
}

function GalaxyDust({reduced}:{reduced:boolean}){
 const ref=useRef<THREE.Points>(null);
 const {positions,colors}=useMemo(()=>{const count=4200;const positions=new Float32Array(count*3);const colors=new Float32Array(count*3);let seed=37;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};for(let i=0;i<count;i++){const r=Math.pow(rand(),.6)*11;const arm=i%3;const a=arm*Math.PI*2/3+r*.53+(rand()-.5)*(.4+1/(r+.5));positions.set([Math.cos(a)*r,(rand()-.5)*(.18+r*.035),Math.sin(a)*r],i*3);const color=new THREE.Color().lerpColors(new THREE.Color('#a3eaff'),new THREE.Color('#6885d8'),r/11);colors.set([color.r,color.g,color.b],i*3)}return {positions,colors}},[]);
 useFrame((_,dt)=>{if(ref.current&&!reduced)ref.current.rotation.y+=dt*.008});
 return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/><bufferAttribute attach="attributes-color" args={[colors,3]}/></bufferGeometry><pointsMaterial size={.037} vertexColors transparent opacity={.78} depthWrite={false} blending={THREE.AdditiveBlending}/></points>
}
function Planet({planet,onSelect,reduced}:{planet:PlanetData;onSelect:()=>void;reduced:boolean}){
 const ref=useRef<THREE.Group>(null); const [hover,setHover]=useState(false);
 useFrame((_,dt)=>{if(ref.current&&!reduced)ref.current.rotation.y+=dt*.1});

 return <group position={planet.position} onClick={e=>{e.stopPropagation();onSelect()}} onPointerOver={e=>{e.stopPropagation();setHover(true)}} onPointerOut={()=>setHover(false)}>
 <group ref={ref} scale={hover?1.12:1}><mesh><sphereGeometry args={[.82,40,24]}/><meshStandardMaterial color={planet.color} roughness={.88}/></mesh>
 {Array.from({length:12},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*.77,Math.cos(i*1.8)*.55,Math.cos(i*2.4)*.77]} rotation={[i*.7,i*.6,0]} scale={[.35,.12,.22]}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color={planet.glow} roughness={1}/></mesh>)}
 <mesh><sphereGeometry args={[.91,24,16]}/><meshBasicMaterial color={planet.color} wireframe transparent opacity={hover?.13:.045}/></mesh>
 {planet.environment==='ice'&&<mesh rotation={[.2,0,.25]}><torusGeometry args={[1.15,.035,6,64]}/><meshBasicMaterial color="#b1e1ee" transparent opacity={.55}/></mesh>}</group>
</group>
}
// Labels live in the UI layer, outside the canvas clipping and visibility rules.
function PlanetLabelPositions({layer}:{layer:RefObject<HTMLDivElement|null>}){
 const point=useMemo(()=>new THREE.Vector3(),[]);
 useFrame(({camera,size})=>{
  if(!layer.current)return;
  const mobile=size.width<=600;
  const halfWidth=mobile?68:90;
  const right=size.width-(mobile?size.width*.04+176: size.width*.04+(size.width<=900?220:258))-halfWidth-12;
  planets.forEach((planet,index)=>{
   const label=layer.current?.children[index] as HTMLElement|undefined;
   if(!label)return;
   point.set(...planet.position).add(new THREE.Vector3(0,-1.2,0)).project(camera);
   const x=THREE.MathUtils.clamp((point.x+1)*size.width/2,halfWidth+12,Math.max(halfWidth+12,right));
   const y=THREE.MathUtils.clamp((1-point.y)*size.height/2,mobile?240:245,size.height-105);
   label.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;
  });
 });
 return null;
}
function Galaxy({onPlanet,reduced}:{onPlanet:(id:string)=>void;reduced:boolean}){
 return <><GalaxyDust reduced={reduced}/><mesh><sphereGeometry args={[.33,24,16]}/><meshBasicMaterial color="#daf5ff"/></mesh>{[.65,1,1.5,2.2].map((r,i)=><mesh key={r} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[r,48]}/><meshBasicMaterial color="#59bbff" transparent opacity={.07/(i+1)} depthWrite={false}/></mesh>)}
 {[4,7,10].map(r=><Line key={r} points={Array.from({length:129},(_,i)=>[Math.cos(i/128*Math.PI*2)*r,-.25,Math.sin(i/128*Math.PI*2)*r] as [number,number,number])} color="#5e729e" transparent opacity={.17} lineWidth={.6}/>)}
 {planets.map((p,i)=>{const next=planets[(i+1)%5];const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(...p.position),new THREE.Vector3(0,.6,0),new THREE.Vector3(...next.position));return <Line key={p.id} points={curve.getPoints(60)} color="#75d5ff" transparent opacity={.2} lineWidth={1} dashed dashSize={.12} gapSize={.15}/>})}
 {planets.map(p=><Planet key={p.id} planet={p} onSelect={()=>onPlanet(p.id)} reduced={reduced}/>)}<group position={[0,.4,1.5]} rotation={[0,-.6,0]}><Ship scale={.55}/></group>
 <OrbitControls makeDefault enablePan={false} minDistance={15} maxDistance={29} minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI/3} enableDamping/>
 </>
}
function Flight({origin,destination,onArrive,reduced}:{origin:[number,number,number];destination:[number,number,number];onArrive:()=>void;reduced:boolean}){
 const ref=useRef<THREE.Group>(null);const elapsed=useRef(0);const done=useRef(false);const target=useMemo(()=>new THREE.Vector3(),[]);
 const curve=useMemo(()=>new THREE.QuadraticBezierCurve3(new THREE.Vector3(...origin),new THREE.Vector3((origin[0]+destination[0])*.3,4,(origin[2]+destination[2])*.3),new THREE.Vector3(...destination)),[origin,destination]);
 useFrame(({camera},dt)=>{elapsed.current+=Math.min(dt,.05);const t=Math.min(elapsed.current/(reduced?.25:3.2),1);const eased=t*t*(3-2*t);const p=curve.getPoint(eased);if(ref.current){ref.current.position.copy(p);ref.current.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),curve.getTangent(eased).normalize())}target.copy(p).add(new THREE.Vector3(0,4,6));camera.position.lerp(target,1-Math.exp(-dt*3));camera.lookAt(p);if(t===1&&!done.current){done.current=true;onArrive()}});
 return <><GalaxyDust reduced={reduced}/><Line points={curve.getPoints(80)} color="#68ceff" transparent opacity={.4}/><group ref={ref}><Ship scale={.7}/></group><Planet planet={planets.find(p=>p.position===destination)!} onSelect={()=>{}} reduced={reduced}/></>
}
// Lightweight original GLBs, generated by scripts/create-characters.mjs.
function Character({mentor=false,moving=false,running=false}:{mentor?:boolean;moving?:boolean;running?:boolean}){
 const group=useRef<THREE.Group>(null);
 const {scene,animations}=useGLTF(`/models/characters/${mentor?'mentor':'explorer'}.glb`);
 const model=useMemo(()=>clone(scene),[scene]);
 const {actions}=useAnimations(animations,group);
 const active=moving?(running?'running':'walking'):'idle';
 useEffect(()=>{const action=actions[active];action?.reset().fadeIn(.2).play();return()=>{action?.fadeOut(.2)}},[actions,active]);
 return <group ref={group} scale={mentor?.65:1}><primitive object={model} dispose={null}/></group>
}

function ProceduralCharacter({mentor=false,moving=false}:{mentor?:boolean;moving?:boolean}){
 const limbs=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(limbs.current)limbs.current.children.forEach((child,i)=>child.rotation.x=moving?Math.sin(clock.elapsedTime*8+i*Math.PI)*.4:0)});
 return <group scale={mentor?.6:1}>
 <mesh position={[0,.95,0]}><coneGeometry args={[.4,1.25,10]}/><meshStandardMaterial color={mentor?'#b7ad89':'#6a5748'}/></mesh>
 <mesh position={[0,1.68,0]}><sphereGeometry args={[.23,16,12]}/><meshStandardMaterial color={mentor?'#8aa997':'#d1b599'}/></mesh>
 <mesh position={[0,1.78,-.08]}><sphereGeometry args={[.25,12,8]}/><meshStandardMaterial color={mentor?'#9caa9e':'#443b35'}/></mesh>
 {mentor&&[-1,1].map(s=><mesh key={s} position={[s*.23,1.72,0]} scale={[.2,.12,.13]}><sphereGeometry/><meshStandardMaterial color="#8aa997"/></mesh>)}
 <group ref={limbs}>{[-1,1].map(s=><group key={s} position={[s*.25,1.2,0]}><mesh position={[0,-.27,0]}><capsuleGeometry args={[.09,.45,4,8]}/><meshStandardMaterial color={mentor?'#b7ad89':'#695346'}/></mesh></group>)}{[-1,1].map(s=><group key={s+3} position={[s*.14,.45,0]}><mesh position={[0,-.15,0]}><capsuleGeometry args={[.1,.35,4,8]}/><meshStandardMaterial color="#34343a"/></mesh></group>)}</group>
 <mesh position={[0,1.05,.1]}><boxGeometry args={[.58,.1,.4]}/><meshStandardMaterial color="#352e2b"/></mesh>
 </group>
}
function Scenery({planet,length}:{planet:PlanetData;length:number}){
 const forest=planet.environment==='forest';const ice=planet.environment==='ice';
 return <><mesh position={[0,-.22,-length/2+3]}><boxGeometry args={[34,.4,length+24]}/><meshStandardMaterial color={planet.glow} roughness={1}/></mesh><mesh position={[0,0,-length/2+2]}><boxGeometry args={[3,.025,length+10]}/><meshStandardMaterial color={ice?'#a2bfca':forest?'#687760':'#9d8d78'} roughness={1}/></mesh>
 {Array.from({length:32},(_,i)=>{const x=(i%2?1:-1)*(4+(i*7%9));const z=5-i/32*(length+8);return <group key={i} position={[x,0,z]}>{forest?<><mesh position={[0,1,0]}><cylinderGeometry args={[.15,.3,2,6]}/><meshStandardMaterial color="#594c39"/></mesh><mesh position={[0,2.5,0]}><coneGeometry args={[1,3,7]}/><meshStandardMaterial color="#305d4d"/></mesh></>:<mesh position={[0,1+(i%4),0]} rotation={[0,i,0]}><coneGeometry args={[1.8+(i%3),3+(i%4)*2,ice?4:5]}/><meshStandardMaterial color={ice?'#b1d2db':planet.color} roughness={.95}/></mesh>}{(planet.environment==='temple'||planet.environment==='mountain'||ice)&&i%4===0&&<mesh position={[0,2.5,0]}><boxGeometry args={[1.4,5,1.4]}/><meshStandardMaterial color={ice?'#618293':'#aea69c'} metalness={.3}/></mesh>}</group>})}
 {forest&&<mesh position={[8,.02,-length/2]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[4,40]}/><meshStandardMaterial color="#459da6" metalness={.6} roughness={.2}/></mesh>}</>
}
function Explorer({props}:{props:Props}){
 const player=useRef<THREE.Group>(null);const companion=useRef<THREE.Group>(null);const keys=useRef<Record<string,boolean>>({});const near=useRef<number|null>(null);const [walking,setWalking]=useState(false);const [running,setRunning]=useState(false);const runningRef=useRef(false);const movingRef=useRef(false);const list=forPlanet(props.selected.id);const length=list.length*5;
 const {camera,size}=useThree();
 const stationPoint=useMemo(()=>new THREE.Vector3(),[]);
 useEffect(()=>{camera.position.set(0,4.4,8.8);camera.lookAt(0,1,-.2)},[camera]);
 const look=useMemo(()=>new THREE.Vector3(),[]);
 useEffect(()=>{const down=(e:KeyboardEvent)=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)&&!props.paused)e.preventDefault();keys.current[e.code]=true;if(e.code==='KeyE'&&!e.repeat&&near.current!==null&&!props.paused)props.onStation(near.current)};const up=(e:KeyboardEvent)=>{keys.current[e.code]=false};const clear=()=>{keys.current={}};window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear)}},[props.paused,props.onStation]);
 useFrame((_,rawDt)=>{const dt=Math.min(rawDt,.05);if(!player.current||!companion.current)return;const p=player.current;const k=keys.current;const m=props.movement;const x=Number(k.KeyD||k.ArrowRight||m.right)-Number(k.KeyA||k.ArrowLeft||m.left);const z=Number(k.KeyS||k.ArrowDown||m.back)-Number(k.KeyW||k.ArrowUp||m.forward);const moving=!props.paused&&(x!==0||z!==0);const sprint=!!k.ShiftLeft&&moving;if(sprint!==runningRef.current){runningRef.current=sprint;setRunning(sprint)}if(moving!==movingRef.current){movingRef.current=moving;setWalking(moving)}if(moving){const n=Math.hypot(x,z);const speed=k.ShiftLeft?5:3;p.position.x=THREE.MathUtils.clamp(p.position.x+x/n*speed*dt,-2,2);p.position.z=THREE.MathUtils.clamp(p.position.z+z/n*speed*dt,-length+3,4);const angle=Math.atan2(x,z);p.rotation.y+=Math.atan2(Math.sin(angle-p.rotation.y),Math.cos(angle-p.rotation.y))*Math.min(1,dt*10)}
 const c=companion.current;const target=p.position.clone().add(new THREE.Vector3(-1.1,0,1.3));c.position.lerp(target,1-Math.exp(-dt*3));c.rotation.y=p.rotation.y;
 if(!props.paused){camera.position.lerp(p.position.clone().add(new THREE.Vector3(0,4.4,7)),1-Math.exp(-dt*4));look.copy(p.position).add(new THREE.Vector3(0,1,-2));camera.lookAt(look)}
 // Project station tags into the UI, keeping the first one clear of panels.
 camera.updateMatrixWorld();
 list.forEach((_,index)=>{
  const tag=props.stationLayer.current?.children[index] as HTMLElement|undefined;
  if(!tag)return;
  stationPoint.set(1.7,2.1,-index*5).project(camera);
  const nearby=Math.abs(p.position.z+index*5)<13;
  const visible=nearby&&stationPoint.z>-1&&stationPoint.z<1;
  tag.style.visibility=visible?'visible':'hidden';
  const x=THREE.MathUtils.clamp((stationPoint.x+1)*size.width/2,65,size.width-65);
  const y=THREE.MathUtils.clamp((1-stationPoint.y)*size.height/2,size.width<=600?270:160,size.height-240);
  tag.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;
 });
 let closest:number|null=null;for(let i=0;i<list.length;i++){if(p.position.distanceTo(new THREE.Vector3(1.7,0,-i*5))<2.8){closest=i;break}}if(near.current!==closest){near.current=closest;props.onNear(closest)}
 });
 return <><Scenery planet={props.selected} length={length}/><group ref={player} position={[0,0,1.8]}><Suspense fallback={<ProceduralCharacter moving={walking}/>}><Character moving={walking} running={running}/></Suspense></group><group ref={companion} position={[-1.1,0,4]}><Suspense fallback={<ProceduralCharacter mentor moving={walking}/>}><Character mentor moving={walking} running={running}/></Suspense></group>{list.map((r,i)=><group key={r.id} position={[1.7,0,-i*5]}><mesh position={[0,.3,0]}><cylinderGeometry args={[.5,.65,.6,8]}/><meshStandardMaterial color="#49546a" metalness={.6}/></mesh><mesh position={[0,1.25,0]}><octahedronGeometry args={[.35,0]}/><meshStandardMaterial color={props.selected.color} emissive={props.selected.color} emissiveIntensity={1.2}/></mesh></group>)}</>
}
class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?this.props.fallback:this.props.children}}
export default function Scene(props:Props){
 const [dpr,setDpr]=useState(()=>window.matchMedia('(max-width: 600px)').matches?1:1.5);
 const fallback=<div className="gpu-fallback">A visualização 3D não está disponível. Use os destinos e a lista de requisitos para continuar.</div>;
 return <SceneBoundary fallback={fallback}><Canvas key={props.mode==='planet'?props.selected.id:props.mode} fallback={fallback} dpr={dpr} performance={{min:.5}} gl={{antialias:false,powerPreference:'low-power'}} camera={{position:props.mode==='galaxy'||props.mode==='flight'?[0,17,19]:props.mode==='planet'?[0,4.4,10]:[0,3,12],fov:48}}><color attach="background" args={[props.mode==='planet'?'#182333':'#050916']}/><ambientLight intensity={props.mode==='planet'?1.8:.75}/><directionalLight position={[-4,8,5]} intensity={2.6} color="#fff1d6"/><pointLight position={[0,2,0]} intensity={12} color="#e6bd81" distance={18}/><Stars radius={65} depth={40} count={props.reducedMotion?350:1000} factor={3} fade speed={0}/>{props.mode==='home'&&<HomeShip reduced={props.reducedMotion}/>} {props.mode==='galaxy'&&<><Galaxy onPlanet={props.onPlanet} reduced={props.reducedMotion}/><PlanetLabelPositions layer={props.labelLayer}/></>} {props.mode==='flight'&&<Flight origin={props.origin} destination={props.selected.position} reduced={props.reducedMotion} onArrive={props.onArrive}/>} {props.mode==='planet'&&<Explorer props={props}/>}<PerformanceMonitor onDecline={()=>setDpr(1)} onIncline={()=>setDpr(window.matchMedia('(max-width: 600px)').matches?1:1.5)} flipflops={2} onFallback={()=>setDpr(1)}/><AdaptiveDpr pixelated/></Canvas></SceneBoundary>
}
