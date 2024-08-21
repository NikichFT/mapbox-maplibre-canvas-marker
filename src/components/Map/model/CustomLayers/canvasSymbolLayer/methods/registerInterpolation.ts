import {watch} from "vue";
import {Map, SymbolLayerSpecification} from "maplibre-gl";
import {interpolateIconSizeByZoom} from "./interpolateIconSizeByZoom.ts";
import {ICanvasMarkerSymbol} from "../../../canvasMarkers/methods/canvasImage.ts";
import {ICanvasMarkerInstance} from "../../../canvasMarkers/types.ts";


export const registerInterpolation = (map: Map, layer: SymbolLayerSpecification, marker: ICanvasMarkerInstance, imageInstances: ICanvasMarkerSymbol[]) => {
	const {isAllowInterpolation, interpolate} = interpolateIconSizeByZoom(map, layer)
	const register = () => {
		const zoomInterpolateIconHandler = () => {
			imageInstances.forEach((imageInstance) => interpolate(imageInstance))
		}
		zoomInterpolateIconHandler()

		watch(() => marker.id.value, (value) => {
			if (value) {
				map.on('zoomend', zoomInterpolateIconHandler)
			} else {
				map.off('zoomend', zoomInterpolateIconHandler)
			}
		})
	}
	if (isAllowInterpolation) marker.watcherFactory.watchers['interpolation'] = register
	marker.watcherFactory.register()
}
