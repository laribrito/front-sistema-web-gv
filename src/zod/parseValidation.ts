import toast from "react-hot-toast";
import { ZodIssue, ZodRawShape, z } from "zod";

type ValidationError = {
    message: string;
};

export type ReturnValidator = {
  success: boolean
  data: ZodIssue[] | object
}

function retornaPrimeiroErro(erros: ValidationError[] | null): string | null {
    if (erros && erros.length > 0) {
      return erros[0].message;
    }
    return null;
}

// Função genérica que aceita um validador do Zod e os dados a serem validados
export function validarDados<T extends ZodRawShape>(validator: z.ZodObject<T, any, any>, dados: T, toToast: boolean = false): ReturnValidator {
    const dadosValidados = validator.safeParse(dados);
    if (!dadosValidados.success) {  
      // Obter o primeiro erro e exibi-lo
      const primeiroErro = retornaPrimeiroErro(dadosValidados.error.errors);
      if (primeiroErro && toToast) {
        toast.error(primeiroErro);
      }

      return {
        success: false,
        data: dadosValidados.error.issues
      }
    } else {
      // Dados válidos
      return {
        success: true,
        data: dados
      }
    }
}