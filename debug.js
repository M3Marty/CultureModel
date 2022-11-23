
const debug = {
	findTiles: condition => {
		const a = []
		for (let i = 0; i < world.tiles.length; i++)
			if (condition(world.tiles[i]))
				a.push(world.tiles[i])

		return a
	},

	parseInt: n => {
		const a = Number.parseInt(n)
		return a? a: 0
	},

	tileSize: tile => {
		return {
			width: debug.parseInt(tile.element.style.borderLeftWidth) + debug.parseInt(tile.element.style.borderRightWidth) + debug.parseInt(tile.element.style.width),
			height: debug.parseInt(tile.element.style.borderTopWidth) + debug.parseInt(tile.element.style.borderBottomWidth) + debug.parseInt(tile.element.style.height)
		}
	},

	mark: (tiles, color = 'red') => {
		for (let i = 0; i < tiles.length; i++)
			tiles[i].element.style.backgroundColor = color
	},

	markI: (tiles, color = 'red') => {

		for (let i = 0; i < tiles.length; i++)
			world.tiles[tiles[i]].element.style.backgroundColor = color
	},

	idToTile: ides => {
		let result = []
		for (let i = 0; i < ides.length; i++)
			result.push(world.tiles[result[i]])

		return result
	}
}
