import { TileTypes } from "./TileTypes.js";

export class TileMap {

constructor(width, height, tileSize = 32) {

    this.width = width;
    this.height = height;
    this.tileSize = tileSize;

    this.ground = [];
    this.objects = [];
    this.collision = [];
}


// ========================================
// CRIAR MAPA VAZIO
// ========================================

createEmpty() {

    this.ground = [];
    this.objects = [];
    this.collision = [];


    for (let y = 0; y < this.height; y++) {

        const groundRow = [];
        const objectRow = [];
        const collisionRow = [];


        for (let x = 0; x < this.width; x++) {

            groundRow.push(
                TileTypes.GRASS.id
            );

            objectRow.push(null);

            collisionRow.push(false);
        }


        this.ground.push(groundRow);
        this.objects.push(objectRow);
        this.collision.push(collisionRow);
    }
}


// ========================================
// CARREGAR MAPA
// ========================================

load(mapData) {

    this.width = mapData.width;
    this.height = mapData.height;
    this.tileSize = mapData.tileSize;


    this.ground =
        mapData.ground.map(row => [...row]);


    this.collision =
        mapData.collision.map(row => [...row]);


    this.objects =
        mapData.objects.map(row => [...row]);
}


// ========================================
// GROUND
// ========================================

getGround(x, y) {

    if (!this.isInside(x, y)) {
        return null;
    }

    return this.ground[y][x];
}


setGround(x, y, value) {

    if (!this.isInside(x, y)) {
        return;
    }

    this.ground[y][x] = value;
}


// ========================================
// COLLISION
// ========================================

getCollision(x, y) {

    if (!this.isInside(x, y)) {
        return true;
    }

    return this.collision[y][x];
}


setCollision(x, y, value) {

    if (!this.isInside(x, y)) {
        return;
    }

    this.collision[y][x] = value;
}


isSolid(x, y) {

    return this.getCollision(x, y);
}


// ========================================
// OBJECTS
// ========================================

getObject(x, y) {

    if (!this.isInside(x, y)) {
        return null;
    }

    return this.objects[y][x];
}


setObject(x, y, value) {

    if (!this.isInside(x, y)) {
        return;
    }

    this.objects[y][x] = value;
}


// ========================================
// POSIÇÃO NO MUNDO
// ========================================

getTileAtWorldPosition(x, y) {

    const tileX =
        Math.floor(
            x / this.tileSize
        );


    const tileY =
        Math.floor(
            y / this.tileSize
        );


    return this.getGround(
        tileX,
        tileY
    );
}


getTileTypeAtWorldPosition(x, y) {

    const tileId =
        this.getTileAtWorldPosition(
            x,
            y
        );


    for (const key in TileTypes) {

        const tileType =
            TileTypes[key];


        if (tileType.id === tileId) {

            return tileType;
        }
    }


    return TileTypes.GRASS;
}


// ========================================
// VERIFICAR LIMITES
// ========================================

isInside(x, y) {

    return (
        x >= 0 &&
        y >= 0 &&
        x < this.width &&
        y < this.height
    );
}


}