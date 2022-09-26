import {
  Call,
  Features,
  MediaStatsReportSample,
  MediaStatsCallFeature,
  MediaStatsCollector,
} from '@azure/communication-calling'
import {
  MediaStatsData,
  Collector,
  MediaStatsDataKey,
  Tabs,
  Options,
} from '../types'
import { MediaStatsMap } from './mediaStatsMap'
import { MEDIA_STATS_AMOUNT_LIMIT } from './constants'
import { setMediaFailedToStart } from '../statTables'

export class MediaStatsCollectorImpl implements Collector {
  call: Call
  tab: Tabs
  mediaStatsCollector?: MediaStatsCollector
  mediaStatsData: MediaStatsData = {
    audio: {
      send: {},
      receive: {},
    },
    video: {
      send: {},
      receive: {},
    },
    screenShare: {
      send: {},
      receive: {},
    },
  }

  constructor(options: Options) {
    this.call = options.callAgent.calls[0]
    this.tab = Tabs.MediaStats
  }

  getStats() {
    return this.mediaStatsData
  }

  startCollector() {
    // Start collecting stats
    try {
      this.mediaStatsCollector = this.call
        .feature(Features.MediaStats)
        .createCollector()
      this.mediaStatsCollector.on(
        'sampleReported',
        (mediaStats: MediaStatsReportSample) => {
          this.mediaStatsData = this.updateData(mediaStats, this.mediaStatsData)
        }
      )
    } catch (e) {
      console.error(e)
      console.error('Media Stats feature is not available')
      setMediaFailedToStart(true)
      return
    }
  }

  stopCollector() {
    // Stop collecting stats
    this.mediaStatsCollector?.dispose()
  }

  updateData(
    mediaStats: MediaStatsReportSample,
    mediaStatsData: MediaStatsData
  ): MediaStatsData {
    try {
      const checkItems = [
        {
          sourceItems: mediaStats.audio.send,
          targetItems: mediaStatsData.audio.send,
          str: 'audio.send',
        },
        {
          sourceItems: mediaStats.audio.receive,
          targetItems: mediaStatsData.audio.receive,
          str: 'audio.receive',
        },
        {
          sourceItems: mediaStats.video.send,
          targetItems: mediaStatsData.video.send,
          str: 'video.send',
        },
        {
          sourceItems: mediaStats.video.receive,
          targetItems: mediaStatsData.video.receive,
          str: 'video.receive',
        },
        {
          sourceItems: mediaStats.screenShare.send,
          targetItems: mediaStatsData.screenShare.send,
          str: 'screenShare.send',
        },
        {
          sourceItems: mediaStats.screenShare.receive,
          targetItems: mediaStatsData.screenShare.receive,
          str: 'screenShare.receive',
        },
      ]
      for (const obj of checkItems) {
        const sourceItems = obj.sourceItems
        const targetItems = obj.targetItems
        const str = obj.str
        const sourceIds: string[] = []
        for (const sourceItem of sourceItems) {
          sourceIds.push(sourceItem.id)
          for (const [statKey, statValue] of Object.entries(sourceItem)) {
            const statName = statKey as MediaStatsDataKey
            const mapKey = `${str}.${statName}`
            if (MediaStatsMap[mapKey] !== undefined) {
              let value: string | number
              let unit: string

              if (MediaStatsMap[mapKey].GranularityDivider) {
                value =
                  (statValue as number) /
                  MediaStatsMap[mapKey].GranularityDivider
                unit = MediaStatsMap[mapKey].GranularityUnits
              } else {
                value = statValue
                unit = MediaStatsMap[mapKey].Units
              }

              if (sourceItem.id in targetItems) {
                const targetItem = targetItems[sourceItem.id]
                if (!targetItem[statName]) {
                  targetItem[statName] = []
                }
                if (targetItem[statName]!.length >= MEDIA_STATS_AMOUNT_LIMIT) {
                  targetItem[statName]!.shift()
                }
                targetItem[statName]!.push({
                  timestamp: new Date(),
                  value,
                  unit,
                })
              } else {
                targetItems[sourceItem.id] = {
                  id: sourceItem.id,
                }
                targetItems[sourceItem.id][statName] = [
                  {
                    timestamp: new Date(),
                    value,
                    unit,
                  },
                ]
              }
            } else {
              console.debug('%s is not present in MediaStatsMap', statName)
            }
          }
        }
        //remove id not available in source
        const targetIds = Object.keys(targetItems)
        const diffIds = targetIds.filter((x) => !sourceIds.includes(x))
        for (const id of diffIds) {
          delete targetItems[id]
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
