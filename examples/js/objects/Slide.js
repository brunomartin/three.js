/**
 * @author brunocmartin /
 *
 * A Slide Object.
 */

THREE.Slide = function () {

  this.cameraPosition = new THREE.Vector3();
  this.lookAt = new THREE.Vector3();
  this.visibleObjects = new THREE.Vector3();

  var self = this;

  this.addSlide = function(slide) {
    self.slides.push(object);
  }

};
