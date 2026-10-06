export class GameOverState {

    constructor(game) {

        this.game = game;
    }


    // ========================================
    // ENTER
    // ========================================

    enter() {
        console.log( "GAME OVER" );
    }

    // ========================================
    // EXIT
    // ========================================

    exit() {

        console.log( "SAINDO DO GAME OVER" );
    }
    // ========================================
    // UPDATE
    // ========================================

    update(delta) {

        // ENTER
        // volta para o menu

        if (
            this.game.input.isPressed(
                "Space"
            )
        ) {

            this.game.states.change(
                "MENU"
            );
        }
    }


    // ========================================
    // RENDER
    // ========================================

    render(renderer) {

        const ctx =
            renderer.context;


        // ====================================
        // FUNDO ESCURO
        // ====================================

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.75)";


        ctx.fillRect(
            0,
            0,
            renderer.width,
            renderer.height
        );


        // ====================================
        // GAME OVER
        // ====================================

        renderer.drawText(

            "GAME OVER",
            renderer.width / 2,
            renderer.height / 2 - 20,
            "#E43B44",
            "bold 40px Arial",
        );


        // ====================================
        // INSTRUÇÃO
        // ====================================

        renderer.drawText(

            "Pressione ENTER para voltar ao Menu",
            renderer.width / 2,
            renderer.height / 2 + 30,
            "#ffffff",
            "16px Arial",
            "center"
        );
    }
}
