import { Entity } from "./Entity.js";
import { Vector2 } from "../engine/Vector2.js";

export class Player extends Entity {

constructor(game, x = 100, y = 100) {

    super(
        game,
        x,
        y,
        32,
        32
    );


    // ========================================
    // MOVIMENTO
    // ========================================

    this.speed = 200;

    this.direction =
        new Vector2();


    // ========================================
    // SPRITE
    // ========================================

    this.image =
        new Image();

    this.image.src =
        "./assets/sprites/heroi0A.png";

    this.imageLoaded =
        false;


    this.image.onload = () => {

        this.imageLoaded =
            true;
    };


    this.image.onerror = () => {

        console.error(
            "Erro ao carregar o sprite do Player:",
            this.image.src
        );
    };


    // ========================================
    // SPRITESHEET
    // ========================================

    this.frameWidth = 16;

    this.frameHeight = 20;

    this.frame = 0;

    this.frameX = 0;

    this.frameY = 0;


    // ========================================
    // ANIMAÇÃO
    // ========================================

    this.animationTimer = 0;

    this.animationSpeed = 0.12;

    this.isMoving = false;


    // ========================================
    // DIREÇÃO INICIAL
    // ========================================

    // 0 = baixo
    // 1 = esquerda
    // 2 = cima
    // 3 = direita

    this.directionRow = 0;
}


// ========================================
// UPDATE
// ========================================

update(delta) {

    const input =
        this.game.input;


    this.direction.set(
        0,
        0
    );


    // ========================================
    // INPUT
    // ========================================

    if (
        input.isDown("ArrowLeft")
    ) {

        this.direction.x -= 1;
    }


    if (
        input.isDown("ArrowRight")
    ) {

        this.direction.x += 1;
    }


    if (
        input.isDown("ArrowUp")
    ) {

        this.direction.y -= 1;
    }


    if (
        input.isDown("ArrowDown")
    ) {

        this.direction.y += 1;
    }


    // ========================================
    // NORMALIZAR
    // ========================================

    this.direction.normalize();


    // ========================================
    // ESTADO
    // ========================================

    this.isMoving =
        this.direction.x !== 0 ||
        this.direction.y !== 0;


    // ========================================
    // DIREÇÃO
    // ========================================

    if (
        this.direction.x < 0
    ) {

        // ESQUERDA

        this.directionRow = 1;
    }

    else if (
        this.direction.x > 0
    ) {

        // DIREITA

        this.directionRow = 3;
    }

    else if (
        this.direction.y < 0
    ) {

        // CIMA

        this.directionRow = 2;
    }

    else if (
        this.direction.y > 0
    ) {

        // BAIXO

        this.directionRow = 0;
    }


    this.frameY =
        this.directionRow;


    // ========================================
    // ANIMAÇÃO
    // ========================================

    if (
        this.isMoving
    ) {

        this.animationTimer +=
            delta;


        if (
            this.animationTimer >=
            this.animationSpeed
        ) {

            this.animationTimer = 0;

            this.frame++;


            if (
                this.frame >= 4
            ) {

                this.frame = 0;
            }
        }
    }

    else {

        this.frame = 0;

        this.animationTimer = 0;
    }


    this.frameX =
        this.frame;


    // ========================================
    // CENTRO DO PLAYER
    // ========================================

    const centerX =
        this.transform.x +
        this.transform.width / 2;


    const centerY =
        this.transform.y +
        this.transform.height / 2;


    // ========================================
    // VELOCIDADE DO TERRENO
    // ========================================

    const terrainSpeed =
        this.game.world.getMovementSpeed(
            centerX,
            centerY
        );


    const currentSpeed =
        this.speed *
        terrainSpeed;


    // ========================================
    // MOVIMENTO
    // ========================================

    const movementX =
        this.direction.x *
        currentSpeed *
        delta;


    const movementY =
        this.direction.y *
        currentSpeed *
        delta;


    this.game.world.collision.moveEntity(
        this,
        movementX,
        movementY
    );
}


// ========================================
// RENDER
// ========================================

render(renderer) {

    if (
        !this.imageLoaded
    ) {

        renderer.fillRect(
            this.transform.x,
            this.transform.y,
            this.transform.width,
            this.transform.height,
            "red"
        );

        return;
    }


    // ========================================
    // TAMANHO DO SPRITE
    // ========================================

    const spriteWidth =
        32;

    const spriteHeight =
        40;


    // ========================================
    // POSIÇÃO
    // ========================================

    // Centraliza o sprite
    // horizontalmente na área física.

    const spriteX =
        this.transform.x +
        (
            this.transform.width -
            spriteWidth
        ) / 2;


    // O ponto Y representa
    // os pés do personagem.

    const spriteY =
        this.transform.y +
        this.transform.height -
        spriteHeight;


    // ========================================
    // FRAME
    // ========================================

    const sourceX =
        this.frameX *
        this.frameWidth;


    const sourceY =
        this.frameY *
        this.frameHeight;


    // ========================================
    // DESENHAR
    // ========================================

    renderer.drawImageFrame(

        this.image,

        sourceX,
        sourceY,

        this.frameWidth,
        this.frameHeight,

        spriteX,
        spriteY,

        spriteWidth,
        spriteHeight
    );


    }
}