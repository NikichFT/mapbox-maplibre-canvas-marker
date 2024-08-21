import data from './data/charging.json'
import {Map, SymbolLayerSpecification} from "maplibre-gl";
import {initChart} from "../markerExamples/charts/model/initChart.ts";
import {pieChartShell} from "../markerExamples/charts/pieChartShell.ts";
import addSuperCluster from "../clusterFeatures/addSuperCluster.ts";
export const addSupercluster = (map: Map) => {
	const testFeatureCollection = data as any
	console.log('testF', testFeatureCollection)

	const testLayerId = `egs`
	const mainTestLayer: SymbolLayerSpecification = {
		id: testLayerId,
		type: 'symbol',
		minzoom: 24,
		source: testLayerId,
		layout: {
			'icon-allow-overlap': true,
			'icon-image': 'energy' + '_' + 22,
		},
	}
	const clusterLayer = addSuperCluster(map, 'egs_cluster', testFeatureCollection, mainTestLayer, initChart(pieChartShell))
}
