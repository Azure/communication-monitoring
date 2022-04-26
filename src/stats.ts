import { GeneralStatsCollectorImpl } from './GeneralStats/generalStatsCollector'
import { MediaStatsCollectorImpl } from './MediaStats/mediaStatsCollector'
import { removeTables, showErrorScreen } from './statTables'
import { Collector, Options } from './types'
import { UserFacingDiagnosticsImpl } from './UserFacingDiagnostics/userFacingDiagnosticsCollector'

export function startCollection(collectorArray: Collector[]) {
  collectorArray.map((collector) => {
    try{
      collector.startCollector()
    } catch (e) {
      console.error(e)
    }
  })
}

export function stopCollection(collectorArray: Collector[]) {
  collectorArray.map((collector) => {
    collector.stopCollector()
  })
}

export function createCollectorArray(options: Options): Collector[] {
  const mediaStats = new MediaStatsCollectorImpl(options)
  const generalStats = new GeneralStatsCollectorImpl(options)
  const userFacingDiagnostics = new UserFacingDiagnosticsImpl(options)
  return [generalStats, mediaStats, userFacingDiagnostics]
}

export function listenToCall(options: Options, isOpened: { value: boolean }) {
  const listener = setInterval(() => {
    if (options.callAgent.calls[0] === undefined) {
      if (isOpened.value) {
        removeTables()
        showErrorScreen()
      }
      clearInterval(listener)
    }
  }, 1000)
}
