import {
  Call,
  CallAgent,
  CallClient,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs,
} from '@azure/communication-calling'

export enum Tabs {
  MediaStats,
  GeneralStats,
  UserFacingDiagnostics,
  None,
}

export interface Collector {
  call: Call
  tab: Tabs
  startCollector(): void
  stopCollector(): void
  getStats():
    | MediaStatsData
    | GeneralStatsData
    | MediaDiagnosticChangedEventArgs
    | NetworkDiagnosticChangedEventArgs
}

export interface GeneralStatsData {
  callId: string
  participantId?: string
  remoteParticipants?: string[]
  dominantSpeakers?: string[]
  isRecording: boolean
  isTranscribing?: boolean
  isScreenSharing?: boolean
  chosenCamera?: string
  chosenMicrophone?: string
  userInfo?: string
  browser?: string
}

export interface MediaStatsDataValue {
  timestamp: Date
  value: string | number
  unit: string
}

export interface MediaStatsData {
  sentBWEstimate?: MediaStatsDataValue[]
  sentBWEstimateValue?: MediaStatsDataValue[]
  audioSendBitrate?: MediaStatsDataValue[]
  audioSendBitrateValue?: MediaStatsDataValue[]
  audioSendPackets?: MediaStatsDataValue[]
  audioSendPacketsValue?: MediaStatsDataValue[]
  audioSendPacketsLost?: MediaStatsDataValue[]
  audioSendPacketsLostValue?: MediaStatsDataValue[]
  audioSendCodecName?: MediaStatsDataValue[]
  audioSendCodecNameValue?: MediaStatsDataValue[]
  audioSendRtt?: MediaStatsDataValue[]
  audioSendRttValue?: MediaStatsDataValue[]
  audioSendPairRtt?: MediaStatsDataValue[]
  audioSendPairRttValue?: MediaStatsDataValue[]
  audioSendAudioInputLevel?: MediaStatsDataValue[]
  audioSendAudioInputLevelValue?: MediaStatsDataValue[]
  audioRecvBitrate?: MediaStatsDataValue[]
  audioRecvBitrateValue?: MediaStatsDataValue[]
  audioRecvJitterBufferMs?: MediaStatsDataValue[]
  audioRecvJitterBufferMsValue?: MediaStatsDataValue[]
  audioRecvPacketsLost?: MediaStatsDataValue[]
  audioRecvPacketsLostValue?: MediaStatsDataValue[]
  audioRecvPackets?: MediaStatsDataValue[]
  audioRecvPacketsValue?: MediaStatsDataValue[]
  audioRecvPairRtt?: MediaStatsDataValue[]
  audioRecvPairRttValue?: MediaStatsDataValue[]
  audioRecvAudioOutputLevel?: MediaStatsDataValue[]
  audioRecvAudioOutputLevelValue?: MediaStatsDataValue[]
  videoSendFrameRateSent?: MediaStatsDataValue[]
  videoSendFrameRateSentValue?: MediaStatsDataValue[]
  videoSendFrameWidthSent?: MediaStatsDataValue[]
  videoSendFrameWidthSentValue?: MediaStatsDataValue[]
  videoSendFrameHeightSent?: MediaStatsDataValue[]
  videoSendFrameHeightSentValue?: MediaStatsDataValue[]
  videoSendBitrate?: MediaStatsDataValue[]
  videoSendBitrateValue?: MediaStatsDataValue[]
  videoSendPackets?: MediaStatsDataValue[]
  videoSendPacketsValue?: MediaStatsDataValue[]
  videoSendRtt?: MediaStatsDataValue[]
  videoSendRttValue?: MediaStatsDataValue[]
  videoSendPairRtt?: MediaStatsDataValue[]
  videoSendPairRttValue?: MediaStatsDataValue[]
  videoSendPacketsLost?: MediaStatsDataValue[]
  videoSendPacketsLostValue?: MediaStatsDataValue[]
  videoSendFrameRateInput?: MediaStatsDataValue[]
  videoSendFrameRateInputValue?: MediaStatsDataValue[]
  videoSendFrameWidthInput?: MediaStatsDataValue[]
  videoSendFrameWidthInputValue?: MediaStatsDataValue[]
  videoSendFrameHeightInput?: MediaStatsDataValue[]
  videoSendFrameHeightInputValue?: MediaStatsDataValue[]
  videoSendCodecName?: MediaStatsDataValue[]
  videoSendCodecNameValue?: MediaStatsDataValue[]
  videoRecvBitrate?: MediaStatsDataValue[]
  videoRecvBitrateValue?: MediaStatsDataValue[]
  videoRecvPackets?: MediaStatsDataValue[]
  videoRecvPacketsValue?: MediaStatsDataValue[]
  videoRecvPacketsLost?: MediaStatsDataValue[]
  videoRecvPacketsLostValue?: MediaStatsDataValue[]
  videoRecvJitterBufferMs?: MediaStatsDataValue[]
  videoRecvJitterBufferMsValue?: MediaStatsDataValue[]
  videoRecvPairRtt?: MediaStatsDataValue[]
  videoRecvPairRttValue?: MediaStatsDataValue[]
  videoRecvFrameRateReceived?: MediaStatsDataValue[]
  videoRecvFrameRateReceivedValue?: MediaStatsDataValue[]
  videoRecvFrameWidthReceived?: MediaStatsDataValue[]
  videoRecvFrameWidthReceivedValue?: MediaStatsDataValue[]
  videoRecvFrameHeightReceived?: MediaStatsDataValue[]
  videoRecvFrameHeightReceivedValue?: MediaStatsDataValue[]
  videoRecvFrameRateOutput?: MediaStatsDataValue[]
  videoRecvFrameRateOutputValue?: MediaStatsDataValue[]
  videoRecvFrameRateDecoded?: MediaStatsDataValue[]
  videoRecvFrameRateDecodedValue?: MediaStatsDataValue[]
  videoRecvLongestFreezeDuration?: MediaStatsDataValue[]
  videoRecvLongestFreezeDurationValue?: MediaStatsDataValue[]
  videoRecvTotalFreezeDuration?: MediaStatsDataValue[]
  videoRecvTotalFreezeDurationValue?: MediaStatsDataValue[]
  screenSharingRecvLongestFreezeDuration?: MediaStatsDataValue[]
  screenSharingRecvTotalFreezeDuration?: MediaStatsDataValue[]
  screenSharingSendFrameWidthInput?: MediaStatsDataValue[]
  screenSharingSendFrameHeightInput?: MediaStatsDataValue[]
  screenSharingSendFrameWidthSent?: MediaStatsDataValue[]
  screenSharingSendFrameHeightSent?: MediaStatsDataValue[]
  screenSharingRecvFrameWidthReceived?: MediaStatsDataValue[]
  screenSharingRecvFrameHeightReceived?: MediaStatsDataValue[]
  screenSharingSendFrameRateInput?: MediaStatsDataValue[]
  screenSharingSendFrameRateSent?: MediaStatsDataValue[]
  screenSharingRecvFrameRateReceived?: MediaStatsDataValue[]
  screenSharingRecvFrameRateDecoded?: MediaStatsDataValue[]
  screenSharingRecvFrameRateOutput?: MediaStatsDataValue[]
  screenSharingSendCodecName?: MediaStatsDataValue[]
  screenSharingRecvCodecName?: MediaStatsDataValue[]
  screenSharingRecvPacketsLost?: MediaStatsDataValue[]
  screenSharingSendPacketsLost?: MediaStatsDataValue[]
  screenSharingRecvJitterBufferMs?: MediaStatsDataValue[]
}

export interface Options {
  callClient: CallClient
  callAgent: CallAgent
  divElement: HTMLDivElement
}
