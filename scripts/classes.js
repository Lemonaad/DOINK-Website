const tilesAround = [[0,0],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]

class Player {
  constructor (x,y,maxSpeedx,jumpHeight,floatTime,health){
    
    this.x = x;
    this.y = y;
    this.vx = 3;
    this.vy = 0;
    this.maxSpeedx = maxSpeedx;
    this.jumpHeight = jumpHeight;
    this.maxHealth = health;
    this.health = health;

    this.floatTime = floatTime;
    this.onGround = 0;
    this.onCeiling = false;
    this.onLeft = false;
    this.onRight = false;
    this.xCancelTimer = 0;
    this.yCancelTimer = 0;

    this.terminalVelocity = 10;

    this.canDoubleJump = true;
    this.doubleJumpCounter = 0;
    this.canWallJump = true;
    
    this.width = 6;
    this.height = 6;
    
    this.cellX = 0;
    this.cellY = 0;
  }

  move(tilemap) {
    
    
    //collisions go here
    this.calcCell(tilemap);

    //friction
    if (!keyPressed(37) && !keyPressed(39)) {
      if(this.xCancelTimer == 0){
        if(this.vx > 0){
          this.vx = toLimit(this.vx,-0.3,0);
        }
        else if (this.vx < 0){
          this.vx = toLimit(this.vx,0.3,0);
        }
      }
      else if (this.xCancelTimer > 0) {
        this.xCancelTimer = toLimit(this.xCancelTimer,-1,0);
      }
      else {
        this.xCancelTimer = toLimit(this.xCancelTimer,1,0)
      }
    }
      
    //calc right
    if(
      tilemap.tiles[this.cellX + 1][this.cellY].type > 0 //is solid and
      && this.x+this.vx+this.width >= (this.cellX + 1)*tilemap.tileWidth//will be in the way
    ){
      this.x = (this.cellX+1)*tilemap.tileWidth-this.width;
      this.vx = 0;
      this.onRight = true;
    }
    else {
      this.onRight = false;
    }

    //calc left
    if(
      tilemap.tiles[this.cellX - 1][this.cellY].type > 0 //is solid and
      && this.x+this.vx-this.width <= this.cellX*tilemap.tileWidth//will be in the way
    ){
      this.x = this.cellX*tilemap.tileWidth+this.width;
      this.vx = 0;
      this.onLeft = true;
    }
    else {
      this.onLeft = false;
    }
    
    //calc bottom
    if(
      tilemap.tiles[this.cellX][this.cellY + 1].type > 0 //is solid and
      && this.y+this.vy+this.height >= (this.cellY + 1)*tilemap.tileWidth//will be in the way
      ||  tilemap.tiles[this.cellX + 1][this.cellY + 1].type > 0 //is solid and
      && this.y+this.vy+this.height >= (this.cellY + 1)*tilemap.tileWidth//will be in the way
      && this.x+this.vx+this.width > (this.cellX + 1)*tilemap.tileWidth//will be in the way
      ||  tilemap.tiles[this.cellX - 1][this.cellY + 1].type > 0 //is solid and
      && this.y+this.vy+this.height >= (this.cellY + 1)*tilemap.tileWidth//will be in the way
      && this.x+this.vx-this.width < this.cellX*tilemap.tileWidth//will be in the way
    ){
      // screen shake on landing if velocity is high
      // if (this.vy >= 10) {
      //   cameras[activeCam].shake(4);
      // }
      this.y = (this.cellY+1)*tilemap.tileHeight-this.height;
      this.vy = 0;
      this.onGround = 0;
      this.doubleJumpCounter = 0;
    }
    else if (this.onRight || this.onLeft) {
      this.vy = toLimit(this.vy,0.3,1);
      this.onGround += 1;
    }
    else if (this.yCancelTimer > 0){
      this.yCancelTimer -= 1;
    }
    else if (this.onGround != 0) {
      this.vy = toLimit(this.vy,0.3,this.terminalVelocity);
      this.onGround += 1;
    }
    else {
      this.onGround += 1;
    }

    //calc top
    if(
      tilemap.tiles[this.cellX][this.cellY - 1].type > 0 //is solid and
      && this.y+this.vy-this.height <= this.cellY*tilemap.tileHeight//will be in the way
      ||  tilemap.tiles[this.cellX + 1][this.cellY - 1].type > 0 //is solid and
      && this.y+this.vy-this.height <= this.cellY*tilemap.tileHeight//will be in the way
      && this.x+this.vx+this.width > (this.cellX + 1)*tilemap.tileWidth//will be in the way
      ||  tilemap.tiles[this.cellX - 1][this.cellY - 1].type > 0 //is solid and
      && this.y+this.vy-this.height <= this.cellY*tilemap.tileHeight//will be in the way
      && this.x+this.vx-this.width < this.cellX*tilemap.tileWidth//will be in the way
    ){
      this.y = this.cellY*tilemap.tileHeight+this.height;
      this.vy = 0;
      this.onCeiling = true;
    }
    
    this.x += this.vx;
    this.y += this.vy;
  }

