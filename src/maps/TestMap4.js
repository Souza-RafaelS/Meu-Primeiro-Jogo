import { TileTypes } from "../world/TileTypes.js";

export const TestMap4 = {

    width: 40,
    height: 30,
    tileSize: 32,

    // ========================================
    // SPAWNS
    // ========================================

    spawns: {

        inicio: {
            x: 64,
            y: 64
        },

        entrada: {
            x: 96,
            y: 64
        }

    },

    // ========================================
    // SAÍDAS
    // ========================================

    exits: [

        {
            x: 36,
            y: 26,
            width: 2,
            height: 2,

            target: "test",

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
    y < TestMap4.height;
    y++
) {

    const groundRow = [];
    const collisionRow = [];
    const objectRow = [];

    for (
        let x = 0;
        x < TestMap4.width;
        x++
    ) {

        groundRow.push(
            TileTypes.GRASS.id
        );

        collisionRow.push(false);

        objectRow.push(null);

    }

    TestMap4.ground.push(groundRow);
    TestMap4.collision.push(collisionRow);
    TestMap4.objects.push(objectRow);

}


// ========================================
// PAREDES EXTERNAS
// ========================================

for (
    let x = 0;
    x < TestMap4.width;
    x++
) {

    TestMap4.ground[0][x] =
        TileTypes.WALL.id;

    TestMap4.ground[TestMap4.height - 1][x] =
        TileTypes.WALL.id;

    TestMap4.collision[0][x] =
        true;

    TestMap4.collision[TestMap4.height - 1][x] =
        true;

}


for (
    let y = 0;
    y < TestMap4.height;
    y++
) {

    TestMap4.ground[y][0] =
        TileTypes.WALL.id;

    TestMap4.ground[y][TestMap4.width - 1] =
        TileTypes.WALL.id;

    TestMap4.collision[y][0] =
        true;

    TestMap4.collision[y][TestMap4.width - 1] =
        true;

}


// ========================================
// LABIRINTO - PAREDE 1
// ========================================

for (
    let x = 3;
    x < 16;
    x++
) {

    TestMap4.ground[4][x] =
        TileTypes.WALL.id;

    TestMap4.collision[4][x] =
        true;

}


// ========================================
// ABERTURA DA PAREDE 1
// ========================================

TestMap4.ground[4][9] =
    TileTypes.GRASS.id;

TestMap4.collision[4][9] =
    false;


// ========================================
// LABIRINTO - PAREDE 2
// ========================================

for (
    let y = 4;
    y < 12;
    y++
) {

    TestMap4.ground[y][16] =
        TileTypes.WALL.id;

    TestMap4.collision[y][16] =
        true;

}


// Abertura

TestMap4.ground[8][16] =
    TileTypes.GRASS.id;

TestMap4.collision[8][16] =
    false;


// ========================================
// LABIRINTO - PAREDE 3
// ========================================

for (
    let x = 16;
    x < 30;
    x++
) {

    TestMap4.ground[12][x] =
        TileTypes.WALL.id;

    TestMap4.collision[12][x] =
        true;

}


// Abertura

TestMap4.ground[12][23] =
    TileTypes.GRASS.id;

TestMap4.collision[12][23] =
    false;


// ========================================
// LABIRINTO - PAREDE 4
// ========================================

for (
    let y = 12;
    y < 23;
    y++
) {

    TestMap4.ground[y][30] =
        TileTypes.WALL.id;

    TestMap4.collision[y][30] =
        true;

}


// Abertura

TestMap4.ground[18][30] =
    TileTypes.GRASS.id;

TestMap4.collision[18][30] =
    false;


// ========================================
// LABIRINTO - PAREDE 5
// ========================================

for (
    let x = 20;
    x < 31;
    x++
) {

    TestMap4.ground[22][x] =
        TileTypes.WALL.id;

    TestMap4.collision[22][x] =
        true;

}


// Abertura

TestMap4.ground[22][25] =
    TileTypes.GRASS.id;

TestMap4.collision[22][25] =
    false;


// ========================================
// LABIRINTO - PAREDE 6
// ========================================

for (
    let y = 16;
    y < 23;
    y++
) {

    TestMap4.ground[y][20] =
        TileTypes.WALL.id;

    TestMap4.collision[y][20] =
        true;

}


// Abertura

TestMap4.ground[19][20] =
    TileTypes.GRASS.id;

TestMap4.collision[19][20] =
    false;


// ========================================
// LABIRINTO - PAREDE 7
// ========================================

for (
    let x = 7;
    x < 20;
    x++
) {

    TestMap4.ground[16][x] =
        TileTypes.WALL.id;

    TestMap4.collision[16][x] =
        true;

}


// Abertura

TestMap4.ground[16][13] =
    TileTypes.GRASS.id;

TestMap4.collision[16][13] =
    false;


// ========================================
// LAGO 1
// ========================================

for (
    let y = 6;
    y < 10;
    y++
) {

    for (
        let x = 3;
        x < 8;
        x++
    ) {

        TestMap4.ground[y][x] =
            TileTypes.WATER.id;

        TestMap4.collision[y][x] =
            true;

    }

}


// ========================================
// LAGO 2
// ========================================

for (
    let y = 14;
    y < 20;
    y++
) {

    for (
        let x = 23;
        x < 29;
        x++
    ) {

        TestMap4.ground[y][x] =
            TileTypes.WATER.id;

        TestMap4.collision[y][x] =
            true;

    }

}


// ========================================
// LAGO 3
// ========================================

for (
    let y = 24;
    y < 28;
    y++
) {

    for (
        let x = 5;
        x < 13;
        x++
    ) {

        TestMap4.ground[y][x] =
            TileTypes.WATER.id;

        TestMap4.collision[y][x] =
            true;

    }

}


// ========================================
// AREIA 1
// ========================================

for (
    let y = 2;
    y < 5;
    y++
) {

    for (
        let x = 24;
        x < 34;
        x++
    ) {

        TestMap4.ground[y][x] =
            TileTypes.SAND.id;

    }

}


// ========================================
// AREIA 2
// ========================================

for (
    let y = 24;
    y < 28;
    y++
) {

    for (
        let x = 27;
        x < 37;
        x++
    ) {

        TestMap4.ground[y][x] =
            TileTypes.SAND.id;

    }

}


// ========================================
// ÁRVORES
// ========================================

TestMap4.objects[2][5] = {
    type: "tree"
};

TestMap4.objects[3][12] = {
    type: "tree"
};

TestMap4.objects[6][11] = {
    type: "tree"
};

TestMap4.objects[9][13] = {
    type: "tree"
};

TestMap4.objects[11][4] = {
    type: "tree"
};

TestMap4.objects[14][18] = {
    type: "tree"
};

TestMap4.objects[15][34] = {
    type: "tree"
};

TestMap4.objects[18][16] = {
    type: "tree"
};

TestMap4.objects[21][34] = {
    type: "tree"
};

TestMap4.objects[24][17] = {
    type: "tree"
};

TestMap4.objects[27][20] = {
    type: "tree"
};

TestMap4.objects[26][33] = {
    type: "tree"
};


// ========================================
// PEDRAS
// ========================================

TestMap4.objects[5][21] = {
    type: "rock"
};

TestMap4.objects[7][28] = {
    type: "rock"
};

TestMap4.objects[10][34] = {
    type: "rock"
};

TestMap4.objects[13][12] = {
    type: "rock"
};

TestMap4.objects[17][27] = {
    type: "rock"
};

TestMap4.objects[20][8] = {
    type: "rock"
};

TestMap4.objects[23][15] = {
    type: "rock"
};

TestMap4.objects[26][26] = {
    type: "rock"
};

TestMap4.objects[27][36] = {
    type: "rock"
};