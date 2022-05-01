const gameContainer = document.getElementById("gameContainer");
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };
  

const fallingEntityFactory = (domElement, type, speed) => {
    let elementWidth = domElement.offsetWidth;
    let elementHeight = domElement.offsetHeight;
  
    let positionX = getRandomNumber(elementWidth, document.body.clientWidth);
    let positionY = -getRandomNumber(elementHeight, 1000);
  
    domElement.style.left = positionX + "px";
    domElement.style.top = positionY + "px";
  
    gameContainer.appendChild(domElement);
  
    const isCollidedVertically = (player) => {
      if (
        Math.floor(domElement.getBoundingClientRect().bottom - 18) >
        Math.floor(player.domElement.getBoundingClientRect().top)
      ) {
        return true;
      }
  
      return false;
    };
  
    const isCollidedHorizontally = (player) => {
      const collidedFromRight =
        Math.floor(domElement.getBoundingClientRect().right) >
        Math.floor(player.domElement.getBoundingClientRect().left);
      const collidedFromLeft =
        Math.floor(domElement.getBoundingClientRect().left) <
        Math.floor(player.domElement.getBoundingClientRect().right);
  
      if (collidedFromLeft && collidedFromRight) {
        return true;
      }
  
      return false;
    };
  
    return {
      type,
      restart: () => {
        positionX = getRandomNumber(elementWidth, document.body.clientWidth);
        positionY = -getRandomNumber(elementHeight, 1000);
        domElement.style.top = positionY + "px";
        domElement.style.left = positionX + "px";
      },
      move: () => {
        positionY += speed;
        domElement.style.top = positionY + "px";
        domElement.style.left = positionX + "px";
      },
      isOutOfScreen: () => {
        return positionY > document.body.clientHeight + elementHeight;
      },
      isCollidedWithPlayer: (player) => {
        if (isCollidedVertically(player) && isCollidedHorizontally(player)) {
          return true;
        }
  
        return false;
      },
      getPositionY: () => {
        return positionY;
      },
      getPositionX: () => {
        return positionX;
      },
    };
  };

  export default fallingEntityFactory