export class Time {
    constructor() {
        this.delta = 0;
        this.elapsed = 0;

        this._lastTime = 0;
    }
update(currentTime){
    if (this._lastTime === 0){
        this._lastTime = currentTime;
        return;
    }
    this.delta = (currentTime - this._lastTime)/ 1000;
    this._lastTime = currentTime;

    this.elapsed += this.delta;
    }
}