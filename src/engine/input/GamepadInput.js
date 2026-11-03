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
                    this.keysDown.clear();

                    for (const action of this.actionDown) {
                        this.actionReleased.add(action);
                    }

                    this.actionDown.clear();
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
            this.keysDown.clear();

            for (const action of this.actionDown) {
                this.actionReleased.add(action);
            }

            this.actionDown.clear();
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

        this.updateAction("playerAttack1", gamepad.buttons[0]?.pressed);
        this.updateAction("confirm", gamepad.buttons[0]?.pressed);
        this.updateAction("playerRun", gamepad.buttons[1]?.pressed);
        this.updateAction("playerAttack2", gamepad.buttons[2]?.pressed);
        this.updateAction("inventory", gamepad.buttons[3]?.pressed);
    }

    updateAction(action, isPressed = false) {
        if (isPressed && !this.actionDown.has(action)) {
            this.actionDown.add(action);
            this.actionPressed.add(action);
        } else if (!isPressed && this.actionDown.delete(action)) {
            this.actionReleased.add(action);
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