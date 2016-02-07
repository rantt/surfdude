/*global Game*/
Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {

		this.scrollPosition = 0;

    background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
    background.tileScale.set(2);
	
    border = this.game.add.tileSprite(0, Game.h-160, this.game.width + 512,160 , 'waves');
    border.enableBody = true;

    this.game.physics.arcade.enable(border);
    border.body.immovable = true;
    border.body.allowGravity = false;


        this.title = this.game.add.sprite(Game.w/2,Game.h/2-100,'title');
        this.title.anchor.setTo(0.5,0.5);

        this.instructions = this.game.add.sprite(Game.w/2+200,200,'instructions');
        this.instructions.scale.x = 0.5;
        this.instructions.scale.y = 0.5;

        // Start Message

        var clickText = this.game.add.bitmapText(Game.w/2, Game.h/2+100, 'minecraftia', '~click to start~', 24); 
        clickText.anchor.setTo(0.5);

    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
      }

    this.scrollPosition -= 6;
		border.tilePosition.x = this.scrollPosition;
		background.tilePosition.x = this.scrollPosition * 0.1;
    }
};
