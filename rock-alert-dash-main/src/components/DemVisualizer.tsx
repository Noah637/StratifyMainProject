// Re-export DemVisualizer from dummy_2 for use in main app
import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";

type TerrainProps = { demArray: Float32Array, size: number };
function getColor(elev: number, min: number, max: number) {
	// Color gradient: low=blue, mid=green, high=yellow, peak=red
	const t = (elev - min) / (max - min);
	if (t < 0.33) return `#1e90ff`;
	if (t < 0.66) return `#22bb22`;
	if (t < 0.9) return `#ffee00`;
	return `#ff2222`;
}

type ClickHandler = (x: number, y: number, world: [number, number, number]) => void;
function Terrain({ demArray, size, onCellClick }: TerrainProps & { onCellClick?: ClickHandler }) {
	const min = Math.min(...demArray);
	const max = Math.max(...demArray);
	const geometry = useMemo(() => {
		const geom = new THREE.PlaneGeometry(500, 500, size - 1, size - 1);
		geom.rotateX(-Math.PI / 2);
		const positions = geom.attributes.position;
		const colors = [];
		for (let i = 0; i < positions.count; i++) {
			const x = i % size;
			const y = Math.floor(i / size);
			const height = demArray[y * size + x];
			positions.setY(i, height * 50);
			// Color by elevation
			const color = new THREE.Color(getColor(height, min, max));
			colors.push(color.r, color.g, color.b);
		}
		positions.needsUpdate = true;
		geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		geom.computeVertexNormals();
		return geom;
	}, [demArray, size]);

	// For grid lines: create a wireframe geometry
	const wireframeGeometry = useMemo(() => {
		const geom = new THREE.PlaneGeometry(500, 500, size - 1, size - 1);
		geom.rotateX(-Math.PI / 2);
		const positions = geom.attributes.position;
		for (let i = 0; i < positions.count; i++) {
			const x = i % size;
			const y = Math.floor(i / size);
			const height = demArray[y * size + x];
			positions.setY(i, height * 50);
		}
		positions.needsUpdate = true;
		geom.computeVertexNormals();
		return geom;
	}, [demArray, size]);

	// Click handler to map intersection to grid cell
	const handlePointerDown = (e: any) => {
		if (!onCellClick) return;
		// Get uv coordinates (0-1), map to grid
		const uv = e.uv;
		if (!uv) return;
		const x = Math.floor(uv.x * (size - 1));
		const y = Math.floor((1 - uv.y) * (size - 1));
		onCellClick(x, y, [e.point.x, e.point.y, e.point.z]);
	};
	return (
		<>
			<mesh geometry={geometry} castShadow receiveShadow onPointerDown={handlePointerDown}>
				<meshStandardMaterial
					vertexColors={true}
					wireframe={false}
					roughness={0.6}
					metalness={0.1}
				/>
			</mesh>
			{/* Grid lines overlay */}
			<lineSegments geometry={wireframeGeometry}>
				<lineBasicMaterial color="#222" linewidth={2} />
			</lineSegments>
		</>
	);
}

type DemVisualizerProps = { demArray: Float32Array, riskArray?: Float32Array | null, size: number };
type Popup = { x: number, y: number, world: [number, number, number], risk: number } | null;
export default function DemVisualizer({ demArray, riskArray, size }: DemVisualizerProps) {
	const [popup, setPopup] = useState<Popup>(null);
	// Risk stats
	let riskStats = null;
	if (riskArray && riskArray.length) {
		const min = Math.min(...riskArray);
		const max = Math.max(...riskArray);
		const avg = riskArray.reduce((a, b) => a + b, 0) / riskArray.length;
		let level = 'Low';
		if (avg > 0.8) level = 'Extreme';
		else if (avg > 0.6) level = 'High';
		else if (avg > 0.4) level = 'Moderate';
		else if (avg > 0.2) level = 'Low';
		riskStats = { min, max, avg, level };
	}

	return (
		<div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, background: "#222" }}>
			<Canvas
				shadows
				style={{ width: "100vw", height: "100vh", display: "block" }}
				gl={{ antialias: true }}
			>
				<PerspectiveCamera makeDefault position={[0, 120, 220]} fov={60} />
				<ambientLight intensity={0.8} />
				<directionalLight
					position={[200, 400, 200]}
					intensity={1.3}
					castShadow
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
				/>
				<Terrain
					demArray={demArray}
					size={size}
					onCellClick={(x, y, world) => {
						if (!riskArray) return;
						const idx = y * size + x;
						setPopup({ x, y, world, risk: riskArray[idx] });
					}}
				/>
				<OrbitControls
					enableZoom={true}
					zoomSpeed={1.2}
					minDistance={10}
					maxDistance={500}
					enablePan={true}
				/>
				<Environment preset="sunset" background={false} />
				{/* Popup for clicked risk location */}
				   {popup && (
					   <Html position={popup.world} center style={{ pointerEvents: 'auto' }}>
						   <div style={{
							   background: 'rgba(30,30,30,0.98)',
							   color: 'white',
							   borderRadius: 10,
							   padding: '1em 1.5em',
							   boxShadow: '0 4px 24px #000a',
							   fontSize: 16,
							   minWidth: 180,
							   textAlign: 'center',
							   border: `2px solid ${popup.risk > 0.8 ? '#ff2222' : popup.risk > 0.6 ? '#ffee00' : '#22bb22'}`
						   }}>
							   <div style={{fontWeight: 700, fontSize: 18, marginBottom: 6}}>Risk at ({popup.x}, {popup.y})</div>
							   <div>Value: <span style={{color: popup.risk > 0.8 ? '#ff2222' : popup.risk > 0.6 ? '#ffee00' : '#22bb22', fontWeight: 600}}>{popup.risk.toFixed(2)}</span></div>
							   <button style={{marginTop: 10, background: '#444', color: 'white', border: 'none', borderRadius: 6, padding: '0.3em 1em', cursor: 'pointer'}} onClick={() => setPopup(null)}>Close</button>
						   </div>
					   </Html>
				   )}
			</Canvas>
			{/* Floating overlay for risk status (always visible) */}
			{riskStats && (
				<div style={{
					position: 'absolute',
					top: 32,
					right: 32,
					background: 'rgba(30,30,30,0.97)',
					color: 'white',
					borderRadius: 12,
					padding: '1.2em 2em',
					boxShadow: '0 4px 24px #0008',
					fontSize: 18,
					minWidth: 220,
					textAlign: 'center',
					border: `2px solid ${riskStats.level === 'Extreme' ? '#ff2222' : riskStats.level === 'High' ? '#ffee00' : '#22bb22'}`
				}}>
					<div style={{fontWeight: 700, fontSize: 22, marginBottom: 8}}>Risk Status</div>
					<div>Level: <span style={{color: riskStats.level === 'Extreme' ? '#ff2222' : riskStats.level === 'High' ? '#ffee00' : '#22bb22', fontWeight: 600}}>{riskStats.level}</span></div>
					<div>Min: {riskStats.min.toFixed(2)}</div>
					<div>Max: {riskStats.max.toFixed(2)}</div>
					<div>Avg: {riskStats.avg.toFixed(2)}</div>
				</div>
			)}
		</div>
	);
}
