/**
 * @author brunocmartin /
 *
 * A Wavefront Object.
 */

THREE.OpticalPath = function () {

  this.objects = [];

  this.geometry = new THREE.Geometry();
  this.material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

  this.line = new THREE.Line(this.geometry, this.material);

  this.ray;
  this.perturbations = [];
  this.rayColors = [];

  var self = this;

  this.addObject = function(object) {
    self.objects.push(object);
    self.geometry.vertices.push(object.position.clone());
    self.line = new THREE.Line(self.geometry, self.material);
  }

  this.createRay = function() {

    self.ray = new THREE.Group();

    for(i=1;i<self.geometry.vertices.length;i++) {
      var pointX = self.geometry.vertices[i-1];
      var pointY = self.geometry.vertices[i];

      var direction = new THREE.Vector3().subVectors( pointY, pointX );
      var arrow = new THREE.ArrowHelper( direction, pointX );

      var geometry = new THREE.CylinderGeometry( 4.5, 4.5, direction.length(), 32 );
      var material = new THREE.MeshStandardMaterial();
      material.color = new THREE.Color(0xff0000);
      material.color = new THREE.Color(0xffffff);
      material.transparent = true;
      material.opacity = 0.8;

      var segment = new THREE.Mesh( geometry, material );

      segment.rotation.copy(arrow.rotation.clone());
      segment.position.copy(pointX.clone().add(direction.clone().multiplyScalar(0.5)));

      self.rayColors.push(material.color);
      self.perturbations.push(0.);

      self.ray.add(segment);
    }
  }

  this.cloneColorFromSegment = function(index) {
    return self.rayColors[index].clone();
  }

  this.setPerturbationAfter = function(perturbation, index) {
    for(i=index; i<self.rayColors.length;i++) {
      self.perturbations[i] = perturbation;
    }
  }

  this.copyColorAfter = function(color, index) {
    for(i=index; i<self.rayColors.length;i++) {
      self.rayColors[i].copy(color);
    }
  }

  this.copyColorTo = function(color, index) {
    self.rayColors[index].copy(color);
  }

};

// THREE.OpticalPath.prototype = Object.create( THREE.Line.prototype );
// THREE.OpticalPath.prototype.constructor = THREE.OpticalPath;
