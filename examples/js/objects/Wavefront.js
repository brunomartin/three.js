/**
 * @author brunocmartin /
 *
 * A Wavefront Object.
 */

const WavefrontType = {
 CORRECTED: 'corrected',
 PERTURBATED: 'perturbated',
 TEST_DIRECTION: 'test direction',
 TEST_PLANE: 'test plane'
}


THREE.Wavefront = function ( size, divisions ) {

  this.wavefrontType = WavefrontType.BEING_PERTURBATED;

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

  this.arrivedAtDestination = false;

  this.perturbation = 0.;

  var self = this;

  this.getSurfacePoint = function(u, v, target) {
    deltaTime = (self.time - self.startTime)/1000;

    switch(self.wavefrontType) {
      case WavefrontType.CORRECTED:
        new Error("this.getSurfacePoint should not be called in that mode");
        break;
      case WavefrontType.PERTURBATED:

        break;
      case WavefrontType.BEING_PERTURBATED:
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

  THREE.Group.call( this );

  var geometry = new THREE.ParametricBufferGeometry( this.getSurfacePoint, this.divisions, this.divisions );
  var material = new THREE.MeshBasicMaterial( { color: 0xB3232D, side: THREE.DoubleSide } );

  var mesh = new THREE.Mesh(geometry, material);
  mesh.material.transparent = true;
  mesh.material.opacity = 0.5;
  mesh.rotateX(-Math.PI/2);

  this.wavefrontMesh = mesh;
  this.add(this.wavefrontMesh)

  this.setOpticalPath = function(opticalPath) {
    opticalPath.forEach(function(element) {
      self.opticalPath.push(element.clone());
    });
    self.updateNextDestination();
  }

  this.setDirection = function(direction) {
    self.direction = direction.clone();
  }

  this.setWavefrontType = function(wavefrontType) {
    self.wavefrontType = wavefrontType;
    if(self.wavefrontType == WavefrontType.CORRECTED) {
      var geometry = new THREE.PlaneBufferGeometry( self.size, self.size );
      var material = new THREE.MeshBasicMaterial( { color: 0xB3232D, side: THREE.DoubleSide } );

      var mesh = new THREE.Mesh(geometry, material);
      mesh.material.transparent = true;
      mesh.material.opacity = 0.5;
      mesh.rotateY(-Math.PI/2);

      mesh.material.color = this.wavefrontMesh.material.color.clone();

      this.remove(this.wavefrontMesh);

      this.wavefrontMesh = mesh;
      this.add(this.wavefrontMesh)

    } else {
      self.geometry = new THREE.ParametricBufferGeometry( self.getSurfacePoint, self.divisions, self.divisions );
    }
  }

  this.updateDeformation = function () {
    if(self.wavefrontType == WavefrontType.BEING_PERTURBATED) {
      self.geometry = new THREE.ParametricBufferGeometry( self.getSurfacePoint, self.divisions, self.divisions );
    }
  }

  this.updateNextDestination = function() {
    // if no more destination, stop movement
    if(self.opticalPath.length == 0) {
      self.speed = 0;
      self.arrivedAtDestination = true;
      return;
    } else if(self.opticalPath.length == 2) {
      self.setWavefrontType(WavefrontType.CORRECTED);
      self.updateDeformation();
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
};

THREE.Wavefront.prototype = Object.create( THREE.Group.prototype );
THREE.Wavefront.prototype.constructor = THREE.Wavefront;
