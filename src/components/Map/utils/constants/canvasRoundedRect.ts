export default function (context, x, y, width, height, radius, rotationAngle?) {
    // Because the function is added to the context prototype
    // the 'this' variable is actually the context
    // Save the existing state of the canvas so that it can be restored later
    context.save()

    // Translate to the given X/Y coordinates
    context.translate(x, y)
    rotationAngle && context.rotate(rotationAngle)
    context.translate(-width / 2, -height / 2)

    // Move to the center of the top horizontal line
    context.moveTo(width / 2, 0)

    // Draw the rounded corners. The connecting lines in between them are drawn automatically
    context.arcTo(width, 0, width, height, Math.min(height / 2, radius))
    context.arcTo(width, height, 0, height, Math.min(width / 2, radius))
    context.arcTo(0, height, 0, 0, Math.min(height / 2, radius))
    context.arcTo(0, 0, radius, 0, Math.min(width / 2, radius))

    // Draw a line back to the start coordinates
    context.lineTo(width / 2, 0)

    // Restore the state of the canvas to as it was before the save
    context.restore()
}
