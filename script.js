const form = document.querySelector('#formCadastro');
const buscarCep = document.querySelector('#buscarCep');
const cep = document.querySelector('#cep');
const estado = document.querySelector('#estado')

function mensagem(texto, tipo = "sucesso") {
    Toastify({
        text: texto,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: tipo === "sucesso"
            ? "#198754"
            : "#dc3545"
        },
    }).showToast();
}

// Adiciona um ouvinte de evento para o clique no botão "Buscar"
buscarCep.addEventListener("click", async function() {
    // Expressão regex
    const valor = cep.value.replace(/\D/g, ""); // Remove caracteres não numéricos
   if (valor.length !== 8) {
        alert("CEP inválido. Por favor, digite um CEP com 8 dígitos.");
        return;
    } try {
        const resposta = await fetch(`https://viacep.com.br/ws/${valor}/json/`);
        const dados = await resposta.json();
        console.log(dados);
        if (!resposta.ok || dados.erro) throw new Error("CEP não encontrado.");
        document.querySelector('#logradouro').value = dados.logradouro;
        document.querySelector('#bairro').value = dados.bairro;
        document.querySelector('#cidade').value = dados.localidade;
        document.querySelector('#estado').value = dados.uf;
        
        
    } catch (error) {
        Toastify({
            text: error.message || "Não foi possível buscar o CEP.",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "#dc3545",
                borderRadius: "12px"
            }
        }).showToast();
    }
});

// Adiciona um ouvinte de evento para o envio do formulário
form.addEventListener("submit", function(event) {
    event.preventDefault();
    console.log(Object.fromEntries([...form.elements]
        .filter(element => element.id)
        .map(element => [element.id, element.value])
    ));
    form.reset();
});

// Criar opções de seleção dinamicamente
function adicionarOpcao(select, texto, valor) {
    select.add(new Option(texto, valor));
}

// Carregar os estados disponíveis
async function carregarEstado() {
    try {
        const resposta = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
        if (!resposta.ok) {
            throw new Error("Não foi possível Carregar os estados.");
        }
        const estados = await resposta.json();
        estados.forEach(item => adicionarOpcao(estado, item.nome, item.sigla));
    } catch (erro) {
        mensagem(erro.message, "erro")
    }
}
carregarEstado()