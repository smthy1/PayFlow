import 'dotenv/config'
import { Resend } from "resend";

if(!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY não encontrada");

const resend = new Resend(process.env.RESEND_API_KEY as string);

export default resend;