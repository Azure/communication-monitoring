import {
  Call,
  Features,
  MediaStats,
  MediaStatsCallFeature,
  MediaStatsCollector,
} from '@azure/communication-calling'
import { MediaStatsData, Collector, Tabs, Options } from '../types'
import { MediaStatsMap } from './mediaStatsMap'
import { MEDIA_STATS_AMOUNT_LIMIT } from './constants'
import { setMediaFailedToStart } from '../statTables'

export class MediaStatsCollectorImpl implements Collector {
  call: Call
  tab: Tabs
  mediaStatsFeature?: MediaStatsCallFeature
  mediaStatsData: MediaStatsData = {}

  constructor(options: Options) {
    this.call = options.callAgent.calls[0]
    this.tab = Tabs.MediaStats
  }

  getStats() {
    return this.mediaStatsData
  }

  startCollector() {
    // Start collecting stats
    let mediaStatsCollector: MediaStatsCollector
    try {
      this.mediaStatsFeature = this.call.feature(Features.MediaStats)
    } catch (e) {
      console.error(e)
      console.error('Media Stats feature is not available')
      setMediaFailedToStart(true)
      return
    }

    const mediaStatsCollectorOptions = {
      aggregationInterval: 1,
      dataPointsPerAggregation: 1,
    }

    try {
      mediaStatsCollector = this.mediaStatsFeature.startCollector(
        mediaStatsCollectorOptions
      )
    } catch (e) {
      console.error(e)
      console.error('Media stats collector could not start')
      setMediaFailedToStart(true)
      return
    }

    mediaStatsCollector.on('mediaStatsEmitted', (mediaStats) => {
      this.mediaStatsData = this.updateData(mediaStats, this.mediaStatsData)
    })
  }

  stopCollector() {
    // Stop collecting stats
    this.mediaStatsFeature?.disposeAllCollectors()
  }

  updateData(
    mediaStats: MediaStats,
    mediaStatsData: MediaStatsData
  ): MediaStatsData {
    try {
      for (const [statName, statValue] of Object.entries(mediaStats.stats)) {
        if (statName in MediaStatsMap) {
          let value: string | number
          let unit: string

          if (
            MediaStatsMap[
              statName as keyof typeof MediaStatsMap
            ].hasOwnProperty('GranularityDivider')
          ) {
            value =
              (statValue.raw[0] as number) /
              ((MediaStatsMap[statName as keyof typeof MediaStatsMap] as any)
                .GranularityDivider as number)
            unit = (
              MediaStatsMap[statName as keyof typeof MediaStatsMap] as any
            ).GranularityUnits
          } else {
            value = statValue.raw[0]
            unit = MediaStatsMap[statName as keyof typeof MediaStatsMap].Units
          }

          if (statName in mediaStatsData) {
            if (
              mediaStatsData[statName as keyof MediaStatsData]!.length >=
              MEDIA_STATS_AMOUNT_LIMIT
            ) {
              mediaStatsData[statName as keyof MediaStatsData]!.shift()
            }
            mediaStatsData[statName as keyof MediaStatsData]!.push({
              timestamp: statValue.timestamp,
              value,
              unit,
            })
          } else {
            mediaStatsData[statName as keyof MediaStatsData] = [
              {
                timestamp: statValue.timestamp,
                value,
                unit,
              },
            ]
          }
        } else {
          console.debug('%s is not present in MediaStatsMap', statName)
        }
      }
    } catch (e) {
      this.stopCollector()
      console.error(e)
      setMediaFailedToStart(true)
    }

    return mediaStatsData
  }
}
