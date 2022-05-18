import {
  Call,
  CallAgent,
  CallClient,
  DebugInfoCallClientFeature,
  DominantSpeakersCallFeature,
  Features,
  RecordingCallFeature,
  TranscriptionCallFeature,
} from '@azure/communication-calling'
import {
  CommunicationUserKind,
  CommunicationIdentifierKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind,
} from '@azure/communication-common'
import { Collector, GeneralStatsData, Options, Tabs } from '../types'
import { BrowserKeyType, BrowserName } from './constants'

let generalStatsCollector: NodeJS.Timer
let generalStatsData: GeneralStatsData

export class GeneralStatsCollectorImpl implements Collector {
  call: Call
  callClient: CallClient
  callAgent: CallAgent
  tab: Tabs
  recordingCallFeature?: RecordingCallFeature
  transcriptionCallFeature?: TranscriptionCallFeature
  dominantSpeakersCallFeature?: DominantSpeakersCallFeature
  debugInfoCallFeature?: DebugInfoCallClientFeature

  constructor(options: Options) {
    this.call = options.callAgent.calls[0]
    this.callClient = options.callClient
    this.callAgent = options.callAgent
    this.tab = Tabs.GeneralStats
  }

  startCollector(): void {
    generalStatsCollector = setInterval(() => {
      this.updateData()
    }, 1000)
  }

  stopCollector(): void {
    clearInterval(generalStatsCollector)
  }

  getStats(): GeneralStatsData {
    return generalStatsData
  }

  async updateData() {
    let remoteParticipantsIds: string[]
    try {
      remoteParticipantsIds = this.call.remoteParticipants.map(
        (remoteParticipant) =>
          this.getParticipantId(
            remoteParticipant.identifier as CommunicationIdentifierKind
          )
      )
    } catch (e) {
      console.error(
        'Something went wrong when fetching the remote participants'
      )
      console.error(e)
      remoteParticipantsIds = []
    }

    let dominantSpeakersIds: string[]
    try {
      this.dominantSpeakersCallFeature = this.call.feature(
        Features.DominantSpeakers
      )
      dominantSpeakersIds =
        this.dominantSpeakersCallFeature?.dominantSpeakers.speakersList.map(
          (speaker: CommunicationIdentifierKind) =>
            this.getParticipantId(speaker)
        )
    } catch (e) {
      console.error('Something went wrong when fetching the dominant speakers')
      console.error(e)
      dominantSpeakersIds = []
    }

    let selectedMicrophone: string | undefined
    try {
      const deviceManager = await this.callClient.getDeviceManager()
      selectedMicrophone = deviceManager.selectedMicrophone?.name
    } catch (e) {
      console.error('Device manager not available')
      selectedMicrophone = ''
    }

    let isRecording: string
    try {
      this.recordingCallFeature = this.call.feature(Features.Recording)
      isRecording = String(this.recordingCallFeature.isRecordingActive)
    } catch (e) {
      isRecording = ''
      console.error('Something went wrong when fetching the recording feature')
      console.error(e)
    }

    let isTranscribing: string
    try {
      this.transcriptionCallFeature = this.call.feature(Features.Transcription)
      isTranscribing = String(
        this.transcriptionCallFeature.isTranscriptionActive
      )
    } catch (e) {
      isTranscribing = ''
      console.error(
        'Something went wrong when fetching the transcribing feature'
      )
      console.error(e)
    }

    const chosenCamera =
      this.call.localVideoStreams.length !== 0
        ? this.call.localVideoStreams[0].source.name
        : 'None'

    generalStatsData = {
      callId: this.call.info.groupId!,
      participantId: this.debugInfoCallFeature?.lastLocalParticipantId,
      remoteParticipants:
        remoteParticipantsIds.length > 0
          ? remoteParticipantsIds
          : ['Not available'],
      dominantSpeakers:
        dominantSpeakersIds!.length > 0
          ? dominantSpeakersIds
          : ['Not available'],
      isRecording: isRecording,
      isTranscribing: isTranscribing,
      // isScreenSharing: this.call.info._tsCall.isScreenSharingOn,
      chosenCamera: chosenCamera,
      chosenMicrophone: selectedMicrophone,
      userInfo: navigator.userAgent,
      browser: this.getBrowserName(navigator.userAgent),
    }

    return generalStatsData
  }

  getLogs() {
    this.debugInfoCallFeature = this.callClient.feature(Features.DebugInfo)
    return this.debugInfoCallFeature?.dumpDebugInfo()
  }

  private getParticipantId(remoteParticipant: CommunicationIdentifierKind) {
    switch (remoteParticipant.kind) {
      case 'communicationUser':
        return (remoteParticipant as CommunicationUserKind).communicationUserId
      case 'phoneNumber':
        return (remoteParticipant as PhoneNumberKind).phoneNumber
      case 'microsoftTeamsUser':
        return (remoteParticipant as MicrosoftTeamsUserKind)
          .microsoftTeamsUserId
      case 'unknown':
        return (remoteParticipant as UnknownIdentifierKind).id
    }
  }

  private getBrowserName(userAgent: string): string {
    if (
      userAgent.indexOf(BrowserKeyType.Edge) !== -1 ||
      userAgent.indexOf(BrowserKeyType.EdgeAnaheim) !== -1
    ) {
      return BrowserName.edge
    } else if (userAgent.indexOf(BrowserKeyType.Chrome) !== -1) {
      return BrowserName.chrome
    } else if (userAgent.indexOf(BrowserKeyType.Firefox) !== -1) {
      return BrowserName.firefox
    } else if (userAgent.indexOf(BrowserKeyType.Safari) !== -1) {
      return BrowserName.safari
    } else if (userAgent.indexOf(BrowserKeyType.MSIE) !== -1) {
      return BrowserName.ie
    } else {
      return BrowserName.unknown
    }
  }
}
