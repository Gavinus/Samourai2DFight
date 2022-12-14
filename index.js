const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d')

// Taille du canvas
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)


const gravity = 0.7

//Background
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './public/assets/background.png'
})

//Shop Background
const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './public/assets/shop.png',
    scale: 2.75,
    framesMax: 6
})

//Player position
const player = new Fighter({
    position: {
        x: 150,
        y: 0
    },
    velocity: {     
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './public/assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    
    // Sprite Animation
    sprites: {
        idle: {
            imageSrc: './public/assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './public/assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './public/assets/samuraiMack/Jump.png',
            framesMax: 2           
        },
        fall: {
            imageSrc: './public/assets/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './public/assets/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './public/assets/samuraiMack/TakeHit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './public/assets/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})


//Enemy Position
const enemy = new Fighter({
    position: {
        x: 800,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './public/assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './public/assets/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './public/assets/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './public/assets/kenji/Jump.png',
            framesMax: 2           
        },
        fall: {
            imageSrc: './public/assets/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './public/assets/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './public/assets/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './public/assets/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})


console.log(player);

const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

reverseTimer()

function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()

    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    enemy.update()
    
    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player Move
    if (keys.q.pressed && player.lastKey === 'q') {
        player.velocity.x = -3
        player.switchSprite('run')
    }else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 3
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }
    
    //Jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }


    //Enemy Move
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -3
        enemy.switchSprite('run')
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 3
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //Detect collision , Enemy get Hit
    if (
        rectangleCollision({
            rectangle1: player, 
            rectangle2: enemy
        }) && 
        player.isAttacking &&
        player.frameCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false

        //gsap library for animation
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
        console.log('player success attack')
    }

    //Player Fail Attack
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

    if (
        rectangleCollision({
            rectangle1: enemy, 
            rectangle2: player
        }) && 
        enemy.isAttacking && 
        enemy.frameCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false

        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
        console.log('enemy success attack')
    }

    // Enemy Fail Attack
    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false
    }


    //End Game
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }

}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            //Player Control
            case 'd':
                keys.d.pressed = true 
                player.lastKey = 'd'
            break
            case 'q':
                keys.q.pressed = true 
                player.lastKey = 'q'
            break
            case 'z':
                player.velocity.y = -20
                player.lastKey = 'z'
            break 
            case ' ':
                player.attack()
            break
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            //Enemy Control
            case 'ArrowRight':
                keys.ArrowRight.pressed = true 
                enemy.lastKey = 'ArrowRight'
            break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true 
                enemy.lastKey = 'ArrowLeft'
            break
            case 'ArrowUp':
                enemy.velocity.y = -20
            break
            case 'ArrowDown':
                enemy.attack()
            break
        }
    }
})


window.addEventListener('keyup', (event) => {
    //Player Keys
    switch (event.key) {
        case 'd':
            keys.d.pressed = false 
        break
        case 'q':
            keys.q.pressed = false 
        break

    }

    //Enemy Keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false 
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false 
        break

    }
})