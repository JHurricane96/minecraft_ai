import SimplexNoise from "simplex-noise";

const simplex = new SimplexNoise();

function mapGenerator2D(centerPos, dimensions) {
	const xLength = dimensions.x;
	const yLength = dimensions.y;
	const zLength = dimensions.z
	const heightMap = [];
	

	for (let i = 0; i < yLength; ++i) {
		heightMap.push([]);
		for (let j = 0; j < xLength; ++j) {
			const x = (i + centerPos.x - xLength / 2) / xLength;
			const y = (j + centerPos.y - yLength / 2) / yLength;
			heightMap[i].push(Math.floor(Math.abs(zLength * simplex.noise2D(x, y))));
		}
	}

	console.log(heightMap.map(function(r){return r.join("")}).join("\n"));

	return heightMap;
}

function mapGenerator3D(centerPos, dimensions) {
	const xLength = dimensions.x;
	const yLength = dimensions.y;
	const zLength = dimensions.z
	const blockMap = [];

	for (let i = 0; i < zLength; ++i) {
		blockMap.push([]);
		for (let j = 0; j < yLength; ++j) {
			blockMap[i].push([]);
			for (let k = 0; k < xLength; ++k) {
				const x = (k + centerPos.x - xLength / 2) / xLength;
				const y = (j + centerPos.y - yLength / 2) / yLength;
				blockMap[i][j].push(simplex.noise3D(k, j, i) + (zLength - i) / zLength);
			}
		}
	}
	console.log(blockMap[0], blockMap[1]);

	return blockMap;
}

export { mapGenerator2D, mapGenerator3D };
