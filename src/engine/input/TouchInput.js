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

        // BOTÕES DE AÇÃO
    const buttonA = document.getElementById("button-a");
    const buttonB = document.getElementById("button-b");

    if (buttonA) { 
        buttonA.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            // PROTEÇÃO: Só dispara a ação se ela já não estiver ativa
            if (this.actionDown.has("playerAttack1")) return; 
            
            this.actionPressed.add("playerAttack1");
            console.log(this.actionPressed)

            this.actionDown.add("playerAttack1");
            //console.log("[TOUCH] Botão A → playerAttack1");
        });

        buttonA.addEventListener("pointerup", (event) => {
            event.preventDefault();
            this.actionDown.delete("playerAttack1");
            this.actionReleased.add("playerAttack1");
            //console.log("[TOUCH] Botão A liberado");
        });

        buttonA.addEventListener("pointercancel", () => {
            this.actionDown.delete("playerAttack1");
            this.actionReleased.add("playerAttack1");
            //console.log("[TOUCH] Botão A cancelado");
        });
    }

    if (buttonB) { 
        buttonB.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            // PROTEÇÃO: Seguindo o mesmo padrão do Botão A usando ações mapeadas
            if (this.actionDown.has("playerRun")) return;

            this.actionPressed.add("playerRun");
            this.actionDown.add("playerRun")
            //console.log("[TOUCH] Botão B → playerRun");
        });

        buttonB.addEventListener("pointerup", (event) => {
            event.preventDefault();
            this.actionDown.delete("playerRun");
            this.actionReleased.add("playerRun")
            //console.log("[TOUCH] Botão B liberado");
        });

        buttonB.addEventListener("pointercancel", () => {
            this.actionDown.delete("playerRun");
            this.actionReleased.add("playerRun")
            //console.log("[TOUCH] Botão B cancelado");
        });
    }
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