// Função que verifica se o valor é válido
function verificarNumero(numero){

    // Se o número for menor que 0, lança uma exceção
    if (numero < 0){
        throw new Error("Número não pode ser negativo");
    }
    // Se não houver erro
    return "Número válido";
}

try {
    // Chamada da função
    console.log(verificarNumero(-15));
} catch (erro) {
    // Captura e mostra o erro
    console.log("Erro:", erro.message);
}