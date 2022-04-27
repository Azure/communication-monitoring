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
    this.recordingCallFeature = this.call.feature(Features.Recording)
    this.transcriptionCallFeature = this.call.feature(Features.Transcription)
    this.dominantSpeakersCallFeature = this.call.feature(
      Features.DominantSpeakers
    )
    this.debugInfoCallFeature = this.callClient.feature(Features.DebugInfo)
  }

  startCollector(): void {
    generalStatsCollector = setInterval(() => {
      try {
        this.updateData()
      } catch (e) {
        this.stopCollector()
        throw e
      }
    }, 1000)
  }

  stopCollector(): void {
    clearInterval(generalStatsCollector)
  }

  getStats(): GeneralStatsData {
    return generalStatsData
  }

  async updateData() {
    try {
      const remoteParticipantsIds = this.call.remoteParticipants.map(
        (remoteParticipant) =>
          this.getParticipantId(
            remoteParticipant.identifier as CommunicationIdentifierKind
          )
      )

      const dominantSpeakersIds =
        this.dominantSpeakersCallFeature?.dominantSpeakers.speakersList.map(
          (speaker) => this.getParticipantId(speaker)
        )

      const chosenCamera =
        this.call.localVideoStreams.length !== 0
          ? this.call.localVideoStreams[0].source.name
          : 'None'

      const deviceManager = await this.callClient.getDeviceManager()
      const selectedMicrophone = await deviceManager.selectedMicrophone?.name

      generalStatsData = {
        callId: this.call.info.groupId!,
        participantId: this.debugInfoCallFeature?.localParticipantId,
        remoteParticipants:
          remoteParticipantsIds.length > 0
            ? remoteParticipantsIds.toString()
            : 'Remote participants feature not available',
        dominantSpeakers:
          dominantSpeakersIds!.length > 0
            ? dominantSpeakersIds!.toString()
            : 'Dominant speaker feature not available',
        isRecording: this.recordingCallFeature!.isRecordingActive,
        isTranscribing: this.transcriptionCallFeature?.isTranscriptionActive,
        // isScreenSharing: this.call.info._tsCall.isScreenSharingOn,
        chosenCamera: chosenCamera,
        chosenMicrophone: selectedMicrophone,
        userInfo: navigator.userAgent,
      }
    } catch (e) {
      throw e
    }

    return generalStatsData
  }

  getLogs() {
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
}
