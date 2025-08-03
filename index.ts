import dotenv from 'dotenv';
import app from './app';
import os from 'os';
import * as http from 'http';

dotenv.config({ path: '../.env ' });

// libuv's threadpool have a default of 4 threads for async operations so we are changing it based on cpu cores
process.env.UV_THREADPOOL_SIZE = String(os.cpus().length);

const main = async () => {
    console.log('Starting server...');
    const PORT = process.env.PORT;

    // init database and redis connection
    // await RedisConnection.init();

    const server = http.createServer(app);

    server.listen(PORT, async () => {
        console.log(`listening on port ${PORT}`);
    });

    server.on('error', (err) => {
        if (err) {
            console.log('Server crashed while listening', err);
            throw err;
        }
    });
};

main();