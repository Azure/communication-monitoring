import { GeneralStatsCollectorImpl } from './GeneralStats/generalStatsCollector'
import { MediaStatsCollectorImpl } from './MediaStats/mediaStatsCollector'
import { Collector, Options } from './types'
import { UserFacingDiagnosticsImpl } from './UserFacingDiagnostics/userFacingDiagnosticsCollector'

export function startCollection(collectorArray: Collector[]) {
  collectorArray.map((collector) => {
    collector.startCollector()
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
