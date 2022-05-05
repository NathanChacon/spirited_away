import { playerFactory, fallingEntityFactory } from "./factories/index.js";
import css from "./index.css";
import greenHeadIcon from "./assets/icons/green_head.svg";

const createEnemyDomElement = () => {
  const image = document.createElement("img");
  image.src = greenHeadIcon;
  image.style.width = "100%";
  image.style.height = "100%";

  const figure = document.createElement("figure");
  figure.appendChild(image);

  figure.className = "green_head";

  return figure;
};

const createCoinDomElement = () => {
  const coin = document.createElement("div");
  coin.className = "coin";

  return coin;
};

const generateCoins = (numberOfCoins) => {
  const coins = [];
  for (let i = 0; i < numberOfCoins; i++) {
    coins.push(fallingEntityFactory(createCoinDomElement(), "coin", 2));
  }

  return coins;
};

const generateEnemies = () => {
  const enemyWidth = document.body.clientWidth > 764 ? 58 : 36;

  const numberOfEnimiesThatFitTheScreen = Math.floor(
    document.body.clientWidth / enemyWidth
  );
  const numberOfEnimiesToGenerate = Math.floor(
    (30 / 100) * numberOfEnimiesThatFitTheScreen
  );

  const enemies = [];
  for (let i = 0; i < numberOfEnimiesToGenerate; i++) {
    enemies.push(fallingEntityFactory(createEnemyDomElement(), "enemy", 2));
  }

  return enemies;
};

let dragonXPosition = 0;

let playerPoints = 0;
let player = playerFactory(34);

let coins = generateCoins(5);
let enemies = generateEnemies(3);
let fallingElements = [...coins, ...enemies];

let isBgAudioOn = false;

window.onload = () => {
  const restartButton = document.getElementById("restartButton");
  restartButton.onclick = () => onClickRestart();
};

document.addEventListener("keydown", (e) => {
  musicPlay();
  if (player.isAlive) {
    const key = e.key;

    key === "ArrowRight" && player.moveRight();
    key === "ArrowLeft" && player.moveLeft();
    key === "ArrowUp" && player.jump();
  }
});

document.addEventListener("keyup", (e) => {
  const keyName = e.key;
  if (keyName === "ArrowRight" || keyName === "ArrowLeft") {
    player.idle();
  }
});

const onClickRestart = () => {
  const deadOverlay = document.getElementById("deadOverlay");
  restartPlayerPoints();
  restarAllFallingElements();

  deadOverlay.classList.remove("dead_overlay--visible");
  deadOverlay.classList.add("dead_overlay--hidden");

  player = playerFactory(34);

  window.requestAnimationFrame(startGame);
};

const restartPlayerPoints = () => {
  playerPoints = 0;
  document.getElementById("points").innerText = playerPoints;
};

const restarAllFallingElements = () => {
  fallingElements.forEach((element) => {
    element.restart();
  });
};

const increasePlayerPoints = () => {
  playerPoints++;
  document.getElementById("points").innerText = playerPoints;
};

const playCoinAudio = () => {
  const coinAudio = new Audio("./audios/coin_sound.wav");
  coinAudio.play();
};

const moveDragon = () => {
  dragonXPosition++;
  const dragon = document.getElementById("dragon");
  const dragonWidth = document.getElementById("dragon").clientWidth;

  if (dragon.getBoundingClientRect().left >= document.body.clientWidth) {
    dragonXPosition = 0;
    dragon.style.left = `${-dragonWidth}px`;
  }

  dragon.style.left = dragonXPosition;
};

const musicPlay = () => {
  !isBgAudioOn && document.getElementById("bgAudio").play();
  isBgAudioOn = true;
};

const startGame = () => {
  moveDragon();
  fallingElements.forEach((fallingElement) => {
    if (fallingElement.isCollidedWithPlayer(player)) {
      if (fallingElement.type === "coin") {
        fallingElement.restart();
        increasePlayerPoints();
        playCoinAudio();
      } else {
        const deadOverlay = document.getElementById("deadOverlay");
        player.isAlive = false;
        document.getElementById(
          "deadScore"
        ).innerText = `SCORE: ${playerPoints}`;
        deadOverlay.classList.remove("dead_overlay--hidden");
        deadOverlay.classList.add("dead_overlay--visible");
      }
    } else if (fallingElement.isOutOfScreen()) {
      fallingElement.restart();
    } else {
      fallingElement.move();
    }
  });

  player.isAlive && requestAnimationFrame(startGame);
};

window.requestAnimationFrame(startGame);
