// rectangle pour la swordbox de colision
function rectangleCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}


//qui gagne
function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#comment').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#comment').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#comment').innerHTML = 'Player Wins'
    } else if (enemy.health > player.health) {
        document.querySelector('#comment').innerHTML = 'Enemy Wins'
    }
}

//timer inversé pour le round
let timer = 60
let timerId
function reverseTimer() {

    if(timer > 0) {
        timerId = setTimeout(reverseTimer, 1000)
        timer-- 
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {

        determineWinner({player, enemy, timerId})
    }
}