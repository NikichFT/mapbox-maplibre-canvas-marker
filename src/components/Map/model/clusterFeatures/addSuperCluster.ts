import {GeoJSONSource, Map, SymbolLayerSpecification} from "maplibre-gl";
import {featureCollection} from "@turf/turf";
import {Feature, Point, FeatureCollection} from "geojson";
import {canvasSymbolLayer, TListImagesCanvasLayer} from "../CustomLayers/canvasSymbolLayer/canvasSymbolLayer.ts";
import {CanvasMarker} from "../canvasMarkers/methods/CanvasMarker.ts";
import Supercluster from "supercluster";
import {TInitCanvasModelComponent} from "../canvasMarkers/methods/canvasImage.ts";
import {addBaseMarkerEvents} from "./layerEvents/addBaseMarkerEvents.ts";

export default function (map: Map, sourceId: string, FC: FeatureCollection<Point>, mainLayer: SymbolLayerSpecification, initCanvasModelFn: (features: Feature<Point>[]) => TInitCanvasModelComponent): SymbolLayerSpecification {
	const maxZoom = 20

	const cluster = new Supercluster({
		radius: 50,
		maxZoom,
		minZoom: 0,
		map: (props) => {
			return {sum: 1}
		},
		reduce: (accumulated, props) => { accumulated.sum += props.sum; }
	});
	cluster.load(FC.features);

	const layerId = mainLayer.id
	const mainLayerIdCluster = `${layerId}_cluster`
	const clusterLayer: SymbolLayerSpecification = {
		id: `${layerId}_cluster`,
		type: 'symbol',
		source: sourceId,
		layout: {
			'icon-image': ['concat', mainLayerIdCluster, ['get', 'cluster_id']],
			'icon-allow-overlap': true,
			'icon-size': [
				'interpolate',
				['linear'],
				['zoom'],
				0, 1,
				maxZoom, 1
			],
		},
		minzoom: 0,
		maxzoom: mainLayer.minzoom,
	}
	const activeMarker = new CanvasMarker()

	function updateClusters () {
		const boundsRaw = map.getBounds();
		const bounds = [boundsRaw._sw.lng, boundsRaw._sw.lat, boundsRaw._ne.lng, boundsRaw._ne.lat];
		const clusters = cluster.getClusters(bounds, map.getZoom());
		const clusterData = featureCollection(clusters.filter(f => f.properties.cluster_id));

		console.log('clusters', clusterData)

		const listImages: TListImagesCanvasLayer = clusterData.features.map((feature) => {
			const clusterId = feature.properties.cluster_id
			const featuresOfCluster = cluster.getLeaves(clusterId, Infinity)

			return {
				boundId: clusterId,
				initCanvasModelComponent: initCanvasModelFn(featuresOfCluster)
			}
		})

		console.log('listImages', listImages)
		canvasSymbolLayer(map, {
			layer: clusterLayer,
			imageName: mainLayerIdCluster,
			size: { width: 100, height: 100 },
			activeMarker,
			listImages
		})

		const source = map.getSource(sourceId) as GeoJSONSource;
		console.log('source', source)
		if (source) {
			source.setData(clusterData);
		}

		return {map: map};
	}

	map.addSource(sourceId, {
		'type': 'geojson',
		'data': featureCollection([]),
	});

	map.on('zoomend', updateClusters)
		.on('moveend', updateClusters);

	addBaseMarkerEvents(map, clusterLayer, activeMarker, mainLayerIdCluster)

	updateClusters();

	return clusterLayer
}
