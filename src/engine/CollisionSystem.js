export class CollisionSystem {

constructor(world) {

    this.world = world;

    this.debug = false;
    this.debugLog = false;
}


// ========================================
// RETÂNGULO DE COLISÃO DA ENTIDADE
// ========================================

getEntityRect(entity) {

    if (
        !entity.collider ||
        !entity.collider.enabled
    ) {

        return {

            x: entity.transform.x,
            y: entity.transform.y,

            width: entity.transform.width,
            height: entity.transform.height
        };
    }


    return entity.collider.getRect(
        entity
    );
}


// ========================================
// VERIFICAR COLISÃO COM TILE
// ========================================

isTileBlocked(
    x,
    y,
    width,
    height
) {

    const tileSize =
        this.world.tileSize;


    const left =
        Math.floor(
            x / tileSize
        );


    const right =
        Math.floor(
            (x + width - 1) /
            tileSize
        );


    const top =
        Math.floor(
            y / tileSize
        );


    const bottom =
        Math.floor(
            (y + height - 1) /
            tileSize
        );


    for (
        let tileY = top;
        tileY <= bottom;
        tileY++
    ) {

        for (
            let tileX = left;
            tileX <= right;
            tileX++
        ) {

            if (
                this.world.tileMap.isSolid(
                    tileX,
                    tileY
                )
            ) {

                if (this.debugLog) {

                    console.log(
                        "COLISÃO COM TILE:",
                        tileX,
                        tileY
                    );
                }


                return true;
            }
        }
    }


    return false;
}


// ========================================
// VERIFICAR COLISÃO COM OBJETOS
// ========================================

isObjectBlocked(
    x,
    y,
    width,
    height
) {

    for (
        const object
        of this.world.objects
    ) {

        if (!object.solid) {

            continue;
        }


        const collision =
            object.getCollisionRect();


        if (
            x <
                collision.x +
                collision.width &&

            x + width >
                collision.x &&

            y <
                collision.y +
                collision.height &&

            y + height >
                collision.y
        ) {

            if (this.debugLog) {

                console.log(
                    "COLISÃO COM OBJETO:",
                    object.type
                );
            }


            return true;
        }
    }


    return false;
}


// ========================================
// COLISÃO GERAL
// ========================================

isBlocked(
    x,
    y,
    width,
    height
) {

    if (
        this.isTileBlocked(
            x,
            y,
            width,
            height
        )
    ) {

        return true;
    }


    if (
        this.isObjectBlocked(
            x,
            y,
            width,
            height
        )
    ) {

        return true;
    }


    return false;
}


// ========================================
// MOVER ENTIDADE
// ========================================

moveEntity(
    entity,
    deltaX,
    deltaY
) {

    const transform =
        entity.transform;


    // ========================================
    // HORIZONTAL
    // ========================================

    if (deltaX !== 0) {

        const collider =
            this.getEntityRect(entity);


        const nextX =
            collider.x +
            deltaX;


        if (
            !this.isBlocked(
                nextX,
                collider.y,
                collider.width,
                collider.height
            )
        ) {

            transform.x += deltaX;
        }
    }


    // ========================================
    // VERTICAL
    // ========================================

    if (deltaY !== 0) {

        const collider =
            this.getEntityRect(entity);


        const nextY =
            collider.y +
            deltaY;


        if (
            !this.isBlocked(
                collider.x,
                nextY,
                collider.width,
                collider.height
            )
        ) {

            transform.y += deltaY;
        }
    }
}
// ========================================
// DEBUG
// ========================================

toggleDebug() {

    this.debug =
        !this.debug;


    console.log(
        "Collision Debug:",
        this.debug
            ? "ATIVADO"
            : "DESATIVADO"
    );
}


toggleLog() {

    this.debugLog =
        !this.debugLog;


    console.log(
        "Collision Log:",
        this.debugLog
            ? "ATIVADO"
            : "DESATIVADO"
    );
}

// ========================================
// RENDERIZAR COLLIDERS
// ========================================

renderDebug(renderer, entities) {

    if (!this.debug) {

        return;
    }


    for (const entity of entities) {

        if (!entity.active) {

            continue;
        }


        if (
            !entity.collider ||
            !entity.collider.enabled
        ) {

            continue;
        }


        const rect =
            entity.collider.getRect(
                entity
            );


        renderer.fillRect(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            "rgba(0, 0, 0, 0.65)"
        );
    }
}

}