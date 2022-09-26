jest.mock('@azure/communication-calling')
jest.mock('@azure/communication-common')
import { MediaStatsCollectorImpl } from '../src/MediaStats/mediaStatsCollector'
import { CallClient } from '@azure/communication-calling'
import { AzureCommunicationTokenCredential } from '@azure/communication-common'
import { MediaStatsData } from '../src/types'
import { MediaStatsMap } from '../src/MediaStats/mediaStatsMap'

describe('Update data function', () => {
  test('Receiving two responses from the Media Stats SDK subscription', async () => {
    const callClient = new CallClient()
    callClient.createCallAgent = jest.fn().mockResolvedValueOnce({
      calls: [
        {
          feature: () => {
            return {
              createCollector: jest.fn(),
            }
          },
        },
      ],
    })

    const firstStats = {
      audio: {
        send: [],
        receive: [
          {
            audioOutputLevel: 1234,
            bitrate: 32480,
            codecName: 'OPUS',
            healedRatio: 0.021,
            id: '29626',
            jitterInMs: 4,
            jitterBufferInMs: 56,
            packetsLostPerSecond: 0,
            packetsPerSecond: 50,
            pairRttInMs: 87,
          },
        ],
      },
      video: {
        send: [],
        receive: [],
      },
      screenShare: {
        send: [],
        receive: [],
      },
    }
    const secondStats = {
      audio: {
        send: [],
        receive: [
          {
            audioOutputLevel: 12345,
            bitrate: 32480,
            codecName: 'OPUS',
            healedRatio: 0.021,
            id: '29626',
            jitterInMs: 4,
            jitterBufferInMs: 56,
            packetsLostPerSecond: 0,
            packetsPerSecond: 50,
            pairRttInMs: 87,
          },
        ],
      },
      video: {
        send: [],
        receive: [],
      },
      screenShare: {
        send: [],
        receive: [],
      },
    }
    const tokenCredential = new AzureCommunicationTokenCredential(
      'mockCredential'
    )
    const callAgent = await callClient.createCallAgent(tokenCredential)
    const divElement = document.createElement('div')
    divElement.id = 'mediaStatsPopUp'
    const mediaStatsCollector = new MediaStatsCollectorImpl({
      callAgent: callAgent,
      callClient: callClient,
      divElement: divElement,
    })
    let currentState: MediaStatsData = {
      audio: {
        send: {},
        receive: {},
      },
      video: {
        send: {},
        receive: {},
      },
      screenShare: {
        send: {},
        receive: {},
      },
    }
    currentState = mediaStatsCollector.updateData(firstStats, currentState)
    currentState = mediaStatsCollector.updateData(secondStats, currentState)
    expect(currentState.audio.receive['29626'].bitrate!.length).toBe(2)
    expect(currentState.audio.receive['29626'].bitrate![0].unit).toBe(
      MediaStatsMap['audio.receive.bitrate'].GranularityUnits
    )
  }),
    test('Not able to retrieve media stats features', async () => {
      console.error = jest.fn()
      const callClient = new CallClient()
      callClient.createCallAgent = jest.fn().mockResolvedValueOnce({
        calls: [{}],
      })

      const tokenCredential = new AzureCommunicationTokenCredential(
        'mockCredential'
      )
      const callAgent = await callClient.createCallAgent(tokenCredential)
      const divElement = document.createElement('div')
      divElement.id = 'mediaStatsPopUp'
      const mediaStatsCollector = new MediaStatsCollectorImpl({
        callAgent: callAgent,
        callClient: callClient,
        divElement: divElement,
      })
      mediaStatsCollector.startCollector()
      expect(console.error).toHaveBeenCalled()
    })
})
