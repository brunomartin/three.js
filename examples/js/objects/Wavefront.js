/**
 * @author erichlof /  http://github.com/erichlof
 *
 * A shadow Mesh that follows a shadow-casting Mesh in the scene, but is confined to a single plane.
 */

THREE.Wavefront = function ( size, divisions ) {

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

  var self = this;

  this.getSurfacePoint = function(u, v, target) {
    deltaTime = (self.time - self.startTime)/1000;
    target.set(self.amplitude*Math.sin(2*Math.PI*(u+v-deltaTime*self.frequency)*self.spacialFrequency), self.size*(u-0.5), self.size*(v-0.5));
  };

  this.updateDeformation = function () {
    this.geometry = new THREE.ParametricBufferGeometry( this.getSurfacePoint, this.divisions, this.divisions );
  }

  this.updatePosition = function () {
    var deltaTime = (self.time - self.lastTime)/1000;
    self.lastTime = self.time;

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

};

THREE.Wavefront.prototype = Object.create( THREE.Mesh.prototype );
THREE.Wavefront.prototype.constructor = THREE.Wavefront;
