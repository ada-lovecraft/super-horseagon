(function() {
  function Menu() {}
  var map, 
    ground,
    layer, 
    player, 
    background, 
    jumpButton, 
    copTimer, 
    policeGroup, 
    playerCollisionGroup,
    groundCollisionGroup,
    enemyCollisionGroup,
    canJump =true;

  Menu.prototype = {
    create: function() {
      game.physics.startSystem(Phaser.Physics.P2JS);
      game.physics.setBoundsToWorld();

      game.physics.p2.gravity.y = 500;
      game.physics.p2.defaultRestitution = 0;

      playerCollisionGroup = game.physics.p2.createCollisionGroup();
      groundCollisionGroup = game.physics.p2.createCollisionGroup();
      enemyCollisionGroup = game.physics.p2.createCollisionGroup();
      console.debug('pcg:', playerCollisionGroup);
      
      background = this.add.tileSprite(0,0,1024,600,'background');
      background.autoScroll(-25,0);


      ground = this.add.tileSprite(0,504,1024,96,'ground');
      game.physics.p2.enable(ground);
      console.debug(ground.body,true);
      ground.body.fixedRotation = true;
      ground.body.data.motionState = p2.Body.STATIC;
      ground.body.bounce = 0;
      ground.autoScroll(-300,0);
      ground.body.name = 'ground';
      ground.body.clearShapes();
      ground.body.setRectangle(1024,96,ground.width/2, ground.height/2);
      ground.body.setCollisionGroup(groundCollisionGroup);
      ground.body.collides(playerCollisionGroup);
     
      player = game.add.sprite(300,400,'horse');
      player.animations.add('run',[0,1,2,3]);
      player.animations.add('jump',[3]);
      player.animations.play('run',12,true);
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
      player.body.collides([groundCollisionGroup, enemyCollisionGroup]);
      player.body.collides(enemyCollisionGroup,function() {
        console.debug('COLLISION!');
      });
      player.body.onBeginContact.add(function(a,b) {
        console.debug('collide');
        if(a.name === 'ground') {
          canJump = true;
          player.animations.play('run',12,true);
        } else if(a.name === 'enemy') {
          this.die();
        } else if(a.name === 'sensor') {
          console.debug('point!');
        }
      },this);
      player.body.onEndContact.add(function(a,b) {
        if(a.name === 'ground') {
          canJump = false;
        }
      });

      policeGroup = game.add.group();
      copTimer = 1500;

      var emitter = game.add.emitter(game.world.centerX, 200,200);


      emitter.makeParticles('sparkles',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]);
      emitter.start(true, 2000,20,10);
      
    },
    update: function() {
      if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !!canJump) {
        player.body.moveUp(350);
        player.animations.play('jump',0,false);
        canJump = false;
      }
      if(copTimer < game.time.now) {
        this.generateCop();
      }

    },
    generateCop: function() {
      var cop = policeGroup.getFirstExists(false);
      if(!cop) {
        cop = game.add.sprite(game.width,500,'police');
        game.physics.p2.enable(cop,true);
        cop.body.clearShapes();
        cop.body.loadPolygon('physicsData', 'police-car');
        cop.body.fixedRotation = true;
        cop.body.data.motionState = p2.Body.KINEMATIC;
        cop.body.bounce = 0;
        cop.body.name = 'enemy';
        var circle = cop.body.addCircle(40,0,120);
        cop.body.shapeChanged();
        cop.body.setCollisionGroup(enemyCollisionGroup);
        cop.body.collides(playerCollisionGroup);
        
        cop.outOfBoundKill = true;
        cop.checkWorldBounds = true;
      }
      cop.x = game.width;
      cop.revive();
      cop.body.moveLeft(300);
      copTimer = game.time.now + 2000;
    },
    die: function() {
      console.debug('YOU DEAD');
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
