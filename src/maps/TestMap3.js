import { TileTypes } from "../world/TileTypes.js";

export const TestMap3 = {

    width: 40,
    height: 30,
    tileSize: 32,

    // ========================================
    // SPAWNS
    // ========================================

    spawns: {

        inicio: {
            x: 160,
            y: 160
        },

        entrada: {
            x: 192,
            y: 160
        }

    },

    // ========================================
    // SAÍDAS
    // ========================================

    exits: [

        {
            x: 36,
            y: 14,
            width: 2,
            height: 2,

            target: "test4",

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
    y < TestMap3.height;
    y++
) {

    const groundRow = [];
    const collisionRow = [];
    const objectRow = [];


    for (
        let x = 0;
        x < TestMap3.width;
        x++
    ) {

        groundRow.push(
            TileTypes.GRASS.id
        );

        collisionRow.push(false);

        objectRow.push(null);

    }


    TestMap3.ground.push(groundRow);
    TestMap3.collision.push(collisionRow);
    TestMap3.objects.push(objectRow);

}


// ========================================
// PAREDES EXTERNAS
// ========================================

// Parede superior

for (
    let x = 0;
    x < TestMap3.width;
    x++
) {

    TestMap3.ground[0][x] =
        TileTypes.WALL.id;

    TestMap3.collision[0][x] =
        true;

}


// Parede inferior

for (
    let x = 0;
    x < TestMap3.width;
    x++
) {

    TestMap3.ground[TestMap3.height - 1][x] =
        TileTypes.WALL.id;

    TestMap3.collision[TestMap3.height - 1][x] =
        true;

}


// Parede esquerda

for (
    let y = 0;
    y < TestMap3.height;
    y++
) {

    TestMap3.ground[y][0] =
        TileTypes.WALL.id;

    TestMap3.collision[y][0] =
        true;

}


// Parede direita

for (
    let y = 0;
    y < TestMap3.height;
    y++
) {

    TestMap3.ground[y][TestMap3.width - 1] =
        TileTypes.WALL.id;

    TestMap3.collision[y][TestMap3.width - 1] =
        true;

}


// ========================================
// LAGO GRANDE
// ========================================

for (
    let y = 6;
    y < 13;
    y++
) {

    for (
        let x = 4;
        x < 13;
        x++
    ) {

        TestMap3.ground[y][x] =
            TileTypes.WATER.id;

    }

}


// ========================================
// SEGUNDO LAGO
// ========================================

for (
    let y = 18;
    y < 25;
    y++
) {

    for (
        let x = 27;
        x < 35;
        x++
    ) {

        TestMap3.ground[y][x] =
            TileTypes.WATER.id;

    }

}


// ========================================
// PRAIA / AREIA SUPERIOR
// ========================================

for (
    let y = 3;
    y < 7;
    y++
) {

    for (
        let x = 18;
        x < 29;
        x++
    ) {

        TestMap3.ground[y][x] =
            TileTypes.SAND.id;

    }

}


// ========================================
// ÁREA DE AREIA INFERIOR
// ========================================

for (
    let y = 24;
    y < 28;
    y++
) {

    for (
        let x = 5;
        x < 16;
        x++
    ) {

        TestMap3.ground[y][x] =
            TileTypes.SAND.id;

    }

}


// ========================================
// PAREDE HORIZONTAL
// ========================================

for (
    let x = 15;
    x < 27;
    x++
) {

    TestMap3.ground[10][x] =
        TileTypes.WALL.id;

    TestMap3.collision[10][x] =
        true;

}


// ========================================
// PAREDE HORIZONTAL 2
// ========================================

for (
    let x = 8;
    x < 19;
    x++
) {

    TestMap3.ground[16][x] =
        TileTypes.WALL.id;

    TestMap3.collision[16][x] =
        true;

}


// ========================================
// PAREDE VERTICAL
// ========================================

for (
    let y = 11;
    y < 20;
    y++
) {

    TestMap3.ground[y][20] =
        TileTypes.WALL.id;

    TestMap3.collision[y][20] =
        true;

}


// ========================================
// PAREDE VERTICAL 2
// ========================================

for (
    let y = 20;
    y < 27;
    y++
) {

    TestMap3.ground[y][24] =
        TileTypes.WALL.id;

    TestMap3.collision[y][24] =
        true;

}


// ========================================
// PEQUENA ÁREA DE PAREDE
// ========================================

for (
    let x = 30;
    x < 36;
    x++
) {

    TestMap3.ground[14][x] =
        TileTypes.WALL.id;

    TestMap3.collision[14][x] =
        true;

}


// ========================================
// ÁRVORES
// ========================================

TestMap3.objects[4][8] = {
    type: "tree"
};

TestMap3.objects[5][14] = {
    type: "tree"
};

TestMap3.objects[8][16] = {
    type: "tree"
};

TestMap3.objects[12][6] = {
    type: "tree"
};

TestMap3.objects[14][12] = {
    type: "tree"
};

TestMap3.objects[19][17] = {
    type: "tree"
};

TestMap3.objects[22][7] = {
    type: "tree"
};

TestMap3.objects[26][18] = {
    type: "tree"
};

TestMap3.objects[8][31] = {
    type: "tree"
};

TestMap3.objects[16][34] = {
    type: "tree"
};

TestMap3.objects[27][30] = {
    type: "tree"
};


// ========================================
// PEDRAS
// ========================================

TestMap3.objects[5][33] = {
    type: "rock"
};

TestMap3.objects[9][28] = {
    type: "rock"
};

TestMap3.objects[13][25] = {
    type: "rock"
};

TestMap3.objects[17][5] = {
    type: "rock"
};

TestMap3.objects[21][21] = {
    type: "rock"
};

TestMap3.objects[25][20] = {
    type: "rock"
};

TestMap3.objects[27][35] = {
    type: "rock"
};