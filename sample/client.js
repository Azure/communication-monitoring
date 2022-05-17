import {
  CallClient,
  VideoStreamRenderer,
  LocalVideoStream,
} from '@azure/communication-calling'
import { AzureCommunicationTokenCredential } from '@azure/communication-common'
import { CommunicationMonitoring } from 'communication-monitoring'
import { AZURE_COMMUNICATION_TOKEN } from './.env'
import './styles.css'
import { v4 as uuidv4 } from 'uuid'

let call
let callAgent
let callClient
const calleeInput = document.getElementById('callee-id-input')
const callButton = document.getElementById('call-button')
const hangUpButton = document.getElementById('hang-up-button')
const stopVideoButton = document.getElementById('stop-Video')
const startVideoButton = document.getElementById('start-Video')
const createCallButton = document.getElementById('create-call-button')
const renderButton = document.getElementById('render')
const stopRenderButton = document.getElementById('stopRender')
const statsContainer = document.getElementById('monitorContainer')

let placeCallOptions
let deviceManager
let localVideoStream
let rendererLocal
let rendererRemote
let communicationMonitoring

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
  createCallButton.disabled = false

  callAgent.on('incomingCall', async (e) => {
    const videoDevices = await deviceManager.getCameras()
    const videoDeviceInfo = videoDevices[0]
    localVideoStream = new LocalVideoStream(videoDeviceInfo)
    localVideoView()

    stopVideoButton.disabled = false
    callButton.disabled = true
    createCallButton.disabled = true
    hangUpButton.disabled = false

    const addedCall = await e.incomingCall.accept({
      videoOptions: { localVideoStreams: [localVideoStream] },
    })
    call = addedCall

    subscribeToRemoteParticipantInCall(addedCall)
  })

  callAgent.on('callsUpdated', (e) => {
    e.removed.forEach((removedCall) => {
      hangUpButton.disabled = true
      callButton.disabled = false
      createCallButton.disabled = false
      stopVideoButton.disabled = true
      renderButton.disabled = true
      stopRenderButton.disabled = true
      // dispose of video renderers
      if (!rendererLocal.disposed) {
        rendererLocal.dispose()
      }

      if (rendererRemote && !rendererRemote.disposed) {
        rendererRemote.dispose()
      }

      if (communicationMonitoring.isOpened.value) {
        stopRenderButton.disabled = false
        renderButton.disabled = true
      } else {
        stopRenderButton.disabled = true
        renderButton.disabled = false
      }

      communicationMonitoring.stop()
    })
  })
}

async function localVideoView() {
  rendererLocal = new VideoStreamRenderer(localVideoStream)
  const view = await rendererLocal.createView()
  document.getElementById('myVideo').appendChild(view.target)
  const lastChild = document.getElementById('myVideo').lastChild
  lastChild.classList.add('localVideoStream')
}

async function remoteVideoView(remoteVideoStream) {
  rendererRemote = new VideoStreamRenderer(remoteVideoStream)
  const view = await rendererRemote.createView()
  document.getElementById('remoteVideo').appendChild(view.target)
  const lastChild = document.getElementById('remoteVideo').lastChild
  lastChild.classList.add('remoteVideoStream')
}

/*
 * Click events start here
 */

async function joinCall() {
  if (communicationMonitoring && communicationMonitoring.isOpened.value) {
    communicationMonitoring.close()
  }
  if (document.getElementById('callee-id-input').value.length === 0) {
    window.alert('Enter a valid call id')
  } else {
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

    communicationMonitoring = new CommunicationMonitoring(options)
    communicationMonitoring.start()

    setInterval(() => {
      if (communicationMonitoring.isOpened.value) {
        statsContainer.classList.add('activated')
      } else {
        statsContainer.classList.remove('activated')
      }
    }, 500)

    communicationMonitoring.open()
    subscribeToRemoteParticipantInCall(call)

    hangUpButton.disabled = false
    callButton.disabled = true
    renderButton.disabled = true
    stopRenderButton.disabled = false
    createCallButton.disabled = true
  }
}

createCallButton.addEventListener('click', async () => {
  const guid = uuidv4()
  document.getElementById('callee-id-input').value = guid
  await joinCall()
})

callButton.addEventListener('click', async () => await joinCall())

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
  try {
    communicationMonitoring.open()
    stopRenderButton.disabled = false
    renderButton.disabled = true
  } catch (e) {
    window.alert(e)
  }
})

stopRenderButton.addEventListener('click', async () => {
  communicationMonitoring.close()
  renderButton.disabled = false
  stopRenderButton.disabled = true
})

hangUpButton.addEventListener('click', async () => {
  // dispose of video renderers
  if (!rendererLocal.disposed) {
    rendererLocal.dispose()
  }

  if (rendererRemote && !rendererRemote.disposed) {
    rendererRemote.dispose()
  }

  communicationMonitoring.stop()
  // end the current call
  await call.hangUp()
  // toggle button states
  hangUpButton.disabled = true
  callButton.disabled = false
  createCallButton.disabled = false
  stopVideoButton.disabled = true
  startVideoButton.disabled = true
  if (communicationMonitoring.isOpened.value) {
    stopRenderButton.disabled = false
    renderButton.disabled = true
  } else {
    stopRenderButton.disabled = true
    renderButton.disabled = false
  }
})

/*
 * Click events end here
 */

init()
