import React, { Suspense, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html, Line, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Menu, RotateCw, ZoomIn, Move, Camera, Lightbulb, ThermometerSun, Clock3, Moon, Sparkles, CircleDot, Layers3, ChevronRight, Orbit, X, Check } from 'lucide-react'
import './styles.css'

const planets = [
  { id:'बुध', name:'बुध', kind:'स्थलीय ग्रह', diameter:'4,879 किमी', distance:'5.8 करोड़ किमी', temperature:'167°C', day:'59 पृथ्वी दिन', moons:'0', color:'स्लेटी और भूरा', atmosphere:'बहुत पतला', about:'बुध सूर्य के सबसे पास और सौरमंडल का सबसे छोटा ग्रह है। दिन में यहाँ बहुत गर्मी और रात में कड़ाके की ठंड पड़ती है।', fact:'बुध का एक वर्ष केवल 88 पृथ्वी दिनों का होता है!', surface:'इसकी पथरीली सतह पर हजारों पुराने उल्कापिंड-गड्ढे हैं।', type:'rock', colors:['#aeb0aa','#6f6962','#d7d0bf'], bars:[42,8,90] },
  { id:'शुक्र', name:'शुक्र', kind:'स्थलीय ग्रह', diameter:'12,104 किमी', distance:'10.8 करोड़ किमी', temperature:'464°C', day:'243 पृथ्वी दिन', moons:'0', color:'पीला और क्रीम', atmosphere:'कार्बन डाइऑक्साइड', about:'शुक्र पृथ्वी के आकार का पड़ोसी ग्रह है, लेकिन इसका घना वायुमंडल इसे बेहद गर्म बनाता है। इसके बादल सल्फ्यूरिक अम्ल के हैं।', fact:'शुक्र पर एक दिन उसके एक वर्ष से भी लंबा है!', surface:'घने सुनहरे बादल नीचे की ज्वालामुखीय सतह को ढक लेते हैं।', type:'cloud', colors:['#f3d58d','#b57538','#fff0bd'], bars:[91,82,66] },
  { id:'पृथ्वी', name:'पृथ्वी', kind:'स्थलीय ग्रह', diameter:'12,742 किमी', distance:'15 करोड़ किमी', temperature:'15°C', day:'24 घंटे', moons:'1', color:'नीला, हरा और सफ़ेद', atmosphere:'नाइट्रोजन व ऑक्सीजन', about:'पृथ्वी हमारा घर है और ज्ञात जीवन वाला एकमात्र ग्रह है। इसके विशाल महासागर, बादल और हरे महाद्वीप इसे अंतरिक्ष से नीला दिखाते हैं।', fact:'पृथ्वी की सतह का लगभग 71% भाग पानी से ढका है।', surface:'नीले महासागर, हरे भूभाग और घूमते सफ़ेद बादल इसकी पहचान हैं।', type:'earth', colors:['#1d6baf','#46a86b','#e8f4ee'], bars:[50,50,72] },
  { id:'मंगल', name:'मंगल', kind:'स्थलीय ग्रह', diameter:'6,779 किमी', distance:'22.8 करोड़ किमी', temperature:'−63°C', day:'24 घंटे 37 मिनट', moons:'2', color:'लाल और नारंगी', atmosphere:'कार्बन डाइऑक्साइड', about:'मंगल को लाल ग्रह कहा जाता है क्योंकि उसकी मिट्टी में लोहे का ऑक्साइड है। यहाँ सौरमंडल का सबसे ऊँचा ज्वालामुखी ओलंपस मॉन्स है।', fact:'मंगल का सूर्यास्त नीले रंग का दिखाई दे सकता है!', surface:'लाल धूल, गहरे गड्ढे और विशाल ज्वालामुखी इसकी पथरीली सतह बनाते हैं।', type:'rock', colors:['#c85f3d','#7e3329','#e7985b'], bars:[19,11,57] },
  { id:'बृहस्पति', name:'बृहस्पति', kind:'गैसीय दानव', diameter:'1,42,984 किमी', distance:'77.8 करोड़ किमी', temperature:'−110°C', day:'9 घंटे 56 मिनट', moons:'95', color:'भूरा, सफ़ेद और नारंगी', atmosphere:'हाइड्रोजन व हीलियम', about:'बृहस्पति हमारे सौरमंडल का सबसे बड़ा ग्रह है। यह मुख्यतः गैसों से बना है और इसकी धारियों में तेज़ तूफ़ान चलते रहते हैं।', fact:'बृहस्पति के भीतर पृथ्वी जैसे 1,300 से अधिक ग्रह समा सकते हैं!', surface:'रंगीन धारियाँ गैसों के घूमते बादल हैं; महान लाल धब्बा एक विशाल तूफ़ान है।', type:'gas', colors:['#d9b38b','#9e6540','#f3dfbc'], bars:[82,96,44] },
  { id:'शनि', name:'शनि', kind:'गैसीय दानव', diameter:'1,20,536 किमी', distance:'143 करोड़ किमी', temperature:'−140°C', day:'10 घंटे 42 मिनट', moons:'146', color:'हल्का पीला और सोना', atmosphere:'हाइड्रोजन व हीलियम', about:'शनि अपने शानदार छल्लों के लिए प्रसिद्ध है। ये छल्ले बर्फ, धूल और चट्टानों के अरबों छोटे टुकड़ों से बने हैं।', fact:'शनि इतना हल्का है कि बहुत बड़े पानी के टब में तैर सकता है!', surface:'नरम सुनहरी गैस-धारियाँ और बर्फीले छल्ले इसे सबसे अलग बनाते हैं।', type:'saturn', colors:['#edcf8b','#b48752','#fff0bd'], bars:[91,84,34] },
  { id:'अरुण', name:'अरुण', kind:'बर्फीला दानव', diameter:'50,724 किमी', distance:'287 करोड़ किमी', temperature:'−195°C', day:'17 घंटे 14 मिनट', moons:'27', color:'नीला-हरा', atmosphere:'हाइड्रोजन, हीलियम व मीथेन', about:'अरुण अपनी धुरी पर लगभग लेटा हुआ घूमता है। मीथेन गैस इसे शांत नीला-हरा रंग देती है।', fact:'अरुण पर एक ऋतु लगभग 21 पृथ्वी वर्षों तक चल सकती है!', surface:'ठंडे मीथेन बादल और धुंधली हल्की धारियाँ इसके वातावरण में हैं।', type:'ice', colors:['#9ae8e5','#4fa7b8','#d7ffff'], bars:[89,15,24] },
  { id:'वरुण', name:'वरुण', kind:'बर्फीला दानव', diameter:'49,244 किमी', distance:'450 करोड़ किमी', temperature:'−200°C', day:'16 घंटे 6 मिनट', moons:'14', color:'गहरा नीला', atmosphere:'हाइड्रोजन, हीलियम व मीथेन', about:'वरुण सूर्य से सबसे दूर का प्रमुख ग्रह है। यहाँ सौरमंडल की सबसे तेज़ हवाएँ चलती हैं।', fact:'वरुण पर हवाएँ ध्वनि की गति से भी तेज़ हो सकती हैं!', surface:'गहरे नीले बादल और चमकीले तूफ़ान इसकी ठंडी सतह को सजाते हैं।', type:'ice', colors:['#245bcb','#123375','#62b8ee'], bars:[114,17,18] }
]

