import {
  Call,
  Features,
  UserFacingDiagnosticsFeature,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs,
} from '@azure/communication-calling'
import { Collector, Tabs } from '../../types'

let userFacingDiagnosticsFeature: UserFacingDiagnosticsFeature
let userFacingDiagnosticsData:
  | MediaDiagnosticChangedEventArgs
  | NetworkDiagnosticChangedEventArgs

export class UserFacingDiagnosticsImpl implements Collector {
  call: Call
  tab: Tabs

  constructor(call: Call) {
    this.call = call
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
    userFacingDiagnosticsFeature = this.call.feature(
      Features.UserFacingDiagnostics
    )
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
