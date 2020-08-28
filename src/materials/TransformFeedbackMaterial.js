import { RawShaderMaterial } from './RawShaderMaterial.js';

/**
 * @author Atsushi Onozawa
 */

function TransformFeedbackMaterial( parameters ) {

	RawShaderMaterial.call( this, parameters );

	this.type = 'TransformFeedbackMaterial';


}

TransformFeedbackMaterial.prototype = Object.create( RawShaderMaterial.prototype );
TransformFeedbackMaterial.prototype.constructor = TransformFeedbackMaterial;

TransformFeedbackMaterial.prototype.isRawShaderMaterial = true;
TransformFeedbackMaterial.prototype.enableTransformFeedback = true;
TransformFeedbackMaterial.prototype.transformFeedbackAttributes = {};

export { TransformFeedbackMaterial };
