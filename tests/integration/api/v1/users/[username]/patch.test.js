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
      await orchestrator.createUser({
        username: "newuserapplication",
      });

      await orchestrator.createUser({
        username: "user2",
      });

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
      await orchestrator.createUser({
        email: "useremail@hotmail.com",
      });

      const createdUser = await orchestrator.createUser({
        email: "email2@hotmail.com",
      });

      const responseWithDuplicatedUserEmail = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
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
      const userToUpdate = await orchestrator.createUser();

      const responseWithDuplicatedUserName = await fetch(
        `http://localhost:3000/api/v1/users/${userToUpdate.username}`,
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
        email: `${userToUpdate.email}`,
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
      const userToUpdate = await orchestrator.createUser();

      const responseWithDuplicatedUserName = await fetch(
        `http://localhost:3000/api/v1/users/${userToUpdate.username}`,
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
        username: `${userToUpdate.username}`,
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
      const userToUpdatePassword = await orchestrator.createUser();

      const responseWithDuplicatedUserName = await fetch(
        `http://localhost:3000/api/v1/users/${userToUpdatePassword.username}`,
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

      console.log(responseBodyDuplicatedUserName);

      expect(responseBodyDuplicatedUserName).toEqual({
        id: responseBodyDuplicatedUserName.id,
        username: `${userToUpdatePassword.username}`,
        email: `${userToUpdatePassword.email}`,
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

      const userInDataBase = await user.findOneByUserName(
        userToUpdatePassword.username,
      );
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
