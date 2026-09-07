import { Transform } from "../engine/Transform.js";
import { Collider } from "../engine/Collider.js";

export class Entity {

constructor(
    game,
    x = 0,
    y = 0,
    width = 32,
    height = 32
) {

    this.game = game;


    // ========================================
    // TRANSFORM
    // ========================================

    this.transform =
        new Transform(
            x,
            y,
            width,
            height
        );


    // ========================================
    // COLLIDER
    // ========================================

    this.collider =
        new Collider(
            8,
            16,
            16,
            12
        );


    this.active = true;
}


update(delta) {

}


render(renderer) {

}


}