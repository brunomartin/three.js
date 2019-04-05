/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 */

THREE.WavefrontShader = {

	uniforms: {

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

	},

	vertexShader: [

		'uniform float waveSpeed;',
		'uniform float time;',

		'varying vec4 vUv;',

		'void main() {',

		'	vUv = textureMatrix * vec4( position, 1.0 );',

		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'

	].join( '\n' ),

	fragmentShader: [

		'uniform sampler2D tDiffuse;',

		'varying vec4 vUv;',

		'void main() {',

		' vec4 uv = vec4( vUv );',
		'	gl_FragColor = vec4( texture2DProj( tDiffuse, uv ), 1.0 );',

		'}'

	].join( '\n' )
};
