import * as THREE from "three";
import { config } from "./config";
import FirstPersonControls from "./controls";
import Block from "./block";
import mapGenerator from "./generator";

let scene, camera, renderer;
const blocks = [];
let curPos;
let curBlockPos;
let controls;
const blockGroupSize = new THREE.Vector2(config.dim.x * config.blockSize, config.dim.y * config.blockSize);
const relativeMapEdges = {
	left: - (config.dim.x * config.blockSize / 2),
	right: config.dim.x * config.blockSize / 2,
	bottom: - (config.dim.y * config.blockSize / 2),
	top: config.dim.y * config.blockSize / 2
};

function createBlocks(centerPos) {
	const heightMap = mapGenerator(centerPos, config.dim);
	const blocks = [];
	const blockSize = config.blockSize;
	for (let i = 0; i < heightMap.length; ++i) {
		for (let j = 0; j < heightMap[0].length; ++j) {
			for (let k = 0; k < heightMap[i][j] + 1; ++k) {
				const x = (i * blockSize) + centerPos.x - (config.dim.x * blockSize / 2);
				const y = (j * blockSize) + centerPos.y - (config.dim.y * blockSize / 2);
				blocks.push(new Block({ x: x, z: y, y: k * blockSize }));
			}
		}
	}
	return blocks;
}

function createBlocksAndAddToScene(centerPos) {
	const blocks = createBlocks(centerPos);
	blocks.forEach(block => scene.add(block.mesh));
	return blocks;
}

function removeBlocks(blocks) {
	blocks.forEach(function(block) {
		scene.remove(block.mesh);
		block.mesh.geometry.dispose();
		block.mesh.material.dispose();
		block.mesh = null;
	});
}

function initBlocks() {
	for (let i = 0; i <= 2; ++i) {
		blocks.push([]);
		for (let j = 0; j <= 2; ++j) {
			blocks[i].push(createBlocksAndAddToScene(new THREE.Vector2(
				curPos.x - (blockGroupSize.x) + j * blockGroupSize.x,
				curPos.z - (blockGroupSize.y) + (2 - i) * blockGroupSize.y,
			)));
		}
	}
}

function updateBlocks() {
	const prevBlockPos = curBlockPos.clone();

	curBlockPos = new THREE.Vector2(
		Math.floor((curPos.x + blockGroupSize.x / 2) / blockGroupSize.x) * blockGroupSize.x,
		Math.floor((curPos.z + blockGroupSize.y / 2) / blockGroupSize.y) * blockGroupSize.y
	);

	if (curBlockPos.x < prevBlockPos.x) /*moved left*/ {
		console.log("moved left");
		// Remove right-most blocks
		removeBlocks(blocks[0][2]);
		removeBlocks(blocks[1][2]);
		removeBlocks(blocks[2][2]);
		// Shift blocks from left to right
		blocks[0][2] = blocks[0][1];
		blocks[1][2] = blocks[1][1];
		blocks[2][2] = blocks[2][1];
		blocks[0][1] = blocks[0][0];
		blocks[1][1] = blocks[1][0];
		blocks[2][1] = blocks[2][0];
		// Add new blocks to left
		blocks[0][0] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x - blockGroupSize.x, curBlockPos.y + blockGroupSize.y));
		blocks[1][0] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x - blockGroupSize.x, curBlockPos.y));
		blocks[2][0] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x - blockGroupSize.x, curBlockPos.y - blockGroupSize.y));		
	}
	else if (curBlockPos.x > prevBlockPos.x) /*moved right*/ {
		console.log("moved right");
		// Remove left-most blocks
		removeBlocks(blocks[0][0]);
		removeBlocks(blocks[1][0]);
		removeBlocks(blocks[2][0]);
		// Shift blocks from right to left
		blocks[0][0] = blocks[0][1];
		blocks[1][0] = blocks[1][1];
		blocks[2][0] = blocks[2][1];
		blocks[0][1] = blocks[0][2];
		blocks[1][1] = blocks[1][2];
		blocks[2][1] = blocks[2][2];
		// Add new blocks to right
		blocks[0][2] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x + blockGroupSize.x, curBlockPos.y + blockGroupSize.y));
		blocks[1][2] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x + blockGroupSize.x, curBlockPos.y));
		blocks[2][2] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x + blockGroupSize.x, curBlockPos.y - blockGroupSize.y));
	}

	if (curBlockPos.y < prevBlockPos.y) /*moved down*/ {
		console.log("moved down");
		// Remove top-most blocks
		removeBlocks(blocks[0][0]);
		removeBlocks(blocks[0][1]);
		removeBlocks(blocks[0][2]);
		// Shift blocks from bottom to top
		blocks[0][0] = blocks[1][0];
		blocks[0][1] = blocks[1][1];
		blocks[0][2] = blocks[1][2];
		blocks[1][0] = blocks[2][0];
		blocks[1][1] = blocks[2][1];
		blocks[1][2] = blocks[2][2];
		// Add new blocks to bottom
		blocks[2][0] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x - blockGroupSize.x, curBlockPos.y - blockGroupSize.y));
		blocks[2][1] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x, curBlockPos.y - blockGroupSize.y));
		blocks[2][2] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x + blockGroupSize.x, curBlockPos.y - blockGroupSize.y));
	}
	else if (curBlockPos.y > prevBlockPos.y) /*moved up*/ {
		console.log("moved up");
		// Remove bottom-most blocks
		removeBlocks(blocks[2][0]);
		removeBlocks(blocks[2][1]);
		removeBlocks(blocks[2][2]);
		// Shift blocks from top to bottom
		blocks[2][0] = blocks[1][0];
		blocks[2][1] = blocks[1][1];
		blocks[2][2] = blocks[1][2];
		blocks[1][0] = blocks[0][0];
		blocks[1][1] = blocks[0][1];
		blocks[1][2] = blocks[0][2];
		// Add new blocks to top
		blocks[0][0] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x - blockGroupSize.x, curBlockPos.y + blockGroupSize.y));
		blocks[0][1] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x, curBlockPos.y + blockGroupSize.y));
		blocks[0][2] = createBlocksAndAddToScene(new THREE.Vector2(curBlockPos.x + blockGroupSize.x, curBlockPos.y + blockGroupSize.y));
	}



	// const blockSize = config.blockSize;
	// const curBlockGroupEdges = {
	// 	left: Math.floor(curPos.x / blockGroupSize.x) * blockGroupSize,
	// 	right: Math.floor(curPos.x / blockGroupSize.x) * blockGroupSize + blockGroupSize,
	// 	bottom: Math.floor(curPos.y / blockGroupSize.y) * blockGroupSize,
	// 	top: Math.floor(curPos.y / blockGroupSize.y) * blockGroupSize + blockGroupSize,
	// }
}

function init() {

	curPos = new THREE.Vector3(0, 0, 0);
	curBlockPos = new THREE.Vector2(0, 0);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = curPos.z;
	camera.lookAt(new THREE.Vector3(0, 10, 0));
	
	// blocks.push(...createBlocks(curPos));
	// blocks.forEach(function(block) {
	// 	scene.add(block.mesh);
	// }, this);
	initBlocks();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	renderer.render(scene, camera);

	controls = new FirstPersonControls(camera, renderer.domElement);
}

function animate() {

	requestAnimationFrame(animate);

	curPos = camera.position;
	updateBlocks();
	renderer.render(scene, camera);
	controls.update(0.5);
}

init();
animate();
