export class TouchInput {

    constructor() {

        this.touchKeys = new Set();
        this.actionPressed = new Set();
        this.actionReleased = new Set();
        this.actionDown = new Set();

        this.joystick = document.getElementById("joystick");
        this.joystickKnob = document.getElementById("joystick-knob");
        this.pointerId = null;
        this.setup();

    }

    setup() {
        if (!this.joystick || !this.joystickKnob) {
            return;
        }

        this.joystick.addEventListener(
            "pointerdown",
            (event) => {

                event.preventDefault();

                if (this.pointerId !== null) {
                    return;
                }

                this.pointerId = event.pointerId;

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
                    event.pointerId !== this.pointerId
                ) {
                    return;
                }

                this.updateJoystick(event);

            }
        );

        this.joystick.addEventListener(
            "pointerup",
            (event) => {

                if (
                    event.pointerId !== this.pointerId
                ) {
                    return;
                }

                this.release();

            }
        );

        this.joystick.addEventListener(
            "pointercancel",
            (event) => {

                if (
                    event.pointerId !== this.pointerId
                ) {
                    return;
                }

                this.release();

            }
        );
        this.setupButtons();
    }
    setupButtons() {

        this.bindActionButton("button-a", ["playerAttack1", "confirm"]);
        this.bindActionButton("button-b", "playerRun");
        this.bindActionButton("button-x", "playerAttack2");
        this.bindActionButton("button-y", "inventory");
    }

    bindActionButton(buttonId, action) {
        const button = document.getElementById(buttonId);
        const actions = Array.isArray(action) ? action : [action];

        if (!button) {
            return;
        }

        button.addEventListener("pointerdown", (event) => {
            event.preventDefault();

            if (actions.every(name => this.actionDown.has(name))) {
                return;
            }

            button.setPointerCapture(event.pointerId);
            for (const name of actions) {
                if (!this.actionDown.has(name)) {
                    this.actionPressed.add(name);
                    this.actionDown.add(name);
                }
            }
        });

        const releaseAction = (event) => {
            event.preventDefault();

            for (const name of actions) {
                if (this.actionDown.delete(name)) {
                    this.actionReleased.add(name);
                }
            }
        };

        button.addEventListener("pointerup", releaseAction);
        button.addEventListener("pointercancel", releaseAction);
    }

    updateJoystick(event) {
        const rect = this.joystick.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = event.clientX - centerX;
        let dy = event.clientY - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = rect.width / 2 - this.joystickKnob.offsetWidth / 2;

        // OTIMIZAÇÃO: Calcula o ângulo apenas UMA vez aqui no topo
        const angle = Math.atan2(dy, dx);

        // ========================================
        // LIMITAR PINO
        // ========================================
        if (distance > maxDistance) {
            dx = Math.cos(angle) * maxDistance;
            dy = Math.sin(angle) * maxDistance;
        }

        // ========================================
        // PINO (ATUALIZAÇÃO VISUAL)
        // ========================================
        this.joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;

        // ========================================
        // LIMPAR DIREÇÕES ANTERIORES DO JOYSTICK
        // ========================================
        const directionalKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        for (const key of directionalKeys) {
            this.touchKeys.delete(key);
            // Opcional: Se quiser espelhar no teclado para o jogo aceitar os dois juntos automaticamente
            //this.keysDown.delete(key); 
        }

        // ========================================
        // ZONA MORTA
        // ========================================
        const deadZone = maxDistance * 0.25;
        if (distance < deadZone) {
            return; // Sai sem injetar nenhuma direção
        }

        // Converte o ângulo original para graus (-180 a 180)
        const degrees = angle * 180 / Math.PI;

        // ========================================
        // PROCESSAR AS 8 DIREÇÕES (GRAUS)
        // ========================================
        
        // DIREÇÃO HORIZONTAL
        if (degrees >= -67.5 && degrees <= 67.5) {
            this.touchKeys.add("ArrowRight");
        } else if (degrees >= 112.5 || degrees <= -112.5) {
            this.touchKeys.add("ArrowLeft");
        }

        // DIREÇÃO VERTICAL
        if (degrees >= 22.5 && degrees <= 157.5) {
            this.touchKeys.add("ArrowDown");
        } else if (degrees <= -22.5 && degrees >= -157.5) {
            this.touchKeys.add("ArrowUp");
        }
    }
    release() {
        // Libera o ID do ponteiro para novos toques
        this.pointerId = null;

        // Lista de chaves direcionais para limpeza em lote
        const directionalKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

        for (const key of directionalKeys) {

            // Limpa dos buffers ativos
            this.touchKeys.delete(key);
        }

        // Reseta visualmente a posição do pino para o centro do analógico
        if (this.joystickKnob) {
            this.joystickKnob.style.transform = "translate(0px, 0px)";
        }
    }
    isDown(key) {
        return this.touchKeys.has(key);
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

    endFrame(){
        this.actionPressed.clear();
        this.actionReleased.clear();
    }
}