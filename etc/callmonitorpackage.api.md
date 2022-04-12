## API Report File for "callmonitorpackage"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { Call } from '@azure/communication-calling';
import { MediaDiagnosticChangedEventArgs } from '@azure/communication-calling';
import { NetworkDiagnosticChangedEventArgs } from '@azure/communication-calling';

// @public (undocumented)
export class CallMonitor {
    constructor(call: Call);
    // (undocumented)
    call: Call;
    // (undocumented)
    close(): void;
    // Warning: (ae-forgotten-export) The symbol "Collector" needs to be exported by the entry point CallMonitor.d.ts
    //
    // (undocumented)
    collectors: Collector[];
    // (undocumented)
    isCollectionStarted: boolean;
    // (undocumented)
    isOpened: boolean;
    // (undocumented)
    open(): void;
    // (undocumented)
    start(): void;
    // (undocumented)
    stop(): void;
}

// (No @packageDocumentation comment for this package)

```