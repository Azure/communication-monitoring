import {
  Call,
  Features,
  MediaStats,
  MediaStatsCallFeature,
} from '@azure/communication-calling'
import { MediaStatsData, Collector, Tabs } from '../../types'
import { MediaStatsMap } from './mediaStatsMap'

export class MediaStatsCollectorImpl implements Collector {
  call: Call
  tab: Tabs
  mediaStatsFeature: MediaStatsCallFeature
  mediaStatsData: MediaStatsData = {}

  constructor(call: Call) {
    this.call = call
    this.tab = Tabs.MediaStats
    this.mediaStatsFeature = this.call.feature(Features.MediaStats)
  }

  getStats() {
    return this.mediaStatsData
  }

  startCollector() {
    // Start collecting stats

    const mediaStatsCollectorOptions = {
      aggregationInterval: 1,
      dataPointsPerAggregation: 1,
    }

    const mediaStatsCollector = this.mediaStatsFeature.startCollector(
      mediaStatsCollectorOptions
    )
    mediaStatsCollector.on('mediaStatsEmitted', (mediaStats) => {
      this.updateData(mediaStats)
    })
  }

  stopCollector() {
    // Stop collecting stats
    this.mediaStatsFeature.disposeAllCollectors()
  }

  updateData(mediaStats: MediaStats) {
    for (const [statName, statValue] of Object.entries(mediaStats.stats)) {
      if (statName in this.mediaStatsData) {
        this.mediaStatsData[statName as keyof MediaStatsData]!.push({
          value: statValue.raw[0],
          unit: MediaStatsMap[statName as keyof typeof MediaStatsMap].Units,
        })
      } else {
        this.mediaStatsData[statName as keyof MediaStatsData] = [
          {
            value: statValue.raw[0],
            unit: MediaStatsMap[statName as keyof typeof MediaStatsMap].Units,
          },
        ]
      }
    }
  }
}
