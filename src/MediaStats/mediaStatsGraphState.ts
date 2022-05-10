import { MediaStatsDataValue } from '../types'
import {
  GRAPH_LINE_COLOR,
  GRAPH_POINT_COLOR,
  CHART_UPDATE_DELAY,
  CHART_UPDATE_TTL,
} from './constants'
import { MediaStatsMap } from './mediaStatsMap'
import Chart from 'chart.js/auto'
import ChartStreaming from 'chartjs-plugin-streaming'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-luxon'

let chart: Chart

export function renderChart(
  objectToGraph: MediaStatsDataValue[],
  objectName: string
) {
  Chart.register(zoomPlugin, ChartStreaming)

  const chartContainer = document.getElementById('myChart') as HTMLCanvasElement
  const objectKey = objectName as keyof typeof MediaStatsMap
  const data = {
    datasets: [
      {
        label:
          MediaStatsMap[objectKey].Name +
          ' - ' +
          MediaStatsMap[objectKey].Category,
        backgroundColor: GRAPH_POINT_COLOR,
        borderColor: GRAPH_LINE_COLOR,
        data: generateOldData(objectToGraph),
        tension: 0.2,
      },
    ],
  }

  const ctx = chartContainer.getContext('2d')!

  /* eslint-disable  @typescript-eslint/no-unused-vars */
  chart = new Chart(ctx, {
    type: 'line',
    data,
    options: {
      animation: {
        duration: 0,
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            delay: CHART_UPDATE_DELAY,
            ttl: CHART_UPDATE_TTL,
            onRefresh: (chart: Chart) => {
              chart.data.datasets[0].data.push({
                x: objectToGraph[objectToGraph.length - 1].timestamp.getTime(),
                y: objectToGraph[objectToGraph.length - 1].value as number,
              })
            },
          },
        },
      },
      plugins: {
        streaming: {
          duration: 20000,
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
          },
          zoom: {
            pinch: {
              enabled: true,
            },
            wheel: {
              enabled: true,
            },
            mode: 'x',
          },
          limits: {
            x: {
              min: 'original',
              max: 'original',
            },
          },
        },
      },
    },
  })
}

function generateOldData(objectToGraph: MediaStatsDataValue[]) {
  const now = new Date()
  const valueArray: { x: number; y: number }[] = []
  now.setSeconds(now.getSeconds() - objectToGraph.length)
  objectToGraph.forEach((element) => {
    valueArray.push({
      x: element.timestamp.getTime(),
      y: element.value as number,
    })
  })
  return valueArray
}

export function destroyChart() {
  if (chart) {
    chart.destroy()
  }
  Chart.unregister(zoomPlugin, ChartStreaming)
}
