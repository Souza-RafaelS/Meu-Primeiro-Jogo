export class GamepadInput {

    constructor() {

        this.gamepadIndex = null;

        this.keysDown = new Set();
        this.keysPressed = new Set();
        this.keysReleased = new Set();

        this.setup();

        this.actionDown = new Set();
        this.actionPressed = new Set();
        this.actionReleased = new Set();    

    }

    setup() {

        window.addEventListener(
            "gamepadconnected",
            (event) => {

                this.gamepadIndex =
                    event.gamepad.index;

                console.log(
                    "[GAMEPAD] Conectado:",
                    event.gamepad.id
                );

            }
        );

        window.addEventListener(
            "gamepaddisconnected",
            (event) => {

                if (
                    this.gamepadIndex === event.gamepad.index
                ) {
                    this.gamepadIndex = null;
                }

                console.log(
                    "[GAMEPAD] Desconectado:",
                    event.gamepad.id
                );

            }
        );

    }

    update() {

        if (this.gamepadIndex === null) {
            return;
        }

        const gamepad = navigator.getGamepads()[
            this.gamepadIndex
        ];

        if (!gamepad) {
            return;
        }

        this.keysDown.clear();

        const deadZone = 0.35;

        const x = gamepad.axes[0];
        const y = gamepad.axes[1];

        if (x > deadZone) {
            this.keysDown.add("ArrowRight");
        }
        if (x < -deadZone) {
            this.keysDown.add("ArrowLeft");
        }
        if (y > deadZone) {
            this.keysDown.add("ArrowDown");
        }
        if (y < -deadZone) {
            this.keysDown.add("ArrowUp");
        }

        const buttonA = gamepad.buttons[0];

        if (buttonA.pressed) {

            //console.log("A pressionado");

            if (!this.actionDown.has("playerAttack1")) {

                this.actionPressed.add("playerAttack1");

                this.actionDown.add("playerAttack1");
            }
        } else {

            if(this.actionDown.has("playerAttack1")) {

                this.actionDown.delete("playerAttack1");
                this.actionReleased.add("playerAttack1")
            }
        }




    }

    isDown(key) {
        return this.keysDown.has(key);
    }

    isActionDown(action) {
        return this.actionDown.has(action);
    }

    isActionPressed(action) {
        return this.actionPressed.has(action);
    }

    isActionReleased(action) {
        return this.actionReleased.has(action);
    }

    endFrame() {

        this.actionPressed.clear();
        this.actionReleased.clear();

    }
}