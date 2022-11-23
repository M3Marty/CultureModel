
const BIOME_COLOR = {
	desert: '#f2cea0',
	hill: '#5f7d85',
	mountain: '#6b5c2e',
	ocean: '#3363ed',
	grassland: '#0fa150',
	river: '#4676e6',
	swamp: 'darkgreen',
	error: 'red'
}

const WATER_BIOMES = ['ocean', 'river', 'coast']

const BIOMES = Object.getOwnPropertyNames(BIOME_COLOR)

const STRAIT_CHANCE = 0.25
const CHANCE_TO_SHIFT_DIRECTION = 0.35
const CHANCE_TO_INFLUENCE_TEMPERATURE = 0.5

const SIDE_VALUE = {
	'top': {
		style: 'borderTopWidth',
		axis: 'height'
	},
	'left': {
		style: 'borderLeftWidth',
		axis: 'width'
	},
	'bottom': {
		style: 'borderBottomWidth',
		axis: 'height'
	},
	'right': {
		style: 'borderRightWidth',
		axis: 'width'
	},
	'null': null
}

function Tile(id, neighbors) {
	this.id = id
	this.x = id % FIELD_WIDTH
	this.y = Math.floor(id / FIELD_WIDTH)
	this.width = TILE_SIZE
	this.height = TILE_SIZE

	this.gaps = {
		'top': 0,
		'left': 0,
		'bottom': 0,
		'right': 0
	}

	this.addGap = (side, value) => {
		try {
			this.gaps[side] += value
			this[SIDE_VALUE[side].axis] -= value

			this.element.style.width = `${this.width}px`
			this.element.style.height = `${this.height}px`
			this.element.style.borderTopWidth = `${this.gaps.top}px`
			this.element.style.borderLeftWidth = `${this.gaps.left}px`
			this.element.style.borderBottomWidth = `${this.gaps.bottom}px`
			this.element.style.borderRightWidth = `${this.gaps.right}px`
		} catch (e) { }
	}

	this.removeVisualGaps = () => {
		this.element.style.width = `${TILE_SIZE}px`
		this.element.style.height = `${TILE_SIZE}px`
		this.element.style.borderTopWidth = '0px'
		this.element.style.borderLeftWidth = '0px'
		this.element.style.borderBottomWidth = '0px'
		this.element.style.borderRightWidth = '0px'
	}

	this.element = document.createElement(`span`)
	this.element.className = 'tile'
	this.element.id = `tile${this.id}`
	this.element.style.width = `${this.width}px`
	this.element.style.height = `${this.height}px`

	this.setBiome = b => {
		this.biome = b
		this.element.style.backgroundColor = BIOME_COLOR[this.biome]

		if (this.biome == 'ocean')
			this.shipping = SEAMODE_DEEP
		else if (this.biome == 'river')
			this.shipping = SEAMODE_FULL
		else
			this.shipping = 0
	}

	this.element.onclick = e => {
		e.preventDefault()
		setSelected(this)
	}

	const chances = { desert: 0, hill: 0, mountain: 0, ocean: 3, grassland: 1, river: 0, swamp: 0 }

	if (this.y == 0 || this.y == FIELD_HEIGHT - 1) {
		chances.ocean += 256
	} else {
		if (neighbors.left == 'ocean' || neighbors.top == 'ocean') {
			chances.ocean += 82
			chances.river += 1
		}

		if (neighbors.left == 'ocean' && neighbors.top == 'grassland' ||
			neighbors.left == 'grassland' && neighbors.top == 'ocean') {
			chances.swamp += 4
		}

		if (neighbors.left == 'swamp')
			chances.swamp += 64
		if (neighbors.top == 'swamp')
			chances.swamp += 64

		if (neighbors.left == 'swamp' && neighbors.top == 'ocean' ||
			neighbors.left == 'ocean' && neighbors.top == 'swamp')
			chances.swamp += 20

		if (neighbors.left == 'grassland' || neighbors.top == 'grassland') {
			chances.grassland += 82
			chances.mountain += 1
			chances.river += 1
			chances.hill += 1
			chances.ocean -= Math.floor(2 * (FIELD_HEIGHT - this.y) / FIELD_HEIGHT)
		}

		if (neighbors.left == 'river' || neighbors.top == 'river')
			chances.river += 96

		if (neighbors.left == 'mountain' && neighbors.top != 'mountain' ||
			neighbors.top == 'mountain' && neighbors.left != 'mountain' ||
			neighbors.top_next == 'mountain' || neighbors.left_prev == 'mountain')
			chances.mountain += 48
		else if (neighbors.left == neighbors.top == 'mountain' ||
			neighbors.top == neighbors.top_next == 'mountain') {
			chances.mountain = 0
		}

		if (neighbors.left == 'mountain' || neighbors.left == 'hill' ||
			neighbors.top == 'mountain' || neighbors.top == 'hill') {
			chances.hill += 16
			chances.desert += 16
		}

		if (neighbors.left == 'desert' || neighbors.top == 'desert')
			chances.desert += 48


		if (neighbors.left == 'hill' || neighbors.top == 'hill') {
			chances.hill += 4
			chances.mountain += 16
		}

		if (neighbors.top != 'ocean') {
			chances.ocean -= 2
			chances.grassland += 8 + Math.floor(8 * (FIELD_HEIGHT - this.y) / FIELD_HEIGHT)
		}

		if (neighbors.left_prev != 'ocean')
			chances.ocean -= 2
		else if (neighbors.left != 'ocean')
			chances.ocean += 8

		const rx = this.x / FIELD_WIDTH
		const ry = this.y / FIELD_HEIGHT

		// On top less water and more on bottom
		chances.ocean += Math.round(11 * (ry - 0.5))
		// More water on the middle of the map
		chances.ocean += Math.round(10.5 * Math.cos(rx * 4 * Math.PI))
		// More land on the top right corner
		chances.ocean += rx > -Math.sin(Math.PI * (ry + 0.25)) + 1.5 && rx < Math.sin(this.PI * (ry + 0.25)) ? -16 : 0
		

		if (neighbors.left == neighbors.left_prev == neighbors.top == neighbors.top_next == neighbors.top_prev == 'ocean')
			chances.ocean += 32
	}

	const choose = Math.round(Math.random() * Object.values(chances).reduce((a, b) => a + b, 0))

	let key_id = -1
	let key = 'grassland'
	for (let i = 0; i < choose; i += chances[key]) {
		key_id++
		key = BIOMES[key_id]
	}

	this.setBiome(key)
}

