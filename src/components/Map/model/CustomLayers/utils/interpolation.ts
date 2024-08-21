export const linearInterpolation = (currentZoom, minZoom, maxZoom, outputMin, outputMax) => {
	const zoomRange = maxZoom - minZoom;
	const outputRange = outputMax - outputMin;
	const normalizedInput = (currentZoom - minZoom) / zoomRange;
	return (normalizedInput * outputRange) + outputMin;
}
