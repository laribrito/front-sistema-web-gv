import toast from "react-hot-toast";
import { ZodRawShape, z } from "zod";

type ValidationError = {
    message: string;
};

function retornaPrimeiroErro(erros: ValidationError[] | null): string | null {
    if (erros && erros.length > 0) {
      return erros[0].message;
    }
    return null;
}


// Restrição adicional para garantir que 'T' satisfaça 'ZodRawShape'
type Validable<T> = T & ZodRawShape;

// Função genérica que aceita um validador do Zod e os dados a serem validados
export function validarDados<T extends ZodRawShape>(validator: z.ZodObject<T, any, any>, dados: T): T | undefined {
    const LoginCredentials = validator.safeParse(dados);
    if (!LoginCredentials.success) {  
      // Obter o primeiro erro e exibi-lo
      const primeiroErro = retornaPrimeiroErro(LoginCredentials.error.errors);
      if (primeiroErro) {
        toast.error(primeiroErro);
      }
    } else {
      // Dados válidos
      return dados;
    }
}