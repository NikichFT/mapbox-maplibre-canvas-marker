import {EChartsOption} from "echarts";
import {Feature, Point} from "geojson";
import data from '../../addFeatures/data/charging.json'

export const pieChartShell = (features: Feature<Point>[]): EChartsOption => {
    const testFeatureCollection = data as any

    const fieldsWithCount: {name: string, value: number}[] = [
        {
            name: 'all',
            value: testFeatureCollection.features.length
        },
        {
            name: 'clustered',
            value: features.length
        },
    ]
    return {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            show: false,
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                width: '100px',
                height: '100px',
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 0
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 10,
                        fontWeight: 'bold',
                    }
                },
                labelLine: {
                    show: false
                },
                data: fieldsWithCount.map((fieldData) => {
                    return {
                        value: fieldData.value,
                        name: fieldData.value || 'other',
                    }
                }).sort(function (a, b) {
                    return a.value - b.value;
                }),
            }
        ]
    }
}
