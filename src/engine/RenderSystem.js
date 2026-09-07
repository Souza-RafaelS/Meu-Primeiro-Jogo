export class RenderSystem {

constructor(game) {

    this.game = game;

    this.debug = false;


    // ========================================
    // LAYERS
    // ========================================

    this.layers = {

        ground: 0,

        world: 1,

        effects: 3,

        ui: 4
    };
}


// ========================================
// COLETAR OBJETOS
// ========================================

getRenderables(
    world,
    entityManager
) {

    const renderables = [];


    // ========================================
    // OBJETOS DO MUNDO
    // ========================================

    for (
        const object
        of world.getRenderables()
    ) {

        if (
            object.active === false
        ) {

            continue;
        }


        renderables.push({

            object: object,

            // Objetos participam
            // do mesmo depth do Player

            layer:
                this.layers.world
        });
    }


    // ========================================
    // ENTIDADES
    // ========================================

    for (
        const entity
        of entityManager.entities
    ) {

        if (
            entity.active === false
        ) {

            continue;
        }


        renderables.push({

            object: entity,

            // Player e NPCs participam
            // do mesmo depth dos objetos

            layer:
                this.layers.world
        });
    }


    return renderables;
}


// ========================================
// ORDENAR
// ========================================

sortRenderables(
    renderables
) {

    renderables.sort(
        (a, b) => {

            // ========================================
            // PRIMEIRO: LAYER
            // ========================================

            if (
                a.layer !==
                b.layer
            ) {

                return (
                    a.layer -
                    b.layer
                );
            }


            // ========================================
            // SEGUNDO: PROFUNDIDADE
            // ========================================

            const aObject =
                a.object;


            const bObject =
                b.object;


            const aY =
                this.getDepthY(
                    aObject
                );


            const bY =
                this.getDepthY(
                    bObject
                );


            return aY - bY;
        }
    );


    return renderables;
}


// ========================================
// PEGAR Y DE PROFUNDIDADE
// ========================================

getDepthY(object) {

    // Entidade

    if (
        object.transform
    ) {

        return (
            object.transform.y +
            object.transform.height
        );
    }


    // Objeto do mundo

    if (
        object.getCollisionRect
    ) {

        const rect =
            object.getCollisionRect();


        return (
            rect.y +
            rect.height
        );
    }


    // Fallback

    if (
        object.y !== undefined
    ) {

        return object.y;
    }


    return 0;
}


// ========================================
// RENDER
// ========================================

render(
    renderer,
    world,
    entityManager
) {

    let renderables =
        this.getRenderables(
            world,
            entityManager
        );


    renderables =
        this.sortRenderables(
            renderables
        );


    for (
        const renderable
        of renderables
    ) {

        const object =
            renderable.object;


        if (
            !object.render
        ) {

            continue;
        }


        object.render(
            renderer
        );
    }
}


// ========================================
// ADICIONAR OBJETO À LAYER
// ========================================

addToLayer(
    object,
    layer
) {

    if (
        !this.layers.hasOwnProperty(
            layer
        )
    ) {

        console.warn(
            "Layer não existe:",
            layer
        );

        return;
    }


    object.renderLayer =
        this.layers[layer];
}


// ========================================
// DEBUG
// ========================================

toggleDebug() {

    this.debug =
        !this.debug;


    console.log(
        "Render Debug:",
        this.debug
            ? "ATIVADO"
            : "DESATIVADO"
    );
}


}