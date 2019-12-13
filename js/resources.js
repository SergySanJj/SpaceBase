export let eqSpaceMaps = [
    `../misc/images/space4.jpg`
];

export function randomSpaceMap() {
    return eqSpaceMaps[Math.floor(Math.random() * eqSpaceMaps.length)];
}