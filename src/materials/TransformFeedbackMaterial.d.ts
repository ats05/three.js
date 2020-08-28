import { RawShaderMaterialParameters, RawShaderMaterial } from './RawShaderMaterial';

export class TransformFeedbackMaterial extends RawShaderMaterial {

	constructor( parameters?: RawShaderMaterialParameters );
    enableTransformFeedback: boolean;
    transformFeedbackAttributes: any;

}
