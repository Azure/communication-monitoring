import {
  Call,
  Features,
  UserFacingDiagnosticsFeature,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs,
} from '@azure/communication-calling'
import { Collector, Options, Tabs } from '../types'
import { resetErrorScreenAlreadyShown } from './userFacingDiagnosticsTable'

let userFacingDiagnosticsFeature: UserFacingDiagnosticsFeature
let userFacingDiagnosticsData:
  | MediaDiagnosticChangedEventArgs
  | NetworkDiagnosticChangedEventArgs

export class UserFacingDiagnosticsImpl implements Collector {
  call: Call
  tab: Tabs
  successfulStart: boolean

  constructor(options: Options) {
    this.call = options.callAgent.calls[0]
    this.tab = Tabs.UserFacingDiagnostics
    this.successfulStart = true
  }

  getUFDSuccessfulStart() {
    return this.successfulStart
  }

  startCollector(): void {
    const diagnosticChangedListener = (
      diagnosticInfo:
        | MediaDiagnosticChangedEventArgs
        | NetworkDiagnosticChangedEventArgs
    ) => {
      userFacingDiagnosticsData = diagnosticInfo
    }
    try {
      userFacingDiagnosticsFeature = this.call.feature(
        Features.UserFacingDiagnostics
      )
    } catch (e) {
      console.error(e)
      console.error('User Facing Diagnostics Feature not available')
      this.successfulStart = false
    }

    userFacingDiagnosticsFeature.network.on(
      'diagnosticChanged',
      diagnosticChangedListener
    )
    userFacingDiagnosticsFeature.media.on(
      'diagnosticChanged',
      diagnosticChangedListener
    )
  }

  stopCollector(): void {
    // userFacingDiagnosticsFeature.disposeAllCollectors();
    resetErrorScreenAlreadyShown()
  }

  getStats():
    | MediaDiagnosticChangedEventArgs
    | NetworkDiagnosticChangedEventArgs {
    return userFacingDiagnosticsData
  }
}
