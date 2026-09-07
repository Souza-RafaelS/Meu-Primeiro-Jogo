import { Game } from "./engine/Game.js";

const canvas = document.getElementById("game");

const game = new Game(canvas);
window.game = game;
game.start();