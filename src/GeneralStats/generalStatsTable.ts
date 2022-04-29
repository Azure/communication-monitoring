import { GeneralStatsData } from '../types'

let html = `
<dl id="generalStatsTable">
    <dt hidden=true id='callId'>Call Id</dt>
    <dd hidden=true id='callIdValue'></dd>
    <dt hidden=true id='participantId'>Participant Id</dt>
    <dd hidden=true id='participantIdValue'></dd>
    <dt hidden=true id='remoteParticipants'>Remote Participants</dt>
    <dd hidden=true id='remoteParticipantsValue'></dd>
    <dt hidden=true id='dominantSpeakers'>Dominant Speakers</dt>
    <dd hidden=true id='dominantSpeakersValue'></dd>
    <dt hidden=true id='isRecording'>Is Recording</dt>
    <dd hidden=true id='isRecordingValue'></dd>
    <dt hidden=true id='isTranscribing'>Is Transcribing</dt>
    <dd hidden=true id='isTranscribingValue'></dd>
    <dt hidden=true id='isScreenSharing'>Is Screen Sharing</dt>
    <dd hidden=true id='isScreenSharingValue'></dd>
    <dt hidden=true id='chosenCamera'>Chosen Camera</dt>
    <dd hidden=true id='chosenCameraValue'></dd>
    <dt hidden=true id='chosenMicrophone'>Chosen Microphone</dt>
    <dd hidden=true id='chosenMicrophoneValue'></dd>
    <dt hidden=true id='userInfo'>User Agent</dt>
    <dd hidden=true id='userInfoValue'></dd>
    <dt hidden=true id='browser'>Browser</dt>
    <dd hidden=true id='browserValue'></dd>
</dl>
`

let remoteSpeakersArray: string[] | undefined
let dominantSpeakersArray: string[] | undefined

export function createGeneralStatsTable() {
  remoteSpeakersArray = []
  dominantSpeakersArray = []
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

export function updateGeneralCallStatsTable(
  generalCallStatsData: GeneralStatsData
) {
  if (generalCallStatsData) {
    if (
      !arrayEquals(generalCallStatsData.remoteParticipants, remoteSpeakersArray)
    ) {
      remoteSpeakersArray = generalCallStatsData.remoteParticipants
      updateValue(generalCallStatsData.remoteParticipants, 'remoteParticipants')
    }
    if (
      !arrayEquals(generalCallStatsData.dominantSpeakers, dominantSpeakersArray)
    ) {
      dominantSpeakersArray = generalCallStatsData.dominantSpeakers
      updateValue(generalCallStatsData.dominantSpeakers, 'dominantSpeakers')
    }
    updateValue(generalCallStatsData.callId, 'callId')
    updateValue(generalCallStatsData.isRecording, 'isRecording')
    updateValue(generalCallStatsData.isTranscribing, 'isTranscribing')
    updateValue(generalCallStatsData.isScreenSharing, 'isScreenSharing')
    updateValue(generalCallStatsData.chosenCamera, 'chosenCamera')
    updateValue(generalCallStatsData.chosenMicrophone, 'chosenMicrophone')
    updateValue(generalCallStatsData.userInfo, 'userInfo')
    updateValue(generalCallStatsData.browser, 'browser')
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
function updateValue(statToUpdate: any, key: string) {
  const elementId = key + 'Value'

  if (Array.isArray(statToUpdate)) {
    const stat = document.getElementById(elementId)
    stat!.innerHTML = ''
    const ul = document.createElement('ul')
    stat?.appendChild(ul)

    statToUpdate.forEach((element) => {
      const listedValue = document.createElement('li')
      listedValue.innerText = element
      ul!.appendChild(listedValue)
    })

    document.getElementById(key)!.hidden = false
    document.getElementById(elementId)!.hidden = false
  } else if (
    statToUpdate &&
    document.getElementById(elementId)!.innerText !== statToUpdate
  ) {
    // to avoid updating the dom when incoming data is same as previous data
    document.getElementById(key)!.hidden = false
    document.getElementById(elementId)!.hidden = false
    document.getElementById(elementId)!.innerText = statToUpdate
  }
}

function arrayEquals(a: string[] | undefined, b: string[] | undefined) {
  return a?.length === b?.length && a?.every((val, index) => val === b![index])
}
