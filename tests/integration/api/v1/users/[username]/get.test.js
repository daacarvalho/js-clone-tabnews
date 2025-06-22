import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDataBase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymus user", () => {
    test("With exact case match", async () => {
      const createdUserMatch = await orchestrator.createUser({
        username: "JohnDoeCase",
      });

      const getByUserName = await fetch(
        `http://localhost:3000/api/v1/users/${createdUserMatch.username}`,
      );

      expect(getByUserName.status).toBe(200);

      const responseBodyGetByUserName = await getByUserName.json();

      expect(responseBodyGetByUserName).toEqual({
        id: responseBodyGetByUserName.id,
        username: "JohnDoeCase",
        email: `${createdUserMatch.email}`,
        password: responseBodyGetByUserName.password,
        created_at: responseBodyGetByUserName.created_at,
        updated_at: responseBodyGetByUserName.updated_at,
      });

      expect(uuidVersion(responseBodyGetByUserName.id)).toBe(4);
      expect(Date.parse(responseBodyGetByUserName.created_at)).not.toBeNaN();
      expect(Date.parse(responseBodyGetByUserName.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const createdUserMisMatch = await orchestrator.createUser({
        username: "JaneDoeCase",
      });

      const getByUserName = await fetch(
        `http://localhost:3000/api/v1/users/janedoecase`,
      );

      expect(getByUserName.status).toBe(200);

      const responseBodyGetByUserName = await getByUserName.json();

      expect(responseBodyGetByUserName).toEqual({
        id: responseBodyGetByUserName.id,
        username: "JaneDoeCase",
        email: `${createdUserMisMatch.email}`,
        password: responseBodyGetByUserName.password,
        created_at: responseBodyGetByUserName.created_at,
        updated_at: responseBodyGetByUserName.updated_at,
      });

      expect(uuidVersion(responseBodyGetByUserName.id)).toBe(4);
      expect(Date.parse(responseBodyGetByUserName.created_at)).not.toBeNaN();
      expect(Date.parse(responseBodyGetByUserName.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const getByUserName = await fetch(
        "http://localhost:3000/api/v1/users/usuarioInexistente",
      );

      expect(getByUserName.status).toBe(404);

      const responseBodyGetByUserName = await getByUserName.json();

      expect(responseBodyGetByUserName).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        statusCode: 404,
      });
    });
  });
});
