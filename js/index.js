console.log("Hello Akbar!");

//DRIVING GAME CODE STARTS HERE:
//==============================

//Event Listeners to navigate and run events
const score = document.querySelector(".score");
const speed = document.querySelector(".speed");
const startGame = document.querySelector(".startGame"); //this is linked to play button to play/start the game
const gameArea = document.querySelector(".gameArea");
const endScreen = document.querySelector(".endScreen");

//THIS IS A BLANCK OBJECT WHEN PLAYING GAME THE START FUNCTION CALL THIS
//======================================================================

let player = {
  speed: 5,
  score: 0,
};

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 70) {
    player.speed += 1;
    player.score += 10;
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 83 && player.speed != 0) {
    player.speed -= 1;
    player.score -= 5;
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    endGame();
    location.reload();
  }
});
endScreen.addEventListener("click", (event) => {
  endGame();
  gameOverM.style.display = "flex";
});

//THIS IS TO TRACK WHICH KEY IS PRESSED more info on https://www.w3schools.com/graphics/game_controllers.asp
//==========================================================================================================

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};
//THIS IS THE EVENT LITSENNER TO INVOC GAME WITH KEY IS PRESSED 

startGame.addEventListener("click", start);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

//THIS FUNCTION IS CREATING THE LINE ON THE STREE 
//===============================================

function moveLines() { //this function is moving the lines and looping them to be regenerated
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (item) {
    if (item.y >= 1500) {
      item.y -= 1500;
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

//THIS FUNCTION IS DETECTING THE ACCIDENT
//======================================
function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

//THIS FUNCTION IS CREATING AND MOVING OTHER CARS
//===============================================

function moveEnemy(car) {
  let ele = document.querySelectorAll(".enemy");
  ele.forEach(function (item) {
    if (isCollide(car, item)) {
      console.log("HIT");
      endGame();
    }
    if (item.y >= 1500) {
      item.y = -600;
      item.style.left = Math.floor(Math.random() * 350) + "px";
      item.style.backgroundColor = randomColor();
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

//THIS IS THE FUNCTION THAT STARTS THE GAME
//=========================================
function playGame() {
  let car = document.querySelector(".car");
  moveLines();
  moveEnemy(car);
  let road = gameArea.getBoundingClientRect(); //And what get bounding client rectangle does is it essentially gets the size of an element and its relative position to the viewpoint get bounding rectangle value and that's going to return back the top right
  console.log(road);
  if (player.start) { //it takes the player object if the start is true ??
    if (keys.ArrowUp && player.y > road.top) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < road.bottom) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < road.width - 50) { //the 50 is the 50 px size of the car and here we are deducting it from the width of the road so the car should not move our of the road 
      //THIS IS FIXING THE CAR POSITION TO THE RIGHT NOT TO MOVE OUT OF THE ROAD
      player.x += player.speed;
    }
    car.style.left = player.x + "px"; // the car elment is created now we are taking that car and positioning it to the player X position and same for Y this allows us to more the object using the arrow
    car.style.top = player.y + "px";
    window.requestAnimationFrame(playGame); //here the requestAnimationFrame function is invoked and rpeated itself 
    score.innerText = "Score: " + player.score;
    speed.innerText = "speed: " + player.speed;
  }
}

//THESE FUNCTION DETECT THE KEY WHILE PRESSED OR RELESED
//======================================================
function pressOn(e) {
  e.preventDefault();
  console.log(keys); // THIS IS TO CHECK WHICH KEYS ARE PRESSED
  keys[e.key] = true;
}

function pressOff(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function endGame() {
  player.start = false;
  score.innerHTML = "Score: " + player.score;
  gameOverM.style.display = "flex";
  startGame.classList.remove("hide");
}

//THIS IS THE FUNCTION TO START THE GAME
//======================================

function start() {
  console.log("click"); //COULD BE REMOVED ONLY FOR TESTING
  gameArea.innerHTML = "";
  player.start = true; //THE PLAYER IS CALLED FOR THE PLAYER OBJECT ABOVE (START OF THE GAME CODE)
  player.score = 0;
  for (let x = 0; x < 10; x++) {  //we are creating lines for the road and the line are object created by javascript same as cars and each time it is looping it creats 10 line 
    let div = document.createElement("div");
    div.classList.add("line"); // this adds the lines and setting the positions 
    div.y = x * 150;
    div.style.top = x * 150 + "px";
    gameArea.appendChild(div); // here we are appending the lines to the road  same as we did for cars 
    console.log(div)
  }
  window.requestAnimationFrame(playGame); //THIS FUNCTION WILL CALL THE PLAY GAME FUNCTION MORE ON MDN Window.requestAnimationFrame() this function allows to loop through several time 
  let car = document.createElement("div"); //THIS VARIABLE IS CREATING THE CAR
  console.log(car);
  car.setAttribute("class", "car"); //there is no default class but we can use the call to set attribute for car whick is in css 
  gameArea.appendChild(car); // add the car to the road area
  player.x = car.offsetLeft; //this is getting the car POSITION where it is in the gameArea
  player.y = car.offsetTop;
  for (let x = 0; x < 3; x++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.innerHTML = "<br>" + (x + 1);
    enemy.y = (x + 1) * 600 * -1;
    enemy.style.top = enemy.y + "px";
    enemy.style.left = Math.floor(Math.random() * 350) + "px";
    enemy.style.backgroundColor = randomColor();
    gameArea.appendChild(enemy);
  }
}

//THIS FUNCTION IS CHANGING THE COLOR OF THE CARS
//===============================================

function randomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);
    return ("0" + String(hex)).substr(-2);
  }
  return "#" + c() + c() + c();
}

// TO CALL/DISPLAY THE MODALS AND CLOSE THEM
//==========================================

const help = document.getElementById("howto");
const modal = document.querySelector(".modal");
const gameO = document.getElementById("gameOverM");
const gameOverM = document.querySelector(".gameOverM");
const modalCloseButton = document.querySelector(".modal-close");
const modalStartButton = document.getElementById("yes");
const gomCloseButton = document.querySelector(".gomodal-close"); //gomCloseButton = Game Over Modal Close Button

help.addEventListener("click", (event) => {
  modal.style.display = "flex";
});

modalCloseButton.addEventListener("click", (event) => {
  modal.style.display = "none";
});

yes.addEventListener("click", (event) => {
  modal.style.display = "none";
  start();
});

gomCloseButton.addEventListener("click", (event) => {
  modal.style.display = "none";
  location.reload();
});