function markGeography(tiles, i, test, isCorners = false, marked = null) {
	if (marked == null)
		marked = []

	if (test(tiles[i])) {
		if (marked.includes(i))
			return
		marked.push(i)

		markGeography(tiles, Math.mod(i + 1, tiles.length), test, isCorners, marked)
		markGeography(tiles, Math.mod(i - 1, tiles.length), test, isCorners, marked)
		markGeography(tiles, Math.mod(i + FIELD_WIDTH, tiles.length), test, isCorners, marked)
		markGeography(tiles, Math.mod(i - FIELD_WIDTH, tiles.length), test, isCorners, marked)
		if (isCorners) {
			markGeography(tiles, Math.mod(i + 1, tiles.length), test, isCorners, marked)
			markGeography(tiles, Math.mod(i - 1, tiles.length), test, isCorners, marked)
			markGeography(tiles, Math.mod(i + FIELD_WIDTH, tiles.length), test, isCorners, marked)
			markGeography(tiles, Math.mod(i - FIELD_WIDTH, tiles.length), test, isCorners, marked)
		}
	}

	return marked
}

function createGeography(tileList) {
	return {
		tiles: tileList,
		name: null,
		type: undefined,
		id: undefined
	}
}

function createNeighbours(tiles, i) {
	return {
		top:			tiles[Math.mod(i - FIELD_WIDTH	  , tiles.length)],
		left:			tiles[Math.mod(i			   - 1, tiles.length)],
		bottom:			tiles[Math.mod(i + FIELD_WIDTH	  , tiles.length)],
		right:			tiles[Math.mod(i			   + 1, tiles.length)],
		top_prev:		tiles[Math.mod(i - FIELD_WIDTH - 1, tiles.length)],
		top_next:		tiles[Math.mod(i - FIELD_WIDTH + 1, tiles.length)],
		bottom_prev:	tiles[Math.mod(i + FIELD_WIDTH - 1, tiles.length)],
		bottom_next:	tiles[Math.mod(i + FIELD_WIDTH + 1, tiles.length)],
		neighboring:	i
	}
}

function createCoast(tile, side, delta = undefined) {
	if (delta == undefined)
		delta = Math.floor(Math.random() * 3) + (tile[SIDE_VALUE[side].axis] == TILE_SIZE ? 2 : 0)

	tile.addGap(side, delta)
}

