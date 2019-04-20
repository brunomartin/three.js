/**
 * @author brunocmartin /
 *
 * A Wavefront Object.
 */

THREE.DeformableMirror = function ( size, divisions ) {

  THREE.Group.call( this );

  this.correction = 0.;

  var geometry = new THREE.CircleBufferGeometry( 10, 50 );

  var mirror = new THREE.Reflector( geometry, {
    // clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777,
    recursion: 1,
    shader: THREE.DeformableReflectorShader
  } );

  this.add(mirror);

  this.mirror = mirror;

  geometry = new THREE.TorusBufferGeometry( 10, 3, 3, 100 );
  material = new THREE.MeshStandardMaterial( { color: 0x0d3681 } );

  var torus = new THREE.Mesh( geometry, material );

  this.add(torus);

  geometry = new THREE.CylinderBufferGeometry( 13, 13, 10, 32 );
  geometry.rotateX(  Math.PI / 2 );
  material = new THREE.MeshStandardMaterial( { color: 0x0d3681 } );

  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.translateZ(-5.01);

  this.add(cylinder);

  geometry = new THREE.CylinderBufferGeometry( 2, 2, 2, 32 );
  // geometry.rotateX(  Math.PI / 2 );
  material = new THREE.MeshBasicMaterial( { color: 0x0d3681 } );

  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.translateY(-12);
  cylinder.translateZ(-3);

  cylinder.material.color;

  cylinder.material.color = new THREE.Color(0xffffff);

  // link color to inner mesh material color
  this.indicatorColor = cylinder.material.color;
  this.correction = 0.;

  this.add(cylinder);

  var refractor = new THREE.Refractor( this.mirror.geometry.clone(), {
    // color: 0x999999,
    // color: 0x000000,
    textureWidth: 2048,
    textureHeight: 2048,
    shader: THREE.HeatRefractionExShader
  } );

  refractor.material.uniforms[ "waveAmp" ].value = 0.1;
  refractor.material.uniforms[ "waveLength" ].value = 0.1;
  refractor.material.uniforms[ "waveSpeed" ].value = 0.03;

  refractor.position.set( 0, 0, 0.001 );
  this.add( refractor );

  this.refractor = refractor;

  var self = this;

  this.setCorrectionOn = function(on) {
    var object = self.refractor;
    object.traverse ( function (child) {
      if (child instanceof THREE.Mesh) {
          child.visible = on;
      }
    });
    object.visible = on;
  }

  this.updateCorrection = function() {
    var perturbatedColor = new THREE.Color(1, 0, 0);
    var correctedColor = new THREE.Color(1, 1, 1);

    var color = perturbatedColor.clone().multiplyScalar(self.correction);
    color.add(correctedColor.clone().multiplyScalar(1-self.correction));
		self.indicatorColor.copy( color );
  }
};

THREE.DeformableMirror.prototype = Object.create( THREE.Group.prototype );
THREE.DeformableMirror.prototype.constructor = THREE.DeformableMirror;
