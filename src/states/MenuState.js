export class MenuState {

    constructor(game) {

        this.game = game;
        this.blinkTimer = 0;
        this.blinkAlpha = 1;
        this.blinkDirection = -1;
    }


    enter() {

        console.log("ENTROU NO MENU");
    }


    exit() {

        console.log("SAIU DO MENU");
    }


    update(delta) {

        //console.log(delta);

        if (this.game.input.isPressed("Space")) {

            this.game.states.change("JOGO");
        }


        this.blinkAlpha +=
            this.blinkDirection * delta;


        if (this.blinkAlpha <= 0) {

            this.blinkAlpha = 0;
            this.blinkDirection = 1;
        }


        if (this.blinkAlpha >= 1) {

            this.blinkAlpha = 1;
            this.blinkDirection = -1;
        }
    }



    render(renderer) {

        renderer.fillScreen("#202040");

        renderer.drawText(
            "MEU PRIMEIRO GAME",
            renderer.width / 2,
            200,
            "#d6b15a",
            "bold 32px Courier New"
            
        );

        renderer.drawText(
            "JOGAR",
            renderer.width / 2,
            250,
            "#ffffff",
            "24px Arial"
        );

        renderer.drawText(
            "PRESSIONE BOTÃO A (SPACE)",
            renderer.width / 2,
            300,
            "#aaaaaa",
            "16px Arial",
            "center",
            this.blinkAlpha
        );
        
    }
}
