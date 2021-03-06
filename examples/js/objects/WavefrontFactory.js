/**
 * @author brunocmartin /
 *
 * A WavefrontFactory Object to create Wavefront objects.
 */

THREE.WavefrontFactory = function ( position ) {

  this.position = position.clone();
  this.frequency = 1;
  this.mirror = null;
  this.generatedCount = 0;
  this.wavefrontSpeed = 100;

  var self = this;

  this.createWavefront = function (opticalPath) {
    var wavefront = new THREE.Wavefront(10, 100);
    wavefront.position.add(self.position.clone());
    wavefront.setWavefrontType(WavefrontType.PERTURBATED);
    wavefront.perturbation = 0.1;
    wavefront.setOpticalPath(opticalPath);
    wavefront.speed = this.wavefrontSpeed;
    self.generatedCount++;
    return wavefront;
  }

};

THREE.WavefrontFactory.prototype = Object.create( THREE.Mesh.prototype );
THREE.WavefrontFactory.prototype.constructor = THREE.WavefrontFactory;
