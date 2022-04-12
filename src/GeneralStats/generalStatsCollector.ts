import { Call, Features } from '@azure/communication-calling'
import {
  getIdentifierKind,
  CommunicationUserKind,
  CommunicationIdentifierKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind,
} from '@azure/communication-common'
import { Collector, GeneralStatsData, Tabs } from '../../types'

let generalStatsCollector: NodeJS.Timer
let generalStatsData: GeneralStatsData

export class GeneralStatsCollectorImpl implements Collector {
  call: Call
  tab: Tabs
  recordingCallFeature
  transcriptionCallFeature
  dominantSpeakersCallFeature
  debugInfoCallFeature

  constructor(call: Call) {
    this.call = call
    this.tab = Tabs.GeneralStats
    this.recordingCallFeature = this.call.feature(Features.Recording)
    this.transcriptionCallFeature = this.call.feature(Features.Transcription)
    this.dominantSpeakersCallFeature = this.call.feature(
      Features.DominantSpeakers
    )
    this.debugInfoCallFeature = this.call.feature(Features.DebugInfo)
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

  updateData() {
    const remoteParticipantsIds = this.call.remoteParticipants.map(
      (remoteParticipant) =>
        this.getParticipantId(
          remoteParticipant.identifier as CommunicationIdentifierKind
        )
    )
    const dominantSpeakersIds =
      this.dominantSpeakersCallFeature.dominantSpeakers.speakersList.map(
        (speaker) => this.getParticipantId(speaker)
      )
    const chosenCamera =
      this.call.localVideoStreams.length !== 0
        ? this.call.localVideoStreams[0].source.name
        : 'None'

    generalStatsData = {
      callId: this.call.info.groupId!,
      participantId: this.debugInfoCallFeature.localParticipantId,
      remoteParticipants: remoteParticipantsIds,
      dominantSpeakers: dominantSpeakersIds,
      isRecording: this.recordingCallFeature.isRecordingActive,
      isTranscribing: this.transcriptionCallFeature.isTranscriptionActive,
      // isScreenSharing: this.call.info._tsCall.isScreenSharingOn,
      chosenCamera: chosenCamera,
      // chosenMicrophone: this.call._callAgent._callClient._deviceManager._selectedMicrophone._name,
      userInfo: navigator.userAgent,
    }

    return generalStatsData
  }

  private getParticipantId(remoteParticipant: CommunicationIdentifierKind) {
    switch (getIdentifierKind(remoteParticipant).kind) {
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
