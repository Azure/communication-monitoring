import {
  DiagnosticQuality,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs,
} from '@azure/communication-calling'
import { UserFacingDiagnosticsMap } from './userFacingDiagnosticsMap'

let html = `
<dl id="userFacingDiagnosticsTable">
    <!--<dt class='tableHeader'>Name (Type)</dt>
    <dd class='tableHeader'>Value</dd>-->

    <dt class='sectionHeader'>Network</dt>
    <dd class='sectionHeader'><a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/user-facing-diagnostics#network-values" target="_blank">Learn more</a></dd>
    <dt id='noNetwork'>noNetwork</dt>
    <dd id='noNetworkValue' class='greenText'>False</dd>
    <dt id='networkRelaysNotReachable'>networkRelaysNotReachable</dt>
    <dd id='networkRelaysNotReachableValue' class='greenText'>False</dd>
    <dt id='networkReconnect'>networkReconnect</dt>
    <dd id='networkReconnectValue'class='greenText'>Good</dd>
    <dt id='networkReceiveQuality'>networkReceiveQuality</dt>
    <dd id='networkReceiveQualityValue' class='greenText'>Good</dd>
    <dt id='networkSendQuality'>networkSendQuality</dt>
    <dd id='networkSendQualityValue' class='greenText'>Good</dd>

    <dt class='sectionHeader'>Audio</dt>
    <dd class='sectionHeader'><a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/user-facing-diagnostics#audio-values" target="_blank">Learn more</a></dd>
    <dt id='noSpeakerDevicesEnumerated'>noSpeakerDevicesEnumerated</dt>
    <dd id='noSpeakerDevicesEnumeratedValue'class='greenText'>False</dd>
    <dt id='speakingWhileMicrophoneIsMuted'>speakingWhileMicrophoneIsMuted</dt>
    <dd id='speakingWhileMicrophoneIsMutedValue' class='greenText'>False</dd>
    <dt id='noMicrophoneDevicesEnumerated'>noMicrophoneDevicesEnumerated</dt>
    <dd id='noMicrophoneDevicesEnumeratedValue' class='greenText'>False</dd>
    <dt id='microphoneNotFunctioning'>microphoneNotFunctioning</dt>
    <dd id='microphoneNotFunctioningValue' class='greenText'>False</dd>
    <dt id='microphoneMuteUnexpectedly'>microphoneMuteUnexpectedly</dt>
    <dd id='microphoneMuteUnexpectedlyValue' class='greenText'>False</dd>
    <dt id='microphonePermissionDenied'>microphonePermissionDenied</dt>
    <dd id='microphonePermissionDeniedValue' class='greenText'>False</dd>

    <dt class='sectionHeader'>Camera</dt>
    <dd class='sectionHeader'><a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/user-facing-diagnostics#camera-values" target="_blank">Learn more</a></dd>
    <dt id='cameraFreeze'>cameraFreeze</dt>
    <dd id='cameraFreezeValue' class='greenText'>False</dd>
    <dt id='cameraStartFailed'>cameraStartFailed</dt>
    <dd id='cameraStartFailedValue' class='greenText'>False</dd>
    <dt id='cameraStartTimedOut'>cameraStartTimedOut</dt>
    <dd id='cameraStartTimedOutValue' class='greenText'>False</dd>
    <dt id='cameraPermissionDenied'>cameraPermissionDenied</dt>
    <dd id='cameraPermissionDeniedValue' class='greenText'>False</dd>
    <dt id='cameraStoppedUnexpectedly'>cameraStoppedUnexpectedly</dt>
    <dd id='cameraStoppedUnexpectedlyValue' class='greenText'>False</dd>

    <dt class='sectionHeader'>Miscellaneous</dt>
    <dd class='sectionHeader'><a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/user-facing-diagnostics#misc-values" target="_blank">Learn more</a></dd>
    <dt id='screenshareRecordingDisabled'>screenshareRecordingDisabled</dt>
    <dd id='screenshareRecordingDisabledValue' class='greenText'>False</dd>
    <dt id='capturerStartFailed'>capturerStartFailed</dt>
    <dd id='capturerStartFailedValue' class='greenText'>False</dd>
    <dt id='capturerStoppedUnexpectedly'>capturerStoppedUnexpectedly</dt>
    <dd id='capturerStoppedUnexpectedlyValue' class='greenText'>False</dd>
</dl>
`

function getKeyName(value: DiagnosticQuality | boolean) {
  if (typeof value === 'boolean') {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1)
  }
  return DiagnosticQuality[value]
}

export function createUserFacingDiagnosticsTable() {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

export function updateUserFacingDiagnosticsTable(
  diagnosticsData:
    | MediaDiagnosticChangedEventArgs
    | NetworkDiagnosticChangedEventArgs
) {
  const element = document.getElementById(diagnosticsData?.diagnostic + 'Value')
  const innerText = getKeyName(diagnosticsData?.value)

  if (element && element.innerText !== innerText) {
    element.innerText = innerText
    element.className = ''
    switch (innerText) {
      case 'Good':
      case 'True':
        if (
          UserFacingDiagnosticsMap[
            diagnosticsData?.diagnostic as keyof typeof UserFacingDiagnosticsMap
          ].reverseColors
        ) {
          element.classList.add('redText')
        } else {
          element.classList.add('greenText')
        }
        break
      case 'False':
      case 'Bad':
        if (
          UserFacingDiagnosticsMap[
            diagnosticsData?.diagnostic as keyof typeof UserFacingDiagnosticsMap
          ].reverseColors
        ) {
          element.classList.add('greenText')
        } else {
          element.classList.add('redText')
        }
        break
      case 'Poor':
        element.classList.add('orangeText')
        break
    }
  }
}
