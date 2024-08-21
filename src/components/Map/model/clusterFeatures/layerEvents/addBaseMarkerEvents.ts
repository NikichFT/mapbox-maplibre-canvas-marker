import {Map, Marker, SymbolLayerSpecification} from "maplibre-gl";
import {ICanvasMarkerInstance} from "../../canvasMarkers/types.ts";
import {getImageIdByBoundId} from "../../CustomLayers/utils/getImageIdByBoundId.ts";

export const addBaseMarkerEvents = (map: Map, layer: SymbolLayerSpecification, activeMarker: ICanvasMarkerInstance, imageName: string) => {
	const removeActiveMarker = () => {
		activeMarker.value?.remove()
		activeMarker.value = null
		activeMarker.id.value = null
	}
	const mouseenterHandler = event => {
		console.log('mouseenterHandler', event)
		event.preventDefault()
		event.originalEvent.stopPropagation()

		const features = event.features
		// console.log('features', features)
		const newMarkerId = features[0].properties.cluster_id
		if (newMarkerId === activeMarker.id.value) return

		if (activeMarker.value) {
			removeActiveMarker()
		}
		activeMarker.layer = features[0].layer

		if (!activeMarker.value) {
			const el = map.getImage(getImageIdByBoundId(imageName, newMarkerId))?.userImage?.canvasModelComponent
			const marker = new Marker({
				element: el
			}).setLngLat(features[0].geometry.coordinates);
			marker.addTo(map);
			activeMarker.id.value = newMarkerId
			activeMarker.value = marker
		}
	}
	const mouseleaveHandler = event => {
		event.preventDefault()
		event.originalEvent.stopPropagation()

		if (event.originalEvent.relatedTarget === map.getCanvas() || !event.originalEvent.relatedTarget) {
			removeActiveMarker()
		}
	}

	map.on('mouseenter', layer.id, mouseenterHandler)
	map.on('mouseleave', layer.id, mouseleaveHandler)
}
