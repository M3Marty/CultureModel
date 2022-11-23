
const SEAMODE_COAST = 1
const SEAMODE_DEEP = 2
const SEAMODE_FULL = 3
const SEAMODE_STRAIT = 4
const SEAMODE_POTENTIAL_STRAIT = 5
const SEAMODE_POTENTIAL_STRAIT2 = 6
const SEAMODE_RIVER = 7

function SeaMapMode() {
	this.colormodel = [
		'black',
		'#7393ff',
		'#3363ed',
		'#5373ed',
		'#00f700',
		'#ff10f0',
		'#bb00b0',
		'black'
	]

	this.apply = isUpdating => {
		if (isUpdating)
			return

		for (let i = 0; i < world.tiles.length; i++)
			world.tiles[i].element.style.backgroundColor = this.colormodel[world.tiles[i].shipping]
	}

	this.additionalModes = [
		{ name: 'Rivers', googleIcon: 'water_drop', apply: isUpdating => {
			if (isUpdating)
				return

			for (let i = 0; i < world.tiles.length; i++) {
				const t = world.tiles[i]
				if (t.river && !Number.isInteger(t.river))
					t.element.style.backgroundColor = CSS_COLOR_NAMES[t.river.master.id % CSS_COLOR_NAMES.length]
			
		}}},
		{ name: 'RiversBaseins', googleIcon: 'water', apply: isUpdating => {
			if (isUpdating)
				return

			for (let i = 0; i < world.tiles.length; i++) {
				const t = world.tiles[i]
				if (Number.isInteger(t.river))
					t.element.style.backgroundColor = CSS_COLOR_NAMES[t.river % CSS_COLOR_NAMES.length]
				else if (t.river)
					t.element.style.backgroundColor = CSS_COLOR_NAMES[t.river.master.id % CSS_COLOR_NAMES.length]
		}}}
	]
}
