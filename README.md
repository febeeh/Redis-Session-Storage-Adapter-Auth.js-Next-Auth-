# Redis Session Storage Adapter for Auth.js/Next-Auth
This is a custom database adapter developed to use Redis as session storage, while allowing other databases to be used for storing user data. The adapter efficiently handles session management with Redis, providing seamless integration with Auth.js/Next-Auth.

## 1. Install the required dependencies:

To get started with the Redis Session Storage Adapter, you will need to install the following dependencies:

```bash
npm install ioredis
```
This will install ioredis for Redis integration.

## 2. Set up environment variables:
In your .env file, add the following configuration for Redis:
```bash
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
```
Replace ```your_redis_host```, ```your_redis_port```, and ```your_redis_password``` with your Redis server details.

## 3. Copy the customDBAdapter.ts and redis.ts Files
To use the adapter, copy the ```customDBAdapter.ts``` and ```redis.ts``` files into your ```./lib``` directory.

## 4. Adding the Adapter to `auth.ts`
#### Import the ```customDBAdapter``` and ```redisClient```:

```ts
import { customDBAdapter  } from "./lib/customDBAdapater";
import redisClient from "./lib/redis";
```

#### Add the Custom Adapter to NextAuth configuration:
```ts
export default NextAuth({
  adapter: customDBAdapter(
    your-userdata-db-adapter-here,
    redisClient
  ),
  // Other NextAuth configuration
});
```

Add your user data DB adapter in place of ```your-userdata-db-adapter-here```. For more details about db adapter, checkout [https://authjs.dev/getting-started/database](https://authjs.dev/getting-started/database)

### Example
Check out the `example` folder for a better understanding of how to integrate the Redis Session Storage Adapter with Auth.js/Next-Auth.


**Done!** You’re all set up to use the Redis Session Storage Adapter.