function createCoastConditionaly(tile, neighbors, side) {
	if (WATER_BIOMES.includes(neighbors[side].biome)) {
		createCoast(tile, side)
		tile.shipping = SEAMODE_COAST
	}
}

function createStraightStrait(tile, axis, gonist, antogonist) {

	if (tile.gaps[gonist[0]] == 0 && tile.gaps[gonist[1]] == 0 &&
		tile.gaps[antogonist[0]] != 0 && tile.gaps[antogonist[1]] != 0) {

		if (Math.random() < STRAIT_CHANCE) {
			createCoast(tile, {
				width: ['left', 'right'], height: ['top', 'bottom']
			}[axis][Math.floor(Math.random() * 2)], Math.floor(Math.random() * 4) + 2)

			tile.shipping = SEAMODE_STRAIT
		}
		else tile.shipping = SEAMODE_POTENTIAL_STRAIT
		return true
	}

	return false
}

function createKnightStrait(tile, neighbors, option) {

	if (tile[option.axis] == TILE_SIZE) {
		if (tile.gaps[option.test[1]] != 0 && tile.gaps[option.test[0]] == 0) {

			if (WATER_BIOMES.includes(neighbors[option.option[0]].biome)) {
				if (Math.random() < STRAIT_CHANCE) {
					tile.addGap(option.side[0], Math.floor(Math.random() * 3) + 2)
					tile.shipping = SEAMODE_STRAIT
				}
				else tile.shipping = SEAMODE_POTENTIAL_STRAIT
				return true
			}
			if (WATER_BIOMES.includes(neighbors[option.option[1]].biome)) {
				if (Math.random() < STRAIT_CHANCE) {
					tile.addGap(option.side[1], Math.floor(Math.random() * 3) + 2)
					tile.shipping = SEAMODE_STRAIT
				}
				else tile.shipping = SEAMODE_POTENTIAL_STRAIT
				return true
			}
		}
		else if (tile.gaps[option.test[0]] != 0 && tile.gaps[option.test[1]] == 0) {

			if (WATER_BIOMES.includes(neighbors[option.option[2]].biome)) {
				if (Math.random() < STRAIT_CHANCE) {
					tile.addGap(option.side[0], Math.floor(Math.random() * 3) + 2)
					tile.shipping = SEAMODE_STRAIT
				}
				else tile.shipping = SEAMODE_POTENTIAL_STRAIT
				return true
			}
			if (WATER_BIOMES.includes(neighbors[option.option[3]].biome)) {
				if (Math.random() < STRAIT_CHANCE) {
					tile.addGap(option.side[1], Math.floor(Math.random() * 3) + 2)
					tile.shipping = SEAMODE_STRAIT
				}
				else tile.shipping = SEAMODE_POTENTIAL_STRAIT
				return true
			}
		}
	}

	return false
}

function createCornerStrait(tile, neighbors) {
	if (tile.width + tile.height - TILE_SIZE * 2)
		return false

	if (WATER_BIOMES.includes(neighbors.top_next.biome) && WATER_BIOMES.includes(neighbors.bottom_prev.biome) &&
			!WATER_BIOMES.includes(neighbors.bottom_next.biome) && !WATER_BIOMES.includes(neighbors.top_prev.biome)) {
		if (Math.random() < STRAIT_CHANCE) {

			if (Math.random() > .5) {
				createCoast(tile, 'top')
				createCoast(tile, 'left')
			}
			else {
				createCoast(tile, 'right')
				createCoast(tile, 'bottom')
			}

			tile.shipping = SEAMODE_STRAIT
			return true
		}

		tile.shipping = SEAMODE_POTENTIAL_STRAIT2
		return false
	}
	else if (WATER_BIOMES.includes(neighbors.bottom_next.biome) && WATER_BIOMES.includes(neighbors.top_prev.biome) &&
			!WATER_BIOMES.includes(neighbors.top_next.biome) && !WATER_BIOMES.includes(neighbors.bottom_prev.biome)) {
		if (Math.random() < STRAIT_CHANCE) {

			if (Math.random() > .5) {
				createCoast(tile, 'top')
				createCoast(tile, 'right')
			}
			else {
				createCoast(tile, 'left')
				createCoast(tile, 'bottom')
			}

			tile.shipping = SEAMODE_STRAIT
			return true
		}

		tile.shipping = SEAMODE_POTENTIAL_STRAIT2
		return false
	}
}

