export function QtdUnidadesPorExtenso(qtd: number){
    return `${qtd} ${qtd === 1 ? "Unidade" : "Unidades"}`;
}

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toUpperCase(text: string): string {
    return text
        .split(" ")
        .map((word) => capitalize(word))
        .join(" ");
}

export function stringAleatoria(tamanho: number): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let resultado = '';
    for (let i = 0; i < tamanho; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres.charAt(indice);
    }
    return resultado;
}