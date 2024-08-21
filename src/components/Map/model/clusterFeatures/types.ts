import {Feature, Point} from "geojson";

type GeneratedIdForCluster = (string | number)
export type FeaturesForCluster = [GeneratedIdForCluster, Feature<Point>[]][]
