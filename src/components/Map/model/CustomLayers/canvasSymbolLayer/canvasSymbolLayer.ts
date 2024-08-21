import {Map, SymbolLayerSpecification} from "maplibre-gl";
import {canvasImage, TInitCanvasModelComponent} from "../../canvasMarkers/methods/canvasImage.ts";
import {ICanvasMarkerInstance} from "../../canvasMarkers/types.ts";
import {registerInterpolation} from "./methods/registerInterpolation.ts";
import {getImageIdByBoundId} from "../utils/getImageIdByBoundId.ts";

export type TListImagesCanvasLayer = {
	boundId: number
	initCanvasModelComponent: TInitCanvasModelComponent,
}[]
export interface CanvasSymbolLayerOptions {
	layer: SymbolLayerSpecification,
	imageName: string,
	size: { width: number, height: number },
	activeMarker: ICanvasMarkerInstance,
	listImages: TListImagesCanvasLayer
}

export function canvasSymbolLayer(map: Map, {
	layer,
	imageName,
	size,
	activeMarker,
	listImages
}: CanvasSymbolLayerOptions): void {
	const {width, height} = size

	const {imagesToUpdate, imagesToAdd}: { [key: string]: CanvasSymbolLayerOptions['listImages'] } = {
		imagesToUpdate: [],
		imagesToAdd: [],
	}
	listImages.forEach((image) => {
		if (map.hasImage(getImageIdByBoundId(imageName, image.boundId))) {
			imagesToUpdate.push(image)
			return
		}

		imagesToAdd.push(image)
	})
	console.log('imagesToUpdate: ', map.getImage(getImageIdByBoundId(imageName, imagesToUpdate[0]?.boundId)))

	// updating existing images
	if (imagesToUpdate.length) {
		imagesToUpdate.forEach(({boundId}) => {
			const imageId = getImageIdByBoundId(imageName, boundId)
			const imageInstance = map.getImage(imageId);
			(imageInstance.userImage as any).update()
		})
	}

	const imageInstancesAdded = imagesToAdd.map(({boundId, initCanvasModelComponent}) => {
		const canvasImageInstance = canvasImage(initCanvasModelComponent, width, height)
		const imageId = getImageIdByBoundId(imageName, boundId)
		map.addImage(imageId, canvasImageInstance, {pixelRatio: 1})
		if (!map.getLayer(layer.id)) {
			map.addLayer(layer);
		}

		return canvasImageInstance
	})

	registerInterpolation(map, layer, activeMarker, imageInstancesAdded)
}
