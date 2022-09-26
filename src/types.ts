import {
  AudioRecvMediaStats,
  AudioSendMediaStats,
  Call,
  CallAgent,
  CallClient,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs,
  ScreenShareRecvMediaStats,
  ScreenShareSendMediaStats,
  VideoRecvMediaStats,
  VideoSendMediaStats,
} from '@azure/communication-calling'

export enum Tabs {
  MediaStats,
  GeneralStats,
  UserFacingDiagnostics,
  None,
}

export enum TableName {
  MediaStats = 'mediaStatsTable',
  GeneralStats = 'generalStatsTable',
  UFDs = 'userFacingDiagnosticsTable',
  Parent = '',
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
  isRecording: string
  isTranscribing?: string
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

export type MediaStatsDataKey = Exclude<
  keyof (
    | AudioSendMediaStats<MediaStatsDataValue[]>
    | AudioRecvMediaStats<MediaStatsDataValue[]>
    | VideoSendMediaStats<MediaStatsDataValue[]>
    | VideoRecvMediaStats<MediaStatsDataValue[]>
    | ScreenShareSendMediaStats<MediaStatsDataValue[]>
    | ScreenShareRecvMediaStats<MediaStatsDataValue[]>
  ),
  'id'
>

export type MediaStatsData = {
  audio: {
    send: Record<string, AudioSendMediaStats<MediaStatsDataValue[]>>
    receive: Record<string, AudioRecvMediaStats<MediaStatsDataValue[]>>
  }
  video: {
    send: Record<string, VideoSendMediaStats<MediaStatsDataValue[]>>
    receive: Record<string, VideoRecvMediaStats<MediaStatsDataValue[]>>
  }
  screenShare: {
    send: Record<string, ScreenShareSendMediaStats<MediaStatsDataValue[]>>
    receive: Record<string, ScreenShareRecvMediaStats<MediaStatsDataValue[]>>
  }
}

export interface Options {
  callClient: CallClient
  callAgent: CallAgent
  divElement: HTMLDivElement
}
