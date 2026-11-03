export class KeyboardInput {

    constructor() {

        this.keysDown = new Set();
        this.keysPressed = new Set();
        this.keysReleased = new Set();

        this.setup();

    }

    setup() {

        window.addEventListener("keydown", (event) => {

            const key = event.code;

            if (!this.keysDown.has(key)) {
                this.keysDown.add(key);
                this.keysPressed.add(key);
            }

        });

        window.addEventListener("keyup", (event) => {

            const key = event.code;

            this.keysDown.delete(key);
            this.keysReleased.add(key);

        });

    }

    isDown(key) {
        return this.keysDown.has(key);
    }

    isPressed(key) {
        return this.keysPressed.has(key);
    }

    isReleased(key) {
        return this.keysReleased.has(key);
    }

    endFrame() {

        this.keysPressed.clear();
        this.keysReleased.clear();

    }

}