const learningDetails = {
  'बुध': { year:'88 पृथ्वी दिन', tilt:'0.03°', landmark:'कैलोरिस बेसिन', mission:'मेरिनर 10 और बेपीकोलंबो' },
  'शुक्र': { year:'225 पृथ्वी दिन', tilt:'177.4°', landmark:'मैक्सवेल पर्वत', mission:'मैगलन और अकात्सुकी' },
  'पृथ्वी': { year:'365.25 दिन', tilt:'23.4°', landmark:'प्रशांत महासागर', mission:'अनेक मौसम उपग्रह' },
  'मंगल': { year:'687 पृथ्वी दिन', tilt:'25.2°', landmark:'ओलंपस मॉन्स', mission:'क्यूरियोसिटी और परसेवरेंस' },
  'बृहस्पति': { year:'11.86 पृथ्वी वर्ष', tilt:'3.1°', landmark:'महान लाल धब्बा', mission:'जूनो और गैलीलियो' },
  'शनि': { year:'29.5 पृथ्वी वर्ष', tilt:'26.7°', landmark:'शानदार बर्फीले छल्ले', mission:'कैसिनी-हाइगेंस' },
  'अरुण': { year:'84 पृथ्वी वर्ष', tilt:'97.8°', landmark:'झुका हुआ घूर्णन अक्ष', mission:'वॉयेजर 2' },
  'वरुण': { year:'164.8 पृथ्वी वर्ष', tilt:'28.3°', landmark:'महान गहरा धब्बा', mission:'वॉयेजर 2' }
}

