/**
 * @author brunocmartin /
 *
 * A Wavefront Object.
 */

THREE.WavefrontSensor = function ( size, divisions ) {

  THREE.Group.call( this );

  var geometry = new THREE.BoxGeometry( 10, 10, 10 );
  var material = new THREE.MeshStandardMaterial( { color: 0x6083c2 } );

  var element = new THREE.Mesh( geometry, material );

  this.add(element);

  geometry = new THREE.CylinderGeometry( 4.5, 4.5, 2, 32 );
  material = new THREE.MeshStandardMaterial( { color: 0x6083c2 } );

  element = new THREE.Mesh( geometry, material );
  element.position.set(0, -5.5, 0);

  this.add(element);

  this.generatedCount = 0;
  this.acquisitionRate = 0.5;
  this.lastAcquisitionTime = 0;

  var self = this;

  this.createInformation = function(perturbation = 0.) {
    self.generatedCount++;
    return new THREE.Information(perturbation);
  }
};

THREE.WavefrontSensor.prototype = Object.create( THREE.Group.prototype );
THREE.WavefrontSensor.prototype.constructor = THREE.WavefrontSensor;
