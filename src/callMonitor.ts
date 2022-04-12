import { startCollection, stopCollection, createCollectorArray } from './stats'
import { initializeTables, removeTables } from './statTables'
import { Collector, Options } from '../types'

export class CallMonitor {
  isOpened: boolean

  private options: Options
  private isCollectionStarted: boolean
  private collectors: Collector[]

  constructor(options: Options) {
    this.options = options
    this.isCollectionStarted = false
    this.isOpened = false
    this.collectors = createCollectorArray(this.options)

    this.start()
  }

  private start() {
    if (!this.isCollectionStarted) {
      startCollection(this.collectors)
      this.isCollectionStarted = true
    }
  }

  stop() {
    stopCollection(this.collectors)
    this.isCollectionStarted = false
  }

  open() {
    if (!this.isOpened) {
      initializeTables(this.collectors, this.options)
      this.isOpened = true
    }
  }

  dispose() {
    this.stop()
    this.close()
  }

  close() {
    removeTables()
    this.isOpened = false
  }
}
