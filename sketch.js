var gameState = 0;
var price = 0;
var goalBudget = 0;
//initialized for easy 
var difficulty = "easy";
var maxSpeedofObst = -2;

var characterxPos = 0;
var characteryPos = 160;
var heightCharacter = 167; //the height of the character

//moving background variables 
var bgX1 = 0;
var bgX2 = 600;
let bgSpeed = .7;
var groundX1 = 0;
var groundX2 = 600;

//jumping variables - taken from class example day06
let jumpMode = false;
let jumpPower = 0;
const gravity = 0.2;


function preload() {
  bg = loadImage('zara.png');
  bg2 = loadImage('zara.png');
  ground1 = loadImage('ground.png');
  ground2 = loadImage('ground2.png');
  character = loadImage('gamecharacter.png');

  //lose point objects
  dog = loadImage('dog.png');
  fries = loadImage('fries.png');
  banana = loadImage('banana.png');
  pigeon = loadImage('pigeon.png');
  trash = loadImage('trash.png');

  //gain point objects 
  tshirt = loadImage('tshirt.png');
  shoes = loadImage('shoes.png');
  purse = loadImage('purse.png');
  shorts = loadImage('shorts.png');
  sweater = loadImage('sweater.png');

  //load sounds
  clothingCollect = loadSound('clothingCollect.wav');
  gameOverSound = loadSound('gameOver.wav');
  jump = loadSound('jump.wav');

}

function setup() {
  // set the background size of our canvas
  canvas = createCanvas(600, 380);
  canvas.style('display', 'block');
  canvas.style('margin','auto');
  canvas.style('margin-bottom','200px');

  //centering the canvas 
  noStroke();
}

//to hold the xpos of the currently shown values 
var curr = [];
var count = 0;

