import { Map, StyleImageInterface } from 'maplibre-gl'

import canvasRoundedRect from './canvasRoundedRect'

interface IPulsedIcon {
    shape: IShapeFigures
    map: Map
    sourceId: string
    sourceLayerId?: string
    color: string
    data: any
    pulsedIconImageId: string
    isExist: boolean
    onAdd(): void
    render(): void
}
export interface IPulseEffect {
    pulsedIcon: IPulsedIcon
    add(): void
    remove(): void
}

interface IShape {
    animationSize: number
    iconSize: number
    width: number
    height: number

    area(): number
    outerArea(): number
    canvasDraw(context: CanvasRenderingContext2D, t: number): void
    canvasDrawStatic(context: CanvasRenderingContext2D): void
}

interface IconSquareFigure extends IShape {}
interface IconRhombusFigure extends IShape {}
interface IconCircleFigure extends IShape {}

type IShapeFigures = IconSquareFigure | IconRhombusFigure | IconCircleFigure

export class IconSquare implements IconSquareFigure {
    animationSize: number
    iconSize: number

    constructor(animationSize: number, iconSize: number) {
        this.animationSize = animationSize
        this.iconSize = iconSize
    }

    get width() {
        return this.animationSize
    }
    get height() {
        return this.animationSize
    }

    area() {
        return (this.animationSize / 2) * 0.5
    }
    outerArea() {
        return (this.animationSize / 2) * 0.5
    }
    canvasDraw(context: CanvasRenderingContext2D, t) {
        const x = this.animationSize / 2
        const y = this.animationSize / 2
        const widthOuterRadius = this.animationSize * t
        const heightOuterRadius = this.animationSize * t

        // console.log('context', context)

        canvasRoundedRect(
            context,
            x,
            y,
            widthOuterRadius,
            heightOuterRadius,
            Math.PI * 2
        )
    }
    canvasDrawStatic(context: CanvasRenderingContext2D) {
        const x = this.animationSize / 2
        const y = this.animationSize / 2
        const widthOuterRadius = this.animationSize
        const heightOuterRadius = this.animationSize

        // console.log('context', context)

        canvasRoundedRect(
            context,
            x,
            y,
            widthOuterRadius,
            heightOuterRadius,
            Math.PI * 2
        )
    }
}

export class IconRhombus implements IconRhombusFigure {
    animationSize: number
    iconSize: number

    constructor(animationSize: number, iconSize: number) {
        this.animationSize = animationSize
        this.iconSize = iconSize
    }

    get width() {
        return this.animationSize
    }
    get height() {
        return this.animationSize
    }

    area() {
        return (this.animationSize / 2) * 0.5
    }
    outerArea() {
        return (this.animationSize / 2) * 0.5
    }
    canvasDraw(context: CanvasRenderingContext2D, t) {
        const rotationAngle = (Math.PI / 180) * 45

        const x = this.animationSize / 2
        const y = this.animationSize / 2
        const widthOuterRadius = (this.animationSize - this.iconSize / 2) * t
        const heightOuterRadius = (this.animationSize - this.iconSize / 2) * t

        // console.log('context', context)

        canvasRoundedRect(
            context,
            x,
            y,
            widthOuterRadius,
            heightOuterRadius,
            Math.PI * 2,
            rotationAngle
        )
    }
    canvasDrawStatic(context: CanvasRenderingContext2D) {
        const rotationAngle = (Math.PI / 180) * 45

        const x = this.animationSize / 2
        const y = this.animationSize / 2
        const widthOuterRadius = this.animationSize - this.iconSize / 2
        const heightOuterRadius = this.animationSize - this.iconSize / 2

        // console.log('context', context)

        canvasRoundedRect(
            context,
            x,
            y,
            widthOuterRadius,
            heightOuterRadius,
            Math.PI * 2,
            rotationAngle
        )
    }
}

export class IconCircle implements IconCircleFigure {
    animationSize: number
    iconSize: number
    constructor(animationSize: number, iconSize) {
        this.animationSize = animationSize
        this.iconSize = iconSize
    }

    get width() {
        return this.animationSize
    }
    get height() {
        return this.animationSize
    }

    area() {
        return (this.animationSize / 2) * 0.3
    }
    outerArea() {
        return (this.animationSize / 2) * 0.7
    }
    canvasDraw(context: CanvasRenderingContext2D, t) {
        const radius = this.area()
        const outerRadius = this.outerArea() * t + radius

        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        )
    }
    canvasDrawStatic(context: CanvasRenderingContext2D) {
        const radius = this.area()
        const outerRadius = this.outerArea() + radius

        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        )
    }
}

export class PulsedIcon implements StyleImageInterface {
    map: Map
    shape: IShapeFigures
    sourceId: string
    sourceLayerId: string
    color: string
    data: Uint8ClampedArray | Uint8Array
    context = null as RenderingContext | null

