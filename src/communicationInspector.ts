import { startCollection, stopCollection, createCollectorArray } from './stats'
import { initializeTables, removeTables } from './statTables'
import { Collector, Options } from '../types'
import { destroyChart } from './MediaStats/mediaStatsGraphState'

export class CommunicationInspector {
  isOpened: boolean

  private options: Options
  private isCollectionStarted: boolean
  private collectors: Collector[]

  constructor(options: Options) {
    this.options = options
    this.isCollectionStarted = false
    this.isOpened = false
    this.collectors = createCollectorArray(this.options)
  }

  start() {
    if (!this.isCollectionStarted) {
      startCollection(this.collectors)
      this.isCollectionStarted = true
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
      console.error('Communication Inspector must be started first')
    } else if (!this.isOpened) {
      initializeTables(this.collectors, this.options)
      this.isOpened = true
    }
  }

  dispose() {
    this.stop()
    this.close()
  }

  close() {
    if (this.isOpened) {
      destroyChart()
      removeTables()
      this.isOpened = false
    }
  }
}
