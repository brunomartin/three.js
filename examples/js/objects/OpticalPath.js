/**
 * @author brunocmartin /
 *
 * A Wavefront Object.
 */

THREE.OpticalPath = function () {

  this.objects = [];

  this.line = new THREE.Group();
  this.ray = new THREE.Group();
  this.wavefronts = new THREE.Group();
  this.perturbations = [];
  this.rayColors = [];

  var self = this;

  this.addObject = function(object) {
    self.objects.push(object);
    self.updateLine();
		self.updateRay();
		self.updateWavefronts();
  }

  this.updateLine = function() {
    while(self.line.children.length>0) {
      self.line.remove(self.line.children[0]);
    }

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    for(i=0;i<self.objects.length;i++) {
      geometry.vertices.push(self.objects[i].position.clone());
    }

    self.line.add(new THREE.Line(geometry, material));
  }

  this.updateRay = function() {

    self.rayColors = [];
    self.perturbations = [];

    while(self.ray.children.length>0) {
      self.ray.remove(self.ray.children[0]);
    }

    for(i=1;i<self.objects.length;i++) {

      var pointX = self.objects[i-1].position.clone();
      var pointY = self.objects[i].position.clone();

      var direction = new THREE.Vector3().subVectors( pointY, pointX );
      var arrow = new THREE.ArrowHelper( direction, pointX );

      var geometry;

      if(i==1) {
        geometry = new THREE.ConeGeometry( 4.5, direction.length(), 32 );
        geometry.rotateX(Math.PI);
      } else {
        geometry = new THREE.CylinderGeometry( 4.5, 4.5, direction.length(), 32 );
      }

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

  this.updateWavefronts = function() {

    while(self.wavefronts.children.length>0) {
      self.wavefronts.remove(self.wavefronts.children[0]);
    }

    for(i=1;i<self.objects.length;i++) {

      var pointX = self.objects[i-1].position.clone();
      var pointY = self.objects[i].position.clone();

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

  this.updatePerturbation = function() {
		var perturbation = self.perturbations[1];

		var perturbatedColor = new THREE.Color(1, 0, 0);
		var correctedColor = new THREE.Color(1, 1, 1);

		var color = perturbatedColor.clone().multiplyScalar(perturbation);
		color.add(correctedColor.clone().multiplyScalar(1-perturbation));
		self.copyColorTo(color, 1);

		perturbation -= mirror.correction;
		self.setPerturbationAfter(perturbation, 2);

		perturbation = Math.abs(perturbation);

		var color = perturbatedColor.clone().multiplyScalar(perturbation);
		color.add(correctedColor.clone().multiplyScalar(1-perturbation));
		self.copyColorAfter(color, 2);
  }

};

// THREE.OpticalPath.prototype = Object.create( THREE.Line.prototype );
// THREE.OpticalPath.prototype.constructor = THREE.OpticalPath;
