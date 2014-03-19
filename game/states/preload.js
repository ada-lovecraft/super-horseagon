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
			this.load.spritesheet('horse', 'assets/horse.png',107,72,4);
			this.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
			this.load.image('tiles', 'assets/tiles2.png');
			this.load.image('police', 'assets/police-car.png');
			this.load.physics('physicsData', 'assets/physics/cop-poly.json');

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
