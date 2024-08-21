import {ICanvasMarkerInstance, ICanvasMarkerWatcherFactory} from "../types.ts";
import {ref} from "vue";

export class CanvasMarkerWatcherFactory implements ICanvasMarkerWatcherFactory {
	watchers: ICanvasMarkerWatcherFactory['watchers']
	constructor(watchers?) {
			this.watchers = watchers || []
	}

	register() {
		if (!this.watchers) return

		Object.values(this.watchers).forEach(watcher => watcher())
	}
}

export class CanvasMarker implements ICanvasMarkerInstance{
	id: ICanvasMarkerInstance['id']
	value: ICanvasMarkerInstance['value']
	layer: ICanvasMarkerInstance['layer']
	watcherFactory: ICanvasMarkerInstance['watcherFactory']
	constructor(props?: Partial<{
		id: ICanvasMarkerInstance['id'],
		value: ICanvasMarkerInstance['value'],
		layer: ICanvasMarkerInstance['layer'],
		watchers: ICanvasMarkerInstance['watcherFactory']['watchers']
	}>) {
		this.id = ref(props?.id || null)
		this.value = props?.value || null
		this.layer = props?.layer || null
		this.watcherFactory = new CanvasMarkerWatcherFactory(props?.watchers)
	}
}
