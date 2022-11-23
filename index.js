Math.mod = (a, b) => {
	let c = a % b
	return c < 0? c + b: c
}

const TOOLS_WIDTH = 386

const TILE_SIZE = 9

const FIELD_WIDTH = document.body.clientWidth > 1400? 160: 100
const FIELD_HEIGHT = document.body.clientHeight > 700? 100: 70

const TILE_REAL_SIZE = Math.sqrt(510_100_000 / FIELD_WIDTH / FIELD_HEIGHT) // km^2

addEventListener('keypress', e => e.preventDefault())

const field = document.getElementById('Field')
field.style.width = `${FIELD_WIDTH * TILE_SIZE}px`
field.style.height = `${FIELD_HEIGHT * TILE_SIZE}px`

const overfield = document.getElementById('OverField')
overfield.style.maxWidth = `${FIELD_WIDTH * TILE_SIZE + 6}px`
overfield.style.height = `${FIELD_HEIGHT * TILE_SIZE + 6}px`

const data = document.getElementById('Data')
data.style.maxWidth = `${TOOLS_WIDTH}px`

const generalBox = document.getElementById('General-Data')
const selectedBox = document.getElementById('Selected-Data')

const time = new Time()

const world = new World(FIELD_WIDTH, FIELD_HEIGHT, field)

const modes = new MapModes()

function setSelected(tile) {
	selectedBox.innerText = `id ${tile.id}; ${tile.landMass.name}; °C ${tile.temperature}°`
}

setTimeout(() => overfield.remove(), 500)
