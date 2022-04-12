import { startCollection, stopCollection, createCollectorArray } from './stats'
import { initializeTables, removeTables } from './statTables'
import { Call } from '@azure/communication-calling'
import { Collector } from '../types'

export class CallMonitor {
  call: Call
  divElement: HTMLDivElement
  isCollectionStarted: boolean
  isOpened: boolean
  collectors: Collector[]

  constructor(call: Call, divElement: HTMLDivElement) {
    this.call = call
    this.divElement = divElement
    this.isCollectionStarted = false
    this.isOpened = false
    this.collectors = createCollectorArray(this.call)
  }

  start() {
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
      initializeTables(this.collectors, this.divElement)
      this.isOpened = true
    }
  }

  close() {
    removeTables()
    this.isOpened = false
  }
}
