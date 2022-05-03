import {
  startCollection,
  stopCollection,
  createCollectorArray,
  listenToCall,
} from './stats'
import { initializeTables, removeTables } from './statTables'
import { Collector, Options } from './types'
import { destroyChart } from './MediaStats/mediaStatsGraphState'

export class CommunicationInspector {
  isOpened: { value: boolean }

  private options: Options
  private isCollectionStarted: boolean
  private collectors: Collector[]

  constructor(options: Options) {
    this.options = options
    this.isCollectionStarted = false
    this.isOpened = { value: false }
    this.collectors = createCollectorArray(this.options)
    listenToCall(this.options, this.isOpened)
  }

  start() {
    if (!this.isCollectionStarted) {
      try {
        startCollection(this.collectors)
        this.isCollectionStarted = true
      } catch (e) {
        throw e
      }
    }
  }

  stop() {
    if (this.isCollectionStarted) {
      stopCollection(this.collectors)
      this.isCollectionStarted = false
    }
  }

  open() {
    if (!this.isCollectionStarted) {
      throw new Error('Communication Inspector must be started first')
    } else if (!this.isOpened.value) {
      initializeTables(this.collectors, this.options)
      this.isOpened.value = true
    }
  }

  dispose() {
    this.stop()
    this.close()
  }

  close() {
    if (this.isOpened.value) {
      destroyChart()
      removeTables()
      this.isOpened.value = false
    }
  }
}