function tryCreateStrait(tile, neighbors) {
		 if (createStraightStrait(tile, 'width', ['left', 'right'], ['top', 'bottom']));
	else if (createStraightStrait(tile, 'height', ['top', 'bottom'], ['left', 'right']));
	else if (createCornerStrait(tile, neighbors));
	else if (createKnightStrait(tile, neighbors, {
		axis: 'width', test: ['top', 'bottom'],
		side: ['left', 'right'],
		option: ['top_prev', 'top_next', 'bottom_prev', 'bottom_next']
	}));
	else if (createKnightStrait(tile, neighbors, {
		axis: 'height', test: ['left', 'right'],
		side: ['top', 'bottom'],
		option: ['top_prev', 'bottom_prev', 'top_next', 'bottom_next']
	}));
	else return false
	return true
}

function markNeighbouringRiver(neighbors, riverId, forcing=false) {
	const l = Object.values(neighbors)
	for (let i = 0; i < 8; i++) {
			if ((!l[i].river || forcing) && !(l[i].shipping && l[i].shipping > SEAMODE_COAST)) {
				l[i].river = riverId
			}
	}
}

function createRiver(tile, tiles, riverId, riverList) {

	if (tile.biome == 'mountain' && !tile.river && !tile.shipping) {

		const horizontalDirection = Math.floor(Math.random() * 5) % 2
		const verticalDirection = Math.floor(Math.random() * 2)
		const secondaryHorizontalDirection = (horizontalDirection + 1) % 2
		const secondaryVerticalDirection = (verticalDirection + 1) % 2

		let currentDirection = Math.random() > .5 ? horizontalDirection : verticalDirection
		let flatChanceToShiftDirection = 0

		const river = {
			id: riverId,
			tiles: [],
			tributeries: [],
			master: null
		}

		while (true) {
			tile.shipping = SEAMODE_RIVER
			tile.river = river
			river.tiles.push(tile)

			const neighbors = createNeighbours(tiles, tile.id)

				 if (neighbors.top.shipping && neighbors.top.river != river)
				currentDirection = 0
			else if (neighbors.left.shipping && neighbors.left.river != river)
				currentDirection = 1
			else if (neighbors.bottom.shipping && neighbors.bottom.river != river)
				currentDirection = 2
			else if (neighbors.right.shipping && neighbors.right.river != river)
				currentDirection = 3
			else if (CHANCE_TO_SHIFT_DIRECTION + flatChanceToShiftDirection > Math.random()) {
				if (currentDirection % 2 == horizontalDirection % 2) {
					// To vertical
					if (CHANCE_TO_SHIFT_DIRECTION > Math.random())
						currentDirection = verticalDirection
					else
						currentDirection = secondaryVerticalDirection

					flatChanceToShiftDirection = 0
				} else {
					// To horizontal
					if (CHANCE_TO_SHIFT_DIRECTION > Math.random())
						currentDirection = horizontalDirection
					else
						currentDirection = secondaryHorizontalDirection

					flatChanceToShiftDirection = 0
				}
			} else {
				if (flatChanceToShiftDirection < 0)
					flatChanceToShiftDirection = 0
				else
					flatChanceToShiftDirection += 0.05
			}

			switch (currentDirection) {
				case 0: tile = tiles[tile.id - FIELD_WIDTH];
					break
				case 1: tile = tiles[tile.id - 1];
					break
				case 2: tile = tiles[tile.id + FIELD_WIDTH];
					break
				case 3: tile = tiles[tile.id + 1];
					break
			}

			if (tile.shipping) {
				river.tiles.push(tile)

				if (tile.river && !Number.isInteger(tile.river)) {
					tile.river.tributeries.push(river)

					river.master = tile.river.master
					river.master.length += river.tiles.length

					tile.river = river

					for (let j = 0; j < river.tiles.length - 1; j++)
						markNeighbouringRiver(createNeighbours(tiles, river.tiles[j].id), river.master.id, true)
				}
				else {
					tile.river = river
					river.master = river
					river.masterId = riverList.length
					river.length = river.tiles.length
					riverList.push(river)
				}
				return
			}

			if (tile.shipping != SEAMODE_COAST)
				markNeighbouringRiver(neighbors, riverId)
		}
	}

	return 0
}

