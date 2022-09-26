import { MediaStatsData, MediaStatsDataKey, MediaStatsDataValue } from '../types'
import { initializeGraph } from './mediaStatsGraph'
import { MediaStatsMap } from './mediaStatsMap'

let html = `
<dl id="mediaStatsTable">
</dl>
`;

type HtmlBlockItems = {
  keys: string[];
  sectionName: string;
  url: string
};

let subHtml: {[key: string]: HtmlBlockItems } = {
};

subHtml['audio.send'] = {
  keys: [
    'bitrate',
    'packetsPerSecond',
    'packetsLostPerSecond',
    'codecName',
    'rttInMs',
    'pairRttInMs',
    'audioInputLevel'
  ],
  sectionName: 'Audio Send',
  url: 'https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk'
};
subHtml['audio.receive'] = {
  keys: [
    'bitrate',
    'jitterInMs',
    'packetsLostPerSecond',
    'packetsPerSecond',
    'pairRttInMs',
    'audioOutputLevel'
  ],
  sectionName: 'Audio Receive',
  url: 'https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk'
};

subHtml['video.send'] = {
  keys: [
    'availableBitrate',
    'frameRateSent',
    'frameWidthSent',
    'frameHeightSent',
    'bitrate',
    'packetsPerSecond',
    'rttInMs',
    'pairRttInMs',
    'packetsLostPerSecond',
    'frameRateInput',
    'frameWidthInput',
    'frameHeightInput',
    'codecName'
  ],
  sectionName: 'Video Send',
  url: 'https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk'
};

subHtml['video.receive'] = {
  keys: [
    'bitrate',
    'packetsPerSecond',
    'packetsLostPerSecond',
    'jitterInMs',
    'pairRttInMs',
    'frameRateReceived',
    'frameWidthReceived',
    'frameHeightReceived',
    'frameRateOutput',
    'frameRateDecoded',
    'longestFreezeDuration',
    'totalFreezeDuration',
    'codecName'
  ],
  sectionName: 'Video Receive',
  url: 'https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk'
};

subHtml['screenShare.send'] = {
  keys: [
    'frameRateSent',
    'frameWidthSent',
    'frameHeightSent',
    'bitrate',
    'packetsPerSecond',
    'rttInMs',
    'pairRttInMs',
    'packetsLostPerSecond',
    'frameRateInput',
    'frameWidthInput',
    'frameHeightInput',
    'codecName'
  ],
  sectionName: 'ScreenShare Send',
  url: 'https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk'
};

subHtml['screenShare.receive'] = {
  keys: [
    'bitrate',
    'packetsPerSecond',
    'packetsLostPerSecond',
    'jitterInMs',
    'pairRttInMs',
    'frameRateReceived',
    'frameWidthReceived',
    'frameHeightReceived',
    'frameRateOutput',
    'frameRateDecoded',
    'longestFreezeDuration',
    'totalFreezeDuration',
    'codecName'
  ],
  sectionName: 'ScreenShare Receive',
  url: 'https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/media-quality-sdk'
};

function generateHtml(key: string, id: string) {
    const item = subHtml[key];
    let html = '';
    html += `<dt class='sectionHeader'>${item.sectionName}</dt>` +
            `<dd class='sectionHeader'><a href="${item.url}" target="_blank">Learn more</a></dd>`;
    for (const k of item.keys) {
      const info = MediaStatsMap[`${key}.${k}`];
      html += `<dt hidden=false id="${key}.${k}.${id}">${info.Name}</dt>` +
            `<dd hidden=false id="${key}.${k}.${id}.value">—</dd>`;

    }
    return html.trim();
}


let eventListenerSet: Set<string>
let allIds: string[] = [];

export function createMediaStatsTable() {
  eventListenerSet = new Set()
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  allIds = [];
  return template.content.firstChild
}

