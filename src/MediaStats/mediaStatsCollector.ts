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
import { resetErrorScreenAlreadyShown } from './mediaStatsTable'

export class MediaStatsCollectorImpl implements Collector {
  call: Call
  tab: Tabs
  mediaStatsFeature?: MediaStatsCallFeature
  mediaStatsData: MediaStatsData = {}
  successfulStart: boolean

  constructor(options: Options) {
    this.call = options.callAgent.calls[0]
    this.tab = Tabs.MediaStats
    this.mediaStatsFeature = undefined
    this.successfulStart = true
  }

  getStats() {
    return this.mediaStatsData
  }

  getMediaSuccessfulStart() {
    return this.successfulStart
  }

  startCollector() {
    // Start collecting stats
    let mediaStatsCollector: MediaStatsCollector
    try {
      this.mediaStatsFeature = this.call.feature(Features.MediaStats)
    } catch (e) {
      console.error(e)
      console.error('Media Stats feature is not available')
      this.successfulStart = false
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
      this.successfulStart = false
      return
    }

    mediaStatsCollector.on('mediaStatsEmitted', (mediaStats) => {
      this.mediaStatsData = this.updateData(mediaStats, this.mediaStatsData)
    })
  }

  stopCollector() {
    // Stop collecting stats
    this.mediaStatsFeature?.disposeAllCollectors()
    this.successfulStart = true
    resetErrorScreenAlreadyShown()
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
