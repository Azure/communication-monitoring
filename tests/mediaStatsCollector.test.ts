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
              startCollector: jest.fn(),
            }
          },
        },
      ],
    })

    const firstStats = {
      stats: {
        sentBWEstimate: {
          timestamp: new Date('2022-03-31T19:51:12.901Z'),
          raw: [300000],
          aggregation: {
            count: [1],
            sum: [300000],
            min: [300000],
            max: [300000],
          },
        },
      },
      collectionInterval: 1000,
      aggregationInterval: 1000,
    }
    const secondStats = {
      stats: {
        sentBWEstimate: {
          timestamp: new Date('2022-03-31T19:51:12.901Z'),
          raw: [300000],
          aggregation: {
            count: [1],
            sum: [300000],
            min: [300000],
            max: [300000],
          },
        },
      },
      collectionInterval: 1000,
      aggregationInterval: 1000,
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
    let currentState: MediaStatsData = {}
    currentState = mediaStatsCollector.updateData(firstStats, currentState)
    currentState = mediaStatsCollector.updateData(secondStats, currentState)
    expect(currentState.sentBWEstimate!.length).toBe(2)
    expect(currentState.sentBWEstimate![0].unit).toBe(
      MediaStatsMap['sentBWEstimate'].Units
    )
  }),
    test('Not able to retrieve media stats features', async () => {
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
      expect(() => {
        mediaStatsCollector.startCollector()
      }).toThrowError('Media stats features are not available')
    })
})
