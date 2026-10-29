import orchestrator from "tests/orchestrator.js";
import activation from "models/activation.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDataBase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () => {
  let createUserResponseBody;
  test("Create user account", async () => {
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

      createUserResponseBody = await response.json();

      expect(createUserResponseBody).toEqual({
        id: createUserResponseBody.id,
        username: "daacarvalho",
        email: "danielfccarvalho@hotmail.com",
        features: ["read:activation_token"],
        password: createUserResponseBody.password,
        created_at: createUserResponseBody.created_at,
        updated_at: createUserResponseBody.updated_at,
      });
    });

    test("Receive activation email", async () => {
      const lastEmail = await orchestrator.getLastEmail();

      const activationToken = await activation.findOneByUserId(createUserResponseBody.id);

      expect(lastEmail.sender).toBe("<contato@fintab.com.br>");
      expect(lastEmail.recipients[0]).toBe("<danielfccarvalho@hotmail.com>");
      expect(lastEmail.subject).toBe("Ative seu cadastro no Clone Fin Tab");
      expect(lastEmail.text).toContain("daacarvalho");
      expect(lastEmail.text).toContain(activationToken.id);

      console.log("Last email text:", lastEmail.text);
    });

    test("Activate user account", async () => {

    })

    test("Login", async () => {
        
    })

    test("Get user information", async () => {
        
    })

});