function makeTexture(planet) {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512
  const ctx = canvas.getContext('2d'); const [base, dark, light] = planet.colors
  ctx.fillStyle = base; ctx.fillRect(0, 0, 1024, 512)
  const random = (n) => { const x = Math.sin(n * 999) * 43758; return x - Math.floor(x) }
  if (planet.type === 'gas' || planet.type === 'saturn' || planet.type === 'cloud') {
    for (let y=0; y<512; y+=18) { ctx.fillStyle = y % 36 ? light : dark; ctx.globalAlpha=.45; ctx.fillRect(0,y,1024,10+random(y)*18) }
    for (let i=0;i<120;i++) { ctx.fillStyle=i%2?light:dark; ctx.globalAlpha=.16; ctx.beginPath(); ctx.ellipse(random(i)*1024,random(i+3)*512,35+random(i+9)*140,2+random(i+6)*8,0,0,Math.PI*2);ctx.fill() }
    if (planet.id==='बृहस्पति') { ctx.globalAlpha=1;ctx.fillStyle='#ae4b39';ctx.beginPath();ctx.ellipse(710,310,75,29,-.08,0,Math.PI*2);ctx.fill() }
  } else if (planet.type === 'earth') {
    for(let i=0;i<40;i++){ctx.fillStyle=i%3?'#3586c8':'#195796';ctx.globalAlpha=.7;ctx.beginPath();ctx.ellipse(random(i)*1024,random(i+1)*512,70+random(i+2)*160,18+random(i+3)*80,random(i+4),0,Math.PI*2);ctx.fill()}
    for(let i=0;i<24;i++){ctx.fillStyle='#4da96f';ctx.globalAlpha=.95;ctx.beginPath();ctx.ellipse(random(i+20)*1024,random(i+21)*512,24+random(i+22)*95,12+random(i+23)*48,random(i+24),0,Math.PI*2);ctx.fill()}
    for(let i=0;i<28;i++){ctx.fillStyle='#fff';ctx.globalAlpha=.55;ctx.beginPath();ctx.ellipse(random(i+50)*1024,random(i+51)*512,40+random(i+52)*115,3+random(i+53)*12,0,0,Math.PI*2);ctx.fill()}
  } else {
    for (let i=0;i<160;i++) { ctx.fillStyle=i%3?dark:light;ctx.globalAlpha=.22+random(i)*.25;ctx.beginPath();ctx.arc(random(i)*1024,random(i+2)*512,2+random(i+4)*25,0,Math.PI*2);ctx.fill() }
    for (let i=0;i<14;i++){ctx.strokeStyle=dark;ctx.globalAlpha=.32;ctx.lineWidth=3;ctx.beginPath();ctx.arc(random(i+10)*1024,random(i+12)*512,22+random(i+14)*48,0,Math.PI*2);ctx.stroke()}
  }
  ctx.globalAlpha=1; const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace; return texture
}

function Rings({ color }) { return <group rotation={[Math.PI/2.35,0,.08]}>{[[2.25,2.47,.62],[2.52,2.7,.33],[2.77,3.12,.58],[3.2,3.45,.22]].map(([inner,outer,opacity],i)=><mesh key={i}><ringGeometry args={[inner,outer,128]}/><meshStandardMaterial color={i===1?'#6f6252':color} transparent opacity={opacity} side={THREE.DoubleSide} roughness={.42}/></mesh>)}</group> }

function CloudShell({ texture, size, planet }) { const cloud=useRef();useFrame((_,d)=>{if(cloud.current)cloud.current.rotation.y-=d*(planet.type==='gas' ? .028 : .018)});return <mesh ref={cloud} scale={1.028}><sphereGeometry args={[size,96,96]}/><meshBasicMaterial map={texture} transparent opacity={planet.type==='earth' ? .22 : .13} depthWrite={false}/></mesh> }

function Atmosphere({ size, color }) { return <mesh scale={1.07}><sphereGeometry args={[size,96,96]}/><meshBasicMaterial color={color} transparent opacity={.12} side={THREE.BackSide} blending={THREE.AdditiveBlending}/></mesh> }

function OrbitingMoons({ planet, size }) { const group=useRef();const count=planet.id==='पृथ्वी'?1:planet.id==='मंगल'?2:planet.id==='शनि'?3:planet.id==='बृहस्पति'?3:planet.id==='वरुण'?2:0;useFrame((_,d)=>{if(group.current)group.current.rotation.y+=d*.16});return <group ref={group}>{Array.from({length:count},(_,i)=>{const angle=(i/count)*Math.PI*2;const radius=size+0.7+i*.28;return <group key={i} rotation={[.25+i*.17,angle,0]}><mesh position={[radius,0,0]}><sphereGeometry args={[.075+(i%2)*.035,20,20]}/><meshStandardMaterial color={i%2?'#b3b0a3':'#e6e1cf'} roughness={.9}/></mesh></group>})}</group> }

