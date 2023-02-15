import { createClient } from 'redis';

const client = createClient();

client.on('error', (result) => console.log('Redis Client Error', result));

client.connect();
export default client;
