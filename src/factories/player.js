const playerFactory = (speed = 24) => {
  const player = document.getElementById("player");

  let isAnimatingMoveRight = false;
  let isAnimatingMoveLeft = false;

  let playerDirection = "right";
  player.style.display = "block";

  const offsets = player.getBoundingClientRect();

  let positionX = offsets.left;
  let isAlive = true;

  const isPositionHigherThenScreen = () => {
    return player.getBoundingClientRect().right >= document.body.clientWidth;
  };

  const isPositionLowerThenScreen = () => {
    return player.getBoundingClientRect().left <= 0;
  };

  return {
    moveLeft: () => {
      if (!isPositionLowerThenScreen()) {
        !player.classList.contains("player--moving") &&
          player.classList.add("player--moving");
        player.classList.remove("player--right");
        player.classList.add("player--left");

        if (!isAnimatingMoveRight) {
          player.style.left = positionX + "px";
        }

        if (!isAnimatingMoveLeft) {
          isAnimatingMoveLeft = true;
          setTimeout(() => {
            if (!isAnimatingMoveRight) {
              positionX -= speed;
            }
            isAnimatingMoveLeft = false;
          }, 500);
        }

        playerDirection = "left";
        player.style.left = positionX + "px";
      }
    },
    moveRight: () => {
      if (!isPositionHigherThenScreen()) {
        !player.classList.contains("player--moving") &&
          player.classList.add("player--moving");
        player.classList.remove("player--left");
        player.classList.add("player--right");
        if (!isAnimatingMoveLeft) {
          player.style.left = positionX + "px";
        }

        if (!isAnimatingMoveRight) {
          isAnimatingMoveRight = true;
          setTimeout(() => {
            if (!isAnimatingMoveLeft) {
              positionX += speed;
            }
            isAnimatingMoveRight = false;
          }, 500);
        }

        playerDirection = "right";
      }
    },
    domElement: player,
    jump: () => {
      playerDirection === "right"
        ? player.classList.add("player--jumpRight")
        : player.classList.add("player--jumpLeft");
      setTimeout(() => {
        player.classList.remove("player--jumpRight");
        player.classList.remove("player--jumpLeft");
      }, 1000);
    },
    idle: () => {
      player.classList.remove("player--moving");
    },
    getPositionX: () => {
      return positionX;
    },
    isAlive,
  };
};

export default playerFactory;
