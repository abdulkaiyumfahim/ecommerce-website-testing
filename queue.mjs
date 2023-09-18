import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import "dotenv/config";

const connection = new Redis(process.env.REDIS_PATH, {
  maxRetriesPerRequest: null,
});

const myQueue = new Queue("product", { connection });

new Worker(
  "product",
  async (job) => {
    console.log(job.data);
  },
  { connection }
);
