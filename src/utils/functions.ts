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
  