  moveLeft() {
    if(this.xCancelTimer < 0){
      this.xCancelTimer += 1;
    }
    else if(this.xCancelTimer > 0){
      this.xCancelTimer = 0;
      this.vx = toLimit(this.vx,-1,-1*this.maxSpeedx);  
    }
    else {
      this.vx = toLimit(this.vx,-1,-1*this.maxSpeedx);   
    }
  }

  moveRight() {
    if(this.xCancelTimer > 0){
      this.xCancelTimer -= 1;
    }
    else if(this.xCancelTimer < 0){
      this.xCancelTimer = 0;
      this.vx = toLimit(this.vx,1,this.maxSpeedx);  
    }
    else {
      this.vx = toLimit(this.vx,1,this.maxSpeedx);   
    }
  }

  jump() {
    if (this.onGround < this.floatTime) {
      this.vy = -1*this.jumpHeight;
    }
    //wallJump
    else if (this.canWallJump){
      if(this.onRight){
        this.vy = -1*this.jumpHeight;
        this.vx -= this.maxSpeedx;
        this.xCancelTimer += this.jumpHeight;
        this.doubleJumpCounter = 0;
      }
      else if (this.onLeft){
        this.vy = -1*this.jumpHeight;
        this.vx += this.maxSpeedx;
        this.xCancelTimer -= this.jumpHeight;
        this.doubleJumpCounter = 0;
      }
        
      //doubleJump
      else if (this.canDoubleJump){
        if (this.doubleJumpCounter == 1 && this.onGround > 5){
          this.vy = -1*this.jumpHeight;
          this.doubleJumpCounter += 1;
        }
        else {
          //failed double jump
        }
      }
    }
  }

  superDash() {
    //coming soon...
  }

  calcCell(tileMap) {
    this.cellX = (this.x-this.x%tileMap.tileWidth)/tileMap.tileWidth;
    this.cellY = (this.y-this.y%tileMap.tileHeight)/tileMap.tileHeight;
  }

  draw() {
    ctx.fillStyle = "#0000ff";
    ctx.fillRect(this.x-this.width,this.y-this.height,this.width*2,this.height*2);
  }
}

class Camera {
  constructor (x,y,follow,maxSpeed){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.maxSpeed = maxSpeed;
    this.follow = follow;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }

  move() {
    //remove shake
    this.x -= this.shakeOffsetX;
    this.y -= this.shakeOffsetY;

    //do x
    let idealx = - this.follow.x + canvas.width/2;
    let idealvx = Math.min(Math.ceil((idealx - this.x)/10),this.maxSpeed);
    if (this.x < idealx){
      if (this.vx < idealvx){
        this.vx += 1;
      }
      else {
        this.vx = idealvx;
      }
    }
    else if (this.x > idealx){
      if (this.vx > idealvx){
        this.vx -= 1;
      }
      else {
        this.vx = idealvx;
      }
    }
    if (Math.abs(this.x - idealx) < this.vx){
      this.x = idealx;
    }
    else {
      this.x += this.vx;  
    }

    //do y
    let idealy = - this.follow.y + canvas.height/2;
    let idealvy = Math.min(Math.ceil((idealy - this.y)/10),this.maxSpeed);
    if (this.y < idealy){
      if (this.vy < idealvy){
        this.vy += 1;
      }
      else {
        this.vy = idealvy;
      }
    }
    else if (this.y > idealy){
      if (this.vy > idealvy){
        this.vy -= 1;
      }
      else {
        this.vy = idealvy;
      }
    }
    if (Math.abs(this.y - idealy) < this.vy){
      this.y = idealy;
    }
    else {
      this.y += this.vy;  
    }

    //do shake
    if(this.shakeStrength > 0){
      this.shakeOffsetX = ((-1)**(this.shakeStrength%2))*Math.random()*this.shakeStrength;
      this.shakeOffsetY = ((-1)**(this.shakeStrength%2))*Math.random()*this.shakeStrength;
      this.shakeStrength -= 1;
    }
    else {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
      this.shakeStrength = 0;
    }
    
    this.x += this.shakeOffsetX;
    this.y += this.shakeOffsetY;
  }

