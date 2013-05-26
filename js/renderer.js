var Renderer = {
	canvas: {}, gl: {},   // canvas being drawn to and WebGL context
	shaderProgram:  {},   // shader program handle
	quadBuffer:     {},   // buffer to hold position vertices for quad
	models:         {},   // list of loaded models
	textures:       {},   // list of loaded textures

	// used for timing
	time: 0, startTime: Date.now(),

	// size of window
	windowWidth: 0.0, windowHeight: 0.0,

	/** Called when canvas is created */
	init: function() {
		this.initGL(canvas);
	  
		// only continue if WebGL is available
		if (gl) {
			// set window resize listener; intial call sets canvas size and gl viewport
			this.onWindowResize();
			window.addEventListener('resize', this.onWindowResize, false);

			Sandbox.init();
			ModelRenderer.init();
	  	}

	  	var bitwaffle = ModelLoader.loadModel(
			"models/bitwaffle/bitwaffle.obj", "models/bitwaffle/bitwaffle.mtl",
			function(model){
				Renderer.models['bitwaffle'] = model;
			}
		);
	},

	/** What happens when window gets resized */
	onWindowResize: function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		if(gl)
			gl.viewport(0, 0, canvas.width, canvas.height);
	},

	/**
	  * Initializes WebGL
	  * After this, if 'gl' is null then it means that WebGl wasn't properly initialized.
	  */
	initGL: function() {
		try {
			gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		}catch(error) {
			// alert user if gl isn't supported
			alert("Oh man, couldn't initialize WebGL! What gives, you using an old browser or something? Psh.");
		}

		if (gl) {
			gl.clearColor(0.0, 0.0, 0.0, 1.0);	// Clear to black, fully opaque
			gl.clearDepth(1.0);					// Clear everything
			gl.enable(gl.DEPTH_TEST);			// Enable depth testing
			gl.depthFunc(gl.LEQUAL);			// Near things obscure far things
		}
	},

	/** Creates a shader of the given type with the given string, returns shader object on success, null otherwise */
	createShader: function(src, type){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);

		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			alert(gl.getShaderInfoLog(shader));
			return null;
		} else
			return shader;
	},

	/** Renders the scene */
	render: function() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		Sandbox.render();
		ModelRenderer.renderModel(Renderer.models['bitwaffle']);
	}
}
