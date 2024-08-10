// child.ts
const items = 4;
const targetMaxOnes = 177;
const maxRolls = Number(process.argv[2]) || 250000; // Rolls per child process

let rolls = 0;
let maxOnes = 0;
const targetThreshold = 1 / items;

while (maxOnes < targetMaxOnes && rolls < maxRolls) {
    let ones = 0;

    for (let i = 0; i < 231; i++) {
        if (Math.random() < targetThreshold) {
            ones++;
        }
    }

    if (ones > maxOnes) maxOnes = ones;
    rolls++;
}

// Send the result back to the parent process
// @ts-ignore
process.send({ type: "result", maxOnes, rolls });
