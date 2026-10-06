import { Player } from "../entities/Player.js";
import { EntityManager } from "../entities/EntityManager.js";
import { World } from "../world/World.js";
import { Enemy } from "../entities/Enemy.js";

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
            this.world.getSpawn("inicio");


        this.player =
            new Player(
                this.game,
                spawn.x,
                spawn.y
            );


        this.player.speed =
            this.game.config.player.speed;


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

        // Carrega os inimigos
        // do mapa atual
        this.loadEnemies();
    }


    // ========================================
    // CARREGAR INIMIGOS
    // ========================================

    loadEnemies() {

        fetch(
            "./assets/data/enemies.json"
        )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Não foi possível carregar o arquivo JSON de inimigos"
                );
            }

            return response.json();
        })


        .then(enemyDatabase => {

            const currentMapName =
                this.currentMap;


            const mapPlacements =
                enemyDatabase.placements[
                    currentMapName
                ];


            const definitions =
                enemyDatabase.definitions;


            // ====================================
            // NENHUM INIMIGO NO MAPA
            // ====================================

            if (!mapPlacements) {

                console.log(
                    `Nenhum inimigo configurado para o mapa ${currentMapName}.`
                );

                return;
            }


            // ====================================
            // CRIAR INIMIGOS
            // ====================================

            mapPlacements.forEach(
                spawnInfo => {

                    const config =
                        definitions[
                            spawnInfo.type
                        ];


                    if (!config) {

                        console.warn(
                            `Definição de inimigo não encontrada: ${spawnInfo.type}`
                        );

                        return;
                    }


                    const newEnemy =
                        new Enemy(
                            this.game,
                            spawnInfo.x,
                            spawnInfo.y,
                            config
                        );


                    this.entities.add(
                        newEnemy
                    );
                }
            );


            console.log(
                `${mapPlacements.length} inimigos gerados no mapa ${currentMapName}!`
            );
        })


        .catch(error => {

            console.error(
                "Erro na carga de dados dos assets dos inimigos:",
                error
            );
        });
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
        // VERIFICAR GAME OVER
        // ====================================

        if (
            this.player.health <= 0
        ) {

            this.player.health = 0;

            this.game.states.change( "GAMEOVER" );
S
            return;
        }


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
        // ATAQUE DO PLAYER
        // ====================================

        if (
            this.player.isAttacking &&
            this.player.swordHitbox
        ) {

            const sword =
                this.player.swordHitbox;


            for (
                const entity of
                this.entities.entities
            ) {

                // Ignora o Player
                // e entidades inativas

                if (
                    entity === this.player ||
                    !entity.active
                ) {

                    continue;
                }


                // =================================
                // INIMIGO
                // =================================

                if (
                    entity instanceof Enemy
                ) {

                    const enemyRect =
                        entity.transform;


                    // =================================
                    // COLISÃO AABB
                    // =================================

                    const colidiu =

                        sword.x <
                            enemyRect.x +
                            enemyRect.width &&

                        sword.x +
                            sword.width >
                            enemyRect.x &&

                        sword.y <
                            enemyRect.y +
                            enemyRect.height &&

                        sword.y +
                            sword.height >
                            enemyRect.y;


                    if (colidiu) {

                        // Causa dano
                        entity.takeDamage(
                            1,
                            this.player.directionRow
                        );


                        // Remove a hitbox
                        this.player.swordHitbox =
                            null;


                        // Um ataque só acerta
                        // um inimigo
                        break;
                    }
                }
            }
        }


        // ========================================
        // INIMIGOS CAUSANDO DANO NO PLAYER
        // ========================================

        for (
            const entity of
            this.entities.entities
        ) {

            if (
                entity === this.player ||
                !entity.active
            ) {

                continue;
            }


            if (
                entity instanceof Enemy
            ) {

                const enemyRect =
                    entity.transform;


                const playerRect =
                    this.player.transform;


                // =================================
                // COLISÃO AABB
                // =================================

                const encostouNoPlayer =

                    enemyRect.x <
                        playerRect.x +
                        playerRect.width &&

                    enemyRect.x +
                        enemyRect.width >
                        playerRect.x &&

                    enemyRect.y <
                        playerRect.y +
                        playerRect.height &&

                    enemyRect.y +
                        enemyRect.height >
                        playerRect.y;


                if (
                    encostouNoPlayer
                ) {

                    entity.attack(
                        this.player
                    );
                }
            }
        }


        // ========================================
        // VERIFICAR GAME OVER NOVAMENTE
        // ========================================

        if (
            this.player.health <= 0
        ) {

            this.player.health = 0;

            this.game.states.change( "GAMEOVER" );

            return;
        }


        // ========================================
        // VERIFICAR SAÍDA
        // ========================================

        const exit =
            this.world.getExitForEntity(
                this.player
            );


        if (exit) {

            // ====================================
            // VERIFICAR MAPA
            // ====================================

            if (
                !this.game.mapManager.has(
                    exit.target
                )
            ) {

                console.warn(
                    "Mapa de destino não existe:",
                    exit.target
                );
            }


            else {

                // =================================
                // NOVO MAPA
                // =================================

                this.currentMap =
                    exit.target;


                this.world.loadMap(
                    this.currentMap
                );


                // =================================
                // NOVO SPAWN
                // =================================

                const spawn =
                    this.world.getSpawn(
                        exit.spawn
                    );


                this.player.transform.x =
                    spawn.x;


                this.player.transform.y =
                    spawn.y;


                // =================================
                // LIMPAR ENTIDADES ANTIGAS
                // =================================

                this.entities.clear();


                // Adiciona o Player novamente
                this.entities.add(
                    this.player
                );


                // =================================
                // CARREGAR INIMIGOS DO NOVO MAPA
                // =================================

                this.loadEnemies();


                console.log(
                    "Transição de mapa:",
                    this.currentMap,
                    "Spawn:",
                    exit.spawn
                );
            }
        }


        // ========================================
        // CAMERA
        // ========================================

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

        // ========================================
        // FUNDO
        // ========================================

        renderer.fillScreen(
            "#203820"
        );


        // ========================================
        // WORLD
        // ========================================

        this.world.render(
            renderer
        );


        // ========================================
        // ENTIDADES
        // ========================================

        this.game.renderSystem.render(
            renderer,
            this.world,
            this.entities
        );


        // ========================================
        // HITBOX DA ESPADA
        // ========================================

        if (
            this.player.isAttacking &&
            this.player.swordHitbox
        ) {

            renderer.fillRect(

                this.player.swordHitbox.x,

                this.player.swordHitbox.y,

                this.player.swordHitbox.width,

                this.player.swordHitbox.height,

                "rgba(255, 0, 0, 0.4)"
            );
        }


        // ========================================
        // COLLISION DEBUG
        // ========================================

        if (
            this.world.debugCollision
        ) {

            this.world.renderCollision(
                renderer
            );


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


        // ========================================
        // HUD DE CORAÇÕES
        // ========================================

        const ctx =
            renderer.context;


        const coracaoTamanho = 20;

        const espacamento = 8;

        const iniciarX = 20;

        const iniciarY = 20;


        for (
            let i = 0;
            i < this.player.maxHealth;
            i++
        ) {

            const x =
                iniciarX +
                i *
                (
                    coracaoTamanho +
                    espacamento
                );


            // Coração cheio
            if (
                i <
                this.player.health
            ) {

                ctx.fillStyle =
                    "#E43B44";
            }


            // Coração vazio
            else {

                ctx.fillStyle =
                    "#3e3e3e";
            }


            ctx.fillRect(
                x,
                iniciarY,
                coracaoTamanho,
                coracaoTamanho
            );


            // Borda
            ctx.strokeStyle =
                "#000000";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                x,
                iniciarY,
                coracaoTamanho,
                coracaoTamanho
            );
        }
    }
}