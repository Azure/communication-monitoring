import {
  Call,
  Features,
  UserFacingDiagnosticsFeature,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs,
} from '@azure/communication-calling'
import { setUfdFailedToStart } from '../statTables'
import { Collector, Options, Tabs } from '../types'

let userFacingDiagnosticsFeature: UserFacingDiagnosticsFeature
let userFacingDiagnosticsData:
  | MediaDiagnosticChangedEventArgs
  | NetworkDiagnosticChangedEventArgs

export class UserFacingDiagnosticsImpl implements Collector {
  call: Call
  tab: Tabs

  constructor(options: Options) {
    this.call = options.callAgent.calls[0]
    this.tab = Tabs.UserFacingDiagnostics
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
      setUfdFailedToStart(true)
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
  }

  getStats():
    | MediaDiagnosticChangedEventArgs
    | NetworkDiagnosticChangedEventArgs {
    return userFacingDiagnosticsData
  }
}
