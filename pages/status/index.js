import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <h2>Banco de dados</h2>
      <DataBaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Ultima atualização: {updatedAtText}</div>;
}

function DataBaseStatus() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let dataBaseVersion = "...";
  let dataBaseMaxConnections = "...";
  let dataBaseOpenedConnections = "...";

  if (!isLoading && data) {
    dataBaseVersion = data.dependencies.database.database_version;
    dataBaseMaxConnections = data.dependencies.database.max_connections;
    dataBaseOpenedConnections = data.dependencies.database.opened_connections;
  }

  return (
    <div>
      Versão do banco: {dataBaseVersion}
      <br></br>
      Máximo de conexões aceitas: : {dataBaseMaxConnections}
      <br></br>
      Conexões abertas: : {dataBaseOpenedConnections}
    </div>
  );
}
