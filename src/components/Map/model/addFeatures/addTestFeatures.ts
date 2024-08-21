import data from './data/charging.json'
import {featuresByRegionId} from "../../utils/featuresByRegionId.ts";
import {SymbolLayerSpecification, Map} from "maplibre-gl";
import addLayerCluster from "../clusterFeatures/addLayerCluster.ts";
import {initChart} from "../markerExamples/charts/model/initChart.ts";
import {pieChartShell} from "../markerExamples/charts/pieChartShell.ts";
import {clustersDbscan} from "@turf/turf";
export const addTestFeatures = (map: Map) => {
	const testFeatureCollection = data as any
	console.log('testF', testFeatureCollection)
	const featuresByRegionIdEntries = Object.entries(featuresByRegionId(testFeatureCollection.features))
	console.log('featuresByRegionIdEntries', featuresByRegionIdEntries)
	const clusteredPoints = clustersDbscan(testFeatureCollection, 40, {
		mutate: false,
	})

	const clustersByDistance: { [key: number]: any } = {};

	// Group points by cluster
	clusteredPoints.features.forEach(feature => {
		const clusterId = feature.properties.cluster;
		if (!clusterId) return
		if (!clustersByDistance[clusterId]) clustersByDistance[clusterId] = [];
		clustersByDistance[clusterId].push(feature);
	});

	const clustersByDistanceEntries = Object.entries(clustersByDistance)

	const testLayerId = `egs`
	const mainTestLayer: SymbolLayerSpecification = {
		id: testLayerId,
		type: 'symbol',
		minzoom: 7,
		source: testLayerId,
		layout: {
			'icon-allow-overlap': true,
			'icon-image': 'energy' + '_' + 22,
		},
	}
	map.addSource(testLayerId, {
		'type': 'geojson',
		'data': testFeatureCollection,
	});
	map.addLayer(mainTestLayer)

	const clusterLayer = addLayerCluster(map, clustersByDistanceEntries, mainTestLayer, initChart(pieChartShell))
}