    constructor(
        shape: IShapeFigures,
        map: Map,
        sourceId: string,
        color = '#ffffff',
        sourceLayerId
    ) {
        this.shape = shape
        this.map = map
        this.sourceId = sourceId
        this.sourceLayerId = sourceLayerId
        this.color = color
        this.data = new Uint8Array(
            this.shape.animationSize * this.shape.animationSize * 4
        )
    }

    get pulsedIconImageId() {
        return this.sourceId + '-dot'
    }
    get pulsedIconLayerId() {
        return this.sourceId + '-points'
    }
    get width() {
        return this.shape.width
    }
    get height() {
        return this.shape.height
    }
    get animationSize() {
        return this.shape.animationSize
    }
    get isExist() {
        return this.map.hasImage(this.pulsedIconImageId)
    }

    onAdd() {
        this.data = new Uint8Array(this.animationSize * this.animationSize * 4)
        const canvas = document.createElement('canvas')
        canvas.width = this.shape.width
        canvas.height = this.shape.height
        this.context = canvas.getContext('2d', { willReadFrequently: true })
    }

    render() {
        if (!this.isExist) {
            console.log('notExist')
            return false
        }
        const duration = 2000
        const t = (performance.now() % duration) / duration
        const radius = this.shape.area()
        const outerRadius = this.shape.outerArea() * t + radius
        const context = this.context

        // console.log('renderer', context)

        if (context !== null && context instanceof CanvasRenderingContext2D) {
            context.clearRect(0, 0, this.width, this.height)
            context.beginPath()

            this.shape.canvasDraw(context, t)

            context.fillStyle =
                this.color + Math.floor((1 - t) * 255).toString(16)
            context.fill()

            // context.beginPath()
            // context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
            // context.fillStyle = 'rgba(255, 100, 100, 1)'
            // context.strokeStyle = 'white'
            // context.lineWidth = 2 + 4 * (1 - t)
            // context.fill()
            // context.stroke()

            this.data = context.getImageData(0, 0, this.width, this.height).data
        }

        this.map.triggerRepaint()

        return true
    }
}

export class PulsedIconStatic implements StyleImageInterface {
    map: Map
    shape: IShapeFigures
    sourceId: string
    sourceLayerId: string
    color: string
    data: Uint8ClampedArray | Uint8Array
    context = null as RenderingContext | null

    constructor(
        shape: IShapeFigures,
        map: Map,
        sourceId: string,
        color = '#ffffff',
        sourceLayerId
    ) {
        this.shape = shape
        this.map = map
        this.sourceId = sourceId
        this.sourceLayerId = sourceLayerId
        this.color = color
        this.data = new Uint8Array(
            this.shape.animationSize * this.shape.animationSize * 4
        )
    }

    get pulsedIconImageId() {
        return this.sourceId + '-dot'
    }
    get pulsedIconLayerId() {
        return this.sourceId + '-points'
    }
    get width() {
        return this.shape.width
    }
    get height() {
        return this.shape.height
    }
    get animationSize() {
        return this.shape.animationSize
    }
    get isExist() {
        return this.map.hasImage(this.pulsedIconImageId)
    }

    onAdd() {
        this.data = new Uint8Array(this.animationSize * this.animationSize * 4)
        const canvas = document.createElement('canvas')
        canvas.width = this.shape.width
        canvas.height = this.shape.height
        this.context = canvas.getContext('2d', { willReadFrequently: true })
    }

    render() {
        if (!this.isExist) {
            console.log('notExist')
            return false
        }
        const duration = 2000
        const t = 1
        const radius = this.shape.area()
        const outerRadius = this.shape.outerArea() * t + radius
        const context = this.context

        // console.log('renderer', context)

        if (context !== null && context instanceof CanvasRenderingContext2D) {
            context.clearRect(0, 0, this.width, this.height)
            context.beginPath()

            this.shape.canvasDrawStatic(context)

            context.fillStyle = this.color
            context.fill()

            // context.strokeRect((this.width - this.width / 1.2), 15, this.width / 1.2, 0);

            // context.beginPath()
            // context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
            // context.fillStyle = 'rgba(255, 100, 100, 1)'
            // context.strokeStyle = 'white'
            // context.lineWidth = 2 + 4 * (1 - t)
            // context.fill()
            // context.stroke()

            this.data = context.getImageData(0, 0, this.width, this.height).data
        }

        this.map.triggerRepaint()

        return true
    }
}

export class PulseEffect implements IPulseEffect {
    constructor(public pulsedIcon: PulsedIcon) {
        this.pulsedIcon = pulsedIcon
    }

