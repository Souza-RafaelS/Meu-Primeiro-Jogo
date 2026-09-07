import { ObjectTypes } from "./ObjectTypes.js";

export class WorldObject {

constructor(
    type,
    x,
    y,
    width = 32,
    height = 32
) {

    this.type = type;

    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;


    // ========================================
    // DEFINIÇÃO DO OBJETO
    // ========================================

    this.definition =
        this.getDefinition();


    this.solid =
        this.definition.solid;


    // ========================================
    // HITBOX
    // ========================================

    const collision =
        this.definition.collision;


    this.collision = {

        x: collision.x,

        y: collision.y,

        width: collision.width,

        height: collision.height
    };
}


// ========================================
// DEFINIÇÃO
// ========================================

getDefinition() {

    for (const key in ObjectTypes) {

        const definition =
            ObjectTypes[key];


        if (
            definition.id === this.type
        ) {

            return definition;
        }
    }


    return {

        solid: false,

        collision: {

            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
    };
}


// ========================================
// POSIÇÃO DA HITBOX NO MUNDO
// ========================================

getCollisionRect() {

    return {

        x:
            this.x +
            this.collision.x,

        y:
            this.y +
            this.collision.y,

        width:
            this.collision.width,

        height:
            this.collision.height
    };
}


// ========================================
// UPDATE
// ========================================

update(delta) {

}


// ========================================
// RENDER
// ========================================

render(renderer) {

    // ========================================
    // ÁRVORE
    // ========================================

    if (this.type === "tree") {

        renderer.fillRect(
            this.x + 12,
            this.y + 16,
            8,
            16,
            "#6b3e26"
        );


        renderer.fillRect(
            this.x + 4,
            this.y + 4,
            24,
            20,
            "#236b32"
        );
    }


    // ========================================
    // PEDRA
    // ========================================

    if (this.type === "rock") {

        renderer.fillRect(
            this.x + 4,
            this.y + 8,
            24,
            16,
            "#777777"
        );
    }


    // ========================================
    // BAÚ
    // ========================================

    if (this.type === "chest") {

        renderer.fillRect(
            this.x + 4,
            this.y + 8,
            24,
            20,
            "#8b5a2b"
        );
    }
}


}