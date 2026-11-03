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
            interact: ["KeyE"],
            menu: ["Escape"]
        };

        this.inputs = [
            this.touch,
            this.gamepad
        ];
    }

    isActionDown(action) {

        const keys = this.bindings[action];

        if (!keys) {
            return false;
        }

        const isDeviceAction =
            this.inputs.some(input =>
                input.isActionDown(action)
            );

        if (isDeviceAction) {
            return true;
        }

        return keys.some(key =>
            this.isDown(key)
        );

    }

    isActionPressed(action) {

        const keys = this.bindings[action];

        const isDeviceAction =
            this.inputs.some(input =>
                input.isActionPressed(action)
            );

        if (isDeviceAction) {
            return true;
        }

        if (!keys) {
            return false;
        }

        return keys.some(key =>
            this.isPressed(key)
        );

    }

    isActionReleased(action) {

        const keys = this.bindings[action];

        const isDeviceAction =
            this.inputs.some(input =>
                input.isActionReleased(action)
            );

        if (isDeviceAction) {
            return true;
        }

        if (!keys) {
            return false;
        }

        return keys.some(key =>
            this.isReleased(key)
        );

    }


    // ========================================
    // ATUALIZAR AÇÕES EVOLUTIVAS (TEMPO / COMBINAÇÕES)
    // ========================================

    updateActions(delta) {

        this.gamepad.update();
        // Nota: Ataques e Corrida foram removidos daqui porque agora 
        // as funções isActionPressed/Down acima já os resolvem DINAMICAMENTE usando os bindings!
        // Não há necessidade de encher o Set a cada frame via código rígido.

        // ========================================
        // LOGICA DE SEGURAR INTERAÇÃO / MENU
        // ========================================
        
        // Verifica dinamicamente se a ação "interact" está sendo segurada (via teclado ou touchKeys)
        const isInteractDown = this.isActionDown("interact");

        if (isInteractDown) {
            // Só acumula o tempo se o menu ainda não foi disparado nesta pressão de botão
            if (this.interactHoldTime !== -1) {
                this.interactHoldTime += delta;

                // SEGURAR POR 1 SEGUNDO (OU O TEMPO CONFIGURADO) -> ABRE MENU
                if (this.interactHoldTime >= this.menuHoldTime) {
                    this.actionPressed.add("menu");
                    //console.log("[AÇÃO] menu");
                    
                    // Trava o contador em -1 para não ficar disparando "menu" em loop a cada frame
                    this.interactHoldTime = -1; 
                }
            }
        } else {
            // TOQUE CURTO E SOLTOU -> DISPARA INTERACT
            // Se saiu do holdTime positivo mas não chegou a travar no menu (-1)
            if (this.interactHoldTime > 0) {
                this.actionPressed.add("interact");
                //console.log("[AÇÃO] interact");
            }

            // Reseta o cronômetro completamente ao soltar o botão
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
       
        // Não precisamos mais limpar actionDown aqui porque o estado contínuo 
        // agora flui direto através do Set keysDown de hardware!
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