function createRiverGaps(river, tiles) {
	let side = 4
	let length = 0

	for (let i = 0; i < river.tiles.length - 1; i++) {
		console.log(river.tiles[i])
		length++
		const gapsSize = Math.max(Math.floor(length / 20) + 1, 1)

		if (river.tiles[i].river != river)
			length += createRiverGaps(river.tiles[i].river, tiles)

		switch (river.tiles[i + 1].id) {
			case river.tiles[i].id + 1:
				river.tiles[i].addGap(Object.keys(SIDE_VALUE)[side], gapsSize)

				if (side % 2 == 1) {
					side = 0
					river.tiles[i].addGap(Object.keys(SIDE_VALUE)[side], gapsSize)
				}
				break
			case river.tiles[i].id - 1:
				river.tiles[i].addGap(Object.keys(SIDE_VALUE)[side], gapsSize)

				if (side % 2 == 1) {
					side = 0
					river.tiles[i].addGap(Object.keys(SIDE_VALUE)[side], gapsSize)
				}
				break
			case river.tiles[i].id + FIELD_WIDTH:
				river.tiles[i].addGap(Object.keys(SIDE_VALUE)[side], gapsSize)

				if (side % 2 == 0) {
					side = 1
					river.tiles[i].addGap(Object.keys(SIDE_VALUE)[side], gapsSize)
				}
				break
			case river.tiles[i].id - FIELD_WIDTH:
				river.tiles[i].addGap(Object.keys(SIDE_VALUE)[side], gapsSize)

				if (side % 2 == 0) {
					side = 1
					river.tiles[i].addGap(Object.keys(SIDE_VALUE)[side], gapsSize)
				}
				break
		}
	}

	river.tiles[river.tiles.length - 1].addGap(Object.keys(SIDE_VALUE)[side], Math.floor(length / 20) + 1)
	return length
}

function createWaterTempertureCenter(tile, neighbours) {
	const l = Object.values(neighbours)
	for (let i = 0; i < 8; i++)
		if (l[i]) {
			const ry = tile.y / FIELD_HEIGHT
			if ((l[i].biome == 'mountain' || l[i].river) && Math.random() < CHANCE_TO_INFLUENCE_TEMPERATURE) {
				tile.temperature = Math.round(60 * (Math.sin(ry * Math.PI) / 1.3 + 0.23)) - 40
				return true
			}
			else if ((l[i].biome == 'swamp' || l[i].biome == 'desert') && Math.random() < CHANCE_TO_INFLUENCE_TEMPERATURE) {
				tile.temperature = Math.round(70 * (Math.sin(ry * Math.PI) / 1.3 + 0.23)) - 40
				return true
			}
		}
}

function createTemperature(tile, centers, shift) {
	let firstMinRange = Infinity, secondMinRange = Infinity
	let firstNearest, secondNearest
	for (let i = 0; i < centers.length; i++) {
		const range = Math.sqrt(Math.pow(tile.x - centers[i].x, 2) + Math.pow(tile.y - centers[i].y, 2))
		if (range < secondMinRange) {
			if (range < firstMinRange) {
				secondMinRange = firstMinRange
				firstMinRange = range
				secondNearest = firstNearest
				firstNearest = centers[i].temperature
			} else {
				secondMinRange = range
				secondNearest = centers[i].temperature
			}
		}
	}

	if (!Number.isNaN(firstNearest) && !Number.isNaN(secondNearest)) {
		const result = Math.round(27.5 * (Math.sin(tile.y / FIELD_HEIGHT * Math.PI) / 2 + 0.5) - 35 + (1 / firstMinRange * firstNearest / 2) + (1 / secondMinRange * secondNearest / 2))

		if (!Number.isNaN(result))
			return shift + result
	}

	return shift + Math.round(27.5 * (Math.sin(tile.y / FIELD_HEIGHT * Math.PI)) / 2 + 0.5)
}

function uniteLandmasses(tiles, rudiment, landMass, geography, islandId) {

	for (let k = 0; k < rudiment.tiles.length; k++) {
		tiles[rudiment.tiles[k]].landMass = landMass
		landMass.tiles.push(rudiment.tiles[k])
	}

	geography.island.splice(islandId, 1)
	if (landMass.type != 'island') {
		geography.another.peninsula.push(rudiment)
		rudiment.type = 'peninsula'
	}
}

function Volcano() {
	this.active = Math.random()
}

