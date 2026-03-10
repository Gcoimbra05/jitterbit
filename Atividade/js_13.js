// Função que verifica se o usuário pode acessar a plataforma
function acessoPlataforma(idade, admin, bloqueado){

    // Verifica se é maior de idade OU é administrador
    // E também se NÃO está bloqueado
    if ((idade >= 18 || admin) && !bloqueado){
        console.log("Acesso permitido");
    } else {
        console.log("Acesso negado");
    }

}

// Exemplo de uso da função
acessoPlataforma(20, false, false); // Saída: "Acesso permitido"