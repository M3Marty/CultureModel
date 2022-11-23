
function TerrainMapMode() {

	this.apply = isUpdating => {
		if (isUpdating)
			return

		for (let i = 0; i < world.tiles.length; i++) {
			let t = world.tiles[i]
			t.element.style.backgroundColor = BIOME_COLOR[t.biome]
		}
	}

	this.selectableElements = []
	for (let i = 0; i < world.geography.continent.length; i++) {
		const obj = world.geography.continent[i]
		this.selectableElements.push({
			apply: () => {
				for (let j = 0; j < obj.tiles.length; j++) {
					world.tiles[obj.tiles[j]].element.style.backgroundColor = '#f88'
				}
			},
			name: world.geography.continent[i].name
		})
	}

	for (let i = 0; i < world.geography.island.length; i++) {
		const obj = world.geography.island[i]
		this.selectableElements.push({
			apply: () => {
				for (let j = 0; j < obj.tiles.length; j++) {
					try {
						world.tiles[obj.tiles[j]].element.style.backgroundColor = '#f88'
					} catch (e) {
						console.log(world.tiles[obj.tiles[j]], obj.tiles[j], j, obj.tiles)
					}
				}
			},
			name: world.geography.island[i].name
		})
	}

	for (let i = 0; i < world.geography.ocean.length; i++) {
		const obj = world.geography.ocean[i]
		this.selectableElements.push({
			apply: () => {
				for (let j = 0; j < obj.tiles.length; j++) {
					try {
						world.tiles[obj.tiles[j]].element.style.backgroundColor = '#f88'
					} catch (e) {
						console.log(world.tiles[obj.tiles[j]], obj.tiles[j], j, obj.tiles)
					}
				}
			},
			name: world.geography.ocean[i].name
		})
	}

	for (let i = 0; i < world.geography.sea.length; i++) {
		const obj = world.geography.sea[i]
		this.selectableElements.push({
			apply: () => {
				for (let j = 0; j < obj.tiles.length; j++) {
					try {
						world.tiles[obj.tiles[j]].element.style.backgroundColor = '#f88'
					} catch (e) {
						console.log(world.tiles[obj.tiles[j]], obj.tiles[j], j, obj.tiles)
					}
				}
			},
			name: world.geography.sea[i].name
		})
	}
}
