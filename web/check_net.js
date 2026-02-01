
const net = require('net');

const HOST = 'db.betffqdeopihcfpqnoay.supabase.co';
const PORTS = [5432, 6543];

async function checkPort(port) {
    return new Promise((resolve) => {
        console.log(`Checking ${HOST}:${port}...`);
        const socket = new net.Socket();
        socket.setTimeout(3000); // 3s timeout

        socket.on('connect', () => {
            console.log(`✅ Success: ${HOST}:${port} is reachable.`);
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log(`❌ Timeout: ${HOST}:${port} took too long.`);
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (err) => {
            console.log(`❌ Error: ${HOST}:${port} - ${err.message}`);
            socket.destroy();
            resolve(false);
        });

        socket.connect(port, HOST);
    });
}

async function main() {
    console.log("Testing Supabase Connectivity...");
    for (const port of PORTS) {
        await checkPort(port);
    }
}

main();
