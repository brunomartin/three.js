/**
 * @author brunocmartin /
 *
 * A Slide Show Object.
 */

THREE.SlideShow = function (scene, camera) {

  this.scene = scene;
  this.camera = camera;
  this.slides = [];
  this.labels = [];
  this.objects = [];

  this.cameraPositionCurve = null;
  this.cameraLookAtPositionCurve = null;

  this.cameraDistance = 1.;
  this.cameraIsMoving = false;
  this.cameraTransition = false;
  this.cameraSpeed = 1.;

  this.currentSlideIndex = -1;

  var self = this;

  // Add a slide
  this.addSlide = function(slide) {
    self.slides.push(slide);

    slide.visibleObjects.forEach(function(object) {
      if(!self.objects.includes(object)) {
        self.objects.push(object);
      }
    });
  }

  // mode to slide index
  this.moveToSlide = function(slideIndex) {
    if(slideIndex > self.slides.length-1) {
      throw "SlideShow.moveToSlide() : slide index out of range";
    }

    // get next slide
    var slide = self.slides[slideIndex];

    // set new title
    var title = slide.title;
    title += " (" + (slideIndex+1).toString()+"/"+self.slides.length.toString() + ")";
    document.getElementById('slide_info').innerHTML = title;

    // hide all object except slide ones
    self.objects.forEach(function(object) {
      if(slide.visibleObjects.includes(object)) {
        // self.scene.add(object);
        self.setVisible(object, true);
      } else {
        // self.scene.remove(object);
        self.setVisible(object, false);
      }
    });

    // remove displayed labels
    self.labels.forEach(function(element) {
      element.object.remove(element.label);
    });

    self.labels = [];

    // display slide labels
    slide.labels.forEach(function(element) {
      addLabelForObject(element.label, element.object);
      self.labels.push(element);
    });

    if(self.currentSlideIndex>-1) {
      self.slides[self.currentSlideIndex].onHide();
    }

    slide.onShow();

    self.moveCameraTo(slide.cameraPosition, slide.cameraLookAtPosition);

    self.currentSlideIndex = slideIndex;
  }

  // move to next slide if any
  this.moveToNextSlide = function() {
    if(self.currentSlideIndex < self.slides.length - 1) {
      self.moveToSlide(self.currentSlideIndex+1);
    }
  }

    // move to previous slide if any
  this.moveToPreviousSlide = function() {
    if(self.currentSlideIndex > 0) {
      self.moveToSlide(self.currentSlideIndex-1);
    }
  }

  this.setVisible = function(object, visible) {
    object.traverse ( function (child) {
      if (child instanceof THREE.Mesh) {
          child.visible = visible;
      }
    });
    object.visible = visible;
  }

  // start camera movement
  this.moveCameraTo = function(position, lookAtPosition) {

    if(!self.cameraTransition) {
      self.camera.position.copy(position);
      self.camera.lookAt(lookAtPosition);
      return;
    }

    var distance = camera.position.distanceTo(position);
    console.log("SlideShow : distance = " + distance);
    if(distance < 5) {
      return;
    }

    // position control point behind end camera movement position
    var controlPoint = position.clone();
    controlPoint.multiplyScalar(2);

    // create curve
    self.cameraPositionCurve = new THREE.QuadraticBezierCurve3(
      camera.position.clone(),
      controlPoint.clone(),
      position.clone()
    );

    // move camera look at point linearly
    var middlePosition = cameraCurrentLookAtPosition.clone().add(lookAtPosition).multiplyScalar(0.5);
    self.cameraLookAtPositionCurve = new THREE.QuadraticBezierCurve3(
      cameraCurrentLookAtPosition.clone(),
      middlePosition,
      lookAtPosition.clone()
    );

    // set camera distance to zero and start camera movement
    self.cameraDistance = 0.;
    self.cameraIsMoving = true;
    console.log("SlideShow : start moving camera");
  }

  this.animate = function(deltaClock) {

    // if camera has not moving, return
    if(!self.cameraIsMoving) {
      return;
    }

    // increment distance
    self.cameraDistance += self.cameraSpeed*deltaClock;

    // if more than 1., stop camera movement
    if(self.cameraDistance > 1.) {
      self.cameraIsMoving = false;
      console.log("SlideShow : stop moving camera");
    }

    self.camera.position.copy(self.cameraPositionCurve.getPoint(self.cameraDistance));
    self.camera.lookAt(self.cameraLookAtPositionCurve.getPoint(self.cameraDistance));
  }

  this.addLabelForObject = function(labelText, object) {
    var div = document.createElement( 'div' );
    div.className = 'label';
    div.textContent = labelText;
    div.style.marginTop = '-1em';
    var label = new THREE.CSS2DObject( div );
    object.add( label );

		var position = new THREE.Vector3();
		object.getWorldPosition(position);
		position.add(new THREE.Vector3(0, 10, 0));

		object.worldToLocal( position );
		label.position.copy(position);
  }

  this.onStart = function() {

  }

  this.start = function() {
    self.onStart();
    self.moveToSlide(0);
  }

};
