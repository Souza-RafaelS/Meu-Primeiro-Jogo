import { TileTypes } from "../world/TileTypes.js";

export const TestMap = {

width: 25,

height: 18,

tileSize: 32,


// ========================================
// SPAWNS
// ========================================

spawns: {

    inicio: {
        x: 100,
        y: 100
    },

    entrada: {
        x: 120,
        y: 100
    }
},


// ========================================
// SAÍDAS
// ========================================

exits: [

    {
        x: 20,
        y: 8,
        width: 2,
        height: 2,

        target: "test2",

        spawn: "entrada"
    }

],


ground: [],

collision: [],

objects: []


};

// ========================================
// GROUND
// ========================================

for (
let y = 0;
y < TestMap.height;
y++
) {

const row = [];


for (
    let x = 0;
    x < TestMap.width;
    x++
) {

    row.push(
        TileTypes.GRASS.id
    );
}


TestMap.ground.push(row);


}

// ========================================
// COLLISION
// ========================================

for (
let y = 0;
y < TestMap.height;
y++
) {

const row = [];


for (
    let x = 0;
    x < TestMap.width;
    x++
) {

    row.push(false);
}


TestMap.collision.push(row);


}

// ========================================
// OBJECTS
// ========================================

for (
let y = 0;
y < TestMap.height;
y++
) {

const row = [];


for (
    let x = 0;
    x < TestMap.width;
    x++
) {

    row.push(null);
}


TestMap.objects.push(row);


}

// ========================================
// PAREDES EXTERNAS
// ========================================

// Parede superior

for (
let x = 0;
x < TestMap.width;
x++
) {

TestMap.ground[0][x] =
    TileTypes.WALL.id;

TestMap.collision[0][x] =
    true;


}

// Parede inferior

for (
let x = 0;
x < TestMap.width;
x++
) {

TestMap.ground[
    TestMap.height - 1
][x] =
    TileTypes.WALL.id;

TestMap.collision[
    TestMap.height - 1
][x] =
    true;


}

// Parede esquerda

for (
let y = 0;
y < TestMap.height;
y++
) {

TestMap.ground[y][0] =
    TileTypes.WALL.id;

TestMap.collision[y][0] =
    true;


}

// Parede direita

for (
let y = 0;
y < TestMap.height;
y++
) {

TestMap.ground[y][
    TestMap.width - 1
] =
    TileTypes.WALL.id;

TestMap.collision[y][
    TestMap.width - 1
] =
    true;


}

// ========================================
// PAREDE HORIZONTAL INTERNA
// ========================================

for (
let x = 5;
x < 12;
x++
) {

TestMap.ground[5][x] =
    TileTypes.WALL.id;

TestMap.collision[5][x] =
    true;


}

// ========================================
// PAREDE VERTICAL INTERNA
// ========================================

for (
let y = 8;
y < 13;
y++
) {

TestMap.ground[y][14] =
    TileTypes.WALL.id;

TestMap.collision[y][14] =
    true;


}

// ========================================
// ÁGUA
// ========================================

for (
let y = 8;
y < 12;
y++
) {

for (
    let x = 4;
    x < 8;
    x++
) {

    TestMap.ground[y][x] =
        TileTypes.WATER.id;
}


}

// ========================================
// AREIA
// ========================================

for (
let y = 3;
y < 6;
y++
) {

for (
    let x = 15;
    x < 20;
    x++
) {

    TestMap.ground[y][x] =
        TileTypes.SAND.id;
}


}

// ========================================
// OBJETOS
// ========================================

TestMap.objects[7][8] = {

type: "tree"


};

TestMap.objects[10][12] = {

type: "tree"


};

TestMap.objects[6][18] = {

type: "rock"


};