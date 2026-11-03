import { KeyboardInput } from "./input/KeyboardInput.js";
import { TouchInput } from "./input/TouchInput.js";
import { GamepadInput } from "./input/GamepadInput.js";

export class Input {

    constructor() {
        // INPUTS
        this.keyboard = new KeyboardInput();
        this.touch = new TouchInput();
        this.gamepad = new GamepadInput();

        // AÇÕES
        this.actionPressed = new Set();
        this.actionReleased = new Set();
        this.actionDown = new Set();

        // INTERAÇÃO / MENU
        this.interactHoldTime = 0;
        this.menuHoldTime = 1.0;

        // CONTROLES
        this.bindings = {
            playerAttack1: ["Space"],
            playerAttack2: ["KeyF"],
            playerRun: ["ShiftLeft", "ShiftRight"],
            inventory: ["KeyI"],
            moveLeft: ["ArrowLeft", "KeyA"],
            moveRight: ["ArrowRight", "KeyD"],
            moveUp: ["ArrowUp", "KeyW"],
            moveDown: ["ArrowDown", "KeyS"],
            confirm: ["Enter"],
            cancel: ["Escape"],
            interact: ["KeyE"],
            menu: ["Escape"]
        };

        this.inputs = [
            this.touch,
            this.gamepad
        ];
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

    isSourceActionDown(action) {
        const keys = this.bindings[action];

        if (!keys) {
            return false;
        }

        return (
            this.inputs.some(input =>
                input.isActionDown(action) ||
                keys.some(key => input.isDown(key))
            ) ||
            keys.some(key => this.keyboard.isDown(key))
        );
    }

    // ========================================
    // ATUALIZAR AÇÕES UNIFICADAS
    // ========================================

    updateActions(delta) {
        this.gamepad.update();

        this.actionPressed.clear();
        this.actionReleased.clear();

        const previousActions = new Set(this.actionDown);
        this.actionDown.clear();

        for (const action of Object.keys(this.bindings)) {
            if (this.isSourceActionDown(action)) {
                this.actionDown.add(action);

                if (!previousActions.has(action) && action !== "interact") {
                    this.actionPressed.add(action);
                }
            } else if (previousActions.has(action)) {
                this.actionReleased.add(action);
            }
        }

        const isInteractDown = this.actionDown.has("interact");

        if (isInteractDown) {
            if (this.interactHoldTime !== -1) {
                this.interactHoldTime += delta;

                if (this.interactHoldTime >= this.menuHoldTime) {
                    this.actionPressed.add("menu");
                    this.interactHoldTime = -1;
                }
            }
        } else {
            if (this.interactHoldTime > 0) {
                this.actionPressed.add("interact");
            }

            this.interactHoldTime = 0;
        }
    }


    // ========================================
    // FINAL DO FRAME
    // ========================================

    endFrame() {
        this.keyboard.endFrame();
        this.touch.endFrame();
        this.gamepad.endFrame();

        this.actionPressed.clear();
        this.actionReleased.clear();
    }


    // ========================================
    // MÉTODOS UTILITÁRIOS DE HARDWARE
    isDown(key) {

        return (
            this.keyboard.isDown(key) 
            || this.inputs.some(input => 
                input.isDown(key)
            )
        );
    }
    isPressed(key) { return this.keyboard.isPressed(key); }
    isReleased(key) { return this.keyboard.isReleased(key); }
}
