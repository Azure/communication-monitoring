import { Call } from '@azure/communication-calling'
import { GeneralStatsCollectorImpl } from './GeneralStats/generalStatsCollector'
import { MediaStatsCollectorImpl } from './MediaStats/mediaStatsCollector'
import { Collector } from '../types'
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

export function createCollectorArray(call: Call): Collector[] {
  const mediaStats = new MediaStatsCollectorImpl(call)
  const generalStats = new GeneralStatsCollectorImpl(call)
  const userFacingDiagnostics = new UserFacingDiagnosticsImpl(call)
  return [generalStats, mediaStats, userFacingDiagnostics]
}
