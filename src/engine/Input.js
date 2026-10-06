export class Input {

    constructor() {

        // ========================================
        // TECLADO
        // ========================================

        this.keysDown = new Set();
        this.keysPressed = new Set();
        this.keysReleased = new Set();


        // ========================================
        // TOUCH
        // ========================================

        this.touchKeys = new Set();

        this.actionPressed = new Set();
        this.actionReleased = new Set();
        this.actionDown = new Set();

        this.interactHoldTime = 0;
        this.menuHoldTime = 1.0;


        // ========================================
        // JOYSTICK
        // ========================================

        this.joystick = null;
        this.joystickKnob = null;
        this.joystickPointerId = null;


        // ========================================
        // CONFIGURAÇÃO
        // ========================================

        this.setupTouch();
        this.setupKeyboard();


        // ========================================
        // CONTROLES
        // ========================================

        this.bindings = {

            // A
            attack1: ["KeyJ"],

            // B
            attack2: ["KeyK"],

            // X
            run: [
                "ShiftLeft",
                "ShiftRight"
            ],

            // Y
            interact: ["KeyE"],

            // MENU
            menu: ["Escape"]
        };
    }


    // ========================================
    // TOUCH CONFIGURAÇÃO
    // ========================================

    setupTouch() {

        this.joystick =
            document.getElementById("joystick");

        this.joystickKnob =
            document.getElementById("joystick-knob");


        // ========================================
        // JOYSTICK
        // ========================================

        if (
            this.joystick &&
            this.joystickKnob
        ) {

            this.joystick.addEventListener(
                "pointerdown",
                (event) => {

                    event.preventDefault();

                    if (
                        this.joystickPointerId !== null
                    ) {
                        return;
                    }

                    this.joystickPointerId =
                        event.pointerId;

                    this.joystick.setPointerCapture(
                        event.pointerId
                    );

                    this.updateJoystick(event);
                }
            );


            this.joystick.addEventListener(
                "pointermove",
                (event) => {

                    if (
                        event.pointerId !==
                        this.joystickPointerId
                    ) {
                        return;
                    }

                    event.preventDefault();

                    this.updateJoystick(event);
                }
            );


            this.joystick.addEventListener(
                "pointerup",
                (event) => {

                    if (
                        event.pointerId !==
                        this.joystickPointerId
                    ) {
                        return;
                    }

                    this.releaseJoystick();
                }
            );


            this.joystick.addEventListener(
                "pointercancel",
                (event) => {

                    if (
                        event.pointerId !==
                        this.joystickPointerId
                    ) {
                        return;
                    }

                    this.releaseJoystick();
                }
            );


            this.joystick.addEventListener(
                "lostpointercapture",
                () => {

                    this.releaseJoystick();
                }
            );
        }


        // ========================================
        // BOTÃO A = SPACE
        // ========================================

        const buttonA = document.getElementById("button-a");
        const buttonB = document.getElementById("button-b");
        const buttonX = document.getElementById("button-x");
        const buttonY = document.getElementById("button-y");

        if (buttonA) { buttonA.addEventListener( "pointerdown",
                (event) => {
                    event.preventDefault();
                    // Se já estiver pressionado,
                    // não gera outro isPressed.
                    if ( this.touchKeys.has("Space")) {return;}
                        this.touchKeys.add("Space");
                        this.keysPressed.add("Space");
                        console.log( "[TOUCH] Botão A → Space" );
                }
            );


            buttonA.addEventListener(
                "pointerup",
                (event) => {

                    event.preventDefault();

                    this.touchKeys.delete("Space");

                    this.keysReleased.add("Space");

                    console.log(
                        "[TOUCH] Botão A liberado"
                    );
                }
            );


            buttonA.addEventListener(
                "pointercancel",
                () => {

                    this.touchKeys.delete("Space");

                    this.keysReleased.add("Space");

                    console.log(
                        "[TOUCH] Botão A cancelado"
                    );
                }
            );
        }
        if (buttonB) { buttonB.addEventListener( "pointerdown",
                (event) => {
                    event.preventDefault();
                    // Se já estiver pressionado,
                    // não gera outro isPressed.
                    if ( this.touchKeys.has("J")) {return;}
                        this.touchKeys.add("J");
                        this.keysPressed.add("J");
                        console.log( "[TOUCH] Botão B → J" );
                }
            );


            buttonB.addEventListener(
                "pointerup",
                (event) => {

                    event.preventDefault();

                    this.touchKeys.delete("J");

                    this.keysReleased.add("J");

                    console.log(
                        "[TOUCH] Botão B liberado"
                    );
                }
            );


            buttonB.addEventListener(
                "pointercancel",
                () => {

                    this.touchKeys.delete("J");

                    this.keysReleased.add("J");

                    console.log(
                        "[TOUCH] Botão B cancelado"
                    );
                }
            );
        }
    }


    // ========================================
    // TECLADO CONFIGURAÇÃO
    // ========================================

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            (event) => {

                const key = event.code;


                // ========================================
                // DEBUG DO TECLADO
                // ========================================

                console.log(
                    "[TECLADO]",
                    "key:",
                    event.key,
                    "| code:",
                    event.code
                );


                // ========================================
                // IMPEDIR REPETIÇÃO
                // ========================================

                if (!this.keysDown.has(key)) {

                    this.keysDown.add(key);

                    this.keysPressed.add(key);

                    console.log(
                        "[INPUT] Pressionado:",
                        key
                    );
                }


                // ========================================
                // EVITAR COMPORTAMENTO DO NAVEGADOR
                // ========================================

                if (
                    key === "ArrowUp" ||
                    key === "ArrowDown" ||
                    key === "ArrowLeft" ||
                    key === "ArrowRight" ||
                    key === "Space"
                ) {

                    event.preventDefault();
                }
            }
        );


        // ========================================
        // KEYUP
        // ========================================

        window.addEventListener(
            "keyup",
            (event) => {

                const key = event.code;

                this.keysDown.delete(key);

                this.keysReleased.add(key);


                console.log(
                    "[INPUT] Liberado:",
                    key
                );
            }
        );


        // ========================================
        // PERDEU O FOCO
        // ========================================

        window.addEventListener(
            "blur",
            () => {

                this.keysDown.clear();

                console.log(
                    "[INPUT] Janela perdeu o foco. Teclas limpas."
                );
            }
        );
    }


    // ========================================
    // JOYSTICK
    // ========================================

    updateJoystick(event) {

        const rect =
            this.joystick.getBoundingClientRect();


        const centerX =
            rect.left +
            rect.width / 2;


        const centerY =
            rect.top +
            rect.height / 2;


        let dx =
            event.clientX -
            centerX;


        let dy =
            event.clientY -
            centerY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const maxDistance =
            rect.width / 2 -
            this.joystickKnob.offsetWidth / 2;


        // ========================================
        // LIMITAR PINO
        // ========================================

        if (
            distance >
            maxDistance
        ) {

            const angle =
                Math.atan2(
                    dy,
                    dx
                );


            dx =
                Math.cos(angle) *
                maxDistance;


            dy =
                Math.sin(angle) *
                maxDistance;
        }


        // ========================================
        // PINO
        // ========================================

        this.joystickKnob.style.transform =
            `translate(${dx}px, ${dy}px)`;


        // ========================================
        // LIMPAR DIREÇÃO
        // ========================================

        this.touchKeys.delete(
            "ArrowUp"
        );

        this.touchKeys.delete(
            "ArrowDown"
        );

        this.touchKeys.delete(
            "ArrowLeft"
        );

        this.touchKeys.delete(
            "ArrowRight"
        );


        // ========================================
        // ZONA MORTA
        // ========================================

        const deadZone =
            maxDistance * 0.25;


        if (
            distance <
            deadZone
        ) {
            return;
        }


        const angle =
            Math.atan2(
                dy,
                dx
            );


        const degrees =
            angle *
            180 /
            Math.PI;


        // ========================================
        // DIREÇÃO HORIZONTAL
        // ========================================

        if (
            degrees >= -67.5 &&
            degrees <= 67.5
        ) {

            this.touchKeys.add(
                "ArrowRight"
            );
        }

        else if (
            degrees >= 112.5 ||
            degrees <= -112.5
        ) {

            this.touchKeys.add(
                "ArrowLeft"
            );
        }


        // ========================================
        // DIREÇÃO VERTICAL
        // ========================================

        if (
            degrees >= 22.5 &&
            degrees <= 157.5
        ) {

            this.touchKeys.add(
                "ArrowDown"
            );
        }

        else if (
            degrees <= -22.5 &&
            degrees >= -157.5
        ) {

            this.touchKeys.add(
                "ArrowUp"
            );
        }
    }


    // ========================================
    // SOLTAR JOYSTICK
    // ========================================

    releaseJoystick() {

        this.joystickPointerId =
            null;


        this.touchKeys.delete(
            "ArrowUp"
        );

        this.touchKeys.delete(
            "ArrowDown"
        );

        this.touchKeys.delete(
            "ArrowLeft"
        );

        this.touchKeys.delete(
            "ArrowRight"
        );


        if (
            this.joystickKnob
        ) {

            this.joystickKnob.style.transform =
                "translate(0px, 0px)";
        }
    }


    // ========================================
    // AÇÕES
    // ========================================

    isActionDown(action) {

        const keys =
            this.bindings[action];


        if (!keys) {
            return false;
        }


        return keys.some(
            key => this.isDown(key)
        );
    }


    isActionPressed(action) {

        return this.actionPressed.has(
            action
        );
    }


    isActionReleased(action) {

        return this.actionReleased.has(
            action
        );
    }


    // ========================================
    // ATUALIZAR AÇÕES
    // ========================================

    updateActions(delta) {


        // ========================================
        // ATAQUE 1
        // A = J
        // ========================================

        if (
            this.isPressed("KeyJ")
        ) {

            this.actionPressed.add(
                "attack1"
            );

            console.log(
                "[AÇÃO] attack1"
            );
        }


        // ========================================
        // ATAQUE 2
        // B = K
        // ========================================

        if (
            this.isPressed("KeyK")
        ) {

            this.actionPressed.add(
                "attack2"
            );

            console.log(
                "[AÇÃO] attack2"
            );
        }


        // ========================================
        // CORRIDA
        // X = SHIFT
        // ========================================

        if (
            this.isDown("ShiftLeft") ||
            this.isDown("ShiftRight")
        ) {

            this.actionDown.add(
                "run"
            );

            console.log(
                "[AÇÃO] run"
            );
        }


        // ========================================
        // INTERAÇÃO
        // Y = E
        // ========================================

        const interactDown =
            this.isDown("KeyE") ||
            this.touchKeys.has("Interact");


        if (interactDown) {

            this.interactHoldTime += delta;


            // ========================================
            // SEGURAR Y POR 1 SEGUNDO
            // ABRE MENU
            // ========================================

            if (
                this.interactHoldTime >=
                this.menuHoldTime
            ) {

                this.actionPressed.add(
                    "menu"
                );

                console.log(
                    "[AÇÃO] menu"
                );

                this.interactHoldTime = 0;
            }
        }

        else {

            // ========================================
            // TOQUE CURTO = INTERACT
            // ========================================

            if (
                this.interactHoldTime > 0 &&
                this.interactHoldTime <
                this.menuHoldTime
            ) {

                this.actionPressed.add(
                    "interact"
                );

                console.log(
                    "[AÇÃO] interact"
                );
            }


            this.interactHoldTime = 0;
        }
    }


    // ========================================
    // FINAL DO FRAME
    // ========================================

    endFrame() {

        this.keysPressed.clear();

        this.keysReleased.clear();

        this.actionPressed.clear();

        this.actionReleased.clear();

        this.actionDown.clear();
    }


    // ========================================
    // IS DOWN
    // ========================================

    isDown(key) {

        return (
            this.keysDown.has(key) ||
            this.touchKeys.has(key)
        );
    }


    // ========================================
    // IS PRESSED
    // ========================================

    isPressed(key) {

        return this.keysPressed.has(
            key
        );
    }


    // ========================================
    // IS RELEASED
    // ========================================

    isReleased(key) {

        return this.keysReleased.has(
            key
        );
    }
}