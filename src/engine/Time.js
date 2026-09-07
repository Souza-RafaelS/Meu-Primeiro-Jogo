export class Time {
    constructor() {
        this.delta = 0;
        this.elapsed = 0;
        this._lastTime = 0;

        this.fps = 0;
        this._frameCount = 0;
        this._fpsTimer = 0;

        this._wasHidden = false;

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this._wasHidden = true;
            }
        });
    }

    update(currentTime) {
        // Primeira atualização
        if (this._lastTime === 0) {
            this._lastTime = currentTime;
            return;
        }

        // Se voltou de outra aba, ignora o tempo que passou
        if (this._wasHidden) {
            this._lastTime = currentTime;
            this.delta = 0;
            this._wasHidden = false;
            return;
        }

        this.delta = (currentTime - this._lastTime) / 1000;

        this._lastTime = currentTime;
        this.elapsed += this.delta;

        // FPS
        this._frameCount++;
        this._fpsTimer += this.delta;

        if (this._fpsTimer >= 1) {
            this.fps = this._frameCount;

            console.log(`FPS: ${this.fps}`);

            this._frameCount = 0;
            this._fpsTimer = 0;
        }
    }
}