const surfaceFeatures = {
  'बुध': [{ label:'कैलोरिस बेसिन', color:'#6e6258', lat:.18, lon:.75, scale:.1 }, { label:'ध्रुवीय छाया', color:'#d9d4ca', lat:.92, lon:-.45, scale:.055 }],
  'शुक्र': [{ label:'अम्लीय बादल', color:'#fff0bb', lat:.28, lon:.55, scale:.08 }, { label:'मैक्सवेल पर्वत', color:'#9f6337', lat:-.2, lon:-.7, scale:.065 }],
  'पृथ्वी': [{ label:'महासागर', color:'#155f9d', lat:.05, lon:.6, scale:.075 }, { label:'बादल पट्टी', color:'#ffffff', lat:.34, lon:-.42, scale:.06 }],
  'मंगल': [{ label:'ओलंपस मॉन्स', color:'#9b382b', lat:.35, lon:.7, scale:.085 }, { label:'वैलेस मेरिनेरिस', color:'#6f241c', lat:-.16, lon:-.58, scale:.06 }],
  'बृहस्पति': [{ label:'महान लाल धब्बा', color:'#a84032', lat:-.22, lon:.64, scale:.16 }, { label:'बादल पट्टियाँ', color:'#fff0d0', lat:.18, lon:-.55, scale:.08 }],
  'शनि': [{ label:'बर्फीले छल्ले', color:'#f6e3b2', lat:.05, lon:.8, scale:.07 }, { label:'सुनहरी धारियाँ', color:'#b88752', lat:-.2, lon:-.45, scale:.07 }],
  'अरुण': [{ label:'झुका हुआ अक्ष', color:'#d5ffff', lat:.52, lon:.52, scale:.07 }, { label:'मीथेन धुंध', color:'#78d9db', lat:-.12, lon:-.56, scale:.075 }],
  'वरुण': [{ label:'तेज़ तूफ़ान', color:'#d7f3ff', lat:.2, lon:.62, scale:.085 }, { label:'मीथेन बादल', color:'#7fc9ff', lat:-.34, lon:-.48, scale:.07 }]
}

const internalProfiles = {
  'बुध': { radii:[1,.52,.38,.22], colors:['#9b9489','#c08a56','#9f5f36','#ffd184'], glow:'#f0aa52' },
  'शुक्र': { radii:[1,.72,.44,.22], colors:['#d9a25c','#e0843f','#d65b35','#ffe08d'], glow:'#ff9b45' },
  'पृथ्वी': { radii:[1,.78,.5,.25], colors:['#2d83bd','#d48743','#e4a33b','#fff0a3'], glow:'#ffb84d' },
  'मंगल': { radii:[1,.72,.34,.16], colors:['#b9533b','#d78642','#b85a37','#ffd48b'], glow:'#e98a4b' },
  'बृहस्पति': { radii:[1,.84,.56,.22], colors:['#e7c79f','#d5a15f','#b96645','#ffe1a1'], glow:'#ffc06a' },
  'शनि': { radii:[1,.82,.52,.2], colors:['#ead18a','#dcb669','#b88954','#fff0b0'], glow:'#ffd37a' },
  'अरुण': { radii:[1,.78,.48,.22], colors:['#9be8e6','#62c0cd','#587fd6','#e1fbff'], glow:'#95f3ff' },
  'वरुण': { radii:[1,.76,.46,.22], colors:['#2b6bd4','#3062aa','#544cc2','#d9f4ff'], glow:'#6cc9ff' }
}

function surfacePoint(size, lat, lon) {
  const phi = Math.PI / 2 - lat
  return [Math.cos(lon) * Math.sin(phi) * size, Math.sin(lat) * size, Math.sin(lon) * Math.sin(phi) * size]
}

