
const SIMULATION_TIME = 365

const CLIMATES_NAMES = {
	Af: 'Tropical rainforest climate',
	Am: 'Tropical monsoon climate',
	Aw: 'Tropical wet savannah climate',
	As: 'Tropical dry savannah climate',

	BWh: 'Hot desert climate',
	BWk: 'Cold desert climate',
	BSh: 'Hot semi-arid climate',
	BSk: 'Cold semi-arid climate',

	Cfa: 'Humid subtropical climate',
	Cfb: 'Temperate oceanic climate',
	Cfc: 'Subpolar oceanic climate',
	Cwa: 'Monsoon-influenced hunid subtropical climate',
	Cwb: 'Subtropical highland climate',
	Cwc: 'Cold subtropical highland climate',
	Csa: 'Hot-summer Mediterranean climate',
	Csb: 'Warm-summer Mediterranean climate',
	Csc: 'Cold-summer Mediterranean climate',

	Dfa: 'Hot-summer humod continental climate',
	Dfb: 'Warm-summer humid continental climate',
	Dfc: 'Subarctic climate',
	Dfd: 'Extremly cold subarctic climate',
	Dwa: 'Monsoon-influenced hot-summer humid continental climate',
	Dwb: 'Monsoon-influenced warm-summer humid continental climate',
	Dwc: 'Monsoon-influenced subarctic climate',
	Dwd: 'Monsoon-influenced extremly cold subarctic climate',
	Dsa: 'Mediterranean-influenced hot-summer humid continental climate',
	Dsb: 'Mediterranean-influenced warm-summer humid continental climate',
	Dsc: 'Mediterranean-influenced subarctic climate',
	Dsd: 'Mediterranean-influenced extremly cold subarctic climate',

	ET: 'Tundra climate',
	EF: 'Ice cap climate'
}

const CLIMATES = {
	A: {
		name: 'Tropical',
		condition: indicators => indicators.temperature.monthMinAverage >= 18,
		description: s0 => `Tropical ${s0} climate`,
		subspecies: {
			f: {
				name: 'Rainforest',
				condition: indicators => indicators.precipitation.monthAverage >= 60
			},
			m: {
				name: 'Monsoon',
				condition: indicators => indicators.precipitation.monthMin >= 100 - indicators.precipitation.total / 25
			},
			w: {
				name: 'Savannah with dry winter',
				condition: indicators =>
					indicators.time.summer.precipitation.total + indicators.time.spring.precipitation.total >
					indicators.time.winter.precipitation.total + indicators.time.autumn.precipitation.total
			},
			s: {
				name: 'Savannah with dry summer',
				condition: indicators => true
			}
		}
	},
	B: {
		name: 'Dry',
		condition: indicators => indicators.temperature.monthMinAverage >= 10,
		description: (s0, s1) => `${s1} ${s0} climate`,
		subspecies: {
			W: {
				name: 'Desert',
				condition: indicators => {
					let limit = 20 * indicators.temperature.annualAverage
					if ((indicators.time.summer.precipitation.total + indicators.time.spring.precipitation.total) / indicators.precipitation.total >= 0.7)
						limit += 280
					else if ((indicators.time.summer.precipitation.total + indicators.time.spring.precipitation.total) / indicators.precipitation.total >= 0.3)
						limit += 140

					return limit / indicators.precipitation.total < 0.5
				}
			},
			S: {
				name: 'Steppe',
				condition: indicators => true,
				subspecies: {
					h: {
						name: 'Hot',
						condition: indicators => indicators.temperature.annualAverage >= 18
					},
					k: {
						name: 'Cold',
						condition: indicators => true
					}
				}
			}
		}
	},
	C: {
		name: 'Temperate',
		condition: indicators => indicators.temperature.monthMin >= 0 && indicators.temperature.monthMin <= 18 && indicators.temperature.monthMax >= 10,
		description: (s0, s1) => `Temperate climate with ${s0} and ${s1}`,
		subspecies: {
			w: {
				name: 'Dry winter',
				condition: indicators => indicators.precipitation.monthMax >= indicators.precipitation.monthMin * 10 &&
					indicators.time.summer.months.filter(m => m.precipitation == indicators.precipitation.monthMax).length
			},
			s: {
				name: 'Dry summer',
				condition: indicators => indicators.precipitation.monthMin < 40
			},
			f: {
				name: 'No dry season',
				condition: indicators => true
			},
			subspecies: {
				a: {
					name: 'Hot summer',
					condition: indicators => indicators.temperature.monthMin > 0 && indicators.temperature.monthMax >= 22 && indicators.time.months.filter(m => m.temperature > 10).length >= 4
				},
				b: {
					name: 'Warn summer',
					condition: indicators => indicators.temperature.monthMin > 0 && indicators.temperature.monthMax < 22 && indicators.time.months.filter(m => m.temperature > 10).length >= 4
				},
				c: {
					name: 'Cold summer',
					condition: indicators => true
				},
			}
		}
	},
	D: {
		name: 'Continental',
		condition: indicators => indicators.temperature.monthMin < 0 && indicators.temperature.monthMax >= 10,
		description: (s0, s1) => `Continental climate with ${s0} and ${s1}`,
		subspecies: {
			w: {
				name: 'Dry winter',
				condition: indicators => indicators.precipitation.monthMax >= indicators.precipitation.monthMin * 10 &&
					indicators.time.summer.month.filter(m => m.precipitation == indicators.precipitation.monthMax).length
			},
			s: {
				name: 'Dry summer',
				condition: indicators => indicators.time.winter.precipitation.monthMax >= indicators.time.summer.precipitation.monthMin * 3 &&
					indicators.time.summer.precipitation.monthMin < 30
			},
			f: {
				name: 'No dry season',
				condition: indicators => true
			},
			subspecies: {
				a: {
					name: 'Hot summer',
					condition: indicators => indicators.temperature.monthMin < 0 && indicators.temperature.monthMax >= 22 &&
						indicators.time.months.filter(m => m.temperature > 10).length >= 4
				},
				b: {
					name: 'Warn summer',
					condition: indicators => indicators.temperature.monthMin < 0 && indicators.temperature.monthMax < 22 &&
						indicators.time.months.filter(m => m.temperature > 10).length >= 4
				},
				c: {
					name: 'Cold summer',
					condition: indicators => indicators.temperature.monthMin > 0 &&
						indicators.time.months.filter(m => m.temperature > 10).length >= 1
				},
				d: {
					name: 'Very cold winter',
					condition: indicators => true
				}
			}
		}
	},
	E: {
		name: 'Polar',
		condition: indicators => true,
		description: s0 => `${s0}`,
		subspecies: {
			T: {
				name: 'Tundra',
				condition: indicators => indicators.temperature.monthMax >= 0
			},
			F: {
				name: 'Eternal frost',
				condition: indicators => true
			}
		}
	}
}

