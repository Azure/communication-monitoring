import {
  Call,
  Features,
  UserFacingDiagnosticsFeature,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs,
} from '@azure/communication-calling'
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
      console.log(diagnosticInfo)
    }
    try {
      userFacingDiagnosticsFeature = this.call.feature(
        Features.UserFacingDiagnostics
      )
    } catch (e) {
      throw new Error('User facing diagnostic features not available')
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
