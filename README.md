# Azure Communication Services communication monitoring

Azure Communication Services communication monitoring is a UI component that enables Azure Communication Services developers to inspect the state of a local call to debug or monitor their solution. When building a solution, developers might need visibility for debugging into general call information such as the Call ID or advanced states (bitrate, received and sent packets are a few examples). The Communication Monitoring tool provides developers this information and more.

## Capabilities

The Communication Monitoring tool provides developers three categories of information that can be used for debugging purposes:
| Category | Descriptions |
|--------------------------------|-----------------------------------|
| General Call Information | Includes call id, participants, devices and user agent information (browser, version, etc.) |
| Media Quality Stats | Metrics and statistics provided by [Media Quality APIs](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/media-quality-sdk). Metrics are clickable for timeseries view.|
| User Facing Diagnostics | UFDs are a useful list of local attributes that may help to determine issues at a quick glance. These attributes include information such as camera status, speaker devices availability, etc. You can find the complete list of user facing diagnostics [here](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/user-facing-diagnostics).|

Data collected by the tool is only kept locally and temporarily for charting purposes for up to 5 minutes. Downloading the logs from within the interface will save to the local machine with a zipped log dump with its unique identifier and hash.

The Communication Monitoring tool is compatible with the same browsers as the Calling SDK. For the complete compatibility table click [here](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#javascript-calling-sdk-support-by-os-and-browser).

## Getting Started

### Prerequisites

- A Javascript web application using the ACS Calling SDK to enable calls between clients.

### Installing

This package is a UI component that can be installed through NPM to your web application. Paste the following command in your terminal while located in the project's root folder to install.

```bash
npm i @azure/communication-monitoring --save
```

### Initialization

The Communication Monitoring component expects to receive an `Options` object that consists of 3 different properties. Both the call client and call agent that are part of your already existing calling application are expected, as well as the div where you want the Communication Monitoring to be injected in once you call the `open()` function.

```typescript
import { CallAgent, CallClient } from '@azure/communication-calling'
import { CommunicationMonitoring } from '@azure/communication-monitoring'

interface Options {
  callClient: CallClient
  callAgent: CallAgent
  divElement: HTMLDivElement
}

const selectedDiv = document.getElementById('selectedDiv')

const options = {
  callClient = this.callClient,
  callAgent = this.callAgent,
  divElement = selectedDiv,
}

const communicationMonitoring = new CommunicationMonitoring(options)
```

## Using the Communication Monitoring tool

The Communication Monitoring API consists of 5 different functions that developers can use to initialize and use the component correctly. These functions are as followed:

### Start

Once the Communication Monitoring tool has been instantiated, you will need to start the collectors before doing anything else. These collectors will retrieve information from different SDKs across ACS to show you the latest information from the call you want to monitor. A suggestion would be to call this function as soon as the call is connected.

```typescript
communicationMonitoring.start()
```

### Open

This function will allow the Communication Monitoring tool to be injected in the div element that was sent as a parameter in the initialization of the component. Make sure to call this after calling the start function to expect the correct behavior.

```typescript
communicationMonitoring.open()
```

### Stop

Stops all collectors from retrieving information.

```typescript
communicationMonitoring.stop()
```

### Close

Removes the component from the selected div. It's worth mentioning that even if the Communication Monitoring tool is closed, it will still collect information from the different SDKs as long as the stop function is not called.

```typescript
communicationMonitoring.close()
```

### Dispose

The dispose function is available to activate both the stop and close functions in one call.

```typescript
communicationMonitoring.dispose()
```

## Sample App

Before adding the Communication Monitoring tool to your project, you may use the quickstart application to get a sample of the implementation. The instructions to initialize the sample application are as followed:

### Clone the repository

Paste the following command in your terminal to download the repository to your local environment:

```bash
git clone https://github.com/Azure/communication-monitoring.git
```

### Add a credential

1. In the sample folder, you will see the `.env.example` file. Remove the `.example` suffix and change the `AZURE_COMMUNICATION_TOKEN` value with the token from your specific resource.

2. Go to the ACS resource page where your application is deployed in the Azure Portal and find the `Identities & User Access Tokens` under the Keys section. Mark the Voice and Video Calling checkbox and generate your token.

3. Copy the User Access Token and paste it in your `.env` file.

### Install the application

Make sure to position yourself in the `sample` folder and then run the following command:

```bash
npm run start
```

If the command fails, try to update to the latest `npm` version.

Quickstart application will be available at `localhost:8080` after setup.

### Join a call

In order to join a specific call using the quickstart application, you will need to find the id for the call you're trying to join. Copy the call id to the app's textbox and click the start call button.

The Communication Monitoring tool will be shown as a white square. This can be changed by clicking the open pop up button found in the UI. This button is calling the `open()` function from the Communication Monitoring API.

### Adding changes

Given the fact that this quickstart application installs the Communication Monitoring package as if it was being installed from the remote origin, changes to the src folder will not automatically show in the quickstart application when saved. Once you've made all of the changes you want to see in action, restart the server by using the same `npm run start` command to allow building, packing and installing processes to take place.
