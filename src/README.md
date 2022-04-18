# Communication Inspector

The Communication Inspector enables Azure Communication Services developers to inspect the state of a call to debug or monitor their solution. When building a solution, developers might need visibility for debugging into general call information such as the Call ID or advanced states. The Communication Inspector provides developers this information and more.

## Getting Started

### Prerequisites

- A Javascript web application using the ACS Calling SDK to enable calls between clients.

### Installing

This package is a UI component that can be installed through NPM to your web application. Paste the following command in your terminal while located in the project's root folder to install.

`command placeholder`

### Initialization

The Communication Inspector component expects to receive an `Options` object that consists of 3 different properties. Both the call client and call agent that are part of your already existing calling application are expected, as well as the div where you want the Inspector to be injected in once you call the `open` function.

```typescript
import { CallAgent, CallClient } from '@azure/communication-calling'
import { CommunicationInspector } from 'communication-inspector'

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

const communicationInspector = new CommunicationInspector(options)
```

## Using the Communication Inspector

The Communication Inspector API consists of 5 different functions that developers can use to initialize and use the component correctly. These functions are as followed:

### Start

Once the Inspector has been instantiated, you will need to start the collectors before doing anything else. These collectors will retrieve information from different SDKs across ACS to show you the latest information from the call you want to monitor.

```typescript
communicationInspector.start()
```

### Open

This function will allow the Inspector to be injected in the div element that was sent as a parameter in the initialization of the component. Make sure to call this after calling the start function to expect the correct behavior.

```typescript
communicationInspector.open()
```

### Stop

Stops all collectors from retrieving information.

```typescript
communicationInspector.stop()
```

### Close

Removes the component from the selected div. It's worth mentioning that even if the Inspector is closed, it will still collect information from the different SDKs as long as the stop function is not called.

```typescript
communicationInspector.close()
```

### Dipose

The dispose function is available to activate both the stop and close functions in one call.

```typescript
communicationInspector.dispose()
```