function SurfaceFeatures({ planet, size, compact }) {
  const { camera } = useThree(); const [close,setClose]=useState(false); const items=surfaceFeatures[planet.id] || []
  useFrame(()=>{const next=camera.position.length() < (compact ? 7.15 : 6.45);if(next!==close)setClose(next)})
  return <group>{items.map((item,i)=>{const markerScale=item.scale*(compact ? .72 : 1)*(planet.type==='gas'||planet.type==='saturn'?1.4:1);const pos=new THREE.Vector3(...surfacePoint(size*1.018,item.lat,item.lon));const normal=pos.clone().normalize();const labelPos=normal.clone().multiplyScalar(size+(compact?.42:.5)+markerScale*.9);const markerQuat=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),normal);return <group key={item.label}><group position={pos.toArray()} quaternion={markerQuat}><mesh scale={markerScale}><sphereGeometry args={[1,24,16]}/><meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={close ? .22 : .06} roughness={.7}/></mesh>{planet.type==='rock'&&<mesh scale={markerScale*2.3}><torusGeometry args={[.7,.05,8,28]}/><meshBasicMaterial color={item.color} transparent opacity={.42}/></mesh>}</group>{(compact||close)&&<><Line points={[pos.clone().multiplyScalar(1.015).toArray(),labelPos.clone().multiplyScalar(.97).toArray()]} color={item.color} lineWidth={compact?1.15:1.4} transparent opacity={.62}/><Html position={labelPos.toArray()} center distanceFactor={compact?8.5:7} occlude zIndexRange={[8,0]}><div className={`feature-label ${compact?'mobile':''}`}>{item.label}</div></Html></>}</group>})}</group>
}

const internalDetails = {
  'बुध': { density:'बहुत बड़ा धातु कोर', magnetic:'कमज़ोर चुंबकीय क्षेत्र', heat:'धीरे-धीरे ठंडी होती चट्टान', layers:['पतली धूसर क्रस्ट','सिलिकेट मेंटल','तरल धातु भाग','ठोस लोहे का कोर'] },
  'शुक्र': { density:'घना पथरीला अंदरूनी भाग', magnetic:'बहुत कम चुंबकीय प्रभाव', heat:'गर्मी भीतर फँसी रहती है', layers:['ज्वालामुखी क्रस्ट','गरम मेंटल','पिघला बाहरी कोर','धातु आंतरिक कोर'] },
  'पृथ्वी': { density:'संतुलित चट्टान और धातु', magnetic:'मज़बूत चुंबकीय ढाल', heat:'मेंटल में धीमी संवहन धाराएँ', layers:['टेक्टोनिक क्रस्ट','गर्म मेंटल','तरल बाहरी कोर','ठोस आंतरिक कोर'] },
  'मंगल': { density:'छोटा, ठंडा होता कोर', magnetic:'पुराने चुंबकीय निशान', heat:'कमज़ोर आंतरिक ऊर्जा', layers:['धूल भरी क्रस्ट','शांत मेंटल','लोहे-सल्फर कोर','घना केंद्रीय भाग'] },
  'बृहस्पति': { density:'गैस से धात्विक हाइड्रोजन तक', magnetic:'बहुत शक्तिशाली चुंबकीय क्षेत्र', heat:'अंदर से अतिरिक्त ऊष्मा निकलती है', layers:['बादल पट्टियाँ','हाइड्रोजन परत','धात्विक हाइड्रोजन','चट्टान-बर्फ कोर'] },
  'शनि': { density:'हल्का गैसीय बाहरी भाग', magnetic:'मुलायम पर शक्तिशाली क्षेत्र', heat:'धीमे-धीमे ऊष्मा छोड़ता है', layers:['सुनहरी बादल परत','हाइड्रोजन-हीलियम','धात्विक हाइड्रोजन','बर्फीला-चट्टानी कोर'] },
  'अरुण': { density:'बर्फ, गैस और चट्टान का मिश्रण', magnetic:'झुका हुआ चुंबकीय क्षेत्र', heat:'बहुत कम अंदरूनी ऊष्मा', layers:['मीथेन धुंध','बर्फीला मेंटल','अमोनिया-पानी महासागर','चट्टानी कोर'] },
  'वरुण': { density:'घना बर्फीला दानव', magnetic:'झुका और सक्रिय क्षेत्र', heat:'सूर्य से दूर होकर भी अंदर गर्म', layers:['नीली मीथेन परत','बर्फीला मेंटल','गर्म तरल मिश्रण','चट्टानी कोर'] }
}

function useCompactViewport() {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const update = () => setCompact(window.innerWidth <= 560)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return compact
}

