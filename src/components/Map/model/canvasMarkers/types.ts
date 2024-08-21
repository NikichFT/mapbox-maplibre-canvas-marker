import {LayerSpecification, Marker} from "maplibre-gl";
import {Ref} from "vue";

export interface ICanvasMarkerWatcherFactory {
	watchers: {
		[key: string]: () => void
	}
	register: () => void
}
export interface ICanvasMarkerInstance {
	id: Ref<number | null>,
	value: Marker | null,
	layer: LayerSpecification | null,
	watcherFactory: ICanvasMarkerWatcherFactory
}
