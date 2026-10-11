import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, PerspectiveCamera, Sparkles, Text } from '@react-three/drei'
import * as THREE from 'three'
import './styles.css'

const cars = [
  { name: 'VX-09 APEX', type: 'Hyper coupe', color: '#d6f2f3', accent: '#73f5e2', speed: '9.4', handling: '8.8' },
  { name: 'R-7 NIGHTFALL', type: 'Street racer', color: '#ff4c3b', accent: '#ffb08c', speed: '8.8', handling: '9.5' },
]

function Car({ position, rotation, color }) {
  const ref = useRef()
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, rotation[2], delta * 5) })
  return <group ref={ref} position={position} rotation={rotation}>
    <mesh castShadow position={[0, .62, 0]}><boxGeometry args={[1.9, .42, 3.9]} /><meshStandardMaterial color={color} metalness={.85} roughness={.18} /></mesh>
    <mesh castShadow position={[0, .98, .15]} rotation={[0, 0, 0]}><boxGeometry args={[1.35, .42, 1.65]} /><meshStandardMaterial color="#101c25" metalness={.4} roughness={.1} transparent opacity={.92} /></mesh>
    {[-.86, .86].map(x => [-1.25, 1.25].map(z => <mesh key={`${x}${z}`} castShadow position={[x, .34, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.38, .38, .22, 20]} /><meshStandardMaterial color="#05080a" roughness={.7} /></mesh>))}
    <mesh position={[0, .72, -1.96]}><boxGeometry args={[1.25, .13, .03]} /><meshStandardMaterial color="#ff5c40" emissive="#ff2e1c" emissiveIntensity={3} /></mesh>
    <mesh position={[0, .78, 1.96]}><boxGeometry args={[1.15, .12, .03]} /><meshStandardMaterial color="#d8ffff" emissive="#b9ffff" emissiveIntensity={2} /></mesh>
    <mesh position={[0, .92, -1.65]}><boxGeometry args={[1.8, .05, .35]} /><meshStandardMaterial color="#0d1217" metalness={.8} /></mesh>
  </group>
}

function World({ driving, speed }) {
  const road = useRef()
  useFrame((_, delta) => { if (road.current && driving) road.current.position.z = (road.current.position.z + delta * speed * .5) % 20 })
  return <>
    <color attach="background" args={['#061015']} /><fog attach="fog" args={['#061015', 18, 65]} />
    <PerspectiveCamera makeDefault position={[7, 5.5, 10]} fov={48} />
    <ambientLight intensity={.35} /><directionalLight position={[-10, 14, 3]} intensity={2.2} color="#c5f3ff" castShadow shadow-mapSize={[1024,1024]} />
    <pointLight position={[0, 4, -14]} intensity={40} distance={24} color="#ff3b2f" /><pointLight position={[-10, 3, -8]} intensity={30} distance={20} color="#12d9d1" />
    <Environment preset="night" />
    <group ref={road}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,-15]} receiveShadow><planeGeometry args={[15, 100]} /><meshStandardMaterial color="#101820" roughness={.9} /></mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[-7,0,-15]}><planeGeometry args={[.22,100]} /><meshStandardMaterial color="#16d7cd" emissive="#0bcac2" emissiveIntensity={3} /></mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[7,0,-15]}><planeGeometry args={[.22,100]} /><meshStandardMaterial color="#ff493a" emissive="#ff291a" emissiveIntensity={3} /></mesh>
      {Array.from({length: 14}, (_, i) => <mesh key={i} rotation={[-Math.PI/2,0,0]} position={[0,.015,-i*7]}><planeGeometry args={[.12,3]} /><meshStandardMaterial color="#d6e6e4" emissive="#d6e6e4" emissiveIntensity={.5} /></mesh>)}
      {Array.from({length: 10}, (_, i) => <group key={i} position={[-10 + (i%2)*20, 2, -i*10]}><mesh><cylinderGeometry args={[.06,.06,4]} /><meshStandardMaterial color="#65737a" /></mesh><mesh position={[0,2,0]}><sphereGeometry args={[.28,10,10]} /><meshStandardMaterial color="#ff493a" emissive="#ff2418" emissiveIntensity={4} /></mesh></group>)}
    </group>
    <Car position={[0,0,4]} rotation={[0,0,0]} color="#d6f2f3" />
    <Sparkles count={120} scale={[24,8,50]} size={1.5} speed={.25} color="#75e6dd" opacity={.5} />
    <Text position={[-8, 5, -22]} rotation={[0,.45,0]} fontSize={1.2} color="#ff5d47" anchorX="left">NIGHT//RUN</Text>
  </>
}

function App() {
  const [driving, setDriving] = useState(false); const [speed, setSpeed] = useState(0); const [mode, setMode] = useState('RACE'); const [car, setCar] = useState(0)
  useEffect(() => { const down = e => { if (['ArrowUp','w','W'].includes(e.key)) setDriving(true); if (e.key === 'Escape') setDriving(false) }; const up = e => { if (['ArrowUp','w','W'].includes(e.key)) setDriving(false) }; window.addEventListener('keydown',down); window.addEventListener('keyup',up); return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)} }, [])
  useEffect(() => { let id; if (driving) { id = setInterval(() => setSpeed(s => Math.min(214, s + 3)), 100) } else { id = setInterval(() => setSpeed(s => Math.max(0, s - 8)), 100) } return () => clearInterval(id) }, [driving])
  return <main className="app"><Canvas shadows dpr={[1,1.5]}><World driving={driving} speed={speed} /></Canvas>
    <header className="topbar"><div className="brand"><span className="brand-mark">RX</span><span>REAL DRIVE <b>X</b></span></div><div className="top-status"><span className="live-dot" /> LIVE SESSION <span className="divider" /> NIGHT CIRCUIT 01</div><button className="icon-btn" onClick={() => setDriving(false)}>Ⅱ</button></header>
    <section className="left-panel"><div className="eyebrow">SEASON 01 / STREET LEAGUE</div><h1>NIGHT<br/><em>RUN</em></h1><p>Push the limit through the city after dark.</p><div className="stats"><div><strong>01</strong><span>POSITION</span></div><div><strong>02:48</strong><span>BEST LAP</span></div><div><strong>8.2KM</strong><span>DISTANCE</span></div></div></section>
    <section className="mode-nav"><div className="nav-label">SELECT EVENT</div>{['RACE','FREE ROAM','DRIFT'].map(x=><button key={x} className={mode===x?'active':''} onClick={()=>setMode(x)}>{x}<span>↗</span></button>)}</section>
    <section className="hud"><div className="speed"><strong>{String(speed).padStart(3,'0')}</strong><span>KM/H</span></div><div className="gear">D <span>••••</span></div><div className="progress"><span>CHECKPOINT 03</span><div><i style={{width:`${Math.min(100,speed/2.14)}%`}} /></div></div></section>
    <footer className="bottom"><div className="car-info"><div className="car-number">0{car+1}</div><div><b>{cars[car].name}</b><span>{cars[car].type} <i /> AWD</span></div><button onClick={()=>setCar(car?0:1)}>CHANGE VEHICLE ↗</button></div><div className="controls"><span><kbd>W</kbd> ACCELERATE</span><span><kbd>S</kbd> BRAKE</span><span><kbd>A</kbd><kbd>D</kbd> STEER</span></div><button className="drive-btn" onMouseDown={()=>setDriving(true)} onMouseUp={()=>setDriving(false)} onTouchStart={()=>setDriving(true)} onTouchEnd={()=>setDriving(false)}>{driving?'DRIVING':'HOLD TO DRIVE'} <b>→</b></button></footer>
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