function draw() {
  background(0);
  image(bg,bgX1,0);
  image(bg, bgX2, 0);
  image(ground1, groundX1,277);
  image(ground2, groundX2, 277);
  //store all the 'positive' point values 
  var positive = [tshirt, shoes, purse, shorts, sweater];
  var negative = [dog, fries, banana, pigeon, trash];

  if (gameState === 1){ //playing the game 
    image(character,characterxPos, characteryPos);
    fill(255);
    //ellipse(characterxPos,characteryPos,25,25);
    textSize(15);
    text("Goal Budget: $" + goalBudget + " Total Price: $"+price, 350, 360);
    if (curr.length === 0){
      let randval = int(random(0,1.5));
      let index = int(random(0,4.5));

      if(randval === 0){
        let obstacleNew = new Obstacle(0,index,maxSpeedofObst);
        curr.push(obstacleNew);
      }
      //case that randval is 1 
      else{
        let obstacleNew = new Obstacle(1,index,maxSpeedofObst);
        curr.push(obstacleNew)
      }
    }
    if(curr[0].typeofObs === 0){
      image(negative[curr[0].index], curr[0].xpos, curr[0].ypos);
    }
    else{
      image(positive[curr[0].index], curr[0].xpos, curr[0].ypos);
    }
    let distance = dist(characterxPos, characteryPos, curr[0].xpos, curr[0].ypos);
    //positive case - collect clothes 
    if(curr[0].typeofObs === 1){
      if(characterxPos >= curr[0].xpos && characterxPos <= curr[0].xpos+50 && characteryPos >= 160){
        price += 50;
        clothingCollect.play();
        curr.pop();
      }
      else if (curr[0].xpos<=0){
        curr.pop();
      }
      else{
        curr[0].xpos -= curr[0].speed;
      }
    }
    //negative case - 160 bc 160+167(height of character)
    else {
      if(characterxPos + 40 >= curr[0].xpos && characterxPos + 20 <= curr[0].xpos+50 && characteryPos >= 160){
        gameOverSound.play();
        gameState = 2;
        curr.pop();
      }
      else if (curr[0].xpos<=0){
        curr.pop();
      }
      else{
        curr[0].xpos -= curr[0].speed;
      }
    }

    bgX1 -= bgSpeed;
    bgX2 -= bgSpeed;
    groundX1 -= bgSpeed * 1.6;
    groundX2 -= bgSpeed * 1.6;

    if (bgX1 <= -600){
      bgX1 = bgX2 + 600;
    }
    if(bgX2 <= -600){
      bgX2 = bgX1 + 600;
    }

    if(groundX1 <= -600){
      groundX1 = groundX2 + 600;
    }

    if (groundX2 <= -600){
      groundX2 = groundX1 + 600;
    }

    //if the total price of the bag === goal budget - came is over and you win! Objective is met!
    if(price === goalBudget){
      gameState = 4;
    }

  }

  else if (gameState === 0){//game not started 
    image(character,265, characteryPos);
    fill(255);
    textSize(15);
    text("Goal Budget: $"+ goalBudget+" Total Price: $0", 350, 360);
    fill(0);
    rect(150,20, 300, 100);
    fill(255);
    textSize(20);
    text("Soso Shopping in Soho", 200,70);
    textSize(14);
    text('Please Select Difficulty', 230, 100);
  }

  else if (gameState === 2){ //game ended 
    image(character,265, characteryPos);
    fill(0);
    rect(150,20, 300, 100);
    fill(255);
    textSize(20);
    text("Game Over!", 240,70);
    textSize(14);
    text('Click Screen to Restart Game', 210, 100);
    textSize(15);
    fill(255,0,0)
    text("Goal Budget: $"+ goalBudget+" Total Price: $0", 350, 360);
  }

  else if (gameState === 3){ //gameState === 3 --> paused 
    image(character,characterxPos, characteryPos);
    if(curr[0].typeofObs === 0){
      image(negative[curr[0].index], curr[0].xpos, curr[0].ypos);
    }
    else{
      image(positive[curr[0].index], curr[0].xpos, curr[0].ypos);
    }
    fill(0);
    rect(150,20, 300, 100);
    fill(255);
    textSize(20);
    text("Game Paused", 230,70);

  }

  else{ //case that game state is 4 and you win! 
    image(character,characterxPos, characteryPos);
    fill(0);
    rect(150,20, 300, 100);
    fill(255);
    textSize(20);
    text("A Successful Soho Trip", 200,50);
    textSize(18);
    text('You met the budget of '+goalBudget, 200, 80);
    textSize(14);
    text('Click Screen to Restart Game', 210, 100);

  }

  //horizontal movement 
  if (keyIsDown(68)) {
    if(characterxPos >= width){
      characterxPos = 0;
    }
    //wrap around logic 
    else{
      characterxPos += 2
    }
  }

  if (keyIsDown(65)) {
    if(characterxPos <= 0){
      characterxPos = 600;
    }
    //wrap around logic 
    else{
      characterxPos -= 2
    }
  }

  if (keyIsDown(87) && jumpMode === false){
    jumpMode = true;
    jumpPower = -5;
    jump.play();
  }
  //case that our character is 
  if (jumpMode) {
    characteryPos += jumpPower;
    characterxPos += .7;
    if(characterxPos >= 600){
      characterxPos = 0;
    }

    //lessen the jump power using the gravity 
    jumpPower += gravity

    //make sure does not go through the floor (add character height bc we want ypos above ground)
    if(characteryPos + heightCharacter >= 330){
      jumpMode = false;
      jumpPower = 0;
      characteryPos = 160;
    }
  }
}

function mousePressed(){
  //technically these could all be in one if statement but i wanted to separate to make the code clear
  //2 - game ended - restart game
  //4 - won game - restart game 
  if (gameState === 2 || gameState === 4 ){
      gameState = 1;
      price = 0;
  }
}

function handlePause() {
  if (gameState === 1){
    gameState = 3;
    document.getElementById('pauseButton').innerHTML = "Resume";
  }
  else{ //case that game is paused and you want to resume the game 
    gameState = 1;
    document.getElementById('pauseButton').innerHTML = "Pause Game";
  }
}

function startGame(){
  //game state = 0 
  difficulty = select('#difficulty').value();

  if(difficulty === "easy"){
    goalBudget = 200;
    maxSpeedofObst = 2.5
  }
  else if (difficulty === "medium"){
    goalBudget = 400;
    maxSpeedofObst = 3
  }
  else{
    goalBudget = 600;
    maxSpeedofObst = 4
  }
  gameState = 1;

}

class Obstacle {
  constructor(typeofObs, index, maxSpeedofObst){
    this.typeofObs = typeofObs;
    this.index = index;
    this.ypos = 280;
    this.xpos = 600;
    this.speed = random(1.5,maxSpeedofObst);
  }
}





