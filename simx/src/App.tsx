import { useRef, useEffect } from "react"
import { SimulatorMessage, SimulatorControlMessage } from "./external/types"
import "./App.css"

// This extension's message channel. Must match simx registration in MakeCode target's `targetconfig.json`
const MY_CHANNEL = "eanders-ms/simx-sample"

// Messages sent to/from this project's code extension. This interface is application-defined and can be anything.
type InitExtensionMessage = {
    type: "init"
}
type StringExtensionMessage = {
    type: "string"
    value: string
}
type ExtensionMessage = InitExtensionMessage | StringExtensionMessage

// Sends a message to this simx's code extension
function postSimMessage(msg: ExtensionMessage) {
    const payload = new TextEncoder().encode(JSON.stringify(msg))
    const packet: Partial<SimulatorControlMessage> = {
        type: "messagepacket",
        channel: MY_CHANNEL,
        data: payload,
    }
    window.parent.postMessage(packet, "*")
}

export function App() {
    // Refs to the elements we want to interact with programmatically
    const inputRef = useRef<HTMLInputElement>(null)
    const logRef = useRef<HTMLTextAreaElement>(null)

    // Handle the user clicking the Send button
    const handleSendClick = () => {
        if (inputRef.current) {
            const message = inputRef.current.value
            inputRef.current.value = ""
            postSimMessage({ type: "string", value: message })
        }
    }

    // Handle a message from this simulator's code extension
    const receiveExtensionMessage = (msg: ExtensionMessage) => {
        switch (msg.type) {
            case "init": {
                if (logRef.current) {
                    logRef.current.value = ""
                }
                break
            }
            case "string": {
                if (logRef.current) {
                    logRef.current.value += msg.value + "\n"
                }
                break
            }
            default:
                console.error("Received unknown extension message", (msg as any).type)
        }
    }

    // Handle a `SimulatorControlMessage` from the MakeCode simulator
    const receiveSimControlMessage = (simmsg: SimulatorControlMessage) => {
        const srcFrameIndex = (simmsg.srcFrameIndex as number) ?? -1
        const fromPrimarySim = srcFrameIndex === 0
        if (!fromPrimarySim) {
            // Ignore messages from other frames
            return
        }
        if (simmsg.channel !== MY_CHANNEL) {
            // Ignore messages from other channels
            return
        }
        const data = new TextDecoder().decode(new Uint8Array(simmsg.data))
        const msg = JSON.parse(data) as ExtensionMessage

        receiveExtensionMessage(msg)
    }

    // Handle a `SimulatorMessage` from the MakeCode simulator
    const receiveSimMessage = (simmsg: SimulatorMessage) => {
        switch (simmsg.type) {
            case "messagepacket":
                return receiveSimControlMessage(simmsg as SimulatorControlMessage)
            default:
                // This is here to reveal how many other kinds of messages are being sent around
                console.log("Unknown simmsg", simmsg.type)
        }
    }

    // Handle a message from the parent window
    const receiveMessage = (ev: MessageEvent) => {
        const { data } = ev
        const { type } = data
        if (!data || !type) return
        receiveSimMessage(data)
    }

    // Register for messages from the parent window
    useEffect(() => {
        window.addEventListener("message", receiveMessage)
        return () => window.removeEventListener("message", receiveMessage)
    }, [])

    return (
        <div className="app">
            <div className="label">Send a message to your microbit:</div>
            <div className="send">
                <input className="send" type="text" ref={inputRef} />
                <button className="send" onClick={handleSendClick}>
                    Send
                </button>
            </div>
            <div className="divider"></div>
            <div className="label">From your microbit:</div>
            <textarea className="log" readOnly ref={logRef}></textarea>
        </div>
    )
}
