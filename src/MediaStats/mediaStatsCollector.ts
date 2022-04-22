import {
  Call,
  Features,
  MediaStats,
  MediaStatsCallFeature,
} from '@azure/communication-calling'
import { MediaStatsData, Collector, Tabs, Options } from '../types'
import { MediaStatsMap } from './mediaStatsMap'
import { MEDIA_STATS_AMOUNT_LIMIT } from './constants'

export class MediaStatsCollectorImpl implements Collector {
  call: Call
  tab: Tabs
  mediaStatsFeature?: MediaStatsCallFeature
  mediaStatsData: MediaStatsData = {}

  constructor(options: Options) {
    try {
    } catch (e) {}
    this.call = options.callAgent.calls[0]
    this.tab = Tabs.MediaStats
    this.mediaStatsFeature = undefined
  }

  getStats() {
    return this.mediaStatsData
  }

  startCollector() {
    // Start collecting stats

    try {
      this.mediaStatsFeature = this.call.feature(Features.MediaStats)
    } catch (e) {
      throw new Error('Media stats features are not available')
    }

    const mediaStatsCollectorOptions = {
      aggregationInterval: 1,
      dataPointsPerAggregation: 1,
    }

    const mediaStatsCollector = this.mediaStatsFeature.startCollector(
      mediaStatsCollectorOptions
    )
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
    for (const [statName, statValue] of Object.entries(mediaStats.stats)) {
      if (statName in MediaStatsMap) {
        if (statName in mediaStatsData) {
          if (
            mediaStatsData[statName as keyof MediaStatsData]!.length >=
            MEDIA_STATS_AMOUNT_LIMIT
          ) {
            mediaStatsData[statName as keyof MediaStatsData]!.shift()
          }
          mediaStatsData[statName as keyof MediaStatsData]!.push({
            timestamp: statValue.timestamp,
            value: statValue.raw[0],
            unit: MediaStatsMap[statName as keyof typeof MediaStatsMap].Units,
          })
        } else {
          mediaStatsData[statName as keyof MediaStatsData] = [
            {
              timestamp: statValue.timestamp,
              value: statValue.raw[0],
              unit: MediaStatsMap[statName as keyof typeof MediaStatsMap].Units,
            },
          ]
        }
      } else {
        console.debug('%s is not present in MediaStatsMap', statName)
      }
    }
    return mediaStatsData
  }
}
