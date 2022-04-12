export const MediaStatsMap = {
  sentBWEstimate: {
    Name: 'Sent Bandwidth Estimate',
    Category: 'General',
    Units: 'bps',
    Purpose: 'Bandwidth estimation',
    Details:
      'Average video bandwidth allocated for the channel bps (bits per second)',
    Comments:
      '1.5 MBps or higher is recommended for high-quality video for upload/download.',
    Clickable: true
  },
  audioSendBitrate: {
    Name: 'Send Bitrate',
    Category: 'Audio',
    Units: 'bps',
    Purpose: 'Sent bitrate',
    Details: 'Send bitrate of audio (bits per second)',
    Comments: 'General values are in the 24 kbps range (36-128kbps typical)',
    Clickable: true
  },
  audioSendPackets: {
    Name: 'Sent Packets',
    Category: 'Audio',
    Units: 'None',
    Purpose: 'Sent packets',
    Details:
      'The number of audio packets sent in last second (packets per second)',
    Comments: '',
    Clickable: true
  },
  audioSendPacketsLost: {
    Name: 'Lost Send Packets',
    Category: 'Audio',
    Units: 'None',
    Purpose: 'Sent packet loss',
    Details:
      'The number of audio packets sent that were lost (not received) in the last second. Results are packets per second (over the last second).',
    Comments: 'Lower is better.',
    Clickable: true
  },
  audioSendCodecName: {
    Name: 'Send codec',
    Category: 'Audio',
    Units: 'None',
    Purpose: 'Sent codec',
    Details: 'Audio CODEC used.',
    Comments: 'Information only.',
    Clickable: false

  },
  audioSendRtt: {
    Name: 'Send Round-Trip Time',
    Category: 'Audio',
    Units: 'ms',
    Purpose: 'Send Round-Trip Time',
    Details:
      'Round trip time between your system and ACS server. Results are in milliseconds (ms).',
    Comments: 'A round trip time of 200 ms or less is recommended.',
    Clickable: true
  },
  audioSendPairRtt: {
    Name: 'Send Pair Round-Trip Time',
    Category: 'Audio',
    Units: 'ms',
    Purpose: 'Send Pair Round-Trip Time',
    Details:
      'Round trip time for entire transport. Results are in milliseconds (ms).',
    Comments: 'A round trip time of 200 ms or less is recommended.',
    Clickable: true
  },
  audioSendAudioInputLevel: {
    Name: 'Microphone Input Level',
    Category: 'Audio',
    Units: 'None',
    Purpose: 'Input level for microphone',
    Details:
      'Sent audio playout level. If source data is between 0-1, media stack multiplies it with 0xFFFF. Depends on microphone. Used to confirm if microphone is silent (no incoming energy).',
    Comments: 'Microphone input level.',
    Clickable: true
  },
  audioRecvBitrate: {
    Name: 'Receive Bitrate',
    Category: 'Audio',
    Units: 'bps',
    Purpose: 'Received bitrate',
    Details: 'Received bitrate of audio received (bits per second)',
    Comments: '',
    Clickable: true
  },
  audioRecvJitterBufferMs: {
    Name: 'Receive Jitter',
    Category: 'Audio',
    Units: 'ms',
    Purpose: 'Received Jitter',
    Details:
      'Jitter is the amount of difference in packet delay (in milliseconds (ms))',
    Comments: 'Typically, an audio jitter of 30 ms or less is recommended.',
    Clickable: true
  },
  audioRecvPacketsLost: {
    Name: 'Lost Receive Packets',
    Category: 'Audio',
    Units: 'None',
    Purpose: 'Received packet loss',
    Details:
      'The number of audio packets that were to be received but were lost. Results are packets per second (over the last second).',
    Comments: 'Lower is better.',
    Clickable: true
  },
  audioRecvPackets: {
    Name: 'Received packets',
    Category: 'Audio',
    Units: 'None',
    Purpose: 'Received packets',
    Details:
      'The number of audio packets received in the last second. Results are packets per second (over the last second).',
    Comments: 'Information only.',
    Clickable: true
  },
  audioRecvPairRtt: {
    Name: 'Receive Pair Round-Trip Time',
    Category: 'Audio',
    Units: 'ms',
    Purpose: 'Receive Pair Round-Trip Time',
    Details:
      'Round trip time for entire transport Results are in milliseconds (ms).',
    Comments: 'A round trip time of 200 ms or less is recommended.',
    Clickable: true
  },
  audioRecvAudioOutputLevel: {
    Name: 'Speaker Output Level',
    Category: 'Audio',
    Units: 'None',
    Purpose: 'Speaker output level.',
    Details:
      'Received audio playout level. If source data is between 0-1, media stack multiplies it with 0xFFFF.',
    Comments: 'Speaker output level.',
    Clickable: true
  },
  videoSendFrameRateSent: {
    Name: 'Sent Frame Rate',
    Category: 'Video',
    Units: 'fps',
    Purpose: 'Sent frame rate',
    Details: 'Number of video frames sent. Results are frames per second',
    Comments:
      'Higher is better: 25-30 fps (360p or better) 8-15 fps (270p or lower) Frames/second',
    Clickable: true
  },
  videoSendFrameWidthSent: {
    Name: 'Sent Width',
    Category: 'Video',
    Units: 'px',
    Purpose: 'Sent width',
    Details: 'Video width resolution sent.',
    Comments:
      'Higher is better. Possible values:<br>1920, 1280, 960, 640, 480, 320',
    Clickable: true
  },
  videoSendFrameHeightSent: {
    Name: 'Sent Height',
    Category: 'Video',
    Units: 'px',
    Purpose: 'Sent height',
    Details: 'Video height resolution sent.',
    Comments:
      'Higher is better. Possible values:<br>1080, 720, 540, 360, 270, 240',
    Clickable: true
  },
  videoSendBitrate: {
    Name: 'Send Bitrate',
    Category: 'Video',
    Units: 'bps',
    Purpose: 'Sent bitrate',
    Details:
      'Amount of video bitrate being sent. Results are bps (bits per second)',
    Comments: '',
    Clickable: true
  },
  videoSendPackets: {
    Name: 'Sent Packets',
    Category: 'Video',
    Units: 'None',
    Purpose: 'Sent packets',
    Details:
      'The number of video packets sent. Results are packets per second (over the last second).',
    Comments: 'Information only',
    Clickable: true
  },
  videoSendRtt: {
    Name: 'Send Round-Trip Time',
    Category: 'Video',
    Units: 'ms',
    Purpose: 'Send Round-Trip Time',
    Details:
      'Response time between your system and ACS server. Lower is better',
    Comments: 'A round trip time of 200 ms or less is recommended.',
    Clickable: true
  },
  videoSendPairRtt: {
    Name: 'Send Pair Round-Trip Time',
    Category: 'Video',
    Units: 'ms',
    Purpose: 'Send Pair Round-Trip Time',
    Details:
      'Response time between your system and ACS server. Results are in milliseconds (ms).',
    Comments: 'A round trip time of 200 ms or less is recommended.',
    Clickable: true
  },
  videoSendPacketsLost: {
    Name: 'Send Packet Loss',
    Category: 'Video',
    Units: 'None',
    Purpose: 'Sent packet loss',
    Details:
      'The number of audio packets that were sent but were lost. Results are packets per second (over the last second).',
    Comments: 'Lower is better',
    Clickable: true
  },
  videoSendFrameRateInput: {
    Name: 'Sent Framerate Input',
    Category: 'Video',
    Units: 'fps',
    Purpose: 'Sent framerate input',
    Details: 'Framerate measurements from the stream input into peerConnection',
    Comments: 'Information only',
    Clickable: true
  },
  videoSendFrameWidthInput: {
    Name: 'Sent Frame Width Input',
    Category: 'Video',
    Units: 'px',
    Purpose: 'Sent frame width input',
    Details:
      'Frame width of the stream input into peerConnection. This takes  videoRecvFrameRateDecoded as an input, might be some loss in rendering.',
    Comments: '1920, 1280, 960, 640, 480, 320',
    Clickable: true
  },
  videoSendFrameHeightInput: {
    Name: 'Sent Frame Height Input',
    Category: 'Video',
    Units: 'px',
    Purpose: 'Sent frame height input',
    Details: 'Frame height of the stream input into peerConnection',
    Comments: '1080, 720, 540, 360, 270, 240',
    Clickable: true
  },
  videoSendCodecName: {
    Name: 'Send Codec',
    Category: 'Video',
    Units: 'None',
    Purpose: 'Video CODEC used for encoding video',
    Details: 'VP8 (1:1 calls) and H26',
    Comments: '',
    Clickable: false
  },
  videoRecvBitrate: {
    Name: 'Received Bitrate',
    Category: 'Video',
    Units: 'bps',
    Purpose: 'Received bitrate',
    Details: 'Bitrate of video currently received (bits per second)',
    Comments: 'Information only',
    Clickable: true
  },
  videoRecvPackets: {
    Name: 'Received Packets',
    Category: 'Video',
    Units: 'None',
    Purpose: 'Received packets',
    Details: 'The number of packets received in last second',
    Comments: 'Information Only',
    Clickable: true
  },
  videoRecvPacketsLost: {
    Name: 'Receive Packet Loss',
    Category: 'Video',
    Units: 'None',
    Purpose: 'Received packet loss',
    Details:
      'The number of video packets that were to be received but were lost. Results are packets per second (over the last second).',
    Comments: 'Lower is better',
    Clickable: true
  },
  videoRecvJitterBufferMs: {
    Name: 'Receive Jitter',
    Category: 'Video',
    Units: 'ms',
    Purpose: 'Received Jitter',
    Details:
      'Jitter is the amount of difference in packet delay (in milliseconds (ms))',
    Comments: 'Lower is better.',
    Clickable: true
  },
  videoRecvPairRtt: {
    Name: 'Receive Pair Round-Trip Time',
    Category: 'Video',
    Units: 'ms',
    Purpose: 'Receive Pair Round-Trip Time',
    Details:
      'Round trip time for entire transport. Results are in milliseconds (ms).',
    Comments: 'A round trip time of 200 ms or less is recommended.',
    Clickable: true
  },
  videoRecvFrameRateReceived: {
    Name: 'Received Frame Rate',
    Category: 'Video',
    Units: 'fps',
    Purpose: 'Received frame rate',
    Details: 'Frame rate of video currently received',
    Comments: '25-30 fps (360p or better)<br>8-15 fps (270p or lower)',
    Clickable: true
  },
  videoRecvFrameWidthReceived: {
    Name: 'Received Width',
    Category: 'Video',
    Units: 'px',
    Purpose: 'Received width',
    Details: 'Width of video currently received',
    Comments: '1920, 1280, 960, 640, 480, 320',
    Clickable: true
  },
  videoRecvFrameHeightReceived: {
    Name: 'Received Height',
    Category: 'Video',
    Units: 'px',
    Purpose: 'Received height',
    Details: 'Height of video currently received',
    Comments: '1080, 720, 540, 360, 270, 240',
    Clickable: true
  },
  videoRecvFrameRateOutput: {
    Name: 'Received Framerate Output',
    Category: 'Video',
    Units: 'fps',
    Purpose: 'Receive framerate output',
    Details: 'No SDK documentation',
    Comments: 'Information only',
    Clickable: true
  },
  videoRecvFrameRateDecoded: {
    Name: 'Received Decoded Framerate',
    Category: 'Video',
    Units: 'fps',
    Purpose: 'Received decoded framerate',
    Details:
      'Framerate from decoder output. This takes videoSendFrameRateInput as an input, might be some loss in decoding',
    Comments: 'Information only',
    Clickable: true
  },
  videoRecvLongestFreezeDuration: {
    Name: 'Received Longest Freeze Duration',
    Category: 'Video',
    Units: 's',
    Purpose: 'Received longest freeze duration',
    Details: 'How long was the longest freeze',
    Comments: 'Lower is better',
    Clickable: true
  },
  videoRecvTotalFreezeDuration: {
    Name: 'Received Total Freeze Duration',
    Category: 'Video',
    Units: 's',
    Purpose: 'Received total freeze duration',
    Details: 'Total freeze duration in seconds',
    Comments: 'Lower is better',
    Clickable: true
  },
}
