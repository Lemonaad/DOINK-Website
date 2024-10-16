function keyPressed (key) {
  if (!keys[key+'handled']){
    keys[key+'handled'] = true;
    return true;
  }
  return keys[key]
}

/**
Adds the amount until number equals the limit
*/
function toLimit(number,amount,limit){
  if(amount < 0){
    if (number + amount < limit){
      return limit;
    }
    return number + amount;
  }
  else {
    if (number + amount > limit){
      return limit;
    }
    return number + amount;
  }
}

function legJoint(x1t,y1t,r1,x2t,y2t,r2,left){
  let x1 = 0;
  let y1 = 0;
  let x2 = x2t - x1t;
  let y2 = y2t - y1t;
  let d1 = Math.sqrt((x1-x2)**2+(y1-y2)**2);
  let a = (r1**2-r2**2+d1**2)/2/d1;
  let h = Math.sqrt(r1**2-a**2);
  if(h){
    return [x1t+a/d1*(x2-x1)+h/d1*(y2-y1)*(left-0.5)*2*(-1),y1t+a/d1*(y2-y1)+h/d1*(x2-x1)*(left-0.5)*2];
  }
}

function createLine (sx,sy,ex,ey,width) {
  if (Math.abs(sx-ex) <= Math.abs(sy-ey)){
    for (let i = Math.floor(width/2); i < Math.floor(width/2)+width; i++) {
      tileMap.lines.push([sx+i,sy,ex+i,ey]);
    }
  }
  else {
    for (let i = Math.floor(width/2); i < Math.floor(width/2)+width; i++) {
      tileMap.lines.push([sx,sy+i,ex,ey+i]);
    } 
  }
}