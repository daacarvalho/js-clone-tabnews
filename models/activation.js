import email from 'infra/email';

async function sendEmailToUser(userObject) {
    await email.send({
        from: "FinTab <contato@fintab.com.br>",
        to: userObject.email,
        subject: "Ative seu cadastro no Clone Fin Tab",
        text: `Olá ${userObject.username},\n\nPara ativar seu cadastro, clique no link abaixo:\n\nhttp://localhost:3000/activate?token=${userObject.activation_token}\n\nAtenciosamente,\nEquipe Clone Fin Tab`
    });
}

const activation = {
    sendEmailToUser,
};

export default activation;