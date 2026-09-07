import { Time } from "./Time.js";
import { Input } from "./Input.js";
import { Renderer } from "./Renderer.js";
import { RenderSystem } from "./RenderSystem.js";
import { Camera } from "./Camera.js";
import { StateMachine } from "./StateMachine.js";
import { GameLoop } from "./GameLoop.js";
import { MapManager } from "../maps/MapManager.js";
import { GameConfig } from "./GameConfig.js";


import { MenuState } from "../states/MenuState.js";
import { GameState } from "../states/GameState.js";

export class Game {

constructor(canvas) {

    this.canvas = canvas;

    this.time = new Time();

    this.input = new Input();

    this.renderer = new Renderer(canvas);

    this.renderSystem = new RenderSystem(this);

    this.mapManager = new MapManager();
    
    this.config = GameConfig;


    this.camera = new Camera(
        this.renderer.width,
        this.renderer.height
    );

    this.camera.setZoom(
        this.config.camera.zoom
    );

    this.camera.followSpeed =
        this.config.camera.followSpeed;

    this.renderer.setCamera(this.camera);


    this.states = new StateMachine();


    this.states.add(
        "MENU",
        new MenuState(this)
    );

    this.states.add(
        "JOGO",
        new GameState(this)
    );

    this.states.change("MENU");


    this.loop = new GameLoop(
        this.time
    );


    this.loop.update = (delta) => {

        this.update(delta);
    };


    this.loop.render = () => {

        this.render();
    };
}


start() {

    this.loop.start();
}


update(delta) {

    this.states.update(delta);

    this.input.endFrame();
}


render() {

    this.renderer.clear();

    this.states.render(this.renderer);
}


}