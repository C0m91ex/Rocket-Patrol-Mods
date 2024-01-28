class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, 0, borderUISize, game.config.width, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        
        // add spaceship (x4)
        this.ship01 = new Spaceship(this, game.config.width + 192, 196, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + 96, 260, 'spaceship', 0, 20).setOrigin(0, 0)
        this.ship03 = new Spaceship(this, game.config.width, 324, 'spaceship', 0, 10).setOrigin(0, 0)
        this.speed01 = new Spaceship(this, game.config.width + 288, 132, 'speeder', 0, 50).setOrigin(0, 0)

        // define keys
        mouse = this.input
        keyMENU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        // initialize score
        this.p1Score = 0
        this.hScore = parseInt(localStorage.getItem("score")) || 0
        let scoreConfig = {
            fontFamily: 'Courier', 
            fontSize: '20px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5, 
                bottom: 5,
            },
            fixedWidth: 150
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, "Score: " + this.p1Score, scoreConfig)
        this.best = this.add.text(225, 54, "Best: " + this.hScore, scoreConfig)

        this.gameClock = game.settings.gameTimer
        let gameClockConfig = {
            fontFamily: "Courier",
            fontSize: '20px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5, 
                bottom: 5,
            },
            fixedWidth: 140
        }
        this.timeLeft = this.add.text(400, 54, "Timer: " + this.formatTime(this.gameClock), gameClockConfig)
        this.timedEvent = this.time.addEvent
        (
            {
                delay: 1000,
                callback: () =>
                {
                    this.gameClock -= 1000;
                    this.timeLeft.text = "Timer: " + this.formatTime(this.gameClock)
                },
                scope: this,
                loop: true
            }
        )

        // Game Over flag
        this.gameOver = false
        // 60-second play clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or (M) for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver=true
        }, null, this)

        this.factor = 1
        this.upSpeed = this.time.delayedCall(game.settings.gameTimer/2, () => {this.factor = 1.5}, null, this)
    }

    update() {
        if(this.gameOver) this.time.removeAllEvents()
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart(this.p1Score)
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyMENU)) {
            this.scene.start('menuScene')
        }

        this.starfield.tilePositionX -= 4
        if(!this.gameOver) {
            this.p1Rocket.update()
            this.ship01.update(this.factor)
            this.ship02.update(this.factor)
            this.ship03.update(this.factor)
            this.speed01.update(this.factor)
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        if (this.checkCollision(this.p1Rocket, this.speed01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.speed01)
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true
            } else {
                return false
            }
    }

    shipExplode(ship) {
        ship.alpha = 0

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        this.p1Score += ship.points
        if(this.p1Score > this.hScore) {
            this.hScore = this.p1Score
            localStorage.setItem("score", this.hScore)
            this.best.text = "Best: " + this.hScore
        }
        this.scoreLeft.text = "Score: " + this.p1Score

        this.sound.play('sfx-explosion')
    }

    formatTime(ms) {
        let s = ms/1000
        let min = Math.floor(s/60)
        let seconds = s%60
        seconds = seconds.toString().padStart(2, "0")
        return `${min}:${seconds}`
    }
}