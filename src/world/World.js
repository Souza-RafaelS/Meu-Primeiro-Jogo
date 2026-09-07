import { TileMap } from "./TileMap.js";
import { TileTypes } from "./TileTypes.js";
import { WorldObject } from "./WorldObject.js";
import { CollisionSystem } from "../engine/CollisionSystem.js";

export class World {

constructor(game, mapId) {

    this.game = game;
    this.tileset = new Image();

    this.tileset.src = "./assets/sprites/tileset0A.png";

    this.tileset.onload = () => {
        console.log("Tileset carregado: tileset0A.png");
    };

    this.tileset.onerror = () => {
        console.error(
            "Erro ao carregar tileset:",
            this.tileset.src
        );
    };
    //=========================================
    // SPRITE DE SAIDA
    //=========================================

    this.exitSprite = new Image();

    this.exitSprite.src =
        "./assets/sprites/saída0A.png";

    //=========================================
    // ANIMAÇÃO DA AGUA
    //=========================================

    this.waterFrame = 0;

    this.waterTimer = 0;

    this.waterFrameDuration = 0.15;

    // ========================================
    // DEBUG
    // ========================================

    this.debugCollision = false;

    this.debugCollisionLog = false;


    // ========================================
    // TILE MAP
    // ========================================

    this.tileMap = null;


    // ========================================
    // OBJETOS
    // ========================================

    this.objects = [];


    // ========================================
    // SPAWNS
    // ========================================

    this.spawns = {};


    // ========================================
    // SAÍDAS
    // ========================================

    this.exits = [];


    // ========================================
    // COLLISION SYSTEM
    // ========================================

    this.collision =
        new CollisionSystem(
            this
        );


    // ========================================
    // CARREGAR MAPA
    // ========================================

    this.loadMap(
        mapId
    );
}


// ========================================
// CARREGAR MAPA
// ========================================

loadMap(mapId) {

    let mapData;


    // ========================================
    // PEGAR MAPA NO MAP MANAGER
    // ========================================

    if (typeof mapId === "string") {
        mapData =
            this.game.mapManager.get(
                mapId
            );

    } else {
        mapData = mapId;
    }


    // ========================================
    // VALIDAR MAPA
    // ========================================

    if (!mapData) {

        throw new Error(
            "Mapa não encontrado: " +
            mapId
        );
    }


    // ========================================
    // TILE MAP
    // ========================================

    if (!this.tileMap) {

        this.tileMap =
            new TileMap(
                mapData.width,
                mapData.height,
                mapData.tileSize
            );
    }


    this.tileMap.load(
        mapData
    );


    // ========================================
    // DIMENSÕES
    // ========================================

    this.tileSize =
        this.tileMap.tileSize;


    this.width =
        this.tileMap.width *
        this.tileSize;


    this.height =
        this.tileMap.height *
        this.tileSize;


    // ========================================
    // SPAWNS
    // ========================================

    this.spawns =
        mapData.spawns || {};


    // ========================================
    // SAÍDAS
    // ========================================

    this.exits =
        mapData.exits || [];


    // ========================================
    // OBJETOS
    // ========================================

    this.createObjects();


    console.log(
        "Mapa carregado:",
        typeof mapId === "string"
            ? mapId
            : "dados"
    );
}


// ========================================
// OBTER SPAWN
// ========================================

getSpawn(name = "inicio") {

    const spawn =
        this.spawns[name];


    if (!spawn) {

        console.warn(
            "Spawn não encontrado:",
            name
        );


        return {
            x: 0,
            y: 0
        };
    }


    return spawn;
}


// ========================================
// CRIAR OBJETOS
// ========================================

createObjects() {

    this.objects = [];


    for (
        let y = 0;
        y < this.tileMap.height;
        y++
    ) {

        for (
            let x = 0;
            x < this.tileMap.width;
            x++
        ) {

            const data =
                this.tileMap.getObject(
                    x,
                    y
                );


            if (!data) {

                continue;
            }


            const object =
                new WorldObject(
                    data.type,
                    x * this.tileSize,
                    y * this.tileSize
                );


            this.objects.push(
                object
            );
        }
    }
}


// ========================================
// UPDATE
// ========================================

update(delta) {

// ========================================
// ANIMAÇÃO DA ÁGUA
// ========================================

this.waterTimer += delta;


if (
    this.waterTimer >=
    this.waterFrameDuration
) {

    this.waterTimer -=
        this.waterFrameDuration;


    this.waterFrame++;


    if (
        this.waterFrame >= 4
    ) {

        this.waterFrame = 0;
    }
}


// ========================================
// OBJETOS
// ========================================

for (
    const object
    of this.objects
) {

    if (
        object.update
    ) {

        object.update(
            delta
        );
    }
}


}

// ========================================
// OBJETOS RENDERIZÁVEIS
// ========================================

getRenderables() {

    return [
        ...this.objects
    ];
}


// ========================================
// RENDER DO TERRENO
// ========================================

render(renderer) {

for (
    let y = 0;
    y < this.tileMap.height;
    y++
) {

    for (
        let x = 0;
        x < this.tileMap.width;
        x++
    ) {

        const tile =
            this.tileMap.getGround(
                x,
                y
            );


        const screenX =
            x * this.tileSize;


        const screenY =
            y * this.tileSize;


        // ========================================
        // POSIÇÃO DO TILESET
        // ========================================

        let sourceX = 0;

        let sourceY = 0;


        // ========================================
        // GRASS
        // ========================================

        if (
            tile ===
            TileTypes.GRASS.id
        ) {

            const variation =
                (x * 7 + y * 13) % 4;


            sourceX =
                variation * 16;


            sourceY = 0;
        }


        // ========================================
        // WALL
        // ========================================

        else if (
            tile ===
            TileTypes.WALL.id
        ) {

            const variation =
                (x * 11 + y * 5) % 4;


            sourceX =
                variation * 16;


            sourceY = 16;
        }


        // ========================================
        // WATER
        // ========================================

        else if (
            tile ===
            TileTypes.WATER.id
        ) {

            sourceX = this.waterFrame * 16;

            sourceY = 32;
        }


        // ========================================
        // SAND
        // ========================================

        else if (
            tile ===
            TileTypes.SAND.id
        ) {

            sourceX = 0;

            sourceY = 48;
        }


        // ========================================
        // DESENHAR
        // ========================================

        renderer.drawImageFrame(

            this.tileset,

            sourceX,
            sourceY,

            16,
            16,

            screenX,
            screenY,

            this.tileSize,
            this.tileSize
        );
    }
    for (const exit of this.exits) {

    if (!this.exitSprite.complete) {
        continue;
    }

    renderer.drawImageFrame(

        this.exitSprite,

        0,
        0,

        32,
        32,

        exit.x * this.tileSize,
        exit.y * this.tileSize,

        exit.width * this.tileSize,
        exit.height * this.tileSize
    );
}

}


}


// ========================================
// COLISÃO DEBUG
// ========================================

renderCollision(renderer) {

    for (
        let y = 0;
        y < this.tileMap.height;
        y++
    ) {

        for (
            let x = 0;
            x < this.tileMap.width;
            x++
        ) {

            if (
                this.tileMap.getCollision(
                    x,
                    y
                )
            ) {

                renderer.fillRect(
                    x * this.tileSize,
                    y * this.tileSize,
                    this.tileSize,
                    this.tileSize,
                    "rgba(255, 0, 0, 0.35)"
                );
            }
        }
    }


    // ====================================
    // COLISÃO DOS OBJETOS
    // ====================================

    for (
        const object
        of this.objects
    ) {

        if (
            !object.solid
        ) {

            continue;
        }


        const collision =
            object.getCollisionRect();


        renderer.fillRect(
            collision.x,
            collision.y,
            collision.width,
            collision.height,
            "rgba(255, 255, 0, 0.65)"
        );
    }
}


// ========================================
// VERIFICAR SAÍDA
// ========================================

getExitForEntity(entity) {

    if (
        !entity ||
        !entity.transform
    ) {

        return null;
    }


    const transform =
        entity.transform;


    const centerX =
        transform.x +
        transform.width / 2;


    const centerY =
        transform.y +
        transform.height / 2;


    for (
        const exit
        of this.exits
    ) {

        const x =
            exit.x *
            this.tileSize;


        const y =
            exit.y *
            this.tileSize;


        const width =
            exit.width *
            this.tileSize;


        const height =
            exit.height *
            this.tileSize;


        if (
            centerX >= x &&
            centerX < x + width &&
            centerY >= y &&
            centerY < y + height
        ) {

            return exit;
        }
    }


    return null;
}


// ========================================
// VELOCIDADE DO TERRENO
// ========================================

getMovementSpeed(x, y) {

    const tile =
        this.tileMap
            .getTileTypeAtWorldPosition(
                x,
                y
            );


    return tile.speed;
}


// ========================================
// DEBUG VISUAL
// ========================================

toggleCollisionDebug() {

    this.debugCollision =
        !this.debugCollision;


    console.log(
        "Visual da colisão:",
        this.debugCollision
            ? "ATIVADO"
            : "DESATIVADO"
    );
}


// ========================================
// DEBUG LOG
// ========================================

toggleCollisionLog() {

    this.debugCollisionLog =
        !this.debugCollisionLog;


    console.log(
        "Log de colisão:",
        this.debugCollisionLog
            ? "ATIVADO"
            : "DESATIVADO"
    );
}


}