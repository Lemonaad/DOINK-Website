class Enemy {
  constructor (x,y){
    this.x = x;
    this.y = y;
  }
}

class FlyingEnemy {
  constructor (x,y,speed,range,targetRange){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.direction = new Vector(0,0);
    this.speed = speed;
    this.range = range;
    this.targetRange = targetRange;
    this.cellX, this.cellY;
  }

  calcCell(tileMap) {
    this.cellX = (this.x-this.x%tileMap.tileWidth)/tileMap.tileWidth;
    this.cellY = (this.y-this.y%tileMap.tileHeight)/tileMap.tileHeight;
  }

  update() {
    this.calcCell(tileMap);

    //reset direction
    this.direction = new Vector(0,0);

    //negative vectors
    for (let i = -this.range-1; i < this.range+1; i++){
      for (let j = -this.range-1; j < this.range+1; j++){
        for (let k = 0; k < 5; k++){
          if ((k == 4 && tileMap.getTile(this.cellX+i,this.cellY+j).type == 1) || tileMap.getTile(this.cellX+i,this.cellY+j).corner[k] > 0){
            let tempVector = new Vector((this.cellX+i)*tileMap.tileWidth-this.x,(this.cellY+j)*tileMap.tileHeight-this.y);
            if (k == 0 || k == 1){
              tempVector.components[0] += 40;
            }
            else if (k == 1 || k == 3){
              tempVector.components[1] += 40;
            }
            else if (k == 5){
              tempVector.components[0] += 20;
              tempVector.components[1] += 20;
            }
            

            tempVector = tempVector.withLength(tileMap.tileWidth*10*this.range/tempVector.length());
            
            ctx.strokeStyle = "#ff0000";
            // ctx.beginPath();
            // ctx.moveTo(this.x,this.y);
            // ctx.lineTo(this.x+tempVector.components[0]*1,this.y+tempVector.components[1]*1);
            // ctx.stroke();

            this.direction = this.direction.subtract(tempVector);
          }
        }      
      }
    }
    // //positive vectors
     if(this.direction.length() != 0)
       this.direction = this.direction.withLength(this.direction.length()/1);
    
    if (Math.abs(player.x - this.x) < this.targetRange && Math.abs(player.y - this.y) < this.targetRange) {
      let tempVector = new Vector(player.x - this.x,player.y - this.y);
      tempVector = tempVector.withLength(toLimit(this.targetRange-tempVector.length(),0,200)/2);
      ctx.strokeStyle = "#00ff00";
      //ctx.beginPath();
      //ctx.moveTo(this.x,this.y);
      // ctx.lineTo(this.x+tempVector.components[0]*1,this.y+tempVector.components[1]*1);
      // ctx.stroke();
      this.direction = this.direction.add(tempVector);
    }
    else {
      this.vx = this.vx/2;
      this.vy = this.vy/2;
    }


    this.direction = this.direction.withLength(this.speed/20);
    this.vx += this.direction.components[0];
    this.vy += this.direction.components[1];
    if (this.vy > this.speed) {
      this.vy = this.speed;
    }
    if (this.vy < -this.speed) {
      this.vy = -this.speed;
    }
    if (this.vx > this.speed) {
      this.vx = this.speed;
    }
    if (this.vx < -this.speed) {
      this.vx = -this.speed;
    }
    this.x += this.vx;
    this.y += this.vy;
  }

  debug() {
    
  }
}

class Krymeniod extends FlyingEnemy {
  constructor (x,y,speed){
    super(x,y,speed,2,600);
  }

  update() {
    super.update();
  }
}