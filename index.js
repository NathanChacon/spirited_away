
const gameContainer = document.getElementById("gameContainer")
let dragonXPosition = 0
const dragonWidth = document.getElementById('dragon').clientWidth
let playerPoints = 0


const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

const generateCoins = (numberOfCoins) => {
    const coins = []
    for(let i = 0; i < numberOfCoins; i++){
        coins.push(
            fallingEntityFactory(createCoinDomElement(), "coin")
        )
    }

    return coins
}

const generateEnemies = (numberOfEnemies) => {
    const enemies = []
    for(let i = 0; i < numberOfEnemies; i++){
        enemies.push(
            fallingEntityFactory(createEnemyDomElement(), "enemy")
        )
    }

    return enemies
}

const createCoinDomElement = () => {
    const coin = document.createElement("div")
    coin.className = "coin" 

    return coin
}

const createEnemyDomElement = () => {
    const image = document.createElement("img")
    image.src = "./green_head.svg"
    image.style.width = "100%"
    image.style.height = "100%"

    const figure = document.createElement("figure")
    figure.appendChild(image)
    
    figure.className = "green_head" 

    return figure
}
 
const fallingEntityFactory = (domElement, type) => {
    let elementWidth = domElement.offsetWidth
    let elementHeight = domElement.offsetHeight
    
    let positionX = getRandomNumber(elementWidth, document.body.clientWidth)
    let positionY = -getRandomNumber(elementHeight,  1000)

    domElement.style.left = positionX + 'px'
    domElement.style.top = positionY + 'px'

    gameContainer.appendChild(domElement)

    const isCollidedVertically = () => {
        if(Math.floor(domElement.getBoundingClientRect().bottom)  > Math.floor(player.domElement.getBoundingClientRect().top)) {
            return true
        }
    
        return false
    }

    const isCollidedHorizontally = () => {
        const collidedFromRight = Math.floor(domElement.getBoundingClientRect().right) > Math.floor(player.domElement.getBoundingClientRect().left)
        const collidedFromLeft = Math.floor(domElement.getBoundingClientRect().left) < Math.floor(player.domElement.getBoundingClientRect().right)

        if(collidedFromLeft && collidedFromRight){
            return true
        }
        
        return false
    }

    return {
        type,
        restart: () => {
            positionX = getRandomNumber(elementWidth, document.body.clientWidth)
            positionY = -getRandomNumber(elementHeight, 1000)
            domElement.style.top = positionY + 'px'
            domElement.style.left = positionX + 'px'
        },
        move: () => {
            positionY += 4
            domElement.style.top = positionY + 'px'
            domElement.style.left = positionX + 'px'
        },
        isOutOfScreen: () => {
           return positionY > (document.body.clientHeight + elementHeight)
        },
        isCollidedWithPlayer: () => {
            if(isCollidedVertically() && isCollidedHorizontally()) {
                return true
            }
        
            return false
        }, 
        getPositionY: () => {
            return positionY
        },
        getPositionX: () => {
            return positionX
        }
    }
}


const playerFactory = (width = 100, height = 100) => {
    const player = document.getElementById("player")
    let playerDirection = "right"
    player.style.display = "block";
    player.setAttribute("width",`${width}`)
    player.setAttribute("height",`${height}`)

    const offsets = player.getBoundingClientRect();
    let positionX = offsets.left;

    let isAlive = true

    return {
        width,
        height,
        moveLeft: () => {
            positionX -= 12
            player.style.left = positionX + 'px'
            player.classList.remove("player--right")
            player.classList.add("player--left")
            !player.classList.contains("player--moving") && player.classList.add("player--moving")
            playerDirection = "left"
        },
        moveRight: () => {
            positionX += 12
            player.style.left = positionX + 'px'
            player.classList.remove("player--left")
            player.classList.add("player--right")
            !player.classList.contains("player--moving") && player.classList.add("player--moving")
            playerDirection = "right"
        },
        domElement: player,
        jump: () => {
            playerDirection === "right" ? player.classList.add("player--jumpRight") : player.classList.add("player--jumpLeft")
            setTimeout(() => {
                playerDirection === "right" ? player.classList.remove("player--jumpRight") : player.classList.remove("player--jumpLeft")
            }, 600)
        },
        idle: () => {
            player.classList.remove("player--moving")
        },
        getPositionX: () => {
            return positionX
        },
        isAlive
    }
}

let coins = generateCoins(5)
let enemies = generateEnemies(3)
let fallingElements = [...coins,...enemies]

let player = playerFactory(134, 134)

window.onload = () => {
    const restartButton = document.getElementById("restartButton")
    restartButton.onclick = () => onClickRestart()
}

const onClickRestart = () => {
    const deadOverlay = document.getElementById("deadOverlay")
    restartPlayerPoints()
    restarAllFallingElements()

    deadOverlay.classList.remove("dead_overlay--visible")
    deadOverlay.classList.add("dead_overlay--hidden")

    player = playerFactory(134, 134)

    window.requestAnimationFrame(startGame)
}

const restartPlayerPoints = () => {
    playerPoints = 0
    document.getElementById("points").innerText = playerPoints
}

const restarAllFallingElements = () => {
    fallingElements.forEach((element) => {
        element.restart()
    })
}

let isBgAudioOn = false
document.addEventListener('keydown', (e) => {
    musicPlay()
    if(player.isAlive){
        const key = e.key
        key === "ArrowRight" && player.moveRight()
        key === "ArrowLeft" && player.moveLeft()
        key === "ArrowUp" && player.jump()
    }
})

document.addEventListener('keyup', (e) => {
    const keyName = e.key
    if(keyName === "ArrowRight" || keyName === "ArrowLeft"){
        player.idle()
    }
  })

const increasePlayerPoints = () => {
    playerPoints++
    document.getElementById("points").innerText = playerPoints
}

const playCoinAudio = () => {
    const coinAudio = new Audio('coin_sound.wav')
    coinAudio.play()
}

const moveDragon = () => {
    dragonXPosition++
    const dragon = document.getElementById("dragon")
    dragon.style.left = dragonXPosition

    if(dragonXPosition >= (document.body.clientWidth + dragonWidth)){
        dragonXPosition = 0
        dragon.style.left = `${-dragonWidth}px` 
    }
}

const musicPlay = () => {
    !isBgAudioOn && document.getElementById('bgAudio').play()
    isBgAudioOn = true
}

const startGame = () => {
        moveDragon()
        fallingElements.forEach((fallingElement) => {
            if(fallingElement.isCollidedWithPlayer()){
                if(fallingElement.type === "coin"){
                    fallingElement.restart()
                    increasePlayerPoints()
                    playCoinAudio()
                }
                else{
                    const deadOverlay = document.getElementById("deadOverlay")
                    player.isAlive = false
                    document.getElementById("deadScore").innerText = `SCORE: ${playerPoints}` 
                    deadOverlay.classList.remove("dead_overlay--hidden")
                    deadOverlay.classList.add("dead_overlay--visible")
                }
            }
            else if(fallingElement.isOutOfScreen()){
                fallingElement.restart()
            }
            else{
                fallingElement.move()
            }
        })

        player.isAlive && requestAnimationFrame(startGame)
}  


window.requestAnimationFrame(startGame)