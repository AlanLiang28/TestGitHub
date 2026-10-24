// Run once to create the table:  npx tsx setup-db.ts
import pg from "pg";

process.loadEnvFile();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL!.split("?")[0],
  ssl: { rejectUnauthorized: false },
});

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS entries (
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mood INTEGER NOT NULL,
    note TEXT
  )
`);

// Turn it into a hypertable: Tiger Data's time-series table type
await client.query(
  "SELECT create_hypertable('entries', by_range('created_at'), if_not_exists => TRUE)"
);

console.log("Table 'entries' is ready.");
await client.end();