function createVolcano(tile, neighbours) {
	let chance = 0.5
	chance += (neighbours.top.biome == 'mountain') * -0.1
	chance += (neighbours.left.biome == 'mountain') * -0.1
	chance += (neighbours.bottom.biome == 'mountain') * -0.1
	chance += (neighbours.right.biome == 'mountain') * -0.1

	if (Math.random() < chance) {
		tile.volcano = new Volcano()
		return tile
	}
}

function createWaterTemperature(tile, centers) {
	let shift = 10
	if (tile.biome == 'river')
		shift += 6

	return createTemperature(tile, centers, shift)
}

function createLandTemperature(tile, centers, neighbours) {
	let shift = 20
	
	if (tile.biome == 'swamp')
		shift += 8

	if (tile.biome == 'mountain')
		shift -= 10
	else if (neighbours.top.biome == 'mountain' && neighbours.left.biome == 'mountain' &&
		neighbours.bottom.biome == 'mountain' && neighbours.right.biome == 'mountain')
		shift -= 7
	else if (tile.biome == 'desert')
		shift += 14

	if (tile.biome == 'hill')
		shift -= 5

	if (tile.biome == 'grassland')
		shift += 4


	const result = Math.round(createTemperature(tile, centers, shift))
	if (tile.biome == 'mountain')
		centers.push(tile)

	return Math.max(Math.min(result, 40), -40)
}

function createFertile(tile, neighbours) {

}

function createResources(tile, neighbours) {

}

