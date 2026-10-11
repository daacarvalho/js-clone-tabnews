import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDataBase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () => {
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

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "daacarvalho",
        email: "danielfccarvalho@hotmail.com",
        features: ["read:activation_token"],
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
    });

    test("Receive activation email", async () => {
      const lastEmail = await orchestrator.getLastEmail();
      expect(lastEmail.sender).toBe("<contato@fintab.com.br>");
      expect(lastEmail.recipients[0]).toBe("<danielfccarvalho@hotmail.com>");
      expect(lastEmail.subject).toBe("Ative seu cadastro no Clone Fin Tab");
      expect(lastEmail.text).toContain("daacarvalho");
    });

    test("Activate user account", async () => {

    })

    test("Login", async () => {
        
    })

    test("Get user information", async () => {
        
    })

});
