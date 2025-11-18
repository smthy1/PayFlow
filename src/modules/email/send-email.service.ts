import resend from "./resend.client.js";
import { type EmailToResetPassword } from "./send-email.schemas.js";

export async function sendEmailToResetPassword(emailToResetPassword: EmailToResetPassword) {
    const { email, resetLink } = emailToResetPassword;
    
    const { data, error } = await resend.emails.send({
        from: "PayFlow <onboarding@resend.dev>",
        to: email,
        subject: "PayFlow - Redefinição de senha",
        html: `
            <h2>Redefinir senha</h2>
            <p>Clique no link abaixo para redefinir sua senha. O link expira em 15 minutos.</p>
      
            <p>
                <a href="${resetLink}" 
                    style="display:inline-block;background:#4f46e5;color:white;
                        padding:10px 16px;border-radius:8px;text-decoration:none;">
                    Redefinir senha
                </a>
            </p>

            <p>Ou copie e cole este link no navegador:</p>
            <p>${resetLink}</p>
        `,
    });

    if(error) {
        return { error: `Erro ao enviar email ${error}` };
    }

    return data;
}