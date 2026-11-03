import { Time } from "./Time.js";
import { Input } from "./Input.js";
import { Renderer } from "./Renderer.js";
import { RenderSystem } from "./RenderSystem.js";
import { Camera } from "./Camera.js";
import { StateMachine } from "./StateMachine.js";
import { GameLoop } from "./GameLoop.js";
import { MapManager } from "../maps/MapManager.js";
import { GameConfig } from "./GameConfig.js";

import { GameOverState } from "../states/GameOverState.js";
import { MenuState } from "../states/MenuState.js";
import { GameState } from "../states/GameState.js";

import { InventoryMenu } from "../game/inventory/InventoryMenu.js";
import { ItemDatabase } from "../content/items/ItemDatabase.js";


export class Game {

constructor(canvas) {

    this.canvas = canvas;

    this.time = new Time();

    this.input = new Input();

    this.renderer = new Renderer(canvas);

    this.renderSystem = new RenderSystem(this);

    this.mapManager = new MapManager();
    
    this.config = GameConfig;

    this.player = null;

    this.isPaused = false;

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
    
    this.states.add(
        "GAMEOVER",
        new GameOverState(this)
    );

    this.states.change("MENU");

        this.inventoryMenu = new InventoryMenu(null, {
            itemDatabase: ItemDatabase,
            canvas: this.canvas,
            canOpen: () =>
                this.states.currentStateName === "JOGO" &&
                Boolean(this.player),
            onOpen: () => {
                this.isPaused = true;
                this.inventoryMenu.inventory = this.player.inventory;
            },
            onClose: () => {
                this.isPaused = false;
            },
            onUseItem: (item) => {
                const combat = this.player.combat;
                const healAmount = item.healAmount ?? 0;

                if (
                    item.type !== "consumable" ||
                    healAmount <= 0 ||
                    combat.health >= combat.maxHealth
                ) {
                    return false;
                }

                combat.health = Math.min(
                    combat.maxHealth,
                    combat.health + healAmount
                );

                return true;
            },

        });


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
startGame() {

    this.states.add(
        "JOGO",
        new GameState(this)
    );

    this.states.change("JOGO");
}
start() {

    this.loop.start();
}


update(delta) {

    this.input.updateActions(delta);

    if (this.input.isActionPressed("inventory")) {
        this.inventoryMenu.toggle();
    }

    if (this.inventoryMenu.isOpen) {
        const menu = this.inventoryMenu;
        const input = this.input;
        const slotCount = menu.inventory?.slots.length ?? 0;

        if (slotCount > 0) {
            const currentIndex = menu.selectedIndex < 0
                ? 0
                : menu.selectedIndex;

            if (input.isActionPressed("moveRight")) {
                menu.selectedIndex = Math.min(
                    currentIndex + 1,
                    slotCount - 1
                );
            } else if (input.isActionPressed("moveLeft")) {
                menu.selectedIndex = Math.max(
                    currentIndex - 1,
                    0
                );
            } else if (input.isActionPressed("moveDown")) {
                menu.selectedIndex = Math.min(
                    currentIndex + menu.columns,
                    slotCount - 1
                );
            } else if (input.isActionPressed("moveUp")) {
                menu.selectedIndex = Math.max(
                    currentIndex - menu.columns,
                    0
                );
            }
        }

        if (input.isActionPressed("confirm")) {
            menu.useSelectedItem();
        }

        if (input.isActionPressed("cancel")) {
            menu.close();
        }
    }

    if (!this.isPaused) {
        this.states.update(delta);
    }

    this.input.endFrame();
}


render() {

    this.renderer.clear();

    this.states.render(this.renderer);
    this.inventoryMenu.render(this.renderer);
}


}