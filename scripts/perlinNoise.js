class Random {

  constructor(seed) {
      this.modulus = 2147483647;
      this.multiplier = 16807;
      this.quo = 127773;
      this.rem = 2836;
      if (seed) {
        this.seed = seed;
      }
      else {
        this.seed = 1;
      }
  }

  setSeed(seed) {
      if (seed <= 0) {
          seed = -(seed % (this.modulus - 1)) + 1;
      }
      if (seed > this.modulus - 1) {
          seed = this.modulus - 1;
      }
      this.seed = seed;
  }

  next() {
      let result = this.multiplier * (this.seed % this.quo) - this.rem * Math.floor(this.seed / this.quo);
      if (result <= 0) {
          result += this.modulus;
      }
      this.seed = result;
      return result / this.modulus;
  }
}


function PerlinSampler2D(width, height, randseed) {
    this.width = width;
    this.height = height;
    this.randseed = randseed;
    this.gradients = new Array(width * height * 2);

    var rand = new Random();
    rand.setSeed(randseed);
    for (var i = 0; i < this.gradients.length; i += 2) {
      var x, y;

      var angle = rand.next() * Math.PI * 2;
      x = Math.sin(angle);
      y = Math.cos(angle);

      this.gradients[i] = x;
      this.gradients[i + 1] = y;
    }
    
    this.dot = function(cellX, cellY, vx, vy) {
      var offset = (cellX + cellY * this.width) * 2;
      var wx = this.gradients[offset];
      var wy = this.gradients[offset + 1];
      return wx * vx + wy * vy;
    };
    
    this.lerp = function(a, b, t) {
      return a + t * (b - a);
    };
    
    this.sCurve = function(t) {
      return t * t * (3 - 2 * t);
    };
    
    this.getValue = function(x, y) {
      var xCell = Math.floor(x);
      var yCell = Math.floor(y);
      var xFrac = x - xCell;
      var yFrac = y - yCell;
      
      var x0 = xCell;
      var y0 = yCell;
      var x1 = xCell === this.width - 1 ? 0 : xCell + 1;
      var y1 = yCell === this.height - 1 ? 0 : yCell + 1;
      
      
      
      var v00 = this.dot(x0, y0, xFrac, yFrac);
      var v10 = this.dot(x1, y0, xFrac - 1, yFrac);
      var v01 = this.dot(x0, y1, xFrac, yFrac - 1);
      var v11 = this.dot(x1, y1, xFrac - 1, yFrac - 1);
      
      var vx0 = this.lerp(v00, v10, this.sCurve(xFrac));
      var vx1 = this.lerp(v01, v11, this.sCurve(xFrac));
      
      return this.lerp(vx0, vx1, this.sCurve(yFrac));
    };
}

/*function Image(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Array(width * height * 4);

    this.setRgba = function(x, y, r, g, b, a) {
      var offset = ((y * this.width) + x) * 4;
      
      this.data[offset] = r;
      this.data[offset + 1] = g;
      this.data[offset + 2] = b;
      this.data[offset + 3] = a;
    };

    this.createPerlinNoise = function(period, randseed) {
      var sampler = new PerlinSampler2D(Math.ceil(this.width / period), Math.ceil(this.height / period), randseed);
      
      for (var j = 0; j < this.height; ++j) {
        for (var i = 0; i < this.width; ++i) {
          var val = sampler.getValue(i / period, j / period);
          var b = (val + 1) / 2 * 256;
          
          this.setRgba(i, j, 
          b, b, b, 0xff);
        }
      }
    };
    
    this.toImageContext = function(ctx) {
      var imgData = ctx.createImageData(this.width, this.height);

      for (var i = 0, len = width * height * 4; i < len; i++) {
        imgData.data[i] = this.data[i];
      }
      
      return imgData;
    };
}
*/