function PlanetModel({ planet, internal, compact }) {
  const mesh = useRef(); const texture = useMemo(()=>makeTexture(planet),[planet]); const size = planet.id==='बुध'?1.45:planet.id==='मंगल'?1.65:planet.id==='पृथ्वी'||planet.id==='शुक्र'?1.76:2.05
  const gaseous=['gas','saturn','cloud'].includes(planet.type); const glow=planet.type==='ice'?'#58c4ef':planet.id==='मंगल'?'#f09964':planet.id==='पृथ्वी'?'#5aaef0':planet.colors[2]
  const viewScale = compact ? (planet.type === 'saturn' ? .58 : .68) : 1
  useFrame((state,delta)=>{if(mesh.current){mesh.current.rotation.y+=delta*(gaseous ? .072 : .052);mesh.current.rotation.z=Math.sin(state.clock.elapsedTime*.35)*.018}})
  if(internal) return <group scale={compact ? .72 : 1}><InternalPlanet planet={planet} texture={texture} size={size}/></group>
  return <group scale={viewScale}><group ref={mesh} rotation={[.1,-.55,0]}><mesh castShadow receiveShadow><sphereGeometry args={[size,112,112]}/><meshStandardMaterial map={texture} roughness={gaseous ? .5 : .82} metalness={planet.type==='ice' ? .17 : .02} bumpMap={texture} bumpScale={gaseous ? .025 : .07}/></mesh>{(gaseous||planet.id==='पृथ्वी'||planet.type==='ice')&&<CloudShell texture={texture} size={size} planet={planet}/>}<SurfaceFeatures planet={planet} size={size} compact={compact}/><Atmosphere size={size} color={glow}/>{planet.type==='saturn'&&<Rings color="#e5d3a3"/>}<OrbitingMoons planet={planet} size={size}/><pointLight position={[2.5,1.8,2]} intensity={.32} color={planet.colors[2]}/></group></group>
}

function InternalPlanet({ planet, texture, size }) {
  const group=useRef(); const flow=useRef(); const pulse=useRef()
  const detail=internalDetails[planet.id]; const profile=internalProfiles[planet.id]; const gas=['gas','saturn','cloud'].includes(planet.type); const ice=planet.type==='ice'
  const palette=profile.colors
  const radii=profile.radii.map(r=>size*r)
  useFrame((state,d)=>{if(group.current)group.current.rotation.y+=d*.13;if(flow.current)flow.current.rotation.z-=d*.35;if(pulse.current){const s=1+Math.sin(state.clock.elapsedTime*2.6)*.07;pulse.current.scale.setScalar(s)}})
  return <group ref={group} rotation={[.18,-.7,0]}>
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radii[0],128,80,0.2,Math.PI*1.55]}/>
      <meshStandardMaterial map={texture} roughness={.72} metalness={ice ? .12 : .03}/>
    </mesh>
    <mesh scale={1.018}>
      <sphereGeometry args={[radii[0],128,80,0.2,Math.PI*1.55]}/>
      <meshBasicMaterial color={planet.colors[2]} transparent opacity={.12} side={THREE.BackSide} blending={THREE.AdditiveBlending}/>
    </mesh>
    {radii.slice(1).map((radius,i)=><mesh key={i} position={[.42+i*.22,0,.05+i*.03]} castShadow>
      <sphereGeometry args={[radius,96,64,0,Math.PI*1.72]}/>
      <meshStandardMaterial color={palette[i+1]} roughness={i===2 ? .35 : .62} emissive={i===2?palette[3]:'#000000'} emissiveIntensity={i===2 ? .55 : .04}/>
    </mesh>)}
    <group ref={flow} position={[.54,0,.08]}>
      {[0,1,2,3,4].map(i=><mesh key={i} rotation={[Math.PI/2,(i*Math.PI)/5,.35]} scale={[1,1,.08]}>
        <torusGeometry args={[radii[1]*(.72+i*.045),.008,8,88]}/>
        <meshBasicMaterial color={i%2?profile.glow:palette[2]} transparent opacity={gas || ice ? .42 : .28}/>
      </mesh>)}
    </group>
    <mesh ref={pulse} position={[1.1,0,.14]}>
      <sphereGeometry args={[radii[3]*.82,64,64]}/>
      <meshStandardMaterial color={palette[3]} emissive={profile.glow} emissiveIntensity={gas ? .75 : 1.15} roughness={.25}/>
    </mesh>
    {planet.type==='saturn'&&<Rings color="#dbc28d"/>}
    <Html position={[-1.75,1.45,0]} center distanceFactor={7}><div className="internal-label">{detail.layers[0]}</div></Html>
    <Html position={[-1.15,.55,0]} center distanceFactor={7}><div className="internal-label warm">{detail.layers[1]}</div></Html>
    <Html position={[-.38,-.4,0]} center distanceFactor={7}><div className="internal-label hot">{detail.layers[2]}</div></Html>
    <Html position={[.9,-1.05,0]} center distanceFactor={7}><div className="internal-label core">{detail.layers[3]}</div></Html>
    <pointLight position={[1.4,.6,1.3]} intensity={1.15} color="#ffb34c"/>
  </group>
}

