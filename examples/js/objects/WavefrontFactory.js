/**
 * @author brunocmartin /
 *
 * A WavefrontFactory Object to create Wavefront objects.
 */

THREE.WavefrontFactory = function ( position ) {

  this.position = position.clone();
  this.frequency = 1;
  this.mirror = null;

  var self = this;

  this.createWavefront = function (opticalPath) {
    var wavefront = new THREE.Wavefront(10, 100);
    wavefront.position.add(self.position.clone());
    wavefront.setOpticalPath(opticalPath);
    return wavefront;
  }

};

THREE.WavefrontFactory.prototype = Object.create( THREE.Mesh.prototype );
THREE.WavefrontFactory.prototype.constructor = THREE.WavefrontFactory;
