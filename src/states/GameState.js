import { Player } from "../entities/Player.js";
import { EntityManager } from "../entities/EntityManager.js";
import { World } from "../world/World.js";

export class GameState {

constructor(game) {

    this.game = game;


    // ========================================
    // MAPA INICIAL
    // ========================================

    this.currentMap =
    this.game.config.initialMap;

    // ========================================
    // WORLD
    // ========================================

    this.world =
        new World(
            this.game,
            this.currentMap
        );


    this.game.world =
        this.world;


    // ========================================
    // ENTITY MANAGER
    // ========================================

    this.entities =
        new EntityManager();


    // ========================================
    // PLAYER
    // ========================================

    const spawn =
        this.world.getSpawn(
            "inicio"
        );


    this.player =
        new Player(
            this.game,
            spawn.x,
            spawn.y
        );
    this.player.speed = this.game.config.player.speed;
    
    this.entities.add(
        this.player
    );
}


// ========================================
// ENTER
// ========================================

enter() {

    console.log(
        "ENTROU NO JOGO"
    );
}


// ========================================
// EXIT
// ========================================

exit() {

    console.log(
        "SAIU DO JOGO"
    );
}


// ========================================
// UPDATE
// ========================================

update(delta) {

    // ====================================
    // WORLD
    // ====================================

    this.world.update(
        delta
    );


    // ====================================
    // ENTIDADES
    // ====================================

    this.entities.update(
        delta
    );


    // ====================================
    // VERIFICAR SAÍDA
    // ====================================

    const exit =
        this.world.getExitForEntity(
            this.player
        );


    if (exit) {

        // --------------------------------
        // VERIFICAR MAPA
        // --------------------------------

        if (
            !this.game.mapManager.has(
                exit.target
            )
        ) {

            console.warn(
                "Mapa de destino não existe:",
                exit.target
            );

        } else {

            // ----------------------------
            // NOVO MAPA
            // ----------------------------

            this.currentMap =
                exit.target;


            this.world.loadMap(
                this.currentMap
            );


            // ----------------------------
            // NOVO SPAWN
            // ----------------------------

            const spawn =
                this.world.getSpawn(
                    exit.spawn
                );


            this.player.transform.x =
                spawn.x;


            this.player.transform.y =
                spawn.y;


            console.log(
                "Transição de mapa:",
                this.currentMap,
                "Spawn:",
                exit.spawn
            );
        }
    }


    // ====================================
    // CAMERA
    // ====================================

    this.game.camera.follow(
        this.player,
        this.world,
        delta
    );
}


// ========================================
// RENDER
// ========================================

render(renderer) {

    // ====================================
    // FUNDO
    // ====================================

    renderer.fillScreen(
        "#203820"
    );


    // ====================================
    // WORLD
    // ====================================

    this.world.render(
        renderer
    );


    // ====================================
    // ENTIDADES + OBJETOS
    // ====================================

    this.game.renderSystem.render(
        renderer,
        this.world,
        this.entities
    );


    // ====================================
    // COLLISION DEBUG
    // ====================================

    if (
    this.world.debugCollision
) {

    // Colisões do mapa e objetos

    this.world.renderCollision(
        renderer
    );


    // Colisão do Player

    const playerCollider =
        this.player.collider.getRect(
            this.player
        );


    renderer.fillRect(
        playerCollider.x,
        playerCollider.y,
        playerCollider.width,
        playerCollider.height,
        "rgba(0, 0, 255, 0.5)"
        );
    }
}


}