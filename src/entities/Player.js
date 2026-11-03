import { Entity } from "./Entity.js";
import { Vector2 } from "../engine/Vector2.js";
import { Combat } from "../game/Combat.js";
import { Inventory } from "../game/inventory/Inventory.js";

export class Player extends Entity {
    constructor(game, x = 100, y = 100) {
        super(game, x, y, 32, 32);

        // TRANSFORMAÇÃO FÍSICA (Necessária para o Combat.js e colisões)
        //this.transform = { x: x, y: y, width: 32, height: 32 };

        // MOVIMENTO (Aumentado de 0 para 120 para o personagem andar)
        this.speed = 100;
        this.direction = new Vector2();
        this.isMoving = false;
        this.isRunning = false;

        // SPRITE
        this.image = new Image();
        this.image.src = "./assets/sprites/heroi0A.png";
        this.imageLoaded = false;
        this.image.onload = () => { this.imageLoaded = true; };
        this.image.onerror = () => { console.error("Erro ao carregar o sprite do Player:", this.image.src); };

        // SPRITESHEET
        this.frameWidth = 16;
        this.frameHeight = 20;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;

        // ANIMAÇÃO
        this.animationTimer = 0;
        this.animationSpeed = 0.12;

        // DIREÇÃO   (0 = baixo, 1 = esquerda, 2 = cima, 3 = direita)
        this.directionRow = 0;

        // COMBATE
        this.combat = new Combat(this, {
                    // vida
                    maxHealth: game.config.player.maxHealth,
                    // Ataque
                    attackDamage: game.config.player.attackDamage,
                    attackRange: 24,
                    attackHitboxSize: 32,
                    attackDuration: 0.2,
                    // Dano
                    blinkDuration: 0.2,
                    invincibleDuration: 0.8
                });
        //INVENTARIO
        this.inventory = new Inventory();
        
        this.inventory.addItem("potion", 5);

        this.game.player = this;
    }

    // ========================================
    // UPDATE
    // ========================================
    update(delta) {
        const input = this.game.input;

        // COMBATE(Atualiza os timers internos)
        const combatLocker = this.combat.update(delta);

        // GERENCIAMENTO DE ATAQUES E COMBOS
        if (!combatLocker) {
            // SE APERTAR O BOTÃO DE ATAQUE 1 (Ex: Botão Esquerdo ou Tecla X)
            if (input.isActionPressed("playerAttack1")) {
                this.combat.attack("attack1");
                this.clearMovementState();
                return;
            }
            // SE APERTAR O BOTÃO DE ATAQUE 2 (Ex: Botão Direito ou Tecla C)
            else if (input.isActionPressed("playerAttack2")) {
                this.combat.attack("attack2");
                this.clearMovementState();
                return;
            }
        } else {
            this.clearMovementState();
            return;
        }
          
        // ========================================
        // INPUT DE MOVIMENTO
        this.direction.set(0, 0);
        if (input.isActionDown("moveLeft"))  this.direction.x -= 1;
        if (input.isActionDown("moveRight")) this.direction.x += 1;
        if (input.isActionDown("moveUp"))    this.direction.y -= 1;
        if (input.isActionDown("moveDown"))  this.direction.y += 1;

        // ========================================
        // NORMALIZAR E VERIFICAR ESTADO
        this.direction.normalize();
        this.isMoving = this.direction.x !== 0 || this.direction.y !== 0;
       
        // ========================================
        // CORRER
        this.isRunning = input.isActionDown("playerRun") && this.isMoving;
        const speedMultiplier = this.isRunning ? 1.6 : 1.0;
        this.animationSpeed = this.isRunning ? 0.07 : 0.12;
        //console.log("Está correndo?", this.isRunning);

        // ========================================
        // DIREÇÃO DO LOOK-AT
        if (this.direction.x < 0) {
            this.directionRow = 1; // ESQUERDA
        } else if (this.direction.x > 0) {
            this.directionRow = 3; // DIREITA
        } else if (this.direction.y < 0) {
            this.directionRow = 2; // CIMA
        } else if (this.direction.y > 0) {
            this.directionRow = 0; // BAIXO
        }

        this.frameY = this.directionRow;

        // ========================================
        // ANIMAÇÃO DE ANDAR
        if (this.isMoving) {
            this.animationTimer += delta;

            if (this.animationTimer >= this.animationSpeed) {
                this.animationTimer = 0;
                this.frame++;

                if (this.frame >= 4) {
                    this.frame = 0;
                }
            }
        } else {
            this.frame = 0;
            this.animationTimer = 0;
        }

        this.frameX = this.frame;

        // ========================================
        // VELOCIDADE E MOVIMENTO FÍSICO
        const centerX = this.transform.x + this.transform.width / 2;
        const centerY = this.transform.y + this.transform.height / 2;

        const terrainSpeed = this.game.world.getMovementSpeed(centerX, centerY);
        const currentSpeed = this.speed * terrainSpeed * speedMultiplier;

        const movementX = this.direction.x * currentSpeed * delta;
        const movementY = this.direction.y * currentSpeed * delta;
        
        // Atualiza a posição física antes de mover na colisão
        this.game.world.collision.moveEntity(this, movementX, movementY);
    }

    // ========================================
    // RENDER
    render(renderer) {
        if (!this.imageLoaded) {
            renderer.fillRect(this.transform.x, this.transform.y, this.transform.width, this.transform.height, "red");
            return;
        }

        const spriteWidth = 32;
        const spriteHeight = 40;

        //const spriteX = this.transform.x + (this.transform.width - spriteWidth) / 2;
        //const spriteY = this.transform.y + this.transform.height - spriteHeight;

        const sourceX = this.frameX * this.frameWidth;
        const sourceY = this.frameY * this.frameHeight;

        const tintColor = this.combat.blinkTimer > 0 ? "#FF0000" : null;

            // Dentro do render(renderer) do Player:
        const posX = this.transform ? this.transform.x : this.x;
        const posY = this.transform ? this.transform.y : this.y;
        const width = this.transform ? this.transform.width : this.width;
        const height = this.transform ? this.transform.height : this.height;

        const spriteX = posX + (width - spriteWidth) / 2;
        const spriteY = posY + height - spriteHeight;


        renderer.drawImageFrame(
            this.image,
            sourceX,
            sourceY,
            this.frameWidth,
            this.frameHeight,
            spriteX,
            spriteY,
            spriteWidth,
            spriteHeight,
            tintColor 
        );
        // ========================================
        // DEBBUG: DESENHAR HITBOX DA ESPADA NA TELA
        // ========================================
        if (this.combat.swordHitbox) {
            const hitbox = this.combat.swordHitbox;
            
            // Define a cor base dependendo do tipo de ataque
            // Ataque 2 (Pesado) fica Azul, Ataque 1 fica Vermelho
            const hitboxColor = this.combat.lastAttackType === "attack2" 
                ? "rgba(0, 150, 255, 0.4)" 
                : "rgba(255, 0, 0, 0.4)";

            // Desenha o preenchimento da hitbox
            renderer.fillRect(
                hitbox.x, 
                hitbox.y, 
                hitbox.width, 
                hitbox.height, 
                hitboxColor
            );
        }
    }


    takeDamage(amount) {
        return this.combat.takeDamage(amount);

    }

    // Método auxiliar que você pode criar ou rodar no Player para limpar redundâncias:
    clearMovementState() {
        this.direction.set(0, 0);
        this.isMoving = false;
        this.frame = 0;
        this.frameX = this.frame;
    }
    
}
