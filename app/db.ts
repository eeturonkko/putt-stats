import * as SQLite from "expo-sqlite";

export type Session = { id: string; date: string; session_name: string };
export type Putt = {
  id: number;
  session_id: string;
  distance_m: number;
  result: number;
};

const db = SQLite.openDatabaseSync("puttstats.db");

export async function initDb(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      session_name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS putts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      distance_m INTEGER NOT NULL,
      result INTEGER NOT NULL,
      FOREIGN KEY(session_id) REFERENCES sessions(id)
    );
  `);
}

export async function resetDb(): Promise<void> {
  await db.execAsync(`
    DROP TABLE IF EXISTS putts;
    DROP TABLE IF EXISTS sessions;
  `);
  await initDb();
}

export async function fetchSessions(): Promise<Session[]> {
  return await db.getAllAsync<Session>(
    "SELECT id, date, session_name FROM sessions ORDER BY date DESC;"
  );
}

export async function fetchPutts(sessionId: string): Promise<Putt[]> {
  return await db.getAllAsync<Putt>(
    "SELECT id, session_id, distance_m, result FROM putts WHERE session_id = ? ORDER BY id ASC;",
    [sessionId]
  );
}

export async function insertSession(
  id: string,
  date: string,
  session_name: string
): Promise<void> {
  await db.runAsync(
    "INSERT INTO sessions (id, date, session_name) VALUES (?, ?, ?);",
    [id, date, session_name]
  );
}

export async function insertPutt(
  sessionId: string,
  distance_m: number,
  result: number
): Promise<void> {
  await db.runAsync(
    "INSERT INTO putts (session_id, distance_m, result) VALUES (?, ?, ?);",
    [sessionId, distance_m, result]
  );
}

export async function deleteSession(id: string): Promise<void> {
  await db.runAsync("DELETE FROM sessions WHERE id = ?;", [id]);
  await db.runAsync("DELETE FROM putts WHERE session_id = ?;", [id]);
}

export default {};
