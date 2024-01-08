import { ShirtStyle, calcularInfosGrade } from "@/context/orderContext";

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

export function setMonetaryNumber(x: string) : number {
    //trata a virgula
    var value = x.replace(',', '.')

    //testa quantidade de números depois do ponto
    const split = value.split('.')[1]

    //ERRO - mais de 2 casas decimais
    if(split && split.length > 2){
        throw Error('No máximo duas casas decimais depois da vírgula')
    } 

    //tratando a string
    if(!split) {
        value += '00'
    } else if(split.length==1){
        value +='0'
    }

    return parseInt(value.replace('.', ''))
}

export function getMonetaryNumber(x: number) : number {
    return (x / 100)
}

export function getMonetaryString(x: number, withCifrao: boolean = true) : string {
    const value = getMonetaryNumber(x)
    if(withCifrao)
        return 'R$ ' + value
    return value.toString()
}

function countAllUnitsShirts(style: ShirtStyle) : number{
    var units = 0
    if(style.sizes){
        units += calcularInfosGrade(style.sizes).grandTotal
        
        if(style.specials){
            style.specials.forEach((caso)=>{
                if(caso.sizes) units += calcularInfosGrade(caso.sizes).grandTotal
            })
        }
    } 

    return units
}

export function countAllUnitsShirtsToString(style: ShirtStyle) : string{
    const units = countAllUnitsShirts(style)
    return QtdUnidadesPorExtenso(units)
}