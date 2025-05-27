import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDataBase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymus user", () => {
    test("With nonexistent 'username'", async () => {
      const getByUserName = await fetch(
        "http://localhost:3000/api/v1/users/usuarioInexistente",
        {
          method: "PATCH",
        },
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

    test("With duplicated 'username'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "newuserapplication",
          email: "userapplication@hotmail.com",
          password: "senha321",
        }),
      });

      expect(user1Response.status).toBe(201);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@hotmail.com",
          password: "senha321",
        }),
      });

      expect(user2Response.status).toBe(201);

      const responseWithDuplicatedUserName = await fetch(
        "http://localhost:3000/api/v1/users/user2",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "newuserapplication",
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

    test("With duplicated 'email'", async () => {
      const userEmailResponse = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "useremail",
            email: "useremail@hotmail.com",
            password: "senha321",
          }),
        },
      );

      expect(userEmailResponse.status).toBe(201);

      const user2EmailResponse = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "email2User",
            email: "email2@hotmail.com",
            password: "senha321",
          }),
        },
      );

      expect(user2EmailResponse.status).toBe(201);

      const responseWithDuplicatedUserEmail = await fetch(
        "http://localhost:3000/api/v1/users/email2User",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "useremail@hotmail.com",
          }),
        },
      );

      expect(responseWithDuplicatedUserEmail.status).toBe(400);

      const responseBodyDuplicatedUserName =
        await responseWithDuplicatedUserEmail.json();

      expect(responseBodyDuplicatedUserName).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        statusCode: 400,
      });
    });

    test("With unique 'username'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueUser1",
          email: "uniqueUser1@hotmail.com",
          password: "senha321",
        }),
      });

      expect(user1Response.status).toBe(201);

      const responseWithDuplicatedUserName = await fetch(
        "http://localhost:3000/api/v1/users/uniqueUser1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueUser2",
          }),
        },
      );

      expect(responseWithDuplicatedUserName.status).toBe(200);

      const responseBodyDuplicatedUserName =
        await responseWithDuplicatedUserName.json();

      expect(responseBodyDuplicatedUserName).toEqual({
        id: responseBodyDuplicatedUserName.id,
        username: "uniqueUser2",
        email: "uniqueUser1@hotmail.com",
        password: responseBodyDuplicatedUserName.password,
        created_at: responseBodyDuplicatedUserName.created_at,
        updated_at: responseBodyDuplicatedUserName.updated_at,
      });

      expect(uuidVersion(responseBodyDuplicatedUserName.id)).toBe(4);
      expect(
        Date.parse(responseBodyDuplicatedUserName.created_at),
      ).not.toBeNaN();
      expect(
        Date.parse(responseBodyDuplicatedUserName.updated_at),
      ).not.toBeNaN();

      expect(
        responseBodyDuplicatedUserName.updated_at >
          responseBodyDuplicatedUserName.created_at,
      ).toBe(true);
    });

    test("With unique 'email'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueEmail1",
          email: "uniqueEmail1@hotmail.com",
          password: "senha321",
        }),
      });

      expect(user1Response.status).toBe(201);

      const responseWithDuplicatedUserName = await fetch(
        "http://localhost:3000/api/v1/users/uniqueEmail1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "uniqueEmail2@hotmail.com",
          }),
        },
      );

      expect(responseWithDuplicatedUserName.status).toBe(200);

      const responseBodyDuplicatedUserName =
        await responseWithDuplicatedUserName.json();

      expect(responseBodyDuplicatedUserName).toEqual({
        id: responseBodyDuplicatedUserName.id,
        username: "uniqueEmail1",
        email: "uniqueEmail2@hotmail.com",
        password: responseBodyDuplicatedUserName.password,
        created_at: responseBodyDuplicatedUserName.created_at,
        updated_at: responseBodyDuplicatedUserName.updated_at,
      });

      expect(uuidVersion(responseBodyDuplicatedUserName.id)).toBe(4);
      expect(
        Date.parse(responseBodyDuplicatedUserName.created_at),
      ).not.toBeNaN();
      expect(
        Date.parse(responseBodyDuplicatedUserName.updated_at),
      ).not.toBeNaN();

      expect(
        responseBodyDuplicatedUserName.updated_at >
          responseBodyDuplicatedUserName.created_at,
      ).toBe(true);
    });

    test("With new 'password'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "newPassword1",
          email: "newPassword1@hotmail.com",
          password: "newPassword1",
        }),
      });

      expect(user1Response.status).toBe(201);

      const responseWithDuplicatedUserName = await fetch(
        "http://localhost:3000/api/v1/users/newPassword1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "newPassword2",
          }),
        },
      );

      expect(responseWithDuplicatedUserName.status).toBe(200);

      const responseBodyDuplicatedUserName =
        await responseWithDuplicatedUserName.json();

      expect(responseBodyDuplicatedUserName).toEqual({
        id: responseBodyDuplicatedUserName.id,
        username: "newPassword1",
        email: "newPassword1@hotmail.com",
        password: responseBodyDuplicatedUserName.password,
        created_at: responseBodyDuplicatedUserName.created_at,
        updated_at: responseBodyDuplicatedUserName.updated_at,
      });

      expect(uuidVersion(responseBodyDuplicatedUserName.id)).toBe(4);
      expect(
        Date.parse(responseBodyDuplicatedUserName.created_at),
      ).not.toBeNaN();
      expect(
        Date.parse(responseBodyDuplicatedUserName.updated_at),
      ).not.toBeNaN();

      expect(
        responseBodyDuplicatedUserName.updated_at >
          responseBodyDuplicatedUserName.created_at,
      ).toBe(true);

      const userInDataBase = await user.findOneByUserName("newPassword1");
      const correctPasswordMatch = await password.compare(
        "newPassword2",
        userInDataBase.password,
      );

      const inorrectPasswordMatch = await password.compare(
        "newPassword1",
        userInDataBase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(inorrectPasswordMatch).toBe(false);
    });
  });
});
