import {SymbolLayerSpecification, Map} from "maplibre-gl";
import {linearInterpolation} from "../../utils/interpolation.ts";

export function interpolateIconSizeByZoom(map: Map, layer: SymbolLayerSpecification) {
	const iconSizeLayerProps = layer.layout?.["icon-size"]
	const isAllowInterpolation = Array.isArray(iconSizeLayerProps)

	const interpolate = (canvasImageInstance) => {
		if (!Array.isArray(iconSizeLayerProps)) return;

		const styleObserver = new MutationObserver((mutations) => {
			calcInterpolation()
		})
		styleObserver.observe(canvasImageInstance.canvas, {
			attributes: true,
			attributeFilter: ['style']
		})

		const calcInterpolation = () => {
			const zoomValue = map.getZoom()
			const maxZoom = iconSizeLayerProps[iconSizeLayerProps.length - 2]
			const minZoom = iconSizeLayerProps[3]
			const outputMin = iconSizeLayerProps[4]
			const outputMax = iconSizeLayerProps[iconSizeLayerProps.length - 1]

			const zoomCoef = linearInterpolation(zoomValue, minZoom, maxZoom, outputMin, outputMax)

			const currentTransform = canvasImageInstance.canvas.style.transform
			if (currentTransform.includes('scale')) {
				const scaleRegex = /scale\([^)]*\)/g;
				const newTransform = currentTransform.replace(scaleRegex, `scale(${zoomCoef})`);
				canvasImageInstance.canvas.style.transform = newTransform
			} else {
				canvasImageInstance.canvas.style.transform = currentTransform + ` scale(${zoomCoef})`
			}
		}
	}

	return {
		isAllowInterpolation,
		interpolate
	}
}
