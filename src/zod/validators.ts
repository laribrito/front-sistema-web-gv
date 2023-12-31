import { z } from "zod";

export const LoginValidator = z.object({
    username: z.string().min(1, { message: "Nome de usuário é obrigatório" }),
    password: z.string().min(1, { message: "Informe uma senha" }),
});

const maxNomePedido = 60
const maxNomeCliente = 50
const maxTelefoneCliente = 16
export const NewOrder1Validator = z.object({
    nomePedido: z.string()
        .min(1, { message: "Nome do pedido é obrigatório" })
        .max(maxNomePedido, { message: `Nome do pedido não pode ter mais de ${maxNomePedido} caracteres` }),
    nomeCliente: z.string()
        .min(1, { message: "Nome do cliente é obrigatório" })
        .max(maxNomeCliente, { message: `Nome do cliente não pode ter mais de ${maxNomeCliente} caracteres` }),
    telefoneCliente: z.string()
        .min(1, { message: "Telefone do cliente é obrigatório" })
        .max(maxTelefoneCliente, { message: `Telefone do cliente não pode ter mais de ${maxTelefoneCliente} caracteres` }),
    empresa: z.string(),
    classificacao: z.string(),
    status: z.string(),
});

export const novaCamisaValidator = z.object({
    printName: z.string().min(1, {message: 'Nome da Estampa é obrigatório'}),
    shirtModeling: z.string(),
    printingTechnique: z.string().min(1, {message: 'Técnica de impressão é obrigatório'}),
    printingColors: z.string().min(1, {message: 'Cores da estampa são obrigatório'}),
    printingPositions: z.string().min(1, {message: 'Posições da estampa são obrigatório'}),
    sleeveColor: z.string(),
    cuffStyle: z.string(),
    specialElement: z.string(),
    sizeAdjustment: z.string(),
})

export const newDetailing01 = z.object({
    shirtCollar: z.string().min(1, {message: 'Gola é obrigatório'}),
    printingTechnique: z.string().min(1, {message: 'Técnica de impressão é obrigatório'}),
    printingColors: z.string().min(1, {message: 'Cores da estampa são obrigatório'}),
    printingPositions: z.string().min(1, {message: 'Posições da estampa são obrigatório'}),
    sleeveColor: z.string(),
    cuffStyle: z.string(),
    specialElement: z.string(),
})