const CameraControls = React.forwardRef(function CameraControls({ compact }, ref) {
  const controls = useRef(); const [spinning,setSpinning]=useState(false)
  useImperativeHandle(ref,()=>({ rotate(){setSpinning(v=>!v)}, zoom(){const c=controls.current;if(c){c.dollyIn(compact?1.32:1.45);c.update()}}, pan(){const c=controls.current;if(c){c.target.x=c.target.x>.2?-.42:.42;c.update()}}, reset(){const c=controls.current;if(c){c.reset();setSpinning(false)}} }))
  return <OrbitControls ref={controls} enablePan enableZoom autoRotate={spinning} autoRotateSpeed={2.1} minDistance={compact?6:4.2} maxDistance={compact?10.8:10}/>
})

function PlanetStage({ planet, internal }) {
  const controls=useRef(); const wrap=useRef(); const compact=useCompactViewport()
  useEffect(()=>controls.current?.reset(),[planet,internal])
  function snapshot(){const canvas=wrap.current?.querySelector('canvas');if(!canvas)return;const link=document.createElement('a');link.download=`${planet.name}-स्नैपशॉट.png`;link.href=canvas.toDataURL('image/png');link.click()}
  return <div className="stage-shell" ref={wrap}><div className="stage-caption"><Sparkles size={14}/> जीवंत 3D मॉडल</div><Canvas camera={{position:[0,0,compact?8.8:6.3],fov:compact?42:38}} shadows dpr={[1,2]}><color attach="background" args={['#f7f3ea']}/><ambientLight intensity={1.35}/><directionalLight position={[4,4,4]} intensity={2.4} castShadow/><pointLight position={[-4,-2,2]} intensity={.7} color="#ffcf83"/><Suspense fallback={null}><PlanetModel planet={planet} internal={internal} compact={compact}/><ContactShadows position={[0,compact?-1.78:-2.25,0]} opacity={compact ? .24 : .34} scale={compact?4.2:6.4} blur={2.6} far={3.5}/><Stars radius={24} depth={4} count={220} factor={1.5} saturation={0} fade speed={.1}/></Suspense><CameraControls ref={controls} compact={compact}/></Canvas><div className="stage-controls"><button onClick={()=>controls.current?.rotate()} title="घुमाएं"><RotateCw/></button><button onClick={()=>controls.current?.zoom()} title="ज़ूम"><ZoomIn/></button><button onClick={()=>controls.current?.pan()} title="खिसकाएं"><Move/></button></div><button className="snapshot" onClick={snapshot}><Camera size={15}/> स्नैपशॉट</button></div>
}

function Fact({ icon:Icon,label,value }) { return <div className="fact"><span className="fact-icon"><Icon size={17}/></span><span><small>{label}</small><strong>{value}</strong></span></div> }
let currentExtra = null
function SectionTitle({children}) { return <>{children === 'एक नज़र में' && currentExtra && <ExtraDetails extra={currentExtra}/>}<h2 className="section-title">{children}</h2></> }
function ExtraDetails({ extra }) { return <div className="learning-card"><SectionTitle>और जानें</SectionTitle><div><span>एक वर्ष</span><b>{extra.year}</b></div><div><span>धुरी का झुकाव</span><b>{extra.tilt}</b></div><div><span>मुख्य पहचान</span><b>{extra.landmark}</b></div><div><span>अंतरिक्ष अभियान</span><b>{extra.mission}</b></div></div> }
function InternalInsight({ detail }) { return <div className="internal-card"><div><Layers3 size={16}/><b>भीतर की कहानी</b></div><p>{detail.density}</p><span><strong>चुंबकत्व</strong>{detail.magnetic}</span><span><strong>ऊष्मा</strong>{detail.heat}</span></div> }

