import { version as uuidVersion } from "uuid";

beforeAll(async () => {});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymus user", () => {
    test("With exact case match", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "JohnDoeCase",
          email: "johndoecase@hotmail.com",
          password: "senha321",
        }),
      });

      expect(response.status).toBe(201);

      const getByUserName = await fetch(
        "http://localhost:3000/api/v1/users/JohnDoeCase",
      );

      expect(getByUserName.status).toBe(200);

      const responseBodyGetByUserName = await getByUserName.json();

      expect(responseBodyGetByUserName).toEqual({
        id: responseBodyGetByUserName.id,
        username: "JohnDoeCase",
        email: "johndoecase@hotmail.com",
        password: responseBodyGetByUserName.password,
        created_at: responseBodyGetByUserName.created_at,
        updated_at: responseBodyGetByUserName.updated_at,
      });

      expect(uuidVersion(responseBodyGetByUserName.id)).toBe(4);
      expect(Date.parse(responseBodyGetByUserName.created_at)).not.toBeNaN();
      expect(Date.parse(responseBodyGetByUserName.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "JaneDoeCase",
          email: "janedoecase@hotmail.com",
          password: "senha321",
        }),
      });

      expect(response.status).toBe(201);

      const getByUserName = await fetch(
        "http://localhost:3000/api/v1/users/janedoecase",
      );

      expect(getByUserName.status).toBe(200);

      const responseBodyGetByUserName = await getByUserName.json();

      expect(responseBodyGetByUserName).toEqual({
        id: responseBodyGetByUserName.id,
        username: "JaneDoeCase",
        email: "janedoecase@hotmail.com",
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
