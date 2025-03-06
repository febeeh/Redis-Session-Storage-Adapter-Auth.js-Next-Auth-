import type { Adapter, AdapterSession } from "@auth/core/adapters";
// Import ioredis
import Redis from "ioredis";

export const format = {
  /** Takes a redis string data and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const key in object) {
      const value = object[key];
      if (key === "expires") {
        newObject[key] = new Date(value);
      } else if (key === "userId") {
        newObject[key] = value.toString();
      } else {
        newObject[key] = value;
      }
    }
    return newObject as T;
  },
  /** Takes a plain old JavaScript object and turns it into a redis string data */
  to<T = Record<string, unknown>>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const key in object) {
      const value = object[key];
      if (key === "userId") {
        newObject[key] = value.toString();
      } else if (key === "expires") {
        newObject[key] = value.toISOString();
      } else if (key === "id") continue;
      else newObject[key] = value;
    }
    return newObject as T;
  },
};

export function customDBAdapter(userDB: Adapter, redisClient: Redis): Adapter {
  const { from, to } = format;

  // Redis adapter functions
  const redisAdapter: Adapter = {
    async getSessionAndUser(sessionToken) {
      const session: any = await redisClient.hgetall(
        `session:${sessionToken.toString()}`
      );
      console.log("Get Session = ", session);
      const formatedSession = from<AdapterSession>(session);
      if (!session) return null;
      const user = await userDB.getUser!(formatedSession.userId);
      if (!user) return null;
      return {
        user: user,
        session: formatedSession,
      };
    },
    async createSession(data) {
      const session = to<AdapterSession>(data);
      const ttl = Math.floor(
        (new Date(data.expires).getTime() - Date.now()) / 1000
      );
      await redisClient.hmset(`session:${data.sessionToken}`, session);
      await redisClient.expire(`session:${data.sessionToken}`, ttl);
      return from<AdapterSession>(session);
    },
    async updateSession(data) {
      const { sessionToken, expires } = to<AdapterSession>(data);
      const ttl = Math.floor(
        (new Date(data.expires!).getTime() - Date.now()) / 1000
      );
      await redisClient.hmset(`session:${data.sessionToken}`, {
        sessionToken,
        expires: expires,
      });
      await redisClient.expire(`session:${data.sessionToken}`, ttl);
      return from<AdapterSession>(data);
    },
    async deleteSession(sessionToken) {
      const session = await redisClient.hgetall(`session:${sessionToken}`);
      if (!session) return null;
      await redisClient.del(`session:${sessionToken}`);
      return from<AdapterSession>(session!);
    },
  };
  return { ...userDB, ...redisAdapter } as Record<string, any>;
}
