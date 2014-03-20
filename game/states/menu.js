(function() {
  function Menu() {}
  var map, 
    ground,
    layer, 
    player, 
    background, 
    jumpButton, 
    copTimer, 
    darkHorseTimer,
    fruitTimer,
    policeGroup, 
    playerCollisionGroup,
    groundCollisionGroup,
    enemyCollisionGroup,
    fruitCollisionGroup,
    canJump =true,
    maxCopFrequency = 10000,
    minCopFrequency = 5000,
    maxDarkHorseFrequency = 10000,
    minDarkHorseFrequency = 5000,
    maxFruitFrequency = 3000,
    minFruitFrequency = 1000,
    filter,
    fireFilter,
    
    score = 0,
    startTime,
    scoreText,
    gameMusic,
    superMusic,
    endMusic,
    emitter,
    isSuper = false,
    superFruit = null,
    config = {};
    var superConfig = {
      run: 'superRun',
      runFramesPerSecond: 24,
      jump: 'superJump',
      copSpeed: 600,
      fruitSpeed: 600,
      minCopFrequency: 200,
      maxCopFrequency: 1000,
      minFruitFrequency: 10,
      maxFruitFrequency: 100,
      isSuper: true,
      groundScrollSpeed: -600,
      playerImmovable: true,
    };

    var defaultConfig = {
      run: 'run',
      runFramesPerSecond: 12,
      jump: 'jump',
      fruitSpeed: 300,
      copSpeed: 300,
      minCopFrequency: 3000,
      maxCopFrequency: 5000,
      minFruitFrequency: 1000,
      maxFruitFrequency: 3000,
      isSuper: false,
      groundScrollSpeed: -300,
      playerImmovable: false

    };
    config = defaultConfig;




  Menu.prototype = {
    create: function() {
      game.physics.startSystem(Phaser.Physics.P2JS);
      game.physics.setBoundsToWorld();

      game.physics.p2.gravity.y = 500;
      game.physics.p2.defaultRestitution = 0;

      playerCollisionGroup = game.physics.p2.createCollisionGroup();
      groundCollisionGroup = game.physics.p2.createCollisionGroup();
      enemyCollisionGroup = game.physics.p2.createCollisionGroup();
      fruitCollisionGroup = game.physics.p2.createCollisionGroup();
      console.debug('pcg:', playerCollisionGroup);
      
      background = this.add.tileSprite(0,0,1024,512,'background');
      background.autoScroll(-25,0);


      ground = this.add.tileSprite(512,480,1024,64,'ground');
      game.physics.p2.enable(ground);
      console.debug(ground.body,true);
      ground.body.fixedRotation = true;
      ground.body.data.motionState = p2.Body.STATIC;
      ground.body.bounce = 0;
      ground.autoScroll(-300,0);
      ground.body.name = 'ground';
      ground.body.clearShapes();
      ground.body.setRectangle(1024,64,0, 0);
      ground.body.setCollisionGroup(groundCollisionGroup);
      ground.body.collides([playerCollisionGroup,fruitCollisionGroup]);
     
      player = game.add.sprite(300,400,'horse');
      player.animations.add('run',[0,1,2,3]);
      player.animations.add('jump',[3]);
      player.animations.add('superRun',[4,5,6,7]);
      player.animations.add('superJump',[7]);

      game.camera.follow(player);
      

      player.animations.play(config.run,12,true);
      game.physics.p2.enable(player);
      player.body.clearShapes();
      player.body.setCircle(35);
      player.body.name = 'player';
      player.body.fixedRotation = true;
      player.body.bounce = 0;
      player.body.setCollisionGroup(playerCollisionGroup);
      player.body.collides(enemyCollisionGroup, function(){
        console.debug('enemy collision');
      });
      player.body.collides([groundCollisionGroup, enemyCollisionGroup, fruitCollisionGroup]);

      player.body.onBeginContact.add(function(a,b) {
        if(player.alive) {
          if(a.name === 'ground') {
            canJump = true;
            player.animations.play(config.run,config.runFramesPerSecond,true);
          } else if(a.name === 'enemy') {
            if(config.isSuper) {
              console.log(a.sprite);
              a.velocity.x = 1000;
              a.velocity.y = -1000;
              a.sprite.alive = false;
              a.sprite.rotationSpeed = game.rnd.integerInRange(2,5);
              game.add.tween(a.sprite).to({rotation: 6}, 1000, Phaser.Easing.Linear.NONE, true);
            } else {
              this.die();  
            }
            
          } else if(a.name === 'fruit' || a.name === 'superfruit') {
            score += a.points;
            a.sprite.kill();
            if(a.name === 'superfruit' && !config.isSuper) {
              this.startSuperHorse();
            }
          }
        } else {
          player.body.setZeroVelocity();
          player.body.setZeroRotation();
        }
      },this);
      player.body.onEndContact.add(function(a,b) {
        if(a.name === 'ground') {
          canJump = false;
        }
      });

      policeGroup = game.add.group();
      fruitGroup = game.add.group();
      copTimer = minCopFrequency;
      fruitTimer = minFruitFrequency;
      darkHorseTimer = maxDarkHorseFrequency * 2;

      emitter = game.add.emitter(game.world.centerX, 200,200);


      emitter.makeParticles('sparkles',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]);
      
      fireFilter = game.add.filter('Fire', 800, 600,0.0);
      
      
      scoreText = game.add.text(10, game.height - 42, 'Score: 0');
      scoreText.font = 'Arial Black';
      scoreText.fontSize = 32;
      scoreText.fontWeight = 'bold';
      scoreText.stroke = '#000';
      scoreText.strokeThickness = 3;
      scoreText.fill = '#fff';

      startTime = game.time.now;
      gameMusic = game.add.audio('gameMusic',1,true);
      superMusic = game.add.audio('superMusic',1,true);
      endMusic = game.add.audio('endMusic',1,true);

      gameMusic.play('',0,1,true);

    },
    update: function() {
      if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !!canJump) {
        player.body.moveUp(350);
        player.animations.play(config.jump,0,false);
        canJump = false;
      }
      if(copTimer < game.time.now) {
        this.generateCop();
      }
      if(fruitTimer < game.time.now) {
        this.generateFruit();
      }

      if(darkHorseTimer < game.time.now) {
        //generateDarkHorse();
      }
      if(superFruit && superFruit.alive) {
        emitter.x = superFruit.x;
        emitter.y = superFruit.y;
      } else {
        emitter.on = false;
      }
      fireFilter.update();
      scoreText.text = 'Score: ' + score;
      policeGroup.forEachExists(function(cop) {
        if(!cop.alive) {
          cop.body.angle += cop.rotationSpeed;
        }
      });

    },
    generateFruit: function() {
      if(player.alive) {
        var fruit = fruitGroup.getFirstExists(false);
        if(!fruit) {
          fruit = game.add.sprite(game.width + 32,300,'fruits');
          fruit.scale.setTo(0.33,0.33);
          
          game.physics.p2.enable(fruit);
          fruit.body.fixedRotation = true;
          fruit.body.data.motionState = p2.Body.KINEMATIC;
          fruit.body.data.shapes[0].sensor = true;
          fruit.body.bounce = 0;
          fruit.body.name = 'fruit';
          fruit.body.setCollisionGroup(fruitCollisionGroup);
          fruit.body.collides([playerCollisionGroup, groundCollisionGroup]);
          
          fruit.outOfBoundsKill = true;
          fruit.checkWorldBounds = true;
          fruitGroup.add(fruit);
        };
        fruit.frame = game.rnd.integerInRange(15,160) % 15 || 0;
        var canSuper = true;
        fruitGroup.forEachAlive(function(fruit) {
          if(fruit.body.name === 'superfruit') {
            canSuper = false;
          }
        });
        if (config.isSuper === false && canSuper && game.rnd.integerInRange(0,100) - 90 > -50) {
          fruit.frame = 15;
          fruit.body.name = 'superfruit';
          superFruit = fruit;
          emitter.x = superFruit.x;
          emitter.y = superFruit.y;
          emitter.start(false, 2000,20);
        } else {
          fruit.body.name = 'fruit';
        }
        fruit.body.points = (fruit.frame+1) * 10;

        fruit.reset(game.width,game.rnd.integerInRange(300,450));
        fruit.revive();
        fruit.body.moveLeft(config.fruitSpeed);
        fruitTimer = game.time.now + game.rnd.integerInRange(config.minFruitFrequency, config.maxFruitFrequency);

      }
    },
    generateCop: function() {
      if(player.alive) {
        var cop = policeGroup.getFirstExists(false);
        if(!cop) {
          cop = game.add.sprite(game.width,450,'police');
          game.physics.p2.enable(cop);
          cop.body.clearShapes();
          cop.body.loadPolygon('physicsData', 'police-car');
          cop.body.fixedRotation = false;
          cop.body.data.motionState = p2.Body.KINEMATIC;
          cop.body.bounce = 0;
          cop.body.name = 'enemy';
          var circle = cop.body.addCircle(40,0,120);
          cop.body.shapeChanged();
          cop.body.setCollisionGroup(enemyCollisionGroup);
          cop.body.collides([playerCollisionGroup]);
          
          cop.outOfBoundsKill = true;
          cop.checkWorldBounds = true;
          policeGroup.add(cop);
        }
        cop.x = game.width;
        cop.revive();
        cop.body.moveLeft(config.copSpeed);
        copTimer = game.time.now + game.rnd.integerInRange(config.minCopFrequency, config.maxCopFrequency);
        console.debug('copTimer:', copTimer, copTimer - game.time.now);
      }
    },
    startSuperHorse: function() {
      background.filters = [fireFilter];
      gameMusic.stop();
      superMusic.play('',0,1,false);
      config = superConfig;
      game.time.events.add(Phaser.Timer.SECOND * 24.346, this.endSuperHorse, this);
      this.updateSprites();
    },
    endSuperHorse: function() {
      background.filters = null;
      gameMusic.play('',0,1,true);
      config = defaultConfig;
      this.updateSprites();
      fruitGroup.callAll('kill');
      policeGroup.callAll('kill');
    },
    updateSprites: function() {
      player.animations.play(config.run,config.runFramesPerSecond,true);
      fruitGroup.forEachAlive(function(fruit) {
        fruit.body.moveLeft(config.fruitSpeed);
      });
      policeGroup.forEachAlive(function(cop) {
        cop.body.moveLeft(config.copSpeed);
      });
      ground.autoScroll(config.groundScrollSpeed,0);
      player.body.immovable = config.playerImmovable;
    },
    die: function() {
      /*
      if (player.alive) {
        ground.autoScroll(0,0);
        game.add.tween(background).to({y:game.height}, 2000, Phaser.Easing.Linear.NONE,true);
        game.add.tween(ground).to({alpha: 0}, 2000, Phaser.Easing.Linear.NONE, true);
        policeGroup.forEachAlive(function(cop) {
          cop.body.setZeroVelocity();
          cop.body.moveDown(100);
          cop.body.moveLeft(100);
        },this);
        fruitGroup.forEachAlive(function(fruit) {
          fruit.body.setZeroVelocity();
          fruit.body.bounce = 0.3;
          fruit.body.data.motionState = p2.Body.DYNAMIC;
        });
        
        gameMusic.stop();
        endMusic.play('',0,1,false);
        player.alive = false;
        player.body.angularVelocity = 10;
        player.body.moveUp(150);
        player.body.moveLeft(50);
        game.physics.p2.gravity.y = 100;
        player.animations.play('jump');
        game.add.tween(player).to({angle: 180}, 3000, Phaser.Easing.Linear.NONE, true);

      }
      */
    }
  };
    MenuState = Menu;
})();
      /*
      
      ground.body.bounce = 0;
      ground.body.immovable = true;
      

      
      
      

      player.body.bounce = 0;
      player.body.collideWorldBounds = true;

      

      
      enemyGroup.callAll('setSize','')



      
      
    },
    
    generateCop: function() {
      var cop = enemyGroup.getFirstExists(false);
      cop.reset(game.width,436);
      cop.revive();
      cop.body.velocity = new Phaser.Point(-300,0);
      
      copTimer = game.time.now + game.rnd.integerInRange(750, 5000);
    }
  };
}());
*/
