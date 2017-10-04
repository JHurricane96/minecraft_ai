import SimplexNoise from "simplex-noise";

export default function mapGenerator(centerPos, dimensions) {
	const xLength = dimensions.x;
	const yLength = dimensions.y;
	const zLength = dimensions.z
	const heightMap = [];
	const simplex = new SimplexNoise();
	

	for (let i = 0; i < yLength; ++i) {
		heightMap.push([]);
		for (let j = 0; j < xLength; ++j) {
			const x = (i + centerPos.x - yLength / 2) / xLength;
			const y = (j + centerPos.y - xLength / 2) / yLength;
			heightMap[i].push(Math.floor(Math.abs(zLength * simplex.noise2D(x, y))));
		}
	}

	console.log(heightMap.map(function(r){return r.join("")}).join("\n"));

	return heightMap;
}
