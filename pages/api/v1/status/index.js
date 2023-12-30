import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dataBaseName = process.env.POSTGRES_DB;

  const dataBaseVersionQuery = await database.query("SHOW server_version;");
  const dataBaseVersion = dataBaseVersionQuery.rows[0].server_version;

  const showMaxConnectionsQuery = await database.query("SHOW MAX_CONNECTIONS;");
  const maxConnections = showMaxConnectionsQuery.rows[0].max_connections;

  const openedConnectionsQuery = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dataBaseName],
  });
  const openedConnections = openedConnectionsQuery.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        database_version: dataBaseVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnections,
      },
    },
  });
}

export default status;
