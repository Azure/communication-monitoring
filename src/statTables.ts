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
import {
  Collector,
  GeneralStatsData,
  MediaStatsData,
  Options,
  TableName,
  Tabs,
} from './types.js'
import {
  createUserFacingDiagnosticsTable,
  updateUserFacingDiagnosticsTable,
} from './UserFacingDiagnostics/userFacingDiagnosticsTable'
import { GeneralStatsCollectorImpl } from './GeneralStats/generalStatsCollector'
import './styles/styles.css'

let tableUpdater: NodeJS.Timer
let statsContainer: HTMLElement
let parentElement: HTMLElement
let generalTab: HTMLElement
let mediaStatsTab: HTMLElement
let userFacingDiagnosticsTab: HTMLElement
let activeTab: Tabs
let mediaStatsTable: ChildNode
let generalStatsTable: ChildNode
let userFacingDiagnosticsTable: ChildNode
let collectorArray: Collector[]
let mediaStatsFailedToStart = false
let ufdFailedToStart = false

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
  generalTab.classList.add('navigationButton')

  mediaStatsTab = document.createElement('button')
  mediaStatsTab.innerText = 'Stats'
  mediaStatsTab.classList.add('navigationButton')

  userFacingDiagnosticsTab = document.createElement('button')
  userFacingDiagnosticsTab.innerText = 'UFDs'
  userFacingDiagnosticsTab.classList.add('navigationButton')

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
    collectorArray.forEach((collector) => {
      if (collector instanceof GeneralStatsCollectorImpl) {
        const logsString = collector.getLogs()?.dump
        downloadLogs('logs.txt', logsString!)
      }
    })
  })
  return downloadLogsButton
}

function updateGeneralStats() {
  updateGeneralCallStatsTable(
    getCollectorBasedOnTab()?.getStats() as GeneralStatsData
  )
}

function updateMediaStats() {
  if (!mediaStatsFailedToStart) {
    updateMediaStatsTable(
      getCollectorBasedOnTab()?.getStats() as MediaStatsData
    )
  }
}

function updateUserFacingDiagnostics() {
  if (!ufdFailedToStart) {
    updateUserFacingDiagnosticsTable(
      getCollectorBasedOnTab()?.getStats() as
        | MediaDiagnosticChangedEventArgs
        | NetworkDiagnosticChangedEventArgs
    )
  }
}

export function initializeTables(collectors: Collector[], options: Options) {
  collectorArray = collectors
  parentElement = options.divElement
  statsContainer = document.createElement('div')
  statsContainer.id = 'media-stats-pop-up'
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

  parentElement.appendChild(statsContainer)

  if (mediaStatsFailedToStart) {
    showErrorScreen('Media Stats feature not available', TableName.MediaStats)
  }

  if (ufdFailedToStart) {
    showErrorScreen(
      'User Facing Diagnostics feature not available',
      TableName.UFDs
    )
  }

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

export function removeTable(componentName: TableName) {
  if (componentName === TableName.Parent) {
    activeTab = Tabs.None
    parentElement.innerHTML = ''
    clearInterval(tableUpdater)
    return
  }
  getComponentBasedOnName(componentName)!.innerHTML = ''
}

export function showErrorScreen(
  message: string,
  componentToShowErrorIn: TableName
) {
  removeTable(componentToShowErrorIn)
  const errorDiv = document.createElement('div')
  errorDiv.id = 'errorDiv'
  const errorMessage = document.createElement('div')
  errorMessage.innerText = message
  errorMessage.id = 'errorMessage'
  errorDiv.appendChild(errorMessage)
  if (componentToShowErrorIn === TableName.Parent) {
    const downloadButton = createDownloadLogsButton(collectorArray)
    errorDiv.appendChild(downloadButton)
  }
  getComponentBasedOnName(componentToShowErrorIn)!.appendChild(errorDiv)
}

function getComponentBasedOnName(componentName: TableName) {
  if (componentName === TableName.Parent) {
    return parentElement
  }
  return document.getElementById(componentName)
}

export function setMediaFailedToStart(value: boolean) {
  mediaStatsFailedToStart = value
}

export function setUfdFailedToStart(value: boolean) {
  ufdFailedToStart = value
}
