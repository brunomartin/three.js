/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 */

THREE.WaterRefractionExShader = {

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

		'tDudv': {
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

		'varying vec2 vUv;',
		'varying vec4 vUvRefraction;',
		'varying vec3 vPosition;',

		'void main() {',

		'	vUv = uv;',
		'	vPosition = position;',

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
		'uniform sampler2D tDudv;',
		'varying vec3 vPosition;',

		'varying vec2 vUv;',
		'varying vec4 vUvRefraction;',

		'float blendOverlay( float base, float blend ) {',

		'	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );',

		'}',

		'vec3 blendOverlay( vec3 base, vec3 blend ) {',

		'	return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ),blendOverlay( base.b, blend.b ) );',

		'}',

		'void main() {',

		// simple distortion (ripple) via dudv map (see https://www.youtube.com/watch?v=6B7IF6GOu7s)

		'	vec2 distortedUv = texture2D( tDudv, vec2( vUv.x + time * waveSpeed, vUv.y ) ).rg * waveAmp;',
		'	distortedUv = vUv.xy + vec2( distortedUv.x, distortedUv.y + time * waveSpeed );',
		'	vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1.0 ) * waveAmp;',

		// new uv coords

		' vec4 uv = vec4( vUvRefraction );',
		// ' uv.xy += distortion;',

		'	uv.x += cos(waveLength * vPosition.y - 10.0 * time * waveSpeed) * waveAmp / 10.0;',

		'	vec4 base = texture2DProj( tDiffuse, uv );',

		'	gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );',

		'}'

	].join( '\n' )
};