function World(width, height, field) {

	this.width = width
	this.height = height

	this.element = field

	this.size = FIELD_WIDTH * FIELD_HEIGHT
	this.tiles = []

	this.forEachTile = f => {
		for (let i = 0; i < this.size; i++)
			f(i)
	}

	// Generate world
	this.forEachTile(i => {
		let tile = null

		let neighbours = { top_prev: undefined}
		if (i > 0) {
			neighbours.left = this.tiles[i - 1].biome

			if (i > 1) {
				neighbours.left_prev = this.tiles[i - 2].biome

				if (i > FIELD_WIDTH) {
					neighbours.top = this.tiles[i - FIELD_WIDTH].biome
					neighbours.top_next = this.tiles[i - FIELD_WIDTH + 1].biome
				}
			}
		}

		tile = new Tile(i, neighbours)

		this.tiles.push(tile)
		this.element.appendChild(tile.element)
	})

	this.geography = {
		ocean: [], sea: [], island: [], continent: [],
		another: {
			peninsula: [],
			volcano: []
		}
	}

	// Filling and forming additional geography, filling inner seas, mark oceans and seas
	const currentLandMassId = new Incrementor()
	this.forEachTile(i => {
		const tile = this.tiles[i]

		// Forming additional geography
		if (!WATER_BIOMES.includes(tile.biome)) {

			const neighbors = createNeighbours(this.tiles, i)
		
			createCoastConditionaly(tile, neighbors, 'top')
			createCoastConditionaly(tile, neighbors, 'left')
			createCoastConditionaly(tile, neighbors, 'bottom')
			createCoastConditionaly(tile, neighbors, 'right')

				 if (tryCreateStrait(tile, neighbors));
			else if (!tile.shipping && (WATER_BIOMES.includes(neighbors.top_prev.biome) || WATER_BIOMES.includes(neighbors.top_next.biome) ||
					WATER_BIOMES.includes(neighbors.bottom_prev.biome) || WATER_BIOMES.includes(neighbors.bottom_next.biome)))
					 tile.shipping = SEAMODE_COAST
		}
		else if (!tile.landMass) {

			const ocean = markGeography(this.tiles, i, t => t.biome == 'ocean')
			if (!ocean.length) {
				const seaMass = createGeography((markGeography(this.tiles, i, t => t.biome == 'river')))
				this.geography.sea.push(seaMass)
				seaMass.type = 'sea'
				seaMass.id = currentLandMassId.get()
				seaMass.name = `sea${seaMass.id}`

				for (let i = 0; i < seaMass.tiles.length; i++)
					this.tiles[seaMass.tiles[i]].landMass = seaMass
				return
			}
			if (ocean.length < 196) {
				const seaMass = createGeography(ocean)
				this.geography.sea.push(seaMass)
				seaMass.type = 'sea'
				seaMass.id = currentLandMassId.get()
				seaMass.name = `sea${seaMass.id}`

				for (let i = 0; i < ocean.length; i++) {
					this.tiles[ocean[i]].setBiome('river')
					this.tiles[ocean[i]].landMass = seaMass
				}
				return
			}

			const oceanMass = createGeography(ocean)
			oceanMass.type = 'ocean'
			oceanMass.id = currentLandMassId.get()
			oceanMass.name = `ocean${oceanMass.id}`
			this.geography.ocean.push(oceanMass)

			for (let i = 0; i < ocean.length; i++)
				this.tiles[ocean[i]].landMass = oceanMass

		}
	})

	// Rivers generation
	const currentRiverId = new Incrementor()
	this.rivers = []
	this.forEachTile(i => {
		if (!(this.tiles[i].biome != 'mountain' || this.tiles[i].river || this.tiles.shipping))
			createRiver(this.tiles[i], this.tiles, currentRiverId.get(), this.rivers)
	})

	// Apply river visualization
	// TODO: this.rivers.forEach(river => createRiverGaps(river, this.tiles))

	// Water masses temperature centers
	const tempertureCenters = []
	this.forEachTile(i => {
		if (WATER_BIOMES.includes(this.tiles[i].biome)) {
			const isCenter = createWaterTempertureCenter(this.tiles[i], createNeighbours(this.tiles, i))
			if (isCenter)
				tempertureCenters.push(this.tiles[i])
		}
	})
	
	// Water temperature
	this.forEachTile(i => {
		if (WATER_BIOMES.includes(this.tiles[i].biome) && !this.tiles[i].temperature)
			this.tiles[i].temperature = createWaterTemperature(this.tiles[i], tempertureCenters)
	})

	// Mark noncoastal tiles's land masses
	this.forEachTile(i => {
		if (!this.tiles[i].shipping && this.tiles[i].landMass == undefined) {
			
			const tile = this.tiles[i]
			tile.landMass = createGeography(markGeography(this.tiles, i,
				t => t.shipping == SEAMODE_RIVER || !t.shipping, true))
			
			for (let j = 0; j < tile.landMass.tiles.length; j++)
				this.tiles[tile.landMass.tiles[j]].landMass = tile.landMass
			
			tile.landMass.id = currentLandMassId.get()
			
			if (tile.landMass.tiles.length < 96)
				tile.landMass.type = 'island' // Island or peninsula
			else
				tile.landMass.type = 'continent'

			tile.landMass.name = tile.landMass.type + tile.landMass.id

			this.geography[tile.landMass.type].push(tile.landMass)
		}
	})

	// Mark coastal tiles's land masses
	let marked = true
	while (marked) {
		marked = false

		this.forEachTile(i => {
			if (this.tiles[i].shipping == SEAMODE_COAST && !this.tiles[i].landMass) {
				const tile = this.tiles[i]
				const neighbours = createNeighbours(this.tiles, i)

				if (!tile.gaps.top && !neighbours.top.gaps.bottom && neighbours.top.landMass != tile.landMass && neighbours.top.landMass.type != 'sea' && neighbours.top.landMass.type != 'ocean') {
					tile.landMass = neighbours.top.landMass
					tile.landMass.tiles.push(tile.id)
					marked = true
				}
				else if (!tile.gaps.left && !neighbours.left.gaps.right && neighbours.left.landMass != tile.landMass && neighbours.left.landMass.type != 'sea' && neighbours.left.landMass.type != 'ocean') {
					tile.landMass = neighbours.left.landMass
					tile.landMass.tiles.push(tile.id)
					marked = true
				}
				else if (!tile.gaps.bottom && !neighbours.bottom.gaps.top && neighbours.bottom.landMass != tile.landMass && neighbours.bottom.landMass.type != 'sea' && neighbours.bottom.landMass.type != 'ocean') {
					tile.landMass = neighbours.bottom.landMass
					tile.landMass.tiles.push(tile.id)
					marked = true
				}
				else if (!tile.gaps.right && !neighbours.right.gaps.left && neighbours.right.landMass != tile.landMass && neighbours.right.landMass.type != 'sea' && neighbours.right.landMass.type != 'ocean') {
					tile.landMass = neighbours.right.landMass
					tile.landMass.tiles.push(tile.id)
					marked = true
				}
			}
		})
	}
	
	// Create islands
	this.forEachTile(i => {
		if (!this.tiles[i].landMass) {
			const tile = this.tiles[i]
			const neighbours = createNeighbours(this.tiles, i)

			if (!tile.gaps.top && !neighbours.top.gaps.bottom && neighbours.top.landMass != tile.landMass && neighbours.top.landMass.type != 'sea' && neighbours.top.landMass.type != 'ocean') {
				tile.landMass = neighbours.top.landMass
				tile.landMass.tiles.push(tile.id)
			}
			else if (!tile.gaps.left && !neighbours.left.gaps.right && neighbours.left.landMass != tile.landMass && neighbours.left.landMass.type != 'sea' && neighbours.left.landMass.type != 'ocean') {
				tile.landMass = neighbours.left.landMass
				tile.landMass.tiles.push(tile.id)
			}
			else if (!tile.gaps.bottom && !neighbours.bottom.gaps.top && neighbours.bottom.landMass != tile.landMass && neighbours.bottom.landMass.type != 'sea' && neighbours.bottom.landMass.type != 'ocean') {
				tile.landMass = neighbours.bottom.landMass
				tile.landMass.tiles.push(tile.id)
			}
			else if (!tile.gaps.right && !neighbours.right.gaps.left && neighbours.right.landMass != tile.landMass && neighbours.right.landMass.type != 'sea' && neighbours.right.landMass.type != 'ocean') {
				tile.landMass = neighbours.right.landMass
				tile.landMass.tiles.push(tile.id)
			}
			else {
				tile.landMass = createGeography([tile.id])
				tile.landMass.id = currentLandMassId.get()
				tile.landMass.type = 'island'
				tile.landMass.name = tile.landMass.type + tile.landMass.id

				this.geography.island.push(tile.landMass)
			}
		}
	})

	// Unite islands with neighbouring islands and peninsula with continent. Also delete excess island and move peninsula to another geography folder
	for (let i = 0; i < this.geography.island.length; i++) {
		for (let j = 0; j < this.geography.island[i].tiles.length; j++) {
			let tile = this.tiles[this.geography.island[i].tiles[j]]
			let neighbours = createNeighbours(this.tiles, tile.id)

				 if (neighbours.top.landMass.type.length > 5    && neighbours.top.landMass    != tile.landMass && !tile.gaps.top && !neighbours.top.gaps.bottom)
				uniteLandmasses(this.tiles, tile.landMass, neighbours.top.landMass, this.geography, i)
			else if (neighbours.left.landMass.type.length > 5   && neighbours.left.landMass   != tile.landMass && !tile.gaps.left && !neighbours.top.gaps.right)
				uniteLandmasses(this.tiles, tile.landMass, neighbours.left.landMass, this.geography, i)
			else if (neighbours.bottom.landMass.type.length > 5 && neighbours.bottom.landMass != tile.landMass && !tile.gaps.bottom && !neighbours.top.gaps.top)
				uniteLandmasses(this.tiles, tile.landMass, neighbours.bottom.landMass, this.geography, i)
			else if (neighbours.right.landMass.type.length > 5  && neighbours.right.landMass  != tile.landMass && !tile.gaps.right && !neighbours.top.gaps.left)
				uniteLandmasses(this.tiles, tile.landMass, neighbours.right.landMass, this.geography, i)
			else
				continue

			i--
			break
		}
	}

	// Land temperature and volcanoes
	this.forEachTile(i => {
		const tile = this.tiles[i]
		if (!WATER_BIOMES.includes(tile.biome)) {
			const neighbours = createNeighbours(this.tiles, i)

			// Volcano
			if (tile.biome == 'mountain') {
				const volcanoTile = createVolcano(tile, neighbours)
				if (volcanoTile) {
					const volcanoGeography = createGeography([i])
					volcanoGeography.id = currentLandMassId.get()
					volcanoGeography.type = 'volcano'
					volcanoGeography.name = `volcano${volcanoGeography.id}`
					volcanoGeography.volcano = tile.volcano

					tile.volcano = volcanoGeography
					this.geography.another.volcano.push(volcanoGeography)
				}
			}

			tile.temperature = createLandTemperature(tile, tempertureCenters, neighbours)
		}
	})

	// Compute real temperature and percepitation, determine climate
	this.atmosphere = new Atmosphere(this)
	
	// Using this to determine fertility and resources, increasing water temperature
	this.forEachTile(i => {
		const tile = this.tiles[i]
		const neighbours = createNeighbours(this.tiles, i)

		createResources(tile, neighbours)

		if (!WATER_BIOMES.includes(tile.biome))
			createFertile(tile, neighbours)
		else
			tile.temperature += (40 - tile.temperature) / 4
	})

	// Form biosphere
	this.biosphere = new Biosphere(this.geography.continent.length)

}
