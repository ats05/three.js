// Renderers / WebGL /////////////////////////////////////////////////////////////////////
export class WebGLBufferRenderer {

	constructor( _gl: WebGLRenderingContext, extensions: any, _infoRender: any );

	setMode( value: any ): void;
	render( start: any, count: number ): void;
	fence(): Promise;
	doTransformFeedback( start: any, count: number, attributes: any): void;
	renderInstances( geometry: any ): void;

}