  shake(strength) {
    this.shakeStrength = Math.floor(strength+Math.random()*2);
  }
}

class TileMap {
  constructor (width, height, tileWidth, tileHeight){
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.lines = [];
    this.caves = [];
    this.unused = [];

    this.randseed = Math.floor(Math.random()*1000);

    let rand = new Random(this.randseed);

    for (let i = 0; i < width; i++){
      this.tiles.push([]);
      for (let j = 0; j < height; j++){
        if (i >= 3 && j >= 3 && i <= 5 && j <= 5){
          this.tiles[i].push(new Tile(0))
        }
        else { 
          this.tiles[i].push(new Tile(Math.floor(rand.next()*2))); 
        }
      }
    }
  }

  generateRandom() {
    let rand = new Random(this.randseed);
    this.tiles = [];

    for (let i = 0; i < this.width; i++) {
      this.tiles.push([]);
      for (let j = 0; j < this.height; j++) {
        if (i >= 3 && j >= 3 && i <= 5 && j <= 5) {
          this.tiles[i].push(new Tile(0))
        }
        else {
          this.tiles[i].push(new Tile(Math.floor(rand.next()*2))); 
        }
      }
    }
  }

  generatePerlinRandom() {
    let period = 10;
    let sampler = new PerlinSampler2D(Math.ceil(this.width*this.tileWidth / period), Math.ceil(this.height*this.tileHeight / period), this.randseed);
    
    this.tiles = []
    for (let i = 0; i < this.height; i++){
      this.tiles.push([])
      for (let j = 0; j < this.width; j++){
        if (i >= 3 && j >= 3 && i <= 5 && j <= 5){
          this.tiles[i].push(new Tile(0));
        }
        else if (i == 1 || i == this.height - 2 || j == 1 || j == this.width - 2){
          this.tiles[i].push(new Tile(1));
        }
        else {
          if ((sampler.getValue(i / period, j / period) + 1)/2 > 0.5) {
            this.tiles[i].push(new Tile(0));
          }
          else {
            this.tiles[i].push(new Tile(1));
          }
        }
      }
    }
  }

  connectCaves() {
    for (let i = 0; i < this.caves.length; i++) {
      if (this.caves[i].tiles.length < 4){
        for (let j = 0; j < this.caves[i].tiles.length; j++) {
          this.getTile(this.caves[i].tiles[j].x, this.caves[i].tiles[j].y).type = 1;
        }
      }
      else {
        for (let j = i + 1; j < this.caves.length; j++) {
          this.caves[i].connectTo(this.caves[j]);
        }
      }
    }

    this.hollowLines();
  }

  hollowLines() {
    for (let i = 0; i < this.lines.length; i++) {
      let slope = (this.lines[i][1]-this.lines[i][3])/(this.lines[i][0]-this.lines[i][2]);
      if (slope == Infinity || slope == -Infinity) {
        for (let j = Math.min(this.lines[i][1],this.lines[i][3]); j <= Math.max(this.lines[i][1],this.lines[i][3]); j++) {
          this.getTile(Math.floor(this.lines[i][0]), Math.floor(j)).type = -1;
        }
      }
      else if (Math.abs(slope) <= 1){
        for (let j = Math.min(this.lines[i][0],this.lines[i][2]); j <= Math.max(this.lines[i][0],this.lines[i][2]); j++) {
          this.getTile(Math.floor(j),Math.floor(slope*(j-Math.min(this.lines[i][0],this.lines[i][2]))+this.lines[i][1])).type = -1;
        }
      }
      else {
        for (let j = Math.min(this.lines[i][1],this.lines[i][3]); j <= Math.max(this.lines[i][1],this.lines[i][3]); j++) {
          this.getTile(Math.floor(1/slope*(j-Math.min(this.lines[i][1],this.lines[i][3]))+this.lines[i][0]),Math.floor(j)).type = -1;
        }
      }
    }
    this.lines = [];
  }

