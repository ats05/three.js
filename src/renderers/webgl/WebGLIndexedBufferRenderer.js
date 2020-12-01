/**
 * @author mrdoob / http://mrdoob.com/
 */

function WebGLIndexedBufferRenderer( gl, extensions, info, capabilities ) {

	var isWebGL2 = capabilities.isWebGL2;

	var mode;

	function setMode( value ) {

		mode = value;

	}

	var type, bytesPerElement;

	function setIndex( value ) {

		type = value.type;
		bytesPerElement = value.bytesPerElement;

	}

	function render( start, count ) {

		gl.drawElements( mode, count, type, start * bytesPerElement );

		info.update( count, mode );

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

		for (let i = 0; i < attributes.varyings.length; i++) {

			let varying = attributes.varyings[i];
			gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, null);
			gl.bindBuffer(gl.ARRAY_BUFFER, varying.buffer);
			gl.getBufferSubData(gl.ARRAY_BUFFER, 0, varying.result);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

		}
		
		gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null); chk();
		info.update( count, mode );
	}

	function renderInstances( geometry, start, count, primcount ) {

		if ( primcount === 0 ) return;

		var extension, methodName;

		if ( isWebGL2 ) {

			extension = gl;
			methodName = 'drawElementsInstanced';

		} else {

			extension = extensions.get( 'ANGLE_instanced_arrays' );
			methodName = 'drawElementsInstancedANGLE';

			if ( extension === null ) {

				console.error( 'THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
				return;

			}

		}

		extension[ methodName ]( mode, count, type, start * bytesPerElement, primcount );

		info.update( count, mode, primcount );

	}

	//

	this.setMode = setMode;
	this.setIndex = setIndex;
	this.render = render;
	this.doTransformFeedback = doTransformFeedback;
	this.renderInstances = renderInstances;

}


export { WebGLIndexedBufferRenderer };
