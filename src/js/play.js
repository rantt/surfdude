/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// Choose Random integer in a range
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var score = 0;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
	init: function() {
		this.game.renderer.renderSession.roundPixels = true;
		this.physics.startSystem(Phaser.Physics.ARCADE);		
		this.physics.arcade.skipQuadTree = false;
	},
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

		this.game.stage.backgroundColor = '#5fcde4';
		this.scrollPosition = 0;
    this.score = 0;

    background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
    background.tileScale.set(2);
	
    border = this.game.add.tileSprite(0, Game.h-160, this.game.width + 512,160 , 'waves');
    border.enableBody = true;

    this.game.physics.arcade.enable(border);
    border.body.immovable = true;
    border.body.allowGravity = false;

    this.player = this.game.add.sprite(128, Game.h-164, 'player');
    this.game.physics.arcade.enable(this.player);
    this.player.body.setSize(32, 64);
    this.player.scale.x = 2;
    this.player.scale.y = 2;
    this.player.anchor.setTo(0.5);
    this.player.animations.add('surf',[0,1,0],10, true);
    this.player.play('surf');

    this.enemies = this.game.add.group();
    this.timer = this.game.time.events.loop(1600, this.addEnemies, this);

    

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.tweening = false;

    wKey.onDown.add(function() {
      this.jump();
    },this);

    this.cursors.up.onDown.add(function() {
      this.jump();
    },this);

    sKey.onDown.add(function() {
      this.duck();
    },this);

    this.cursors.down.onDown.add(function() {
      this.duck();
    },this);

    this.playAgainText = this.game.add.bitmapText(Game.w + 100, this.game.world.centerY, 'minecraftia','test',48);
    
    this.scoreText = this.game.add.bitmapText(Game.w-150, 24, 'minecraftia', 'Score: '+this.score, 24); 

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },
  addEnemies: function() {
    if (this.player.alive === false) {
      return;
    }else {
      this.score += 10;
      this.scoreText.setText('Score: '+this.score);
    }
    var e;
    // if(this.enemies.getFirstExists(false) === null) {

    // this.fowl = this.game.add.sprite(Game.w/2, Game.h/2+100, 'duck');
    // this.fowl.animations.add('fly', [0,1],5, true);
    // this.fowl.play('fly');
      // e = this.add.sprite(Game.w + 64, Game.h/2, 'shark');
      if (rand(0,1) === 0) {
        e = this.add.sprite(Game.w,  Game.h-164, 'shark');
        e.animations.add('bite', [0, 1, 2], 20);
        e.anchor.setTo(0,-0.5);
        this.game.physics.arcade.enable(e);
        e.checkWorldBounds = true;
        e.outOfBoundsKill = true;
        e.bite = false;
        e.body.immovable = true;
        console.log(e);
      }else {
        e = this.add.sprite(Game.w,  Game.h/2+100, 'duck');
        e.animations.add('fly', [0,1],5, true);
        e.play('fly');
        e.anchor.setTo(0.5);
        this.game.physics.arcade.enable(e);
        e.body.setSize(32, 32);
        e.checkWorldBounds = true;
        e.outOfBoundsKill = true;
        e.bite = false;
        e.body.immovable = true;
        console.log(e);

      }
      this.enemies.add(e);
    // }else {
    //   console.log('reset');
    //   e = this.enemies.getFirstExists(false);
    //   if (e.key === 'shark') {
    //     e.reset(Game.w, Game.h-164);
    //     e.bite = false;
    //   }else{
    //     e.reset(Game.w, Game.h+100);
    //   } 
    //
    // }
    e.body.velocity.x = -355;
  },
 jump: function() {
      if (this.tweening) {return;}
      this.tweening = true;
      this.player.animations.stop();
      this.player.frame = 3;

      var t = this.game.add.tween(this.player)
                .to({y: Game.h-300},400, Phaser.Easing.Linear.None)
                .to({y: Game.h-164},400, Phaser.Easing.Linear.None)
                .start();
      t.onComplete.add(function() {
        this.tweening = false;
      }, this);
 },
  duck: function() {
      if (this.tweening) {return;}
      this.tweening = true;
      this.player.animations.stop();
      this.player.frame = 2;

    //     this.player.y = Game.h-100;
      var t = this.game.add.tween(this.player)
                .to({y: Game.h-64},400, Phaser.Easing.Linear.None)
                .to({y: Game.h-164},400, Phaser.Easing.Linear.None)
                .start();

      t.onComplete.add(function() {
        this.tweening = false;
      }, this);

  },
 makeBox: function(x,y) {
		var bmd = this.game.add.bitmapData(x, y);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, x, y);
		bmd.ctx.fillStyle = '#fff';
		bmd.ctx.fill();
		return bmd;
	},
  checkOverlap: function(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
  },
  update: function() {

    if (this.player.alive === true) {
      if (!this.tweening) {
        this.player.play('surf');
      }

      this.game.physics.arcade.collide(this.player, this.enemies, function(player, enemy) {
        enemy.play('bite');
        this.player.kill();
        console.log('hit');
      }, null, this); 
    }else {
        this.playAgainText.setText('Try Again?');
        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { 
            this.game.add.tween(this.playAgainText).to({x: this.game.world.centerX-300}, 355, Phaser.Easing.Linear.None).start();
            this.twitterButton.visible = true;
        }, this);
          
        if (this.game.input.activePointer.isDown || wKey.isDown || this.cursors.up.isDown){
          this.enemies.forEach(function(e) {
            e.alive = false;
          });
          this.player.alive = true;
          this.score = 0;
          this.game.state.start('Play');
        }
      }
    

    // this.enemies.forEach(function(enemy) {
    //   if (enemy.x < 300 && enemy.bite === false) {
    //     enemy.play('bite');
    //     enemy.bite = true;
    //   }
    //   if (this.checkOverlap(this.player, enemy)) {
    //     this.player.kill();
    //   }
    // }, this);
    //

    // if (!this.tweening) {
    //   if(this.cursor.up.isDown || wKey.isDown) {
    //     // if (this.keyDown !== true) {
    //       // this.keyDown = true;
    //       this.player.y = Game.h-300;
    //       this.player.frame = 3;
    //     // }
    //   }else if(this.cursor.down.isDown || sKey.isDown) {
    //     // this.keyDown = true;
    //     this.player.y = Game.h-100;
    //     this.player.frame = 2;
    //   }else {
    //     // this.keyDown = false;
    //     this.player.y = Game.h-164;
    //   }
    // // }

    this.scrollPosition -= 6;
		border.tilePosition.x = this.scrollPosition;
		background.tilePosition.x = this.scrollPosition * 0.1;

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/GAMETITLE/'; 
    var twitter_name = 'rantt_';
    var tags = ['1GAM'];

    window.open('http://twitter.com/share?text=My+best+score+is+'+score+'+playing+GAME+TITLE+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },

  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   this.game.debug.body(this.player);
  //   this.enemies.forEach(function(enemy) {
  //     this.game.debug.body(enemy);
  //   }, this);
  // }

};
