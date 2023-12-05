import { z } from "zod";

export const LoginValidator = z.object({
    username: z.string().min(1, { message: "Nome de usuário é obrigatório" }),
    password: z.string().min(1, { message: "Informe uma senha" }),
});