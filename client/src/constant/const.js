/* General constantes */
const avatars = ["Domingo", "Baghera", "Etoile", "Ava", "Ponce", "Horty", "LBW", "Poulpe", "Maghla", "Zack", "Marie", "Rivenzi", "Ultia", "Xari"];

const gamesList = [
    { name: 'Le Picass', id: 1, img: '/img/picass.webp', available: true },
    { name: 'Rat de Stars', id: 2, img: '/img/rat2.webp', available: false },
    { name: 'Au + Proche', id: 3, img: '/img/auplusproche.webp', available: false }];


/* Picass constantes */
const colors1 = [{ name: 'white', value: 'white' }, { name: 'slate-400', value: 'rgb(148 163 184)' },
{ name: 'red-400', value: 'rgb(252 165 165)' },
{ name: 'orange-400', value: 'rgb(251 146 60)' },
{ name: 'yellow-400', value: 'rgb(250 204 21)' },
{ name: 'green-400', value: 'rgb(74 222 128)' },
{ name: 'blue-400', value: 'rgb(96 165 250)' },
{ name: 'purple-400', value: 'rgb(192 132 252)' },
{ name: 'pink-400', value: 'rgb(244 114 182)' }];

const colors2 = [{ name: 'black', value: 'black' }, { name: 'slate-700', value: 'rgb(51 65 85)' },
{ name: 'red-700', value: 'rgb(185 28 28)' }, { name: 'orange-700', value: 'rgb(194 65 12)' }
    , { name: 'yellow-700', value: 'rgb(161 98 7)' }, { name: 'green-700', value: 'rgb(21 128 61)' }
    , { name: 'blue-700', value: 'rgb(29 78 216)' }, { name: 'purple-700', value: 'rgb(126 34 206)' }
    , { name: 'pink-700', value: 'rgb(190 24 93)' }
]

const lineWidths = [
    { lineWidth: 35, circleSize: 'w-7 h-7' },
    { lineWidth: 25, circleSize: 'w-6 h-6' },
    { lineWidth: 15, circleSize: 'w-4 h-4' },
    { lineWidth: 5, circleSize: 'w-2 h-2' },
];

export { colors1, colors2, avatars, gamesList, lineWidths }