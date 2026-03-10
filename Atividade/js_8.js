// Função que soma todos os números ímpares de 0 até n
function somaImpares(n){

    // Variável que acumula a soma
    let soma = 0;
    // Percorre os números de 0 até n
    for(let i = 0; i <= n; i++){
        // Verifica se o número é ímpar
        if(i % 2 != 0){
            // Se for ímpar, adiciona à soma
            soma += i;
        }
    }
    // Retorna o resultado da soma
    return soma;
}
// Executa a função com 526 e mostra o resultado no console
console.log("somaImpares" + "(" + somaImpares(526) + ")");