export class Camera {

constructor(width = 800, height = 450) {

    this.x = 0;
    this.y = 0;

    this.width = width;
    this.height = height;

    // ========================================
    // CONFIGURAÇÃO
    // ========================================

    this.zoom = 1;

    this.followSpeed = 8;
}


// ========================================
// FOLLOW
// ========================================

follow(
    entity,
    world,
    delta = 1 / 60
) {

    const visibleWidth =
        this.width / this.zoom;


    const visibleHeight =
        this.height / this.zoom;


    const targetX =
        entity.transform.x +
        entity.transform.width / 2 -
        visibleWidth / 2;


    const targetY =
        entity.transform.y +
        entity.transform.height / 2 -
        visibleHeight / 2;


    // ====================================
    // MOVIMENTO SUAVE
    // ====================================

    const smoothing =
        1 -
        Math.exp(
            -this.followSpeed *
            delta
        );


    this.x +=
        (targetX - this.x) *
        smoothing;


    this.y +=
        (targetY - this.y) *
        smoothing;


    // ====================================
    // LIMITES
    // ====================================

    this.clamp(
        world
    );


    // ====================================
    // PIXEL PERFECT
    // ====================================

    this.x =
        Math.round(
            this.x
        );

    this.y =
        Math.round(
            this.y
        );
}


// ========================================
// CLAMP
// ========================================

clamp(world) {

    const visibleWidth =
        this.width /
        this.zoom;


    const visibleHeight =
        this.height /
        this.zoom;


    // ====================================
    // MAPA MENOR QUE A ÁREA VISÍVEL
    // ====================================

    if (
        world.width <=
        visibleWidth
    ) {

        this.x =
            (
                world.width -
                visibleWidth
            ) / 2;
    }


    else {

        if (
            this.x < 0
        ) {

            this.x = 0;
        }


        if (
            this.x +
            visibleWidth >
            world.width
        ) {

            this.x =
                world.width -
                visibleWidth;
        }
    }


    if (
        world.height <=
        visibleHeight
    ) {

        this.y =
            (
                world.height -
                visibleHeight
            ) / 2;
    }


    else {

        if (
            this.y < 0
        ) {

            this.y = 0;
        }


        if (
            this.y +
            visibleHeight >
            world.height
        ) {

            this.y =
                world.height -
                visibleHeight;
        }
    }
}


// ========================================
// ZOOM
// ========================================

setZoom(zoom) {

    if (
        typeof zoom !== "number" ||
        zoom <= 0
    ) {

        console.warn(
            "Zoom inválido:",
            zoom
        );

        return;
    }


    this.zoom =
        zoom;
}


}