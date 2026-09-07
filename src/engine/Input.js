export class Input {

constructor() {

    // ========================================
    // TECLADO
    // ========================================

    this.keysDown =
        new Set();

    this.keysPressed =
        new Set();

    this.keysReleased =
        new Set();


    // ========================================
    // TOUCH
    // ========================================

    this.touchKeys =
        new Set();


    // ========================================
    // JOYSTICK
    // ========================================

    this.joystick =
        null;

    this.joystickKnob =
        null;

    this.joystickPointerId =
        null;


    this.setupTouch();
}


// ========================================
// TOUCH
// ========================================

setupTouch() {

    this.joystick =
        document.getElementById(
            "joystick"
        );

    this.joystickKnob =
        document.getElementById(
            "joystick-knob"
        );


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
                    this.joystickPointerId !==
                    null
                ) {

                    return;
                }


                this.joystickPointerId =
                    event.pointerId;


                this.joystick.setPointerCapture(
                    event.pointerId
                );


                this.updateJoystick(
                    event
                );
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


                this.updateJoystick(
                    event
                );
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

    const buttonA =
        document.getElementById(
            "button-a"
        );


    if (buttonA) {

        buttonA.addEventListener(
            "pointerdown",
            (event) => {

                event.preventDefault();


                // Se já estiver pressionado,
                // não gera outro isPressed.

                if (
                    this.touchKeys.has(
                        "Space"
                    )
                ) {

                    return;
                }


                this.touchKeys.add(
                    "Space"
                );


                this.keysPressed.add(
                    "Space"
                );
            }
        );


        buttonA.addEventListener(
            "pointerup",
            (event) => {

                event.preventDefault();


                this.touchKeys.delete(
                    "Space"
                );


                this.keysReleased.add(
                    "Space"
                );
            }
        );


        buttonA.addEventListener(
            "pointercancel",
            () => {

                this.touchKeys.delete(
                    "Space"
                );


                this.keysReleased.add(
                    "Space"
                );
            }
        );
    }
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
    // DIREÇÃO
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
// FINAL DO FRAME
// ========================================

endFrame() {

    this.keysPressed.clear();

    this.keysReleased.clear();
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