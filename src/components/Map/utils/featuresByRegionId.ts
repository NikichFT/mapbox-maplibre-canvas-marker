import {Feature, Point} from "geojson";

interface IFeatureByRegionId {
	[key: number]: Feature[]
}
export const featuresByRegionId = (features: Feature<Point>[]): IFeatureByRegionId => {
	const featuresByRegionId = {}
	features.forEach(feature => {
		if (featuresByRegionId[feature.properties?.region_id]) {
			featuresByRegionId[feature.properties?.region_id].push(feature);
			return
		}
		featuresByRegionId[feature.properties?.region_id] = [feature]
	})

	return featuresByRegionId
}
