let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
addEventListener("resize", () => {canvas.width = window.innerWidth;canvas.height = window.innerHeight;});

let keys = {}
document.addEventListener('keydown', function(event) {
  keys[event.keyCode] = true;
  keys[event.keyCode + "handled"] = false;
})
document.addEventListener('keyup', function(event) {
  keys[event.keyCode] = false;
})

let player = new Player(200,200,3,5,5,100);
let jonathan = new FlyingEnemy(300,300,10,2,500);
let cameras = [new Camera(0,0,player,30), new Camera(0,0,jonathan,30)];
let activeCam = 0;
let tileMap = new TileMap(200,200,40,40);
let tile = new Image();
tile.src = 'tile1.png';


let distance = 4;

tileMap.generateRandom();
//tileMap.generatePerlinRandom();
tileMap.seperateCaves();
tileMap.fourFiveRule();
tileMap.fourFiveRule();
tileMap.fourFiveRule();
tileMap.fourFiveRule();
tileMap.fourFiveRule();
tileMap.idk();
tileMap.labelTiles();
let interval = setInterval(update,20);

function update() {
  //update background and do calculations

  //camera update
  //optimization: only actually move active camera, for the others, have a hard teleport instead
  for (let i = 0; i < cameras.length; i++){
    cameras[i].move();
  }

  //key update
  keyUpdate();

  //player update
  player.move(tileMap);
  
  //update visuals
  clearScreen();

  //transformed
    ctx.translate(Math.floor(cameras[activeCam].x),Math.floor(cameras[activeCam].y));
    
    //draw tiles
    for (let i = 0; i < tileMap.tiles.length; i++){
      for (let j = 0; j < tileMap.tiles[i].length; j++){
        if (Math.abs(player.x-i*tileMap.tileWidth) < canvas.width && Math.abs(player.y-j*tileMap.tileHeight) < canvas.height){
          if (tileMap.tiles[i][j].type >= 1){
            ctx.fillStyle = "#000000";
            ctx.fillRect(i*tileMap.tileWidth,j*tileMap.tileHeight,tileMap.tileWidth,tileMap.tileHeight);
            if (tileMap.tiles[i][j].corner[0] > 0){
              ctx.drawImage(tile,40*tileMap.tiles[i][j].corner[0]-40,0,40,40,i*tileMap.tileWidth+20,j*tileMap.tileHeight-20,40,40)
            }
            if (tileMap.tiles[i][j].corner[1] > 0){
              ctx.drawImage(tile,40*tileMap.tiles[i][j].corner[1]-40,40,40,40,i*tileMap.tileWidth+20,j*tileMap.tileHeight+20,40,40)
            }
            if (tileMap.tiles[i][j].corner[2] > 0){
              ctx.drawImage(tile,40*tileMap.tiles[i][j].corner[2]-40,120,40,40,i*tileMap.tileWidth-20,j*tileMap.tileHeight+20,40,40)
            }
            if (tileMap.tiles[i][j].corner[3] > 0){
              ctx.drawImage(tile,40*tileMap.tiles[i][j].corner[3]-40,80,40,40,i*tileMap.tileWidth-20,j*tileMap.tileHeight-20,40,40)
            }
            
          tileMap.tiles[i][j].explored = true;
          }
          else if (tileMap.tiles[i][j].type == -1) {
            ctx.fillStyle = "#ff0000";
            //ctx.fillRect(i*tileMap.tileWidth,j*tileMap.tileHeight,tileMap.tileWidth,tileMap.tileHeight);
          }
          else if (tileMap.tiles[i][j].type == -2) {
            ctx.fillStyle = "#00ff00";
            //ctx.fillRect(i*tileMap.tileWidth,j*tileMap.tileHeight,tileMap.tileWidth,tileMap.tileHeight);
          }
        }
      }
    }

    //shade caves
    for (let i = 0; i < tileMap.caves.length; i++){
      for (let j = 0; j < tileMap.caves[i].tiles.length; j++){
        if (i % 6 == 0)
        ctx.fillStyle = "#609060";
        else
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(tileMap.caves[i].tiles[j][0]*tileMap.tileWidth,tileMap.caves[i].tiles[j][1]*tileMap.tileHeight,tileMap.tileWidth,tileMap.tileHeight);
      }
      //shade min and max tiles
      ctx.fillStyle = "#ffffff"
      // ctx.fillRect(tileMap.caves[i].maxY[0]*tileMap.tileWidth,tileMap.caves[i].maxY[1]*tileMap.tileHeight,tileMap.tileWidth,tileMap.tileHeight);
      // ctx.fillRect(tileMap.caves[i].minY[0]*tileMap.tileWidth,tileMap.caves[i].minY[1]*tileMap.tileHeight,tileMap.tileWidth,tileMap.tileHeight);
      // ctx.fillRect(tileMap.caves[i].minX[0]*tileMap.tileWidth,tileMap.caves[i].minX[1]*tileMap.tileHeight,tileMap.tileWidth,tileMap.tileHeight);
      // ctx.fillRect(tileMap.caves[i].maxX[0]*tileMap.tileWidth,tileMap.caves[i].maxX[1]*tileMap.tileHeight,tileMap.tileWidth,tileMap.tileHeight);
    }
  
    //draw player
    player.draw();

    //update jonathan
    //jonathan.update();
    //draw jonathan
    // ctx.fillStyle = "#ffff00";
    // ctx.fillRect(jonathan.x,jonathan.y,10,20);
    // ctx.strokeStyle = "#0000ff";
    // ctx.beginPath();
    // ctx.moveTo(jonathan.x,jonathan.y);
    // ctx.lineTo(jonathan.x+jonathan.direction.components[0]*100,jonathan.y+jonathan.direction.components[1]*100);
    // ctx.stroke();
    // ctx.strokeRect(jonathan.x-jonathan.range*tileMap.tileWidth,jonathan.y-jonathan.range*tileMap.tileHeight,jonathan.range*2*tileMap.tileWidth,jonathan.range*2*tileMap.tileHeight);
    // ctx.strokeStyle = "#00ff00";
    // ctx.strokeRect(jonathan.x-jonathan.targetRange,jonathan.y-jonathan.targetRange,jonathan.targetRange*2,jonathan.targetRange*2);

    // //draw superDash
    // ctx.fillStyle = "#ff0000"
    // ctx.fillRect(player.x-player.width,player.y-player.height,player.width*2,player.superDashTimer/4)
  
  
  //no transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

  //draw map
  ctx.fillStyle = "#ffffff";
  //ctx.fillRect(10,10,210,210)
  for (let i = 0; i < tileMap.tiles.length; i++) {
    for (let j = 0; j < tileMap.tiles[i].length; j++) {
      if (tileMap.tiles[i][j].explored == true) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(10+i*1,10+j*1,1,1);
      }
    }
  }
  ctx.fillStyle = "#0000ff";
  ctx.fillRect(10+player.x/tileMap.tileWidth-1,10+player.y/tileMap.tileHeight-1,3,3);
}

function clearScreen() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

function keyUpdate() {
  if (keyPressed(38)){
    player.jump();
  }
  else if (player.doubleJumpCounter == 0) {
    player.doubleJumpCounter = 1;
  }
  if (keyPressed(37)) {
    player.moveLeft();
  }
  else if (keyPressed(39)) {
    player.moveRight();
  }
  if (keyPressed(90)) {
    player.superDash();
  }
  else {
    if(player.superDash < 48) {
      player.superDashTimer = toLimit(player.superDashTimer,-1,0);
    }
  }
  if(keyPressed(76)){
    activeCam = 1;
  }
  else {
    activeCam = 0;
  }
}