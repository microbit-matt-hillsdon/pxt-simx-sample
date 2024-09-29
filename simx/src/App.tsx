import { useRef, useEffect } from "react"
import { SimulatorMessage, SimulatorControlMessage } from "./external/types"
import "./App.css"

// This extension's message channel. Must match simx registration in MakeCode target's `targetconfig.json`
const SIMX_CHANNEL = "eanders-ms/simx-sample"

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
        channel: SIMX_CHANNEL,
        data: payload,
    }
    window.parent.postMessage(packet, "*")
}

const GREEN = "#3AFFB3"
const BLUE = "#3ADCFF"
const YELLOW = "#FFD43A"
const RED = "#FF3A54"
const COLORS = [GREEN, BLUE, YELLOW, RED]

function setBackgroundColor() {
    // assign a background color to the root div
    const root = document.getElementById("root")
    if (root) {
        root.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    }
}

export function App() {
    // Refs to the elements we want to interact with programmatically
    const inputRef = useRef<HTMLInputElement>(null)
    const logRef = useRef<HTMLTextAreaElement>(null)

    // Set a random color on startup
    useEffect(() => {
        setBackgroundColor()
    }, [])

    // Handle send button click
    const handleSendClick = () => {
        if (inputRef.current) {
            const message = inputRef.current.value
            inputRef.current.value = ""
            postSimMessage({ type: "string", value: message })
        }
    }

    // Handle a message from the code extension
    const receiveExtensionMessage = (msg: ExtensionMessage) => {
        switch (msg.type) {
            case "init": {
                if (logRef.current) {
                    logRef.current.value = ""
                }
                setBackgroundColor()
                break
            }
            case "string": {
                if (logRef.current) {
                    logRef.current.value += msg.value + "\n"
                    logRef.current.scrollTop = logRef.current.scrollHeight
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
            // Ignore messages from non-primary frames
            return
        }
        if (simmsg.channel !== SIMX_CHANNEL) {
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
                // This is here to reveal how many other kinds of messages are being sent around.
                // Remove this line in a real project.
                // TODO: Document the other message types. Some of them are useful.
                console.log("Unknown simmsg", simmsg.type)
        }
    }

    // Handle messages from the parent window
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