export function updateMediaStatsTable(mediaStatsData: MediaStatsData) {
  try{
    if (mediaStatsData) {
      const checkItems = [
          {
            key: 'audio.send',
            value: mediaStatsData.audio.send
          },
          {
            key: 'audio.receive',
            value: mediaStatsData.audio.receive
          },
          {
            key: 'video.send',
            value: mediaStatsData.video.send
          },
          {
            key: 'video.receive',
            value: mediaStatsData.video.receive
          },
          {
            key: 'screenShare.send',
            value: mediaStatsData.screenShare.send
          },
          {
            key: 'screenShare.receive',
            value: mediaStatsData.screenShare.receive
          }
      ];

      //check if there are id added or removed
      const newIds: string[] = [];
      for (const obj of checkItems) {
        const str = obj.key;
        const items = obj.value
        const ids = Object.keys(items);
        for (const id of ids) {
          newIds.push(str + '.' + id);
        }
      }
      if(allIds.filter(x => !newIds.includes(x)).length ||
         newIds.filter(x => !allIds.includes(x)).length) {
        //there is id change, regenerate html
        let html = '';
        for (const obj of checkItems) {
          const str = obj.key;
          const items = obj.value
          const ids = Object.keys(items);
          for (const id of ids) {
            html += generateHtml(str, id);
          }
        }
        const elem = document.getElementById('mediaStatsTable');
        elem!.innerHTML = html;
        allIds = newIds;
        //listeners attached to dom element are removed
        eventListenerSet.clear();
      }
      updateValue(mediaStatsData);
    }
  }catch(e){
    console.error(e);
  }
}

function updateValue(mediaStatsData: MediaStatsData) {
  const checkItems = [
    {
      key: 'audio.send',
      value: mediaStatsData.audio.send
    },
    {
      key: 'audio.receive',
      value: mediaStatsData.audio.receive
    },
    {
      key: 'video.send',
      value: mediaStatsData.video.send
    },
    {
      key: 'video.receive',
      value: mediaStatsData.video.receive
    },
    {
      key: 'screenShare.send',
      value: mediaStatsData.screenShare.send
    },
    {
      key: 'screenShare.receive',
      value: mediaStatsData.screenShare.receive
    }
  ];
  for(const obj of checkItems) {
    const str = obj.key
    const items = obj.value
    const ids = Object.keys(items);
    const metricKeys = subHtml[str].keys;
    for(const id of ids) {
      const targetItem = items[id];
      for (const k of metricKeys) {
        const elementId = `${str}.${k}.${id}`
        const elementValueId = `${elementId}.value`
        const elementMapId = `${str}.${k}`
        const dataValue = targetItem[k as MediaStatsDataKey];
        if (dataValue !== undefined) {
          const value =
            typeof dataValue[dataValue.length - 1].value === 'number'
              ? Math.round(dataValue[dataValue.length - 1].value as number)
              : dataValue[dataValue.length - 1].value
          const unit =
            dataValue[dataValue.length - 1].unit === 'None'
              ? ''
              : dataValue[dataValue.length - 1].unit
          const textToShow = value + unit
          if (textToShow !== document.getElementById(elementId)!.innerText) {
            // to avoid updating the dom when incoming data is same as previous data
            document.getElementById(elementValueId)!.innerText = textToShow
            document.getElementById(elementValueId)!.hidden = false
            document.getElementById(elementId)!.hidden = false
          }

          if (!eventListenerSet.has(elementId)) {
            // to avoid duplicate event listeners
            if (MediaStatsMap[elementMapId].Clickable) {
              document.getElementById(elementId)!.addEventListener('click', () => {
                initializeGraph(dataValue, elementMapId)
              })
              document.getElementById(elementValueId)!.addEventListener('click', () => {
                initializeGraph(dataValue, elementMapId)
              })
              document.getElementById(elementId)!.classList.add('interactive')
              document.getElementById(elementValueId)!.classList.add('interactive')
              eventListenerSet.add(elementId)
            }
          }
        } else {
          ;(document.getElementById(elementValueId) as HTMLElement).innerText = ''
          ;(document.getElementById(elementValueId) as HTMLElement).hidden = true
          ;(document.getElementById(elementId) as HTMLElement).hidden = true
        }
      }
    }
  }
}
