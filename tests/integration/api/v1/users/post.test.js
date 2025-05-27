import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDataBase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymus user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "daacarvalho",
          email: "danielfccarvalho@hotmail.com",
          password: "senha123",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "daacarvalho",
        email: "danielfccarvalho@hotmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDataBase = await user.findOneByUserName("daacarvalho");
      const correctPasswordMatch = await password.compare(
        "senha123",
        userInDataBase.password,
      );

      const inorrectPasswordMatch = await password.compare(
        "senha321",
        userInDataBase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(inorrectPasswordMatch).toBe(false);
    });

    test("With duplicated 'email'", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "johndoe",
          email: "johndoe@hotmail.com",
          password: "senha321",
        }),
      });

      expect(response.status).toBe(201);

      const responseWithDuplicatedEmail = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "johndoeduplicated",
            email: "Johndoe@hotmail.com",
            password: "senha321",
          }),
        },
      );

      expect(responseWithDuplicatedEmail.status).toBe(400);

      const responseBodyDuplicatedEmail =
        await responseWithDuplicatedEmail.json();

      expect(responseBodyDuplicatedEmail).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        statusCode: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "maryjane",
          email: "maryjane@hotmail.com",
          password: "senha321",
        }),
      });
      expect(response.status).toBe(201);

      const responseWithDuplicatedUserName = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "Maryjane",
            email: "maryjane@gmail.com",
            password: "senha321",
          }),
        },
      );

      expect(responseWithDuplicatedUserName.status).toBe(400);

      const responseBodyDuplicatedUserName =
        await responseWithDuplicatedUserName.json();

      expect(responseBodyDuplicatedUserName).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        statusCode: 400,
      });
    });
  });
});
