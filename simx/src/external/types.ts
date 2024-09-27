// MakeCode Simulator Message Types
// See https://github.com/microsoft/pxt/blob/c32ac7b23e82fb955dd6f02bfb32a9f0fde8e316/pxtsim/embed.ts#L90

export interface SimulatorMessage {
    type: string
    // who created this message
    source?: string
}

export interface SimulatorBroadcastMessage extends SimulatorMessage {
    broadcast: boolean
    toParentIFrameOnly?: boolean
    srcFrameIndex?: number
}

export interface SimulatorControlMessage extends SimulatorBroadcastMessage {
    type: "messagepacket"
    channel: string
    data: Uint8Array
}
