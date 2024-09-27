namespace test {
    //% block
    export function loadSimulatorExtension() {
        const msg = {
            type: "init",
        };
        control.simmessages.send("eanders-ms/simx-sample", Buffer.fromUTF8(JSON.stringify(msg)), false);
    }
}
