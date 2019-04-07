/**
 * @author brunocmartin /
 *
 * A Wavefront Object.
 */

THREE.Information = function (perturbation) {

  this.perturbation = perturbation;
  this.speed = 0.9;
  this.computeTime = 1;

  this.time = 0;
  this.distance = 0;

  this.computationStartTime;
  this.computing = false;
  this.hasBeenComputed = false;
  this.hasArrived = false;

  this.correction = 0.;

  var geometry = new THREE.SphereBufferGeometry(3);
  var material = new THREE.MeshBasicMaterial( { color: 0x6083c2 } );

  THREE.Mesh.call( this, geometry, material );

  this.path = null;

  var self = this;

  this.setPath = function(path) {
    self.path = path;
    self.position.copy(self.path.getPoint(0));
  }

  this.updatePosition = function(deltaTime) {
    self.time += deltaTime;

    if(self.computing) {
      if(self.time > self.computationStartTime + self.computeTime) {
        self.correction = -self.perturbation;
        self.hasComputed = true;
        self.computing = false;
      }
    } else if(!self.hasComputed && self.distance > 0.5) {
      self.computationStartTime = self.time;
      self.computing = true;
    } else if(self.distance > 0.95) {
      self.hasArrived = true;
      self.position.copy(self.path.getPoint(0.95));
    } else {
      self.distance += deltaTime*self.speed;
      self.position.copy(self.path.getPoint(self.distance));
    }
  }
};

THREE.Information.prototype = Object.create( THREE.Mesh.prototype );
THREE.Information.prototype.constructor = THREE.Information;
