
const CLIMATES_COLORS = {
	Af:  '#0000fe', // Tropical rainforest climate
	Am:  '#0077ff', // Tropical monsoon climate
	Aw:  '#47a0ff', // Tropical wet savannah climate
	As:  '#46a9fa', // Tropical dry savannah climate

	BWh: '#fe0000', // Hot desert climate
	BWk: '#fe9695', // Cold desert climate
	BSh: '#f5a301', // Hot semi-arid climate
	BSk: '#ffdb63', // Cold semi-arid climate

	Cfa: '#c6ff4e', // Humid subtropical climate
	Cfb: '#66ff33', // Temperate oceanic climate
	Cfc: '#33c701', // Subpolar oceanic climate
	Cwa: '#96ff96', // Monsoon-influenced hunid subtropical climate
	Cwb: '#63c764', // Subtropical highland climate
	Cwc: '#329633', // Cold subtropical highland climate
	Csa: '#ffff00', // Hot-summer Mediterranean climate
	Csb: '#c6c700', // Warm-summer Mediterranean climate
	Csc: '#969600', // Cold-summer Mediterranean climate

	Dfa: '#00ffff', // Hot-summer humod continental climate
	Dfb: '#38c7ff', // Warm-summer humid continental climate
	Dfc: '#007e7d', // Subarctic climate
	Dfd: '#00455e', // Extremly cold subarctic climate
	Dwa: '#abb1ff', // Monsoon-influenced hot-summer humid continental climate
	Dwb: '#5a77db', // Monsoon-influenced warm-summer humid continental climate
	Dwc: '#4c51b5', // Monsoon-influenced subarctic climate
	Dwd: '#320087', // Monsoon-influenced extremly cold subarctic climate
	Dsa: '#ff00fe', // Mediterranean-influenced hot-summer humid continental climate
	Dsb: '#c600c7', // Mediterranean-influenced warm-summer humid continental climate
	Dsc: '#963295', // Mediterranean-influenced subarctic climate
	Dsd: '#966495', // Mediterranean-influenced extremly cold subarctic climate

	ET:  '#b2b2b2', // Tundra climate
	EF:  '#686868', // Ice cap climate
}

function ClimateMapMode() {

	this.apply = isUpdating => {
		if (isUpdating)
			return

		for (let i = 0; i < world.size; i++)
			if (!WATER_BIOMES.includes(world.tiles[i].biome))
				world.tiles[i].element.style.backgroundColor = CLIMATES_COLORS[world.tiles[i].climate]
	}
}
