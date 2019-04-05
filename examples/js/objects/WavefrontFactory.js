/**
 * @author brunocmartin /
 *
 * A WavefrontFactory Object to create Wavefront objects.
 */

THREE.WavefrontFactory = function ( position ) {

  this.position = position.clone();
  this.frequency = 1;

  var self = this;

  this.createWavefront = function (opticalPath) {
    wavefront = new THREE.Wavefront(10, 100);
    wavefront.position = self.position.clone();
    wavefront.setOpticalPath(opticalPath);
    return wavefront;
  }

};

THREE.Wavefront.prototype = Object.create( THREE.Mesh.prototype );
THREE.Wavefront.prototype.constructor = THREE.Wavefront;