function App() {
  const [selected,setSelected]=useState('बृहस्पति'); const [internal,setInternal]=useState(false); const [mobilePanel,setMobilePanel]=useState(null); const [menuOpen,setMenuOpen]=useState(false); const planet=planets.find(x=>x.id===selected); const extra=learningDetails[planet.id]; const internalInfo=internalDetails[planet.id]; currentExtra=extra
  const selectPlanet=(id)=>{setSelected(id);setInternal(false);setMenuOpen(false)}
  return <main className="app-shell"><header className="topbar"><div className="brand-mark"><div className="sun-mini"><span/></div><div><h1>सौरमंडल दर्शन</h1><p>इंटरैक्टिव 3D एक्सप्लोरर</p></div></div><div className="header-actions"><div className="planet-menu"><button className="round-button" aria-label="ग्रह सूची" onClick={()=>setMenuOpen(v=>!v)}><Menu size={21}/></button>{menuOpen&&<div className="planet-dropdown"><div className="menu-heading">एक ग्रह चुनें</div>{planets.map(item=><button className={item.id===selected?'selected':''} key={item.id} onClick={()=>selectPlanet(item.id)}><i style={{background:`linear-gradient(135deg,${item.colors[2]},${item.colors[0]} )`}}/>{item.name}{item.id===selected&&<Check size={14}/>}</button>)}</div>}</div></div></header><div className="mobile-tabs"><button onClick={()=>setMobilePanel('info')}>ग्रह की जानकारी</button><button onClick={()=>setMobilePanel('data')}>डेटा और वर्गीकरण</button></div><div className="dashboard"><aside className={`panel left-panel ${mobilePanel==='info'?'mobile-open':''}`}><button className="close-mobile" onClick={()=>setMobilePanel(null)}><X/></button><SectionTitle>इस ग्रह के बारे में</SectionTitle><p className="about">{planet.about}</p><div className="diameter"><div className="label-row"><span>व्यास</span><strong>{planet.diameter}</strong></div><div className="slider-track"><i style={{width:`${planet.bars[1]}%`}}/></div></div><div className="divider"/><SectionTitle>ग्रह के तथ्य</SectionTitle><div className="facts"><Fact icon={Orbit} label="सूर्य से दूरी" value={planet.distance}/><Fact icon={ThermometerSun} label="तापमान" value={planet.temperature}/><Fact icon={Clock3} label="दिन की लंबाई" value={planet.day}/><Fact icon={Moon} label="चंद्रमा" value={planet.moons}/></div><div className="did-you-know"><div className="bulb"><Lightbulb size={19}/></div><div><h3>क्या आप जानते हैं?</h3><p>{planet.fact}</p></div></div></aside><section className="center-stage"><PlanetStage planet={planet} internal={internal}/></section><aside className={`panel right-panel ${mobilePanel==='data'?'mobile-open':''}`}><button className="close-mobile" onClick={()=>setMobilePanel(null)}><X/></button><div className="planet-identity"><div><span>चुना हुआ ग्रह</span><h2>{planet.name}</h2></div><div className="planet-dot" style={{background:`linear-gradient(145deg,${planet.colors[2]},${planet.colors[0]} 60%,${planet.colors[1]})`}}/></div><span className="type-pill">{planet.kind}</span><div className="surface-detail"><div className="magnify" style={{background:`linear-gradient(145deg,${planet.colors[2]},${planet.colors[0]},${planet.colors[1]})`}}><span/><b style={{background:planet.colors[1]}}/></div><div><SectionTitle>सतह का विवरण</SectionTitle><p>{planet.surface}</p></div></div><div className="divider"/><SectionTitle>वर्गीकरण</SectionTitle><div className="taxonomy"><div><span>प्रकार</span><b>{planet.kind}</b></div><div><span>रंग</span><b>{planet.color}</b></div><div><span>वायुमंडल</span><b>{planet.atmosphere}</b></div></div><div className="divider"/><SectionTitle>एक नज़र में</SectionTitle><div className="meters">{[['गुरुत्वाकर्षण',planet.bars[0]],['द्रव्यमान',planet.bars[1]],['कक्षीय गति',planet.bars[2]]].map(([label,value])=><div className="meter" key={label}><div><span>{label}</span><b>{value}%</b></div><i><em style={{width:`${value}%`}}/></i></div>)}</div><div className="divider"/><SectionTitle>आंतरिक संरचना</SectionTitle><div className="structure"><div><span className="layer crust"/><small>{internalInfo.layers[0]}</small></div><ChevronRight/><div><span className="layer mantle"/><small>{internalInfo.layers[1]}</small></div><ChevronRight/><div><span className="layer outer"/><small>{internalInfo.layers[2]}</small></div><ChevronRight/><div><span className="layer inner"/><small>{internalInfo.layers[3]}</small></div></div><InternalInsight detail={internalInfo}/></aside></div><footer className="site-copyright">© Dr. Akshat Shukla 2026</footer><div className="view-switch"><button className={!internal?'active':''} onClick={()=>setInternal(false)}><CircleDot size={16}/>3D दृश्य</button><button className={internal?'active':''} onClick={()=>setInternal(true)}><Layers3 size={16}/>आंतरिक दृश्य</button></div></main>
}
createRoot(document.getElementById('root')).render(<App />)

