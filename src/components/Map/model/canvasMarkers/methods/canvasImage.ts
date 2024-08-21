import {StyleImageInterface, Map} from "maplibre-gl";

export interface ICanvasMarkerSymbol extends StyleImageInterface {
	width: number,
	height: number,
	data: Uint8Array | Uint8ClampedArray,
	canvas: HTMLCanvasElement,
	context: any,
	map: Map | null,
	canvasModelComponent: HTMLElement | null,
	update: () => void
}
export type TInitCanvasModelComponent = (canvas: HTMLCanvasElement) => {
	canvas: HTMLElement,
	update: () => void
}

export const canvasImage = (initCanvasModelComponent: TInitCanvasModelComponent, width: number, height: number): ICanvasMarkerSymbol => {
	return {
		width,
		height,
		data: new Uint8Array(width * height * 4),
		canvas: document.createElement('canvas'),
		context: null,
		map: null,
		canvasModelComponent: null,
		update: () => {},

		// When the layer is added to the map,
		// get the rendering context for the map canvas.
		onAdd: function (map, gl) {
			this.canvas.width = width;
			this.canvas.height = height;

			this.context = this.canvas.getContext('2d', {
				willReadFrequently: true,

			});
			this.map = map

			const {canvas, update } = initCanvasModelComponent(this.canvas)
			this.canvasModelComponent = canvas
			this.update = update
		},

		// Call once before every frame where the icon will be used.
		render: function () {
			this.data = this.context?.getImageData(
				0,
				0,
				this.width,
				this.height
			).data;

			this.map?.triggerRepaint();

			// Return `true` to let the map know that the image was updated.
			return true;
		},
	}
};
