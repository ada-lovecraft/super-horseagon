'use strict';

//global variables
var BootState, PreloadState, MenuState, PlayState, GameOverState, FooState, game;
window.onload = function () {
  console.log('setting up the game');
  game = new Phaser.Game(1024, 512, Phaser.AUTO, 'flappy-game');
  game.state.add('boot', BootState);
  game.state.add('preload', PreloadState);
  game.state.add('menu', MenuState);

  game.state.start('boot');
};
