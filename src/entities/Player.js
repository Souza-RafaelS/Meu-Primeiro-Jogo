import { Entity } from "./Entity.js";
import { Vector2 } from "../engine/Vector2.js";

export class Player extends Entity {
    constructor(game, x = 100, y = 100) {
        super(game, x, y, 32, 32);

        // ========================================
        // MOVIMENTO
        // ========================================
        this.speed = 200;
        this.direction = new Vector2();

        // ========================================
        // SPRITE
        // ========================================
        this.image = new Image();
        this.image.src = "./assets/sprites/heroi0A.png";
        this.imageLoaded = false;

        this.image.onload = () => {
            this.imageLoaded = true;
        };

        this.image.onerror = () => {
            console.error("Erro ao carregar o sprite do Player:", this.image.src);
        };

        // SPRITESHEET
        this.frameWidth = 16;
        this.frameHeight = 20;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;

        // ANIMAÇÃO
        this.animationTimer = 0;
        this.animationSpeed = 0.12;
        this.isMoving = false;

        // DIREÇÃO INICIAL
        // 0 = baixo, 1 = esquerda, 2 = cima, 3 = direita
        this.directionRow = 0;

        // ATAQUE DO PLAYER
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackDuration = 0.2; // O ataque dura 0.2 segundos
        this.swordHitbox = null;   // Área do corte da espada

        // Atributos de Vida e Combate
        this.maxHealth = 3;  // Equivale a 3 corações
        this.health = 3;

        // Controle de Dano recebido
        this.blinkTimer = 0;
        this.blinkDuration = 0.2;
        this.invincibleTimer = 0;
        this.invincibleDuration = 0.8; // 800ms de imunidade após levar um golpe

    }

    // ========================================
    // UPDATE
    // ========================================
    update(delta) {
        const input = this.game.input;
        
        // Atualiza os relógios de dano e invencibilidade
        if (this.blinkTimer > 0) this.blinkTimer -= delta;
        if (this.invincibleTimer > 0) this.invincibleTimer -= delta;

        // 1. GERENCIAR ESTADO DE GOLPE ATIVO (CORRIGIDO: Colocado no início)
        if (this.isAttacking) {
            this.attackTimer -= delta;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
                this.swordHitbox = null; 
            }
            
            this.direction.set(0, 0);
            this.isMoving = false;
            this.frame = 0; 
            this.frameX = this.frame;
            return; // Bloqueia novos movimentos até o golpe terminar
        }

        // 2. DISPARAR ATAQUE AO PRESSIONAR "X"
        // Adicionado fallback para "KeyX" caso seu InputHandler capture por código
        if (input.isDown("j") || input.isDown("J") || input.isDown("KeyJ")|| input.isDown("attack1")) {
            this.isAttacking = true;
            this.attackTimer = this.attackDuration;
            this.createSwordHitbox();
            return;
        }

        this.direction.set(0, 0);

        // ========================================
        // INPUT DE MOVIMENTO
        // ========================================
        if (input.isDown("ArrowLeft"))  this.direction.x -= 1;
        if (input.isDown("ArrowRight")) this.direction.x += 1;
        if (input.isDown("ArrowUp"))    this.direction.y -= 1;
        if (input.isDown("ArrowDown"))  this.direction.y += 1;

        // ========================================
        // NORMALIZAR
        // ========================================
        this.direction.normalize();

        // ========================================
        // ESTADO
        // ========================================
        this.isMoving = this.direction.x !== 0 || this.direction.y !== 0;

        // ========================================
        // DIREÇÃO DO LOOK-AT
        // ========================================
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
        // ========================================
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
        // ========================================
        const centerX = this.transform.x + this.transform.width / 2;
        const centerY = this.transform.y + this.transform.height / 2;

        const terrainSpeed = this.game.world.getMovementSpeed(centerX, centerY);
        const currentSpeed = this.speed * terrainSpeed;

        const movementX = this.direction.x * currentSpeed * delta;
        const movementY = this.direction.y * currentSpeed * delta;

        this.game.world.collision.moveEntity(this, movementX, movementY);
    }

    // ========================================
    // RENDER
    // ========================================
    render(renderer) {
        if (!this.imageLoaded) {
            renderer.fillRect(this.transform.x, this.transform.y, this.transform.width, this.transform.height, "red");
            return;
        }

        const spriteWidth = 32;
        const spriteHeight = 40;

        const spriteX = this.transform.x + (this.transform.width - spriteWidth) / 2;
        const spriteY = this.transform.y + this.transform.height - spriteHeight;

        const sourceX = this.frameX * this.frameWidth;
        const sourceY = this.frameY * this.frameHeight;

        const tintColor = this.blinkTimer > 0 ? "#FF0000" : null;

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
    }

    // ========================================
    // CRIAR HITBOX DA ESPADA (CORRIGIDO INTEGRALMENTE)
    // ========================================
    createSwordHitbox() {
        const range = 24; // Alcance do golpe
        const size = 32;  // Espessura do corte

        let hX = this.transform.x;
        let hY = this.transform.y;
        let hW = size;
        let hH = size;

        switch (this.directionRow) {
            case 0: // GOLPE PARA BAIXO
                hX = this.transform.x + (this.transform.width - size) / 2;
                hY = this.transform.y + this.transform.height;
                hW = size;
                hH = range;
                break;
            case 1: // GOLPE PARA A ESQUERDA
                hX = this.transform.x - range;
                hY = this.transform.y + (this.transform.height - size) / 2;
                hW = range;
                hH = size;
                break;
            case 2: // GOLPE PARA CIMA
                hX = this.transform.x + (this.transform.width - size) / 2;
                hY = this.transform.y - range;
                hW = size;
                hH = range;
                break;
            case 3: // GOLPE PARA A DIREITA
                hX = this.transform.x + this.transform.width;
                hY = this.transform.y + (this.transform.height - size) / 2;
                hW = range;
                hH = size;
                break;
        }

        this.swordHitbox = { x: hX, y: hY, width: hW, height: hH };
    }
    takeDamage(amount) {
        // Se o jogador estiver no tempo de imunidade, ignora o dano
        if (this.invincibleTimer > 0) return;

        this.health -= amount;
        this.blinkTimer = this.blinkDuration;
        this.invincibleTimer = this.invincibleDuration;

        console.log(`Player levou dano! Vida atual: ${this.health}`);

        if (this.health <= 0) {
            this.health = 0;
            console.log("GAME OVER! O Player morreu.");
            // Futuramente você pode mudar o estado do jogo para uma tela de Game Over aqui
        }
    }
}
