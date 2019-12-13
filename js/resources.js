export let eqSpaceMaps = [
    'https://i.imgur.com/skiLEHi.jpg',
    'https://img2.goodfon.ru/original/1920x1080/5/95/mlechnyy-put-zvezdy-noch-4810.jpg'
];

export function randomSpaceMap() {
    return eqSpaceMaps[Math.floor(Math.random() * eqSpaceMaps.length)];
}