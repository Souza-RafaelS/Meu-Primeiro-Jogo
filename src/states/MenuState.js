export class MenuState {

    constructor(game) {

        this.game = game;
    }


    enter() {

        console.log("ENTROU NO MENU");
    }


    exit() {

        console.log("SAIU DO MENU");
    }


    update(delta) {

        if (this.game.input.isPressed("Space")) {

            this.game.states.change("JOGO");
        }
    }


    render(renderer) {

        renderer.fillRect(
            0,
            0,
            renderer.width,
            renderer.height,
            "#202040"
        );
    }
}
