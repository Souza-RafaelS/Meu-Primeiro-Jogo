import { TileTypes } from "../world/TileTypes.js";

export const TestMap2 = {

    width: 30,
    height: 20,
    tileSize: 32,

    // ========================================
    // SPAWNS
    // ========================================

    spawns: {

        inicio: {
            x: 400,
            y: 200
        },

        entrada: {
            x: 450,
            y: 200
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

            target: "test3",

            spawn: "entrada"
        }

    ],

    ground: [],
    collision: [],
    objects: []

};


// ========================================
// CRIAR MATRIZES
// ========================================

for (
    let y = 0;
    y < TestMap2.height;
    y++
) {

    const groundRow = [];
    const collisionRow = [];
    const objectRow = [];


    for (
        let x = 0;
        x < TestMap2.width;
        x++
    ) {

        // GRAMA
        groundRow.push(
            TileTypes.GRASS.id
        );

        // SEM COLISÃO
        collisionRow.push(false);

        // SEM OBJETO
        objectRow.push(null);

    }


    TestMap2.ground.push(groundRow);
    TestMap2.collision.push(collisionRow);
    TestMap2.objects.push(objectRow);

}


// ========================================
// PAREDES EXTERNAS
// ========================================

// Parede superior

for (
    let x = 0;
    x < TestMap2.width;
    x++
) {

    TestMap2.ground[0][x] =
        TileTypes.WALL.id;

    TestMap2.collision[0][x] =
        true;

}


// Parede inferior

for (
    let x = 0;
    x < TestMap2.width;
    x++
) {

    TestMap2.ground[TestMap2.height - 1][x] =
        TileTypes.WALL.id;

    TestMap2.collision[TestMap2.height - 1][x] =
        true;

}


// Parede esquerda

for (
    let y = 0;
    y < TestMap2.height;
    y++
) {

    TestMap2.ground[y][0] =
        TileTypes.WALL.id;

    TestMap2.collision[y][0] =
        true;

}


// Parede direita

for (
    let y = 0;
    y < TestMap2.height;
    y++
) {

    TestMap2.ground[y][TestMap2.width - 1] =
        TileTypes.WALL.id;

    TestMap2.collision[y][TestMap2.width - 1] =
        true;

}


// ========================================
// LAGO
// ========================================

for (
    let y = 6;
    y < 12;
    y++
) {

    for (
        let x = 3;
        x < 10;
        x++
    ) {

        TestMap2.ground[y][x] =
            TileTypes.WATER.id;

    }

}


// ========================================
// FAIXA DE AREIA
// ========================================

for (
    let y = 2;
    y < 5;
    y++
) {

    for (
        let x = 16;
        x < 25;
        x++
    ) {

        TestMap2.ground[y][x] =
            TileTypes.SAND.id;

    }

}


// ========================================
// PAREDE HORIZONTAL INTERNA
// ========================================

for (
    let x = 11;
    x < 20;
    x++
) {

    TestMap2.ground[10][x] =
        TileTypes.WALL.id;

    TestMap2.collision[10][x] =
        true;

}


// ========================================
// PAREDE VERTICAL INTERNA
// ========================================

for (
    let y = 12;
    y < 18;
    y++
) {

    TestMap2.ground[y][22] =
        TileTypes.WALL.id;

    TestMap2.collision[y][22] =
        true;

}


// ========================================
// ÁRVORES
// ========================================

TestMap2.objects[5][13] = {
    type: "tree"
};

TestMap2.objects[7][15] = {
    type: "tree"
};

TestMap2.objects[9][17] = {
    type: "tree"
};

TestMap2.objects[13][8] = {
    type: "tree"
};


// ========================================
// PEDRAS
// ========================================

TestMap2.objects[4][26] = {
    type: "rock"
};

TestMap2.objects[6][27] = {
    type: "rock"
};

TestMap2.objects[15][12] = {
    type: "rock"
};