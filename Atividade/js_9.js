// Função que recebe uma palavra (string) e retorna essa palavra invertida
function inverterPalavra(palavra){

    // Cria uma variável para armazenar a palavra invertida
    let invertida = "";
    // Percorre a palavra de trás para frente
    for(let i = palavra.length - 1; i >= 0; i--){

        // Adiciona cada letra ao final da variável invertida
        invertida += palavra[i];
    }
    // Retorna a palavra já invertida
    return invertida;
}

// Teste da função
console.log(inverterPalavra("javascript")); // Saída: "tpircsavaj"