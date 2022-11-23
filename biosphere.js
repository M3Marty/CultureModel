
const BIOSPHERE_PROTOTYPE = {
	atmoshpere: {
		flora: { },
		fauna: {

		}
	},

	hydrosphre: {
		flora: {

		},
		fauna: {

		}
	},

	geosphere: {
		flora: {
			large: [
				{
					name: 'pine',
					growth: 0.02,
					popultaion: 12_400_000,

					spawn: {
						spread: false,
						frequence: 1.0,
						fertile: 0.1
					},

					use: {
						fuel: {
							energy: 15,
							pollution: 14.5
						},
						construction: {
							strength: 36.6,
							hardness: 46.0,
							density: 520,
							fireResistance: 0.0,

						},
						decoration: {
							value: 1.0,
							skill: 1.0,
							cost: 1.0
						}
					},

					cultivation: {
						able: true
					}
				},
				{
					name: 'fir',
					growth: 0.01428,
					popultaion: 12_400_000,

					spawn: {
						spread: true,
						frequence: 0.16,
						fertile: 0.5
					},

					use: {
						fuel: {
							energy: 13,
							pollution: 14.5
						},
						construction: {
							strength: 36.6,
							hardness: 48.0,
							density: 550,
							fireResistance: 0.0,

						},
						decoration: {
							value: 3.0,
							skill: 3.0,
							cost: 0.75
						},
						production: ['music_instrument', 'paper']
					},

					cultivation: {
						able: true
					}
				},
				{
					name: 'larch',
					growth: 0.4,
					popultaion: 12_400_000,

					spawn: {
						spread: true,
						frequence: 0.5,
						fertile: 0.2
					},

					use: {
						fuel: {
							energy: 12,
							pollution: 14.5
						},
						construction: {
							strength: 96.6,
							hardness: 82.5,
							density: 725,
							fireResistance: 0.0,
							waterResistance: true
						},
						decoration: {
							value: 1.0,
							skill: 1.0,
							cost: 3.0
						},

					},

					cultivation: {
						able: true
					}
				},
				{
					name: 'larch',
					growth: 0.4,
					popultaion: 12_400_000,

					spawn: {
						spread: true,
						frequence: 0.5,
						fertile: 0.2
					},

					use: {
						fuel: {
							energy: 12,
							pollution: 14.5
						},
						construction: {
							strength: 96.6,
							hardness: 82.5,
							density: 725,
							fireResistance: 0.0,
							waterResistance: true
						},
						decoration: {
							value: 1.0,
							skill: 1.0,
							cost: 3.0
						},

					},

					cultivation: {
						able: true
					}
				}
			],
			medium: [

			],
			small: [

			]
		},
		fauna: {

		}
	}
}

function Biosphere(continentsCount) {

}
