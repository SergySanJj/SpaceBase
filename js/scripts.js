import css from '../css/style.css';

import {Game} from './game'
let game;


window.onload = () => {
    game = new Game("canvas");

    window.onresize = () => {
        game.resize();
    };

    game.run();
};





