import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

await client.connect();
const result = await client.query("SELECT NOW() AS time");
console.log("Connected! Database time:", result.rows[0].time);
await client.end();