/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 */

THREE.HeatRefractionExShader = {

	uniforms: {

		'color': {
			type: 'c',
			value: null
		},

		'time': {
			type: 'f',
			value: 0
		},

		'waveAmp': {
			type: 'f',
			value: 0.1
		},

		'waveLength': {
			type: 'f',
			value: 0.1
		},

		'waveSpeed': {
			type: 'f',
			value: 0.03
		},

		'tDiffuse': {
			type: 't',
			value: null
		},

		'textureMatrix': {
			type: 'm4',
			value: null
		}

	},

	vertexShader: [

		'uniform mat4 textureMatrix;',

		'uniform float waveSpeed;',
		'uniform float time;',

		'varying vec4 vUvRefraction;',

		'void main() {',

		'	vUvRefraction = textureMatrix * vec4( position, 1.0 );',

		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'

	].join( '\n' ),

	fragmentShader: [

		'uniform vec3 color;',
		'uniform float time;',
		'uniform float waveAmp;',
		'uniform float waveSpeed;',
		'uniform float waveLength;',
		'uniform sampler2D tDiffuse;',

		'varying vec4 vUvRefraction;',

		'void main() {',

		// new uv coords

		' vec4 uv = vec4( vUvRefraction );',
		'	uv.x += cos(vUvRefraction.y / waveLength - 10.0 * time * waveSpeed) * waveAmp / 10.0;',

		'	gl_FragColor = vec4( texture2DProj( tDiffuse, uv ).rgb, 1.0 );',

		'}'

	].join( '\n' )
};
