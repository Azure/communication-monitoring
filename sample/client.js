import {
  CallClient,
  VideoStreamRenderer,
  LocalVideoStream,
} from '@azure/communication-calling'
import { AzureCommunicationTokenCredential } from '@azure/communication-common'
import { CommunicationInspector } from 'communication-inspector'
import { AZURE_COMMUNICATION_TOKEN } from './.env'

let call
let callAgent
let callClient
const calleeInput = document.getElementById('callee-id-input')
const callButton = document.getElementById('call-button')
const hangUpButton = document.getElementById('hang-up-button')
const stopVideoButton = document.getElementById('stop-Video')
const startVideoButton = document.getElementById('start-Video')
const renderButton = document.getElementById('render')
const stopRenderButton = document.getElementById('stopRender')
const statsContainer = document.getElementById('media-stats-pop-up')

let placeCallOptions
let deviceManager
let localVideoStream
let rendererLocal
let rendererRemote
let communicationInspector

function handleVideoStream(remoteVideoStream) {
  remoteVideoStream.on('isAvailableChanged', async () => {
    if (remoteVideoStream.isAvailable) {
      remoteVideoView(remoteVideoStream)
    } else {
      rendererRemote.dispose()
    }
  })
  if (remoteVideoStream.isAvailable) {
    remoteVideoView(remoteVideoStream)
  }
}

function subscribeToParticipantVideoStreams(remoteParticipant) {
  remoteParticipant.on('videoStreamsUpdated', (e) => {
    e.added.forEach((v) => {
      handleVideoStream(v)
    })
  })
  remoteParticipant.videoStreams.forEach((v) => {
    handleVideoStream(v)
  })
}

function subscribeToRemoteParticipantInCall(callInstance) {
  callInstance.on('remoteParticipantsUpdated', (e) => {
    e.added.forEach((p) => {
      subscribeToParticipantVideoStreams(p)
    })
  })
  callInstance.remoteParticipants.forEach((p) => {
    subscribeToParticipantVideoStreams(p)
  })
}

async function init() {
  callClient = new CallClient()
  const tokenCredential = new AzureCommunicationTokenCredential(
    AZURE_COMMUNICATION_TOKEN
  )
  callAgent = await callClient.createCallAgent(tokenCredential, {
    displayName: 'optional ACS user name',
  })

  deviceManager = await callClient.getDeviceManager()
  callButton.disabled = false

  callAgent.on('incomingCall', async (e) => {
    const videoDevices = await deviceManager.getCameras()
    const videoDeviceInfo = videoDevices[0]
    localVideoStream = new LocalVideoStream(videoDeviceInfo)
    localVideoView()

    stopVideoButton.disabled = false
    callButton.disabled = true
    hangUpButton.disabled = false

    const addedCall = await e.incomingCall.accept({
      videoOptions: { localVideoStreams: [localVideoStream] },
    })
    call = addedCall

    subscribeToRemoteParticipantInCall(addedCall)
  })

  callAgent.on('callsUpdated', (e) => {
    e.removed.forEach((removedCall) => {
      // dispose of video renderers
      rendererLocal.dispose()
      rendererRemote.dispose()
      // toggle button states
      hangUpButton.disabled = true
      callButton.disabled = false
      stopVideoButton.disabled = true
    })
  })
}

async function localVideoView() {
  rendererLocal = new VideoStreamRenderer(localVideoStream)
  const view = await rendererLocal.createView()
  document.getElementById('myVideo').appendChild(view.target)
}

async function remoteVideoView(remoteVideoStream) {
  rendererRemote = new VideoStreamRenderer(remoteVideoStream)
  const view = await rendererRemote.createView()
  document.getElementById('remoteVideo').appendChild(view.target)
}

/*
 * Click events start here
 */

callButton.addEventListener('click', async () => {
  const videoDevices = await deviceManager.getCameras()
  const videoDeviceInfo = videoDevices[0]
  localVideoStream = new LocalVideoStream(videoDeviceInfo)
  placeCallOptions = {
    videoOptions: { localVideoStreams: [localVideoStream] },
    audioOptions: null,
  }

  localVideoView()
  stopVideoButton.disabled = false
  startVideoButton.disabled = true

  const userToCall = calleeInput.value
  call = callAgent.join({ groupId: userToCall }, placeCallOptions)
  const options = {
    callAgent: callAgent,
    callClient: callClient,
    divElement: statsContainer,
  }
  communicationInspector = new CommunicationInspector(options)
  communicationInspector.start()

  subscribeToRemoteParticipantInCall(call)

  hangUpButton.disabled = false
  callButton.disabled = true
  renderButton.disabled = false
})

stopVideoButton.addEventListener('click', async () => {
  await call.stopVideo(localVideoStream)
  rendererLocal.dispose()
  startVideoButton.disabled = false
  stopVideoButton.disabled = true
})

startVideoButton.addEventListener('click', async () => {
  await call.startVideo(localVideoStream)
  localVideoView()
  stopVideoButton.disabled = false
  startVideoButton.disabled = true
})

renderButton.addEventListener('click', async () => {
  communicationInspector.open()
  stopRenderButton.disabled = false
  renderButton.disabled = true
})

stopRenderButton.addEventListener('click', async () => {
  communicationInspector.close()
  renderButton.disabled = false
  stopRenderButton.disabled = true
})

hangUpButton.addEventListener('click', async () => {
  // dispose of video renderers
  rendererLocal.dispose()
  rendererRemote.dispose()
  communicationInspector.stop()
  // end the current call
  await call.hangUp()
  // toggle button states
  hangUpButton.disabled = true
  callButton.disabled = false
  stopVideoButton.disabled = true
})

/*
 * Click events end here
 */

init()
