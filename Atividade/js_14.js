/*SINTAXE
try {
    // código que pode gerar erro
} catch (erro) {
    // código executado se ocorrer um erro
}
*/

// Exemplo de uso do try-catch
try {
    // Tenta acessar uma variável que não existe
    console.log(variavelInexistente);
} catch (erro) {
    // Exibe uma mensagem de erro personalizada
    console.log("Ocorreu um erro: " + erro.message);
}