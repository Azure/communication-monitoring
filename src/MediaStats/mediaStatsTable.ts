import { MediaStatsData } from '../types.js'
import { initializeGraph } from './mediaStatsGraph'
import { MediaStatsMap } from './mediaStatsMap.js'

let html = `
<dl id="mediaStatsTable">
    <dt class='sectionHeader'>Bandwidth</dt>
    <dd class='sectionHeader'><a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk#bandwidth-metrics" target="_blank">Learn more</a></dd>
    <dt hidden=false id='sentBWEstimate'>Sent Bandwidth Estimate</dt>
    <dd hidden=false id='sentBWEstimateValue'>—</dd>
    <dt class='sectionHeader'>Audio</dt>
    <dd class='sectionHeader'><a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk#audio-quality-metrics" target="_blank">Learn more</a></dd>
    <dt hidden=false id='audioSendBitrate'>Send Bitrate</dt>
    <dd hidden=false id='audioSendBitrateValue'>—</dd>
    <dt hidden=false id='audioSendPackets'>Sent Packets</dt>
    <dd hidden=false id='audioSendPacketsValue'>—</dd>
    <dt hidden=false id='audioSendPacketsLost'>Lost Send Packets</dt>
    <dd hidden=false id='audioSendPacketsLostValue'>—</dd>
    <dt hidden=false id='audioSendCodecName'>Send codec</dt>
    <dd hidden=false id='audioSendCodecNameValue'>—</dd>
    <dt hidden=false id='audioSendRtt'>Send Round-Trip Time</dt>
    <dd hidden=false id='audioSendRttValue'>—</dd>
    <dt hidden=false id='audioSendPairRtt'>Send Pair Round-Trip Time</dt>
    <dd hidden=false id='audioSendPairRttValue'>—</dd>
    <dt hidden=false id='audioSendAudioInputLevel'>Microphone Input Level</dt>
    <dd hidden=false id='audioSendAudioInputLevelValue'>—</dd>
    <dt hidden=false id='audioRecvBitrate'>Receive Bitrate</dt>
    <dd hidden=false id='audioRecvBitrateValue'>—</dd>
    <dt hidden=false id='audioRecvJitterBufferMs'>Receive Jitter</dt>
    <dd hidden=false id='audioRecvJitterBufferMsValue'>—</dd>
    <dt hidden=false id='audioRecvPacketsLost'>Lost Receive Packets</dt>
    <dd hidden=false id='audioRecvPacketsLostValue'>—</dd>
    <dt hidden=false id='audioRecvPackets'>Received packets</dt>
    <dd hidden=false id='audioRecvPacketsValue'>—</dd>
    <dt hidden=false id='audioRecvPairRtt'>Receive Pair Round-Trip Time</dt>
    <dd hidden=false id='audioRecvPairRttValue'>—</dd>
    <dt hidden=false id='audioRecvAudioOutputLevel'>Speaker Output Level</dt>
    <dd hidden=false id='audioRecvAudioOutputLevelValue'>—</dd>
    <dt class='sectionHeader'>Video</dt>
    <dd class='sectionHeader'><a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk#video-quality-metrics" target="_blank">Learn more</a></dd>
    <dt hidden=false id='videoSendFrameRateSent'>Sent Frame Rate</dt>
    <dd hidden=false id='videoSendFrameRateSentValue'>—</dd>
    <dt hidden=false id='videoSendFrameWidthSent'>Sent Width</dt>
    <dd hidden=false id='videoSendFrameWidthSentValue'>—</dd>
    <dt hidden=false id='videoSendFrameHeightSent'>Sent Height</dt>
    <dd hidden=false id='videoSendFrameHeightSentValue'>—</dd>
    <dt hidden=false id='videoSendBitrate'>Send Bitrate</dt>
    <dd hidden=false id='videoSendBitrateValue'>—</dd>
    <dt hidden=false id='videoSendPackets'>Sent Packets</dt>
    <dd hidden=false id='videoSendPacketsValue'>—</dd>
    <dt hidden=false id='videoSendRtt'>Send Round-Trip Time</dt>
    <dd hidden=false id='videoSendRttValue'>—</dd>
    <dt hidden=false id='videoSendPairRtt'>Send Pair Round-Trip Time</dt>
    <dd hidden=false id='videoSendPairRttValue'>—</dd>
    <dt hidden=false id='videoSendPacketsLost'>Send Packet Loss</dt>
    <dd hidden=false id='videoSendPacketsLostValue'>—</dd>
    <dt hidden=false id='videoSendFrameRateInput'>Sent Frame Rate Input</dt>
    <dd hidden=false id='videoSendFrameRateInputValue'>—</dd>
    <dt hidden=false id='videoSendFrameWidthInput'>Sent Frame Width Input</dt>
    <dd hidden=false id='videoSendFrameWidthInputValue'>—</dd>
    <dt hidden=false id='videoSendFrameHeightInput'>Sent Frame Height Input</dt>
    <dd hidden=false id='videoSendFrameHeightInputValue'>—</dd>
    <dt hidden=false id='videoSendCodecName'>Send Codec</dt>
    <dd hidden=false id='videoSendCodecNameValue'>—</dd>
    <dt hidden=false id='videoRecvBitrate'>Received Bitrate</dt>
    <dd hidden=false id='videoRecvBitrateValue'>—</dd>
    <dt hidden=false id='videoRecvPackets'>Received Packets</dt>
    <dd hidden=false id='videoRecvPacketsValue'>—</dd>
    <dt hidden=false id='videoRecvPacketsLost'>Receive Packet Loss</dt>
    <dd hidden=false id='videoRecvPacketsLostValue'>—</dd>
    <dt hidden=false id='videoRecvJitterBufferMs'>Receive Jitter</dt>
    <dd hidden=false id='videoRecvJitterBufferMsValue'>—</dd>
    <dt hidden=false id='videoRecvPairRtt'>Receive Pair Round-Trip Time</dt>
    <dd hidden=false id='videoRecvPairRttValue'>—</dd>
    <dt hidden=false id='videoRecvFrameRateReceived'>Received Frame Rate</dt>
    <dd hidden=false id='videoRecvFrameRateReceivedValue'>—</dd>
    <dt hidden=false id='videoRecvFrameWidthReceived'>Received Width</dt>
    <dd hidden=false id='videoRecvFrameWidthReceivedValue'>—</dd>
    <dt hidden=false id='videoRecvFrameHeightReceived'>Received Height</dt>
    <dd hidden=false id='videoRecvFrameHeightReceivedValue'>—</dd>
    <dt hidden=false id='videoRecvFrameRateOutput'>Received Frame Rate Output</dt>
    <dd hidden=false id='videoRecvFrameRateOutputValue'>—</dd>
    <dt hidden=false id='videoRecvFrameRateDecoded'>Received Decoded Frame Rate</dt>
    <dd hidden=false id='videoRecvFrameRateDecodedValue'>—</dd>
    <dt hidden=false id='videoRecvLongestFreezeDuration'>Received Longest Freeze Duration</dt>
    <dd hidden=false id='videoRecvLongestFreezeDurationValue'>—</dd>
    <dt hidden=false id='videoRecvTotalFreezeDuration'>Received Total Freeze Duration</dt>
    <dd hidden=false id='videoRecvTotalFreezeDurationValue'>—</dd>
    <dt class='sectionHeader'>Screen Sharing</dt>
    <dd class='sectionHeader'><a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk#video-quality-metrics" target="_blank">Learn more</a></dd>
    <dt hidden=false id='screenSharingRecvFrameRateReceived'>Received Frame Rate</dt>
    <dd hidden=false id='screenSharingRecvFrameRateReceivedValue'>—</dd>
    <dt hidden=false id='screenSharingRecvFrameRateDecoded'>Received Decoded Frame Rate</dt>
    <dd hidden=false id='screenSharingRecvFrameRateDecodedValue'>—</dd>
    <dt hidden=false id='screenSharingRecvFrameWidthReceived'>Received Width</dt>
    <dd hidden=false id='screenSharingRecvFrameWidthReceivedValue'>—</dd>
    <dt hidden=false id='screenSharingRecvFrameHeightReceived'>Received Height</dt>
    <dd hidden=false id='screenSharingRecvFrameHeightReceivedValue'>—</dd>
    <dt hidden=false id='screenSharingRecvLongestFreezeDuration'>Received Longest Freeze Duration</dt>
    <dd hidden=false id='screenSharingRecvLongestFreezeDurationValue'>—</dd>
    <dt hidden=false id='screenSharingRecvTotalFreezeDuration'>Received Total Decoded Frame Rate</dt>
    <dd hidden=false id='screenSharingRecvTotalFreezeDurationValue'>—</dd>
    <dt hidden=false id='screenSharingRecvJitterBufferMs'>Received Jitter</dt>
    <dd hidden=false id='screenSharingRecvJitterBufferMsValue'>—</dd>
    <dt hidden=false id='screenSharingRecvPacketsLost'>Received Packet Loss</dt>
    <dd hidden=false id='screenSharingRecvPacketsLostValue'>—</dd>
</dl>
`

