(function() {
	'use strict';
	function Preload() {
		console.debug('PreloadState constructor');
		this.asset = null;
		this.ready = false;

	}

	Preload.prototype = {
		preload: function() {
			console.debug('PreloadState preload');
			this.asset = this.add.sprite(320,240, 'preloader');
			this.asset.anchor.setTo(0.5, 0.5);

			this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
			this.load.setPreloadSprite(this.asset);
			this.load.image('background', 'assets/background.png');
			this.load.image('ground', 'assets/ground.png');
			this.load.spritesheet('horse', 'assets/horse.png',107,72,8);
			this.load.spritesheet('pegasus', 'assets/pegasus.png',64,73,9);
			this.load.spritesheet('rainbow-horse', 'assets/rainbow-horse.png',106,72,4);
			this.load.spritesheet('sparkles', 'assets/sparkles.png',122,19,40);
			this.load.spritesheet('fruits', 'assets/fruits.png',110,123,16);
			this.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
			this.load.image('police', 'assets/police-car.png');
			this.load.physics('physicsData', 'assets/physics/cop-poly.json');
			this.load.script('filterX', 'filters/BlurX.js');
			this.load.script('filter', 'filters/Fire.js');
			this.load.audio('introMusic', 'assets/music/intro.wav');
			this.load.audio('gameMusic', 'assets/music/game.wav');
			this.load.audio('superMusic', 'assets/music/super.wav');
			this.load.audio('endMusic', 'assets/music/end.wav');


			/*

			this.load.spritesheet('bird', 'assets/bird.png', 34,24,3);
			this.load.spritesheet('pipes', 'assets/pipes.png',54,320,2);
			this.load.image('startButton', 'assets/start-button.png');
			this.load.image('title', 'assets/title.png');
			this.load.image('instructions', 'assets/instructions.png');
			this.load.image('getReady', 'assets/get-ready.png');
			*/

		},
		create: function() {
			console.debug('PreloadState Create');
			this.asset.cropEnabled = false;
		},
		update: function() {
			if(!!this.ready) {
				game.state.start('menu');
			}
		},
		onLoadComplete: function() {
			console.debug('PreloadState OnLoadComplete');
			this.ready = true;
		}
	};

	PreloadState = Preload;
}());
