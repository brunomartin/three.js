/**
 * @author brunocmartin /
 *
 * A Wavefront Object.
 */

THREE.Wavefront = function ( size, divisions ) {

  const WavefrontType = {
    NORMAL: 'normal',
    TEST_DIRECTION: 'test direction',
    TEST_PLANE: 'test plane'
  }

  this.wavefrontType = WavefrontType.NORMAL;

  this.size = size;
  this.divisions = divisions;
  this.amplitude = 1;
  this.spacialFrequency = 2;
  this.frequency = 10;
  this.speed = 100;
  this.direction = new THREE.Vector3(0, 0, 1);

  this.directionChangeCount = 0;

  this.startTime = Date.now();
  this.time = this.startTime;
  this.lastTime = this.startTime;

  this.nextDestination = null;
  this.opticalPath = [];

  var self = this;

  this.setOpticalPath = function(opticalPath) {
    opticalPath.forEach(function(element) {
      self.opticalPath.push(element.clone());
    });
    self.updateNextDestination();
  }

  this.setDirection = function(direction) {
    self.direction = direction.clone();
  }

  this.getSurfacePoint = function(u, v, target) {
    deltaTime = (self.time - self.startTime)/1000;

    switch(self.wavefrontType) {
      case WavefrontType.NORMAL:
        target.set(self.amplitude*Math.sin(2*Math.PI*(u+v-deltaTime*self.frequency)*self.spacialFrequency), self.size*(u-0.5), self.size*(v-0.5));
        break;
      case WavefrontType.TEST_DIRECTION:
        target.set(10*self.amplitude*(1-Math.sqrt((u-0.5)*(u-0.5)+(v-0.5)*(v-0.5))), self.size*(u-0.5), self.size*(v-0.5));
        break;
      case WavefrontType.TEST_PLANE:
        target.set(0, self.size*(u-0.5), self.size*(v-0.5));
        break;
    }
  };

  this.updateDeformation = function () {
    this.geometry = new THREE.ParametricBufferGeometry( this.getSurfacePoint, this.divisions, this.divisions );
  }

  this.updateNextDestination = function() {
    // if no more destination, stop movement
    if(self.opticalPath.length == 0) {
      self.speed = 0;
      return;
    }

    // update next destination and remove it from the list
    self.nextDestination = self.opticalPath[0].clone();
    self.opticalPath.splice(0,1);

    // set new direction and normalize
    self.direction = self.nextDestination.clone();
    self.direction.sub(self.position);
    self.direction.normalize();

    // rotate object in new the direction
    self.lookAt(self.nextDestination);
    self.rotateY(-Math.PI/2);
  }

  this.updatePosition = function () {
    var deltaTime = (self.time - self.lastTime)/1000;
    self.lastTime = self.time;

    if(self.nextDestination) {
      var vector = self.nextDestination.clone();
      vector.sub(self.position);
      var dot = vector.dot(self.direction);
      if(dot < 0.01) {
        // set position at new start
        self.position = self.nextDestination.clone();
        self.updateNextDestination();
      }
    }

    var displacement = self.direction.clone();
    displacement.multiplyScalar(self.speed*deltaTime);
    self.position.add(displacement);
  }

  this.test = 2;

  var geometry = new THREE.ParametricBufferGeometry( this.getSurfacePoint, this.divisions, this.divisions );
  var material = new THREE.MeshBasicMaterial( { color: 0xB3232D, side: THREE.DoubleSide } );

  THREE.Mesh.call( this, geometry, material );

  this.material.transparent = true;
  this.material.opacity = 0.5;

  this.rotateY(-Math.PI/2);

};

THREE.Wavefront.prototype = Object.create( THREE.Mesh.prototype );
THREE.Wavefront.prototype.constructor = THREE.Wavefront;
