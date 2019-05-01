/**
 * @author brunocmartin /
 *
 * A Slide Object.
 */

THREE.Slide = function () {

  this.title = "No title";
  this.cameraPosition = new THREE.Vector3();
  this.cameraLookAtPosition = new THREE.Vector3();
  this.visibleObjects = [];
  this.labels = [];

  var self = this;

  this.clone = function(slide) {
    var result = new THREE.Slide;
    result.title = self.title;
    result.cameraPosition.copy(self.cameraPosition);
    result.cameraLookAtPosition.copy(self.cameraLookAtPosition);
    result.visibleObjects = [...self.visibleObjects];
    result.labels = Array.from(self.labels);
    return result;
  }

  this.onShow = function() {

  }
  
  this.onHide = function() {

  }

};
