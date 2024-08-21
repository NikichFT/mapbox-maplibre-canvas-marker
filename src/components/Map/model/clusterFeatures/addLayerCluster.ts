import {FeaturesForCluster} from "./types.ts";
import {SymbolLayerSpecification, Map} from "maplibre-gl";
import {Feature, Point, FeatureCollection} from "geojson";
import {center} from "@turf/turf";
import {canvasSymbolLayer, TListImagesCanvasLayer} from "../CustomLayers/canvasSymbolLayer/canvasSymbolLayer.ts";
import {CanvasMarker} from "../canvasMarkers/methods/CanvasMarker.ts";
import {TInitCanvasModelComponent} from "../canvasMarkers/methods/canvasImage.ts";

export default function (map: Map, groupedFeatures: FeaturesForCluster, mainLayer: SymbolLayerSpecification, initCanvasModelFn: (features: Feature<Point>[]) => TInitCanvasModelComponent): SymbolLayerSpecification {
	const layerId = mainLayer.id

	const mainLayerIdCluster = `${layerId}_cluster`
	const clusterLayer: SymbolLayerSpecification = {
		id: `${layerId}_cluster`,
		type: 'symbol',
		source: mainLayerIdCluster,
		layout: {
			'icon-image': ['concat', mainLayerIdCluster, ['get', 'cluster_id']],
			'icon-allow-overlap': true,
			'icon-size': [
				'interpolate',
				['linear'],
				['zoom'],
				0, 0.1,
				20, 1
			],
		},
		minzoom: 0,
		maxzoom: 20,
	}
	const centerOfRegionFeatureCollection: FeatureCollection = {
		'type': 'FeatureCollection',
		'features': [],
	}
	console.log('groupedFeatures', groupedFeatures)

	const listImages: TListImagesCanvasLayer = groupedFeatures.map(([clusterId, featuresOfRegionId]) => {
		const regionCenterFeature = center({
			'type': 'FeatureCollection',
			'features': featuresOfRegionId,
		})
		centerOfRegionFeatureCollection.features.push({...regionCenterFeature, properties: {
				...regionCenterFeature,
				cluster_id: clusterId,
			}})

		return {
			boundId: clusterId,
			initCanvasModelComponent: initCanvasModelFn(featuresOfRegionId)
		}
	})
	map.addSource(mainLayerIdCluster, {
		'type': 'geojson',
		'data': centerOfRegionFeatureCollection,
	});
	const activeMarker = new CanvasMarker()
	console.log('listImages', listImages)
	canvasSymbolLayer(map, {
		layer: clusterLayer,
		imageName: mainLayerIdCluster,
		size: { width: 100, height: 100 },
		activeMarker,
		listImages
	})

	return clusterLayer
}
