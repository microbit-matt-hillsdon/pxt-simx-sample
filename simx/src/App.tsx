import { useRef, useEffect } from "react"
import { SimulatorMessage, SimulatorControlMessage } from "./external/types"
import "./App.css"

// This extension's message channel. Must match the extension's simx registration key in MakeCode's `targetconfig.json`
// Value is typically in the form of "orgname/reponame".
// 🛠️ TASK: Update this to match your project's channel.
const SIMX_CHANNEL = "eanders-ms/simx-sample"

// Messages sent to/from this project's code extension. This interface is application-defined and can be anything.
// 🛠️ TASK: Modify and extend these to match your project's needs. 
type InitExtensionMessage = {
    type: "init"
}
type StringExtensionMessage = {
    type: "string"
    value: string
}
type ExtensionMessage = InitExtensionMessage | StringExtensionMessage

// Sends a message to this project's code extension running in the MakeCode simulator
function postExtensionMessage(msg: ExtensionMessage) {
    const payload = new TextEncoder().encode(JSON.stringify(msg))
    const packet: Partial<SimulatorControlMessage> = {
        type: "messagepacket",
        channel: SIMX_CHANNEL,
        data: payload,
    }
    window.parent.postMessage(packet, "*")
}

// Colors for the background
const GREEN = "#3AFFB3"
const BLUE = "#3ADCFF"
const YELLOW = "#FFD43A"
const RED = "#FF3A54"
const COLORS = [GREEN, BLUE, YELLOW, RED]

function setBackgroundColor() {
    // Assign a random background color to the root div
    const root = document.getElementById("root")
    if (root) {
        root.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    }
}

export function App() {
    // Refs to the DOM elements we want to interact with programmatically
    const inputRef = useRef<HTMLInputElement>(null)
    const logRef = useRef<HTMLTextAreaElement>(null)

    // Set a random background color on startup
    useEffect(() => {
        setBackgroundColor()
    }, [])

    // Handle send button click
    const handleSendClick = () => {
        if (inputRef.current) {
            const message = inputRef.current.value
            inputRef.current.value = ""
            postExtensionMessage({ type: "string", value: message })
        }
    }

    // Handle Enter key press on input box
    const handleInputKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === "Enter") {
            handleSendClick()
        }
    }

    // Handle messages from the MakeCode simulator
    useEffect(() => {
        // Handle a message from this project's code extension
        const receiveExtensionMessage = (msg: ExtensionMessage) => {
            // 🛠️ TASK: Handle messages from your code extension here
            switch (msg.type) {
                case "init": {
                    // Clear the log when the extension is initialized
                    if (logRef.current) {
                        logRef.current.value = ""
                    }
                    // Set a random background color when the extension is initialized
                    setBackgroundColor()
                    break
                }
                case "string": {
                    // Append incoming message to the log
                    if (logRef.current) {
                        logRef.current.value += msg.value + "\n"
                        logRef.current.scrollTop = logRef.current.scrollHeight
                    }
                    break
                }
                default: {
                    const { type } = msg
                    console.error("Received unknown extension message", type)
                }
            }
        }

        // Handle a SimulatorControlMessage from MakeCode
        const receiveSimControlMessage = (simmsg: SimulatorControlMessage) => {
            // Cross-frame communication is overly chatty right now, so we must filter out unwanted messages here.
            // TODO (MakeCode): Clean up iframe messaging to reduce noise.
            const srcFrameIndex = (simmsg.srcFrameIndex as number) ?? -1
            const fromPrimarySim = srcFrameIndex === 0
            if (!fromPrimarySim) {
                // Ignore messages from other simulator extensions
                return
            }
            if (simmsg.channel !== SIMX_CHANNEL) {
                // Ignore messages on other channels
                return
            }
            // looks like a message from our code extension
            const data = new TextDecoder().decode(new Uint8Array(simmsg.data))
            const msg = JSON.parse(data) as ExtensionMessage
            receiveExtensionMessage(msg)
        }

        // Handle a SimulatorMessage from MakeCode
        const receiveSimMessage = (simmsg: SimulatorMessage) => {
            switch (simmsg.type) {
                case "messagepacket":
                    // looks like a SimulatorControlMessage
                    return receiveSimControlMessage(simmsg as SimulatorControlMessage)
                default:
                    // This is here to reveal how many other kinds of messages are being sent.
                    // TODO (MakeCode): Document the other message types. Some of them are useful.
                    // 🛠️ TASK: Handle other message types as needed.
                    // 🛠️ TASK: Comment out this line in a real project.
                    console.log("Received unknown simmsg", simmsg.type)
            }
        }

        // Handle messages from the parent window
        const receiveMessage = (ev: MessageEvent) => {
            const { data } = ev
            const { type } = data
            if (!data || !type) return
            // Looks like a SimulatorMessage from MakeCode
            receiveSimMessage(data as SimulatorMessage)
        }

        window.addEventListener("message", receiveMessage)
        return () => window.removeEventListener("message", receiveMessage)
    }, [])

    return (
        <div className="app">
            <div className="label">Send a message to your microbit:</div>
            <div className="send">
                <input className="send" type="text" ref={inputRef} onKeyDown={handleInputKeyDown} />
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