let eventListenerSet: Set<string>

export function createMediaStatsTable() {
  eventListenerSet = new Set()
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

export function updateMediaStatsTable(mediaStatsData: MediaStatsData) {
  if (mediaStatsData) {
    updateValue(mediaStatsData, 'sentBWEstimate')
    updateValue(mediaStatsData, 'audioSendBitrate')
    updateValue(mediaStatsData, 'audioSendPackets')
    updateValue(mediaStatsData, 'audioSendPacketsLost')
    updateValue(mediaStatsData, 'audioSendCodecName')
    updateValue(mediaStatsData, 'audioSendRtt')
    updateValue(mediaStatsData, 'audioSendPairRtt')
    updateValue(mediaStatsData, 'audioSendAudioInputLevel')
    updateValue(mediaStatsData, 'audioRecvBitrate')
    updateValue(mediaStatsData, 'audioRecvJitterBufferMs')
    updateValue(mediaStatsData, 'audioRecvPacketsLost')
    updateValue(mediaStatsData, 'audioRecvPackets')
    updateValue(mediaStatsData, 'audioRecvPairRtt')
    updateValue(mediaStatsData, 'audioRecvAudioOutputLevel')
    updateValue(mediaStatsData, 'videoSendFrameRateSent')
    updateValue(mediaStatsData, 'videoSendFrameWidthSent')
    updateValue(mediaStatsData, 'videoSendFrameHeightSent')
    updateValue(mediaStatsData, 'videoSendBitrate')
    updateValue(mediaStatsData, 'videoSendPackets')
    updateValue(mediaStatsData, 'videoSendRtt')
    updateValue(mediaStatsData, 'videoSendPairRtt')
    updateValue(mediaStatsData, 'videoSendPacketsLost')
    updateValue(mediaStatsData, 'videoSendFrameRateInput')
    updateValue(mediaStatsData, 'videoSendFrameWidthInput')
    updateValue(mediaStatsData, 'videoSendFrameHeightInput')
    updateValue(mediaStatsData, 'videoSendCodecName')
    updateValue(mediaStatsData, 'videoRecvBitrate')
    updateValue(mediaStatsData, 'videoRecvPackets')
    updateValue(mediaStatsData, 'videoRecvPacketsLost')
    updateValue(mediaStatsData, 'videoRecvJitterBufferMs')
    updateValue(mediaStatsData, 'videoRecvPairRtt')
    updateValue(mediaStatsData, 'videoRecvFrameRateReceived')
    updateValue(mediaStatsData, 'videoRecvFrameWidthReceived')
    updateValue(mediaStatsData, 'videoRecvFrameHeightReceived')
    updateValue(mediaStatsData, 'videoRecvFrameRateOutput')
    updateValue(mediaStatsData, 'videoRecvFrameRateDecoded')
    updateValue(mediaStatsData, 'videoRecvLongestFreezeDuration')
    updateValue(mediaStatsData, 'videoRecvTotalFreezeDuration')
    updateValue(mediaStatsData, 'screenSharingRecvFrameRateReceived')
    updateValue(mediaStatsData, 'screenSharingRecvFrameRateDecoded')
    updateValue(mediaStatsData, 'screenSharingRecvFrameWidthReceived')
    updateValue(mediaStatsData, 'screenSharingRecvFrameHeightReceived')
    updateValue(mediaStatsData, 'screenSharingRecvLongestFreezeDuration')
    updateValue(mediaStatsData, 'screenSharingRecvTotalFreezeDuration')
    updateValue(mediaStatsData, 'screenSharingRecvJitterBufferMs')
    updateValue(mediaStatsData, 'screenSharingRecvPacketsLost')
  }
}

function updateValue(mediaStatsData: MediaStatsData, key: string) {
  const elementId = key + 'Value'
  if (key in mediaStatsData) {
    const dataValue = mediaStatsData[key as keyof MediaStatsData]!
    const value = dataValue[dataValue.length - 1].value
    let unit = dataValue![dataValue.length - 1].unit
    if (unit === 'None') {
      unit = ''
    }
    const textToShow = value + unit

    if (textToShow !== document.getElementById(elementId)!.innerText) {
      // to avoid updating the dom when incoming data is same as previous data
      document.getElementById(elementId)!.innerText = textToShow
      document.getElementById(elementId)!.hidden = false
      document.getElementById(key)!.hidden = false
    }

    if (!eventListenerSet.has(key)) {
      // to avoid duplicate event listeners
      if (MediaStatsMap[key as keyof typeof MediaStatsMap].Clickable) {
        document.getElementById(key)!.addEventListener('click', () => {
          initializeGraph(mediaStatsData[key as keyof MediaStatsData]!, key)
        })
        document.getElementById(elementId)!.addEventListener('click', () => {
          initializeGraph(mediaStatsData[key as keyof MediaStatsData]!, key)
        })
        document.getElementById(key)!.classList.add('interactive')
        document.getElementById(elementId)!.classList.add('interactive')
        eventListenerSet.add(key)
      }
    }
  } else {
    ;(document.getElementById(elementId) as HTMLElement).innerText = ''
    ;(document.getElementById(elementId) as HTMLElement).hidden = true
    ;(document.getElementById(key) as HTMLElement).hidden = true
  }
}
