import * as echarts from 'echarts';
import {EChartsOption} from "echarts";
import {computed, watch} from "vue";

export const initChart = (getOption: (...args: any) => EChartsOption) => {

    return (...args) => {
        const option = getOption(...args)

        return (canvas) => {
            const myChart = echarts.init(canvas, null,  { renderer: 'canvas' });
            canvas.width = myChart.getWidth();
            canvas.height = myChart.getHeight();

            option && myChart.setOption(option);

            // const filters = computed(() => globalThis.vm.$state.view.listControlData.selected.filter)
            // watch(filters, (changedFilters) => {
            //     const filteredFeatures = args[0].filter(feature => {
            //         const changedFiltersArr = Object.entries<string[]>(changedFilters)
            //         if (!changedFiltersArr.find(([filterType, values]) => values.length)) {
            //             return args[0]
            //         }
            //         return Object.entries<[string, string[]]>(changedFilters).find(([key, values]) => {
            //             return values.includes(feature.properties[key])
            //         })
            //     })
            //     myChart.setOption(getOption(filteredFeatures))
            // })
            return {
                canvas: myChart.getDom(),
                update: () => {
                    myChart.setOption(option)
                }
            }
        }
    }
}