function SeasonIndicator(months, shift) {

}

function MonthIndicator() {

}

function Indicator() {
	this.precipitation = {
		monthAverage: 0,
		monthMin: Infinity,
		monthMax: 0,
		total: 0
	}

	this.temperature = {
		annualAverage: 0,
		monthMinAverage: Infinity,
		monthMin: Infinity,
		monthMax: 0,
	}

	this.time = {
		months: fillArray(12, () => new MonthIndicator())
	}

	this.time.winter = new SeasonIndicator(this.time.months, 0)
	this.time.spring = new SeasonIndicator(this.time.months, 3)
	this.time.summer = new SeasonIndicator(this.time.months, 6)
	this.time.autumn = new SeasonIndicator(this.time.months, 9)
}

const BIOME_SEASON_SHIFT = {
	desert: -0.015,
	hill: 0.045,
	mountain: 0.066,
	ocean: 0.1,
	grassland: 0,
	river: 0.015,
	swamp: 0.05,
}

function Atmosphere() {

	this.yf = y => {
		if (y < 0.1935)
			return Math.tan(y + 4.36698) / 6 - 0.453
		if (y < 0.3343)
			return -96 * Math.pow(y - 0.26, 2) + 1
		if (y < 0.6731)
			return -Math.pow(4.93 * y - 2.465, 3)
		if (y < 0.8067)
			return 96 * Math.pow(y - 0.74, 2) - 1

		return Math.tan(y + 0.9162) / 6 + 0.453
	}

	this.getTemperature = (tile, season = time.yearDay / 365) => {

		const cSeason = season - BIOME_SEASON_SHIFT[tile.biome]

		const x = tile.x / FIELD_WIDTH
		const y = tile.y / FIELD_HEIGHT

		return tile.temperature + 30 * (-Math.cos(Math.PI * (2 * (x + cSeason) + 1)) * this.yf(y))
	}

	this.getPrecipitation = (tile, season = time.yearDay / 365) => {

	}

	this.computeClimate = world => {
		// collects climate indicators. 3 marks on temperature per month (on month used also first from next month) and precepitation
		const indicators = fillArray(world.size, () => new Indicator())

		const precipitationCenters = []

		for (let i = 0; i < world.size(); i++) {

		}
	}
}
