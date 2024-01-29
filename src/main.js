// Name: Jason Torres
// Rocket Patrol Remastered
// about 10 Hours
// Mods List:
// Track a high score that persists across scenes and display it in the UI (1)
// Implement the speed increase that happens after 30 seconds in the original game(1)
// Display the time remaining (in seconds) on the screen (3)
// Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves, faster and is worth more points (5)
// Implement a new timing/scoring mechanism that adds time to the clock for succesful hits (5)
// Implement mouse control for player movement and left mouse click to fire (5)


let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play]
}

let game = new Phaser.Game(config)

// reserve keyboard bindings
let keyMENU, keyRESET, keyLEFT, keyRIGHT
let mouse

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
