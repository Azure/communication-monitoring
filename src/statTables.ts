import {
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs,
} from '@azure/communication-calling'
import {
  createGeneralStatsTable,
  updateGeneralCallStatsTable,
} from './GeneralStats/generalStatsTable'
import {
  createMediaStatsTable,
  updateMediaStatsTable,
} from './MediaStats/mediaStatsTable.js'
import { Collector, GeneralStatsData, MediaStatsData, Tabs } from '../types.js'
import {
  createUserFacingDiagnosticsTable,
  updateUserFacingDiagnosticsTable,
} from './UserFacingDiagnostics/userFacingDiagnosticsTable'

let tableUpdater: NodeJS.Timer
let statsContainer: HTMLElement
let generalTab: HTMLElement
let mediaStatsTab: HTMLElement
let userFacingDiagnosticsTab: HTMLElement
let activeTab: Tabs
let mediaStatsTable: ChildNode
let generalStatsTable: ChildNode
let userFacingDiagnosticsTable: ChildNode
let collectorArray: Collector[]

function getCollectorBasedOnTab(): Collector | undefined {
  return collectorArray.find((collector) => {
    return collector.tab === activeTab
  })
}

function renderActiveTab() {
  generalTab.classList.remove('active')
  mediaStatsTab.classList.remove('active')
  userFacingDiagnosticsTab.classList.remove('active')
  ;(mediaStatsTable as HTMLElement).hidden = true
  ;(generalStatsTable as HTMLElement).hidden = true
  ;(userFacingDiagnosticsTable as HTMLElement).hidden = true

  switch (activeTab) {
    case Tabs.MediaStats: {
      mediaStatsTab.classList.add('active')
      ;(mediaStatsTable as HTMLElement).hidden = false
      updateMediaStats()
      break
    }
    case Tabs.GeneralStats: {
      generalTab.classList.add('active')
      ;(generalStatsTable as HTMLElement).hidden = false
      updateGeneralStats()
      break
    }
    case Tabs.UserFacingDiagnostics: {
      userFacingDiagnosticsTab.classList.add('active')
      ;(userFacingDiagnosticsTable as HTMLElement).hidden = false
      updateUserFacingDiagnostics()
      break
    }
  }
}

function createNavigationTabs() {
  const tabs = document.createElement('div')
  generalTab = document.createElement('button')
  generalTab.innerText = 'General'
  generalTab.classList.add('active')

  mediaStatsTab = document.createElement('button')
  mediaStatsTab.innerText = 'Stats'

  userFacingDiagnosticsTab = document.createElement('button')
  userFacingDiagnosticsTab.innerText = 'UFDs'

  generalTab.addEventListener('click', () => {
    activeTab = Tabs.GeneralStats
    renderActiveTab()
  })
  mediaStatsTab.addEventListener('click', () => {
    activeTab = Tabs.MediaStats
    renderActiveTab()
  })
  userFacingDiagnosticsTab.addEventListener('click', () => {
    activeTab = Tabs.UserFacingDiagnostics
    renderActiveTab()
  })

  tabs.appendChild(generalTab)
  tabs.appendChild(mediaStatsTab)
  tabs.appendChild(userFacingDiagnosticsTab)

  return tabs
}

function downloadLogs(filename: string, text: string) {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  )
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

function createDownloadLogsButton(collectorArray: Collector[]) {
  const downloadLogsButton = document.createElement('button')
  downloadLogsButton.id = 'downloadLogsButton'
  downloadLogsButton.innerHTML = 'Download Logs'
  downloadLogsButton.addEventListener('click', () => {
    const logs = Object.assign(
      collectorArray.map((collector) => {
        return collector.getStats()
      })
    )
    const logsString = JSON.stringify(logs)
    downloadLogs('logs.txt', logsString)
  })
  return downloadLogsButton
}

function updateGeneralStats() {
  updateGeneralCallStatsTable(
    getCollectorBasedOnTab()?.getStats() as GeneralStatsData
  )
}

function updateMediaStats() {
  updateMediaStatsTable(getCollectorBasedOnTab()?.getStats() as MediaStatsData)
}

function updateUserFacingDiagnostics() {
  updateUserFacingDiagnosticsTable(
    getCollectorBasedOnTab()?.getStats() as
      | MediaDiagnosticChangedEventArgs
      | NetworkDiagnosticChangedEventArgs
  )
}

export function initializeTables(
  collectors: Collector[],
  divElement: HTMLDivElement
) {
  collectorArray = collectors
  statsContainer = divElement
  mediaStatsTable = createMediaStatsTable()!
  generalStatsTable = createGeneralStatsTable()!
  userFacingDiagnosticsTable = createUserFacingDiagnosticsTable()!
  activeTab = Tabs.GeneralStats

  const navigationTabs = createNavigationTabs()
  navigationTabs.id = 'navigationTabs'
  const downloadButton = createDownloadLogsButton(collectorArray)

  navigationTabs.appendChild(downloadButton)
  statsContainer.appendChild(navigationTabs)
  statsContainer.appendChild(mediaStatsTable as HTMLElement)
  statsContainer.appendChild(generalStatsTable as HTMLElement)
  statsContainer.appendChild(userFacingDiagnosticsTable as HTMLElement)

  renderActiveTab()

  tableUpdater = setInterval(() => {
    if (activeTab === Tabs.GeneralStats) {
      updateGeneralStats()
    }
    if (activeTab === Tabs.MediaStats) {
      updateMediaStats()
    }
    if (activeTab === Tabs.UserFacingDiagnostics) {
      updateUserFacingDiagnostics()
    }
  }, 1000)
}

export function removeTables() {
  activeTab = Tabs.None
  statsContainer.innerHTML = ''
  clearInterval(tableUpdater)
}