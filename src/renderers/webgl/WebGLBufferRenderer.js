/**
 * @author mrdoob / http://mrdoob.com/
 */

function WebGLBufferRenderer( gl, extensions, info, capabilities ) {

	var isWebGL2 = capabilities.isWebGL2;

	var mode;

	function setMode( value ) {

		mode = value;

	}

	function render( start, count ) {

		gl.drawArrays( mode, start, count );

		info.update( count, mode );

	}

	function fence() {
		return new Promise(function(resolve) {
			var sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
			gl.flush(); // Ensure the fence is submitted.
			function check() {
				var status = gl.getSyncParameter(sync, gl.SYNC_STATUS);
				if (status == gl.SIGNALED) {
					gl.deleteSync(sync);
					resolve();
				} else {
					setTimeout(check, 0);
				}
			}
			setTimeout(check, 0);
		});
	}


	function doTransformFeedback( start, count, attributes) {


		for (let i = 0; i < attributes.varyings.length; i++) {
			let varying = attributes.varyings[i];
			gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, varying.buffer);
		}

		gl.enable(gl.RASTERIZER_DISCARD);
		gl.beginTransformFeedback(gl.POINTS);

		gl.drawArrays( gl.POINTS, 0, attributes.length);

		gl.disable(gl.RASTERIZER_DISCARD);
		gl.endTransformFeedback();

		fence().then(function() {
			for (let i = 0; i < attributes.varyings.length; i++) {
				let varying = attributes.varyings[i];
				gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, varying.buffer);
				gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, i, varying.result);
				gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

			}
		});

		info.update( count, mode );
	}

	function renderInstances( geometry, start, count, primcount ) {

		if ( primcount === 0 ) return;

		var extension, methodName;

		if ( isWebGL2 ) {

			extension = gl;
			methodName = 'drawArraysInstanced';

		} else {

			extension = extensions.get( 'ANGLE_instanced_arrays' );
			methodName = 'drawArraysInstancedANGLE';

			if ( extension === null ) {

				console.error( 'THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
				return;

			}

		}

		extension[ methodName ]( mode, start, count, primcount );

		info.update( count, mode, primcount );

	}

	//

	this.setMode = setMode;
	this.render = render;
	this.doTransformFeedback = doTransformFeedback;
	this.renderInstances = renderInstances;

}


export { WebGLBufferRenderer };
