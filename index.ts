import { spawn } from "bun";
import os from "node:os";

const items = 4; // Number of sides on the dice
const maxRolls = 10 ** 9; // Number of rolls

const numProcesses = os.cpus().length; // Number of parallel processes to spawn

const targetMaxOnes = 177;
const rollsPerProcess = Math.floor(maxRolls / numProcesses);
let rolls = 0;
let maxOnes = 0;
let completedProcesses = 0;

// Function to handle messages from child processes
function handleChildMessage(message: { type: string; maxOnes: number; rolls: number }) {
    if (message.type === "result") {
        rolls += message.rolls;
        maxOnes = Math.max(maxOnes, message.maxOnes);
        //console.log(`Child Process Result: ${message.maxOnes}`);

        completedProcesses++;
        console.log("Completed Processes:", completedProcesses);
        
        if (completedProcesses === numProcesses) {
            console.log("Number of Roll Sessions:", rolls);
            console.log("Highest Ones Roll:", maxOnes);
            console.log(`Took: ${Bun.nanoseconds() / 10 ** 9} seconds.`);

            process.exit(0);
        }
    }
}

console.log("Spawning", numProcesses, "child processes...");

// Spawn child processes
for (let i = 0; i < numProcesses; i++) {
    const childProc = spawn(["bun", "child.ts", rollsPerProcess.toString()], {
        ipc(message) {
            handleChildMessage(message);
        },
        onExit() {
            handleProcessExit();
        },
    });
}
