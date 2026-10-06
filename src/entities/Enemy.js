import { Entity } from "./Entity.js";
import { Vector2 } from "../engine/Vector2.js";

export class Enemy extends Entity {
    constructor(game, x, y, enemyData) {
        const width = enemyData.drawWidth || enemyData.frameWidth || 32;
        const height = enemyData.drawHeight || enemyData.frameHeight || 32;
        super(game, x, y, width, height);

        this.active = true;
        this.name = enemyData.name || "Inimigo";
        this.speed = enemyData.speed || 80;
        this.direction = new Vector2();

        // ========================================
        // ATRIBUTOS DE COMBATE
        // ========================================
        this.health = enemyData.health || 3;
        this.damage = enemyData.damage || 1;
        this.detectionRadius = enemyData.detectionRadius || 150;
        this.attackRadius = enemyData.attackRadius || 24;
        
        this.attackCooldown = enemyData.attackCooldown || 1.0;
        this.attackTimer = 0;

        // ========================================
        // SPRITESHEET & ANIMAÇÃO
        // ========================================
        this.frameWidth = enemyData.frameWidth || 16;   
        this.frameHeight = enemyData.frameHeight || 16;  
        this.frameCount = enemyData.frameCount || 4; 
        
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;

        this.animationTimer = 0;
        this.animationSpeed = enemyData.animationSpeed || 0.15; 
        this.isMoving = false;
        this.directionRow = 0; 

        // ========================================
        // CARREGAMENTO DO SPRITE DINÂMICO
        // ========================================
        this.imageLoaded = false;
        this.image = new Image();
        this.image.src = enemyData.sprite; 
        
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        
        this.image.onerror = () => {
            console.error(`Erro ao carregar o sprite do inimigo (${this.name}):`, this.image.src);
        };

        // Atributos de Knockback
        this.knockbackDirection = new Vector2();
        this.knockbackSpeed = 300;     
        this.knockbackDuration = 0.15; 
        this.knockbackTimer = 0;       

        // Atributos de Efeito Visual (Piscar ao levar dano)
        this.blinkTimer = 0;
        this.blinkDuration = 0.15; 
    }

    update(delta) {
        if (this.attackTimer > 0) this.attackTimer -= delta;
        if (this.blinkTimer > 0) this.blinkTimer -= delta;

        // ========================================
        // PROCESSAR RECUO (KNOCKBACK)
        // ========================================
        if (this.knockbackTimer > 0) {
            this.knockbackTimer -= delta;

            const kx = this.knockbackDirection.x * this.knockbackSpeed * delta;
            const ky = this.knockbackDirection.y * this.knockbackSpeed * delta;

            if (kx !== 0 || ky !== 0) {
                this.game.world.collision.moveEntity(this, kx, ky);
            }
            return; 
        }

        // CORREÇÃO DE ACESSO: Busca o player diretamente no estado ativo de gameplay
        const player = this.game.states.currentState?.player || this.game.player; 
        if (!player) return;

        // Centros das caixas para cálculo limpo de proximidade
        const myCenterX = this.transform.x + this.transform.width / 2;
        const myCenterY = this.transform.y + this.transform.height / 2;
        const playerCenterX = player.transform.x + player.transform.width / 2;
        const playerCenterY = player.transform.y + player.transform.height / 2;
        
        // Distância Euclidiana nativa (Mais estável e performática)
        const distance = Math.hypot(playerCenterX - myCenterX, playerCenterY - myCenterY);

        this.direction.set(0, 0);

        // Inteligência Artificial
        if (distance <= this.attackRadius) {
            this.attack(player);
        } 
        else if (distance <= this.detectionRadius) {
            this.direction.x = playerCenterX - myCenterX;
            this.direction.y = playerCenterY - myCenterY;
            this.direction.normalize();
        }

        // ========================================
        // DIREÇÃO DO SPRITE
        // ========================================
        this.isMoving = this.direction.x !== 0 || this.direction.y !== 0;

        if (this.isMoving) {
            if (Math.abs(this.direction.x) > Math.abs(this.direction.y)) {
                this.directionRow = this.direction.x < 0 ? 1 : 3; 
            } else {
                this.directionRow = this.direction.y < 0 ? 2 : 0; 
            }
        }
        this.frameY = this.directionRow;

        // ========================================
        // ANIMAÇÃO DOS FRAMES
        // ========================================
        if (this.isMoving) {
            this.animationTimer += delta;
            if (this.animationTimer >= this.animationSpeed) {
                this.animationTimer = 0;
                this.frame++;
                if (this.frame >= this.frameCount) this.frame = 0;
            }
        } else {
            this.frame = 0;
            this.animationTimer = 0;
        }
        this.frameX = this.frame;

        // ========================================
        // MOVIMENTAÇÃO FÍSICA E COLISÃO
        // ========================================
        const movementX = this.direction.x * this.speed * delta;
        const movementY = this.direction.y * this.speed * delta;

        if (movementX !== 0 || movementY !== 0) {
            this.game.world.collision.moveEntity(this, movementX, movementY);
        }
    }

    attack(player) {
        if (this.attackTimer <= 0) {
            player.takeDamage(this.damage); 
            this.attackTimer = this.attackCooldown;
        }
    }
    
    takeDamage(amount, attackerDirectionRow) {
        this.health -= amount;
        console.log(`${this.name} recebeu ${amount} de dano! Vida restante: ${this.health}`);

        if (this.health <= 0) {
            this.active = false;
            console.log(`${this.name} foi derrotado!`);
            return; 
        }

        this.blinkTimer = this.blinkDuration;
        this.knockbackTimer = this.knockbackDuration; 
        this.knockbackDirection.set(0, 0);

        switch (attackerDirectionRow) {
            case 0: this.knockbackDirection.y = 1;  break;
            case 1: this.knockbackDirection.x = -1; break;
            case 2: this.knockbackDirection.y = -1; break;
            case 3: this.knockbackDirection.x = 1;  break;
        }
    }

    render(renderer) {
        if (!this.imageLoaded) {
            renderer.fillRect(
                this.transform.x,
                this.transform.y,
                this.transform.width,
                this.transform.height,
                "green"
            );
            return;
        }

        const sourceX = this.frameX * this.frameWidth;
        const sourceY = this.frameY * this.frameHeight;
        const tintColor = this.blinkTimer > 0 ? "#FF0000" : null;

        renderer.drawImageFrame(
            this.image,
            sourceX,
            sourceY,
            this.frameWidth,
            this.frameHeight,
            this.transform.x,
            this.transform.y,
            this.transform.width,
            this.transform.height,
            tintColor
        );
    }
}
