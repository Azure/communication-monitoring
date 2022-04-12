jest.mock('@azure/communication-calling')
jest.mock('@azure/communication-common')
import { GeneralStatsCollectorImpl } from '../src/GeneralStats/generalStatsCollector'
import { CallClient } from '@azure/communication-calling'
import { AzureCommunicationTokenCredential } from '@azure/communication-common'
import { CommunicationIdentifierKind } from '@azure/communication-common'

describe('Update data function', () => {
  test('Get updates', async () => {
    const callClient = new CallClient()
    callClient.getDeviceManager = jest.fn().mockResolvedValueOnce({
      selectedMicrophone: {
        name: 'Mocked microphone',
      },
    })
    callClient.createCallAgent = jest.fn().mockResolvedValueOnce({
      calls: [
        {
          feature: () => {
            return {
              dominantSpeakers: {
                speakersList: [
                  {
                    communicationUserId: 'mockedCommunicationUser',
                    kind: 'communicationUser',
                  } as CommunicationIdentifierKind,
                ],
              },
            }
          },
          remoteParticipants: [
            {
              identifier: {
                communicationUserId: 'mockedCommunicationUser',
                kind: 'communicationUser',
              } as CommunicationIdentifierKind,
            },
          ],
          localVideoStreams: [
            {
              source: {
                name: 'mockCamera',
              },
            },
          ],
          info: {
            groupId: 'mockGroupId',
          },
        },
      ],
    })
    const tokenCredential = new AzureCommunicationTokenCredential(
      'mockCredential'
    )
    const callAgent = await callClient.createCallAgent(tokenCredential)
    const divElement = document.createElement('div')
    divElement.id = 'mediaStatsPopUp'
    const generalStats = new GeneralStatsCollectorImpl({
      callAgent: callAgent,
      callClient: callClient,
      divElement: divElement,
    })
    const results = await generalStats.updateData()
    expect(results.callId).toBe('mockGroupId')
    expect(results.remoteParticipants).toBe('mockedCommunicationUser')
  }),
    test('Dominant speaker list and remote participant features not available', async () => {
      const callClient = new CallClient()
      callClient.getDeviceManager = jest.fn().mockResolvedValueOnce({
        selectedMicrophone: {
          name: 'Mocked microphone',
        },
      })
      callClient.createCallAgent = jest.fn().mockResolvedValueOnce({
        calls: [
          {
            feature: () => {
              return {
                dominantSpeakers: {
                  speakersList: [],
                },
              }
            },
            remoteParticipants: [],
            localVideoStreams: [
              {
                source: {
                  name: 'mockCamera',
                },
              },
            ],
            info: {
              groupId: 'mockGroupId',
            },
          },
        ],
      })
      const tokenCredential = new AzureCommunicationTokenCredential(
        'mockCredential'
      )
      const callAgent = await callClient.createCallAgent(tokenCredential)
      const divElement = document.createElement('div')
      divElement.id = 'mediaStatsPopUp'
      const generalStats = new GeneralStatsCollectorImpl({
        callAgent: callAgent,
        callClient: callClient,
        divElement: divElement,
      })
      const results = await generalStats.updateData()
      expect(results.dominantSpeakers).toBe(
        'Dominant speaker feature not available'
      )
      expect(results.remoteParticipants).toBe(
        'Remote participants feature not available'
      )
    })
  test('No camera permissions or no camera installed', async () => {
    const callClient = new CallClient()
    callClient.getDeviceManager = jest.fn().mockResolvedValueOnce({
      selectedMicrophone: {
        name: 'Mocked microphone',
      },
    })
    callClient.createCallAgent = jest.fn().mockResolvedValueOnce({
      calls: [
        {
          feature: () => {
            return {
              dominantSpeakers: {
                speakersList: [],
              },
            }
          },
          remoteParticipants: [],
          localVideoStreams: [],
          info: {
            groupId: 'mockGroupId',
          },
        },
      ],
    })
    const tokenCredential = new AzureCommunicationTokenCredential(
      'mockCredential'
    )
    const callAgent = await callClient.createCallAgent(tokenCredential)
    const divElement = document.createElement('div')
    divElement.id = 'mediaStatsPopUp'
    const generalStats = new GeneralStatsCollectorImpl({
      callAgent: callAgent,
      callClient: callClient,
      divElement: divElement,
    })
    const results = await generalStats.updateData()
    expect(results.chosenCamera).toBe('None')
  })
})