  fourFiveRule() {
    let tempTiles = [];
    for (let i = 0; i < this.tiles.length; i++){
      tempTiles.push([]);
      for (let j = 0; j < this.tiles[i].length; j++){
        tempTiles[i].push(new Tile(0));
        if (i > 2 && i < this.tiles.length - 2 && j > 2 && j < this.tiles[i].length - 2){
          if (i >= 3 && j >= 3 && i <= 5 && j <= 5){
            tempTiles[i][j].type = 0;
          }
          else {
            let tempTileCounter = 0;
            for (let k = 0; k < tilesAround.length; k++){
              if (this.tiles[i+tilesAround[k][0]][j+tilesAround[k][1]].type > 0){
                tempTileCounter += 1;
              }
            }
            if (tempTileCounter > 4){
              tempTiles[i][j].type = 1;
            }
          }
        }
        else {
          //this makes the border of the world solid
          tempTiles[i][j].type = 1;
        }
      }
    }
    this.tiles = tempTiles;
  }

  seperateCaves() {
    //caves
    this.caves = [];
    this.unused = [];

    //use flood fill to seperate the tiles into caves
    for (let i = 0; i < this.tiles.length; i++) {
      this.unused.push([]);
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (i > 1 && i < this.tiles.length - 1 && j > 1 && j < this.tiles[i].length - 1) {
          this.unused[i].push(this.tiles[i][j].type);
        }
        else {
          this.unused[i].push(1);
        }
      }
    }

    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (this.unused[i][j] == 0) {
          this.caves.push(new Cave(i,j));
          this.floodSeperate(i, j);
        }
      }
    }
  }

  labelTiles() {
    //corners
    for (let i = 0; i < this.tiles.length; i++){
      for (let j = 0; j < this.tiles[i].length; j++){
        if (i > 1 && i < this.tiles.length - 1 && j > 1 && j < this.tiles[i].length - 1){
          let tilesAroundCounter = [];
          for (let k = 0; k < tilesAround.length; k++){
            if (this.tiles[i+tilesAround[k][0]][j+tilesAround[k][1]].type > 0 && this.tiles[i][j].type > 0){
              tilesAroundCounter.push(1);
            }
            else {
              tilesAroundCounter.push(0);
            }
          }
          // top right
          if ((tilesAroundCounter)[1] < 1 && (tilesAroundCounter)[7] < 1) {
            this.tiles[i][j].corner[0] = 4
          }
          else if ((tilesAroundCounter)[1] < 1 /* rs */) {
            this.tiles[i][j].corner[0] = 3
          }
          else if ((tilesAroundCounter)[7] < 1 /* ts */) {
            this.tiles[i][j].corner[0] = 1
          }
          else if ((tilesAroundCounter)[8] < 1 /* tr */) {
            this.tiles[i][j].corner[0] = 2
          }
          else {
            this.tiles[i][j].corner[0] = 0;
          }

          // bottom right
          if ((tilesAroundCounter)[1] < 1 && (tilesAroundCounter)[3] < 1) {
            this.tiles[i][j].corner[1] = 4
          }
          else if ((tilesAroundCounter)[1] < 1 /* rs */) {
            this.tiles[i][j].corner[1] = 3
          }
          else if ((tilesAroundCounter)[3] < 1 /* bs */) {
            this.tiles[i][j].corner[1] = 1
          }
          else if ((tilesAroundCounter)[2] < 1 /* br */) {
            this.tiles[i][j].corner[1] = 2
          }
          else {
            this.tiles[i][j].corner[1] = 0;
          }

          // bottom left
          if ((tilesAroundCounter)[5] < 1 && (tilesAroundCounter)[3] < 1) {
            this.tiles[i][j].corner[2] = 4
          }
          else if ((tilesAroundCounter)[5] < 1 /* ls */) {
            this.tiles[i][j].corner[2] = 3
          }
          else if ((tilesAroundCounter)[3] < 1 /* bs */) {
            this.tiles[i][j].corner[2] = 1
          }
          else if ((tilesAroundCounter)[4] < 1 /* bl */) {
            this.tiles[i][j].corner[2] = 2
          }
          else {
            this.tiles[i][j].corner[2] = 0;
          }

          // top left
          if ((tilesAroundCounter)[5] < 1 && (tilesAroundCounter)[7] < 1) {
            this.tiles[i][j].corner[3] = 4
          }
          else if ((tilesAroundCounter)[5] < 1 /* ls */) {
            this.tiles[i][j].corner[3] = 3
          }
          else if ((tilesAroundCounter)[7] < 1 /* ts */) {
            this.tiles[i][j].corner[3] = 1
          }
          else if ((tilesAroundCounter)[6] < 1 /* tl */) {
            this.tiles[i][j].corner[3] = 2
          }
          else {
            this.tiles[i][j].corner[3] = 0;
          }
        }
      }
    }
  }

  getTile(i, j) {
    if (i > 1 && i < this.tiles.length - 1 && j > 1 && j < this.tiles[i].length - 1){
      return this.tiles[i][j];
    }
    else {
      return new Tile(2);
    }
  }

  floodSeperate(i, j) {
    try {
      if (this.unused[i][j] <= 0) {
        this.unused[i][j] = 1;
        this.caves[this.caves.length-1].tiles.push([i,j]);
        if (i < this.caves[this.caves.length-1].minX[0]) {
          this.caves[this.caves.length-1].minX = [i,j];
        }
        if (i > this.caves[this.caves.length-1].maxX[0]) {
          this.caves[this.caves.length-1].maxX = [i,j];
        }
        if (j < this.caves[this.caves.length-1].minY[1]) {
          this.caves[this.caves.length-1].minY = [i,j];
        }
        if (j > this.caves[this.caves.length-1].maxY[1]) {
          this.caves[this.caves.length-1].maxY = [i,j];
        }

        this.floodSeperate(i-1, j);
        this.floodSeperate(i+1, j);
        this.floodSeperate(i, j-1);
        this.floodSeperate(i, j+1);
      }
    } catch (e) {
      console.log(i,j);
    }
  }

  floodFill(i, j, fillType, floodType) {
    try {
      if (this.tiles[i][j].type == 0) {
        this.tiles[i][j].type = fillType;
        this.caves[this.caves.length-1].tiles.push([i,j]);
        if (i < this.caves[this.caves.length-1].minX[0]) {
          this.caves[this.caves.length-1].minX = [i,j];
        }
        if (i > this.caves[this.caves.length-1].maxX[0]) {
          this.caves[this.caves.length-1].maxX = [i,j];
        }
        if (j < this.caves[this.caves.length-1].minY[1]) {
          this.caves[this.caves.length-1].minY = [i,j];
        }
        if (j > this.caves[this.caves.length-1].maxY[1]) {
          this.caves[this.caves.length-1].maxY = [i,j];
        }

        this.floodFill(i-1, j, fillType, floodType);
        this.floodFill(i+1, j, fillType, floodType);
        this.floodFill(i, j-1, fillType, floodType);
        this.floodFill(i, j+1, fillType, floodType);
      }
    } catch (e) {
      console.log(i,j,e);
    }
  }

  idk() {
    //this.unused = [];

    for (let i = 0; i < this.tiles.length; i++) {
      //this.unused.push([]);
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (i > 1 && i < this.tiles.length - 1 && j > 1 && j < this.tiles[i].length - 1) {
          //this.unused[i].push(this.getTile(i,j).type);
          
        }
        else {
          this.tiles[i][j].type = 1;
          //this.unused[i].push(1);
        }
      }
    }

    this.caves = [];

    loopOnce: for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j].type == 0) {
          this.caves.push(new Cave(i,j));
          this.floodFill(i, j, -1, 0);
          break loopOnce;
        }
      }
    }

    this.connectTwoCaves();
  }

  connectTwoCaves() {
    let next = [this.caves[0].minX[0], this.caves[0].minX[1]];
    let que = [];
    let direction = 0;

    //clear 2s from tiles
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j].type == 2) {
          this.tiles[i][j].type = 1;
        }
      }
    }

    //trace cave border
    while(que.length == 0 || (next[0] != que[0][0][0] || next[1] != que[0][0][1])) {
      que.push([next,next]);
      for (let i = 0; i < 5; i++) {
        //if tile to the right is solid
        if (this.tiles[next[0]+tilesAround[((direction+3)%4)*2+1][0]][next[1]+tilesAround[((direction+3)%4)*2+1][1]].type == 1) {
          if (this.tiles[next[0]+tilesAround[((direction+4)%4)*2+1][0]][next[1]+tilesAround[((direction+4)%4)*2+1][1]].type == -1) {
            if (this.tiles[next[0]+tilesAround[((direction+3)%4)*2+2][0]][next[1]+tilesAround[((direction+3)%4)*2+2][1]].type == -1) {
              next = [next[0]+tilesAround[((direction+3)%4)*2+2][0],next[1]+tilesAround[((direction+3)%4)*2+2][1]];
            }
            else {
              next = [next[0]+tilesAround[((direction+4)%4)*2+1][0],next[1]+tilesAround[((direction+4)%4)*2+1][1]];
            }
            break;
          }
        }
        direction++;  
        direction %= 4;
        if (i == 4){
          console.log('error',next);
        }
      }
    }
    
    //bfs for other caves
    while (que.length > 0) {
      let firstInQue = que.shift();
      for (let i = 0; i < 4; i++) {
        next = [firstInQue[0][0]+tilesAround[i*2+1][0],firstInQue[0][1]+tilesAround[i*2+1][1]];
        if (next[0] > 1 && next[1] > 1 && next[0] < this.tiles.length - 1 && next[1] < this.tiles[next[0]].length - 1) {
          if (this.tiles[next[0]][next[1]].type == 0) {
            this.floodFill(next[0], next[1], -1, 0);
            createLine(next[0], next[1], firstInQue[1][0], firstInQue[1][1], 2);
            this.hollowLines();
            this.connectTwoCaves();
            return;
          }
          else if (this.tiles[next[0]][next[1]].type == 1) {
            que.push([[next[0],next[1]],[firstInQue[1][0],firstInQue[1][1]]]);
            this.tiles[next[0]][next[1]].type = 2;
          }
        } 
      }
    }
  }

  isThereAnyEmptyCaves() {
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        if (this.unused[i][j] == 0) {
          return true;
        }
      }
    }
    return false;
  }
}

