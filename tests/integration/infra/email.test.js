import email from "infra/email.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "FinTab <danielfccarvalho@hotmail.com>",
      to: "daafcarvalho@gmail.com",
      subject: "Teste de assunto",
      text: "Teste de corpo.",
    });

    await email.send({
      from: "FinTab <danielfccarvalho@hotmail.com>",
      to: "daafcarvalho@gmail.com",
      subject: "Segundo Email Teste de assunto",
      text: "Segundo Email Teste de corpo.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<danielfccarvalho@hotmail.com>");
    expect(lastEmail.recipients[0]).toBe("<daafcarvalho@gmail.com>");
    expect(lastEmail.subject).toBe("Segundo Email Teste de assunto");
    expect(lastEmail.text).toBe("Segundo Email Teste de corpo.\n");
  });
});
