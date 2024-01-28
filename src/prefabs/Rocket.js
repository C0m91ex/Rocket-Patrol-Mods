// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add objects to existing scene
        scene.add.existing(this)
        this.isFiring = false
        this.moveSpeed = 2
        
        this.sfxShot = scene.sound.add('sfx-shot')
    }

    update() {
        mouse.on("pointermove", (pointer) => {
            if(!this.isFiring){
                this.x = Phaser.Math.Clamp(pointer.x, 47, 578)
            }
        }, this)

        if(mouse.activePointer.leftButtonDown() && !this.isFiring) {
            this.isFiring = true
            this.sfxShot.play()
        }
        if(this.isFiring && this.y >= 108) this.y -= 2
        if( this.y <= 108) {
            this.isFiring = false
            this.y = 431
        }
    }

    reset() {
        this.isFiring = false
        this.y = game.config.height - borderUISize - borderPadding
    }
}