    addStatic() {
        // console.log(this.pulsedIcon.pulsedIconImageId)
        if (!this.pulsedIcon.map.hasImage(this.pulsedIcon.pulsedIconImageId))
            this.pulsedIcon.map.addImage(
                this.pulsedIcon.pulsedIconImageId,
                this.pulsedIcon,
                { pixelRatio: 2 }
            )

        this.pulsedIcon.map.addLayer({
            id: this.pulsedIcon.pulsedIconLayerId,
            type: 'symbol',
            source: this.pulsedIcon.sourceId,
            layout: {
                'icon-overlap': 'always',
                'icon-image': this.pulsedIcon.pulsedIconImageId,
            },
            paint: {
                'icon-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'isFocused'], true],
                    1,
                    0,
                ],
            },
            ...(this.pulsedIcon.sourceLayerId && {
                'source-layer': this.pulsedIcon.sourceLayerId,
            }),
        })

        const firstLayer = this.pulsedIcon.map
            .getStyle()
            .layers.find(item => item.id.includes(this.pulsedIcon.sourceId))?.id

        this.pulsedIcon.map.moveLayer(
            this.pulsedIcon.pulsedIconLayerId,
            firstLayer
        )
    }

    add() {
        // console.log(this.pulsedIcon.pulsedIconImageId)
        if (!this.pulsedIcon.map.hasImage(this.pulsedIcon.pulsedIconImageId))
            this.pulsedIcon.map.addImage(
                this.pulsedIcon.pulsedIconImageId,
                this.pulsedIcon,
                { pixelRatio: 2 }
            )

        this.pulsedIcon.map.addLayer({
            id: this.pulsedIcon.pulsedIconLayerId,
            type: 'symbol',
            source: this.pulsedIcon.sourceId,
            layout: {
                'icon-overlap': 'always',
                'icon-image': this.pulsedIcon.pulsedIconImageId,
            },
            paint: {
                'icon-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'isFocused'], false],
                    1,
                    0,
                ],
            },
            ...(this.pulsedIcon.sourceLayerId && {
                'source-layer': this.pulsedIcon.sourceLayerId,
            }),
        })

        const firstLayer = this.pulsedIcon.map
            .getStyle()
            .layers.find(item => item.id.includes(this.pulsedIcon.sourceId))?.id

        this.pulsedIcon.map.moveLayer(
            this.pulsedIcon.pulsedIconLayerId,
            firstLayer
        )
    }
    async remove() {
        this.pulsedIcon.map.removeLayer(this.pulsedIcon.pulsedIconLayerId)

        // this.pulsedIcon.map.removeImage(this.pulsedIcon.pulsedIconImageId)
    }
}

export class PulseEffectStatic implements IPulseEffect {
    constructor(public pulsedIcon: PulsedIcon) {
        this.pulsedIcon = pulsedIcon
    }

    add() {
        // console.log(this.pulsedIcon.pulsedIconImageId)
        if (!this.pulsedIcon.map.hasImage(this.pulsedIcon.pulsedIconImageId))
            this.pulsedIcon.map.addImage(
                this.pulsedIcon.pulsedIconImageId,
                this.pulsedIcon,
                { pixelRatio: 2 }
            )

        // this.pulsedIcon.map.addLayer({
        //     id: this.pulsedIcon.pulsedIconLayerId,
        //     type: 'symbol',
        //     source: this.pulsedIcon.sourceId,
        //     layout: {
        //         'icon-overlap': 'always',
        //         'icon-image': this.pulsedIcon.pulsedIconImageId,
        //     },
        //     paint: {
        //         'icon-opacity': 1,
        //     },
        //     ...(this.pulsedIcon.sourceLayerId && {'source-layer': this.pulsedIcon.sourceLayerId}),
        // })

        const firstLayer = this.pulsedIcon.map
            .getStyle()
            .layers.find(item => item.id.includes(this.pulsedIcon.sourceId))?.id

        this.pulsedIcon.map.moveLayer(
            this.pulsedIcon.pulsedIconLayerId,
            firstLayer
        )

        return this.pulsedIcon.pulsedIconImageId
    }

    async remove() {
        this.pulsedIcon.map.removeLayer(this.pulsedIcon.pulsedIconLayerId)

        // this.pulsedIcon.map.removeImage(this.pulsedIcon.pulsedIconImageId)
    }
}

export default (
    pulsedIconType: IShapeFigures,
    map: Map,
    sourceId: string,
    color?: string,
    sourceLayerId?: string | null,
    isStatic?: boolean
) => {
    if (isStatic) {
        const pulsedIcon = new PulsedIconStatic(
            pulsedIconType,
            map,
            sourceId,
            color,
            sourceLayerId
        )
        return new PulseEffectStatic(pulsedIcon)
    }
    const pulsedIcon = new PulsedIcon(
        pulsedIconType,
        map,
        sourceId,
        color,
        sourceLayerId
    )
    // console.log('pulseFigure', pulsedIcon)
    return new PulseEffect(pulsedIcon)
}
