(function() {
  function Menu() {}
  var map, ground,layer, player, background, jumpButton, cop, copTimer, enemyGroup, playerCollisionGroup, groundCollisionGroup;

  Menu.prototype = {
    create: function() {
      game.physics.startSystem(Phaser.Physics.P2JS);
      game.physics.p2.gravity.y = 500;
      
      background = this.add.tileSprite(0,0,1024,600,'background');
      background.autoScroll(-25,0);


      ground = this.add.tileSprite(0,504,1024,96,'ground');
      game.physics.p2.enable(ground);
      console.debug(ground.body);
      ground.body.fixedRotation = true;
      ground.body.data.motionState = p2.Body.STATIC;
      ground.autoScroll(-300,0);
      ground.body.name = 'ground';
      ground.body.setRectangle(1024,30);

      player = game.add.sprite(300,400,'horse');
      player.animations.add('run',[0,1,2,3]);
      player.animations.add('jump',[3]);
      player.animations.play('run',12,true);
      game.physics.p2.enable(player);
      player.body.name = 'player';
      player.body.setCircle(20);
      console.debug(player.body);
    },
    update: function() {
      
      //game.physics.p2.collide(player,ground);
      //game.physics.p2.collide(player, enemyGroup);
      console.debug(player.body);
      if(player.body.touching.down) {
        this.canJump = true;
      }
      if(jumpButton.isDown && this.canJump) {
        player.body.velocity.y = -300;
        player.animations.play('jump',0,false);
        this.canJump = false;
      } else if(player.body.touching.down) {
        player.animations.play('run', 12, true);
      }
      /*
      if(copTimer < game.time.now) {
        this.generateCop();
      }
      */
      
    },
  };
    MenuState = Menu;
})();
      /*
      
      ground.body.bounce = 0;
      ground.body.immovable = true;
      

      
      
      

      player.body.bounce = 0;
      player.body.collideWorldBounds = true;

      

      
      enemyGroup.callAll('setSize','')



      jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      copTimer = game.time.now + 1500
      
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
