import {EChartsOption} from "echarts";
import {Feature, Point} from "geojson";

export const pieChartShell = (features: Feature<Point>[]): EChartsOption => {
    const brandSet = new Set(
      features.map(feature => feature.properties?.name)
    )
    const brandsWithCount: { name: string; value: number }[] = []
    brandSet.forEach((brandName: string) => {
        const count = features.filter(
          feature => feature.properties?.name === brandName
        ).length
        brandsWithCount.push({
            name: brandName,
            value: count,
        })
    })

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
                data: brandsWithCount.map((fieldData) => {
                    return {
                        value: fieldData.value,
                        name: fieldData.name || 'other',
                    }
                }).sort(function (a, b) {
                    return a.value - b.value;
                }),
            }
        ]
    }
}
