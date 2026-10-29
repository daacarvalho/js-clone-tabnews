import email from 'infra/email';
import database from 'infra/database';
import webserver from 'infra/webserver';

async function findOneByUserId(userId) {
    const newToken = await runSelectQuery(userId);
    return newToken;

    async function runSelectQuery(userId) {
        const results = await database.query({
            text: "SELECT * FROM user_activation_tokens WHERE user_id = $1 LIMIT 1",
            values: [userId]
        });

        return results.rows[0];
    }
}

async function create(userId) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    const activationToken = await runInsertQuery(userId, expiresAt);

    return activationToken;

    async function runInsertQuery(userId, expiresAt) {
        
        const results = await database.query({
            text: "INSERT INTO user_activation_tokens (user_id, expires_at) VALUES ($1, $2) RETURNING *",
            values: [userId, expiresAt]
        })

        return results.rows[0];
    }
}

async function sendEmailToUser(userObject, activationToken) {
    await email.send({
        from: "FinTab <contato@fintab.com.br>",
        to: userObject.email,
        subject: "Ative seu cadastro no Clone Fin Tab",
        text: `Olá ${userObject.username},\n\nPara ativar seu cadastro, clique no link abaixo:\n\n${webserver.origin}/cadastro/ativar/${activationToken.id}\n\nAtenciosamente,\nEquipe Clone Fin Tab`
    });
}

const activation = {
    create,
    sendEmailToUser,
    findOneByUserId
};

export default activation;