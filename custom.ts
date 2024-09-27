namespace SimxSample {
    //% block
    export function sendString(s: string) {
        const msg = {
            type: "string",
            value: s
        }
        control.simmessages.send("eanders-ms/simx-sample", Buffer.fromUTF8(JSON.stringify(msg)), false);
    }

    let stringMessageHandler: (s: string) => void;

    //% block
    export function onReceiveString(handler: (s: string) => void) {
        stringMessageHandler = handler;
    }

    function handleSimxMessage(b: Buffer) {
        const s = b.toString();
        const msg = JSON.parse(s);
        if (msg.type) return;
        switch (msg.type) {
            case "string": {
                if (stringMessageHandler) stringMessageHandler(msg.value);
                break;
            }
        }
    }

    /**
     * Register to receive simx messages
     */
    //% shim=TD_NOOP
    function registerSimx() {
        control.simmessages.onReceived("eanders-ms/simx-sample", handleSimxMessage)
        const msg = { type: "init" };
        control.simmessages.send("eanders-ms/simx-sample", Buffer.fromUTF8(JSON.stringify(msg)), false);
    }

    // Register simulator extension on load
    registerSimx();
}