class Cave {
  constructor (x, y) {
    this.maxX = [x,y];
    this.maxY = [x,y];
    this.minX = [x,y];
    this.minY = [x,y];
    this.size = 0;
    
    this.tiles = [];
  }

  connectTo (cave) {
    if (Math.abs(cave.minX[0] - this.maxX[0]) + Math.abs(cave.minX[1] - this.maxX[1]) < distance) {
      this.createLine(this.maxX[0], this.maxX[1], cave.minX[0], cave.minX[1], 2);
      // tileMap.lines.push([this.maxX[0], this.maxX[1], cave.minX[0], cave.minX[1]]);
      // tileMap.lines.push([this.maxX[0]-1, this.maxX[1]+1, cave.minX[0]-1, cave.minX[1]+1]);
    }
    if (Math.abs(cave.minY[0] - this.maxY[0]) + Math.abs(cave.minY[1] - this.maxY[1]) < distance) {
      this.createLine(this.maxY[0], this.maxY[1], cave.minY[0], cave.minY[1], 2);
      // tileMap.lines.push([this.maxY[0], this.maxY[1], cave.minY[0], cave.minY[1]]);
      // tileMap.lines.push([this.maxY[0]-1, this.maxY[1]+1, cave.minY[0]-1, cave.minY[1]+1]);
    }
    if (Math.abs(cave.maxX[0] - this. minX[0]) + Math.abs(cave.maxX[1] - this. minX[1]) < distance) {
      this.createLine(this.minX[0], this.minX[1], cave.maxX[0], cave.maxX[1], 2);
      // tileMap.lines.push([this.minX[0], this.minX[1], cave.maxX[0], cave.maxX[1]]);
      // tileMap.lines.push([this.minX[0]-1, this.minX[1]+1, cave.maxX[0]-1, cave.maxX[1]+1]);
    }
    if (Math.abs(cave.maxY[0] - this.minY[0]) + Math.abs(cave.maxY[1] - this.minY[1]) < distance) {
      this.createLine(this.minY[0], this.minY[1], cave.maxY[0], cave.maxY[1], 2);
      // tileMap.lines.push([this.minY[0], this.minY[1], cave.maxY[0], cave.maxY[1]]);
      // tileMap.lines.push([this.minY[0]-1, this.minY[1]+1, cave.maxY[0]-1, cave.maxY[1]+1]);
    }
  }
}

class Tile {
  constructor (type) {
    this.type = type;
    this.corner = [];
    this.explored = false;
  }
}