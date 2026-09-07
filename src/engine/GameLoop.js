export class GameLoop {

constructor(time) {

    this.time = time;

    this.running = false;

    this.update = null;
    this.render = null;
}


start() {

    if (this.running) {
        return;
    }

    this.running = true;

    requestAnimationFrame((time) => {
        this.frame(time);
    });
}


stop() {

    this.running = false;
}


frame(currentTime) {

    if (!this.running) {
        return;
    }


    this.time.update(currentTime);


    if (this.update) {
        this.update(this.time.delta);
    }


    if (this.render) {
        this.render();
    }


    requestAnimationFrame((time) => {
        this.frame(time);
    });
}


}