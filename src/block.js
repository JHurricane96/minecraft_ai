import * as THREE from "three";
import { config } from "./config";

export default function Block(position) {
	const size = config.blockSize;
	const geometry = new THREE.BoxGeometry(size, size, size);
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
	this.mesh = new THREE.Mesh(geometry, material);
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y;
	this.mesh.position.z = position.z;
}