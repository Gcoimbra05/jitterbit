/*ForEach 
Percorre cada usuário e mostra o nome */
usuarios.forEach(function(usuario){
    console.log(usuario.nome);
});

/* Map
Cria um novo array apenas com os nomes */
let nomes = usuarios.map(function(usuario){
    return usuario.nome;
});
console.log(nomes);

/* for...of 
Percorre o array e mostra nome e idade */
for (let usuario of usuarios) {
    console.log(usuario.nome, usuario.idade);
}