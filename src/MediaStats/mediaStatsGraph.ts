import { MediaStatsDataValue } from '../../types'
import { renderChart } from './mediaStatsGraphState'
import Chart from 'chart.js/auto'

let myChart: Chart
let backButton: HTMLElement

export function initializeGraph(
  objectToGraph: MediaStatsDataValue[],
  objectName: string
) {
  (document.getElementById('mediaStatsTable') as HTMLElement).hidden = true
  ;(document.getElementById('navigationTabs') as HTMLElement).hidden = true

  const statsContainer = document.getElementById('media-stats-pop-up')!
  const historicalDataDiv = document.createElement('div')
  historicalDataDiv.id = 'historicalDataDiv'
  const chartContainer = document.createElement('canvas')!
  chartContainer.id = 'myChart'
  const chartContainerHolder = document.createElement('div')

  backButton = document.createElement('button')
  backButton.id = 'backButton'
  backButton.innerText = '<- Back'

  backButton.addEventListener('click', () => {
    (document.getElementById('mediaStatsTable') as HTMLElement).hidden = false
    ;(document.getElementById('navigationTabs') as HTMLElement).hidden = false
    statsContainer.removeChild(historicalDataDiv)
    statsContainer.removeChild(backButton)
    myChart.destroy()
  })

  chartContainerHolder.append(chartContainer)
  historicalDataDiv.append(chartContainerHolder)
  statsContainer.append(backButton, historicalDataDiv)

  renderChart(objectToGraph, objectName, myChart)
}
