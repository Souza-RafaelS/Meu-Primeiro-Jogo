export class Combat {
    constructor(entity, options = {}) {
        this.entity = entity;

        // ========================================
        // VIDA
        // ========================================
        this.maxHealth = options.maxHealth ?? 10;
        this.health = this.maxHealth;

        // ========================================
        // CONFIGURAÇÕES DE ATRIBUTOS
        // ========================================
        this.attackDamage = options.attackDamage ?? 1;
        this.attackRange = options.attackRange ?? 24;
        this.attackHitboxSize = options.attackHitboxSize ?? 32;
        this.blinkDuration = options.blinkDuration ?? 0.2;
        this.invincibleDuration = options.invincibleDuration ?? 0.8;

        // ========================================
        // SISTEMA DE COMBO (MÁQUINA DE ESTADOS)
        // ========================================
        this.isAttacking = false;
        this.attackTimer = 0;
        this.swordHitbox = null;

        // Gerenciamento do Combo
        this.currentComboStep = 0;       // Passo atual: 0 (parado), 1, 2, 3...
        this.maxComboSteps = 3;          // Limite máximo de golpes seguidos
        this.comboResetTimer = 0;        // Tempo limite para apertar o próximo botão
        this.comboResetWindow = 0.5;     // Janela de 0.5 segundos para continuar o combo
        this.lastAttackType = null;      // Guarda se foi "attack1" ou "attack2"

        // Configuração de propriedades por variação do golpe
        this.currentAttackDuration = 0.2;
        this.currentAttackMultiplier = 1.0;

        // ========================================
        // TIMERS DE DANO RECEBIDO
        // ========================================
        this.blinkTimer = 0;
        this.invincibleTimer = 0;
    }

    // ========================================
    // UPDATE
    // ========================================
    update(delta) {
        // Atualiza relógios de dano e invencibilidade
        if (this.blinkTimer > 0) this.blinkTimer -= delta;
        if (this.invincibleTimer > 0) this.invincibleTimer -= delta;

        // Atualiza a janela de tempo para continuar o combo
        if (!this.isAttacking && this.currentComboStep > 0) {
            this.comboResetTimer -= delta;
            if (this.comboResetTimer <= 0) {
                this.resetCombo(); // Tempo esgotou, combo quebrou
            }
        }

        // Ataque ativo consumindo tempo
        if (this.isAttacking) {
            this.attackTimer -= delta;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
                this.swordHitbox = null;
                
                // Se chegou no final do combo máximo, reseta imediatamente
                if (this.currentComboStep >= this.maxComboSteps) {
                    this.resetCombo();
                } else {
                    // Dá uma pequena janela de tempo após o término do golpe atual para o próximo input
                    this.comboResetTimer = this.comboResetWindow;
                }
            }
            return true; // Mantém o Player travado no movimento
        }

        return false;
    }

    // ========================================
    // PROCESSAR TENTATIVA DE ATAQUE
    // ========================================
    attack(type) {
        // Impede novos inputs se o golpe atual ainda estiver no meio do corte físico
        if (this.isAttacking) return false;

        // Avança o passo do combo
        this.currentComboStep++;
        this.lastAttackType = type;
        this.isAttacking = true;

        // Define propriedades dinâmicas com base no combo e tipo de ataque
        this.configureAttackProperties(type);
        
        // Gera a hitbox matemática no espaço do mapa
        this.createHitbox();
        return true;
    }

    // ========================================
    // CONFIGURAR PROPRIEDADES DINÂMICAS DO GOLPE
    // ========================================
    configureAttackProperties(type) {
        // Exemplo de Balanço de Gameplay:
        if (type === "attack1") {
            // Ataques rápidos, menor dano
            this.currentAttackDuration = 0.18; 
            this.currentAttackMultiplier = 1.0;
        } else if (type === "attack2") {
            // Ataques pesados, mais lentos, maior dano
            this.currentAttackDuration = 0.28; 
            this.currentAttackMultiplier = 1.5; // Dá 50% a mais de dano
        }

        // Golpe finalizador do combo (Passo 3) é sempre devastador
        if (this.currentComboStep === 3) {
            this.currentAttackMultiplier *= 2.0; // Dobra o dano atual
            this.currentAttackDuration += 0.1;   // Adiciona mais peso visual (lentidão)
            console.log("💥 GOLPE FINALIZADOR ATIVADO!");
        }

        this.attackTimer = this.currentAttackDuration;
        console.log(`Combo: ${this.currentComboStep}/3 | Tipo: ${type} | Multiplicador Dano: x${this.currentAttackMultiplier}`);
    }

    // ========================================
    // RESETAR COMBO
    // ========================================
    resetCombo() {
        this.currentComboStep = 0;
        this.comboResetTimer = 0;
        this.lastAttackType = null;
        this.currentAttackMultiplier = 1.0;
    }

    // ========================================
    // CRIAR HITBOX
    // ========================================
    createHitbox() {
        const entity = this.entity;
        
        // Aumenta levemente o alcance da hitbox se for o Ataque Pesado (Ataque 2)
        const bonusRange = this.lastAttackType === "attack2" ? 12 : 0;
        const range = this.attackRange + bonusRange;
        const size = this.attackHitboxSize;

        let hX = entity.transform.x;
        let hY = entity.transform.y;
        let hW = size;
        let hH = size;

        const directionRow = entity.directionRow ?? 0;
        switch (directionRow) {
            case 0: // BAIXO
                hX = entity.transform.x + (entity.transform.width - size) / 2;
                hY = entity.transform.y + entity.transform.height;
                hW = size;
                hH = range;
                break;
            case 1: // ESQUERDA
                hX = entity.transform.x - range;
                hY = entity.transform.y + (entity.transform.height - size) / 2;
                hW = range;
                hH = size;
                break;
            case 2: // CIMA
                hX = entity.transform.x + (entity.transform.width - size) / 2;
                hY = entity.transform.y - range;
                hW = size;
                hH = range;
                break;
            case 3: // DIREITA
                hX = entity.transform.x + entity.transform.width;
                hY = entity.transform.y + (entity.transform.height - size) / 2;
                hW = range;
                hH = size;
                break;
        }

        this.swordHitbox = { x: hX, y: hY, width: hW, height: hH };
    }

    // ========================================
    // RECEBER DANO E OUTROS MÉTODOS NATIVOS
    // ========================================
    takeDamage(amount) {
        if (this.invincibleTimer > 0) return false;
        this.health -= amount;
        this.blinkTimer = this.blinkDuration;
        this.invincibleTimer = this.invincibleDuration;
        
        console.log(`${this.entity.constructor.name} levou dano! Vida atual: ${this.health}`);
      //  if (this.health 0; }
    //isInvincible() { return this.invincibleTimer > 0; }
   /* resetHealth() {
        this.health = this.maxHealth;
        this.blinkTimer = 0;
        this.invincibleTimer = 0;
        this.resetCombo();
    }*/
    }
}
