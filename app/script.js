/* Variável global para armazenar todos os produtos */
let todosProdutos = [];

/* Função para obter produtos de um arquivo JSON */
async function getProdutos() {
    try {
        const response = await fetch('dados.json');
        const data = await response.json();
        console.log('Dados obtidos:', data);
        
        todosProdutos = data;
        
        return data;
    } catch (error) {
        console.error('Erro ao obter produtos:', error);
        throw error;
    }
}

/* Função para mostrar produtos na tela */
async function mostrarProdutos() {
    try {
        await getProdutos();
        const containerProdutos = document.querySelector('.produtos');
        
        if (todosProdutos.length === 0) {
            containerProdutos.textContent = 'Sem Produto no Estoque';
        } else {
            todosProdutos.forEach(criarCardProduto);
        }
    } catch (error) {
        console.error('Erro ao obter produtos:', error);
    }
}

/* Função para criar um card de produto */
async function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.classList.add('card');

    const imagem = document.createElement('img');
    
    /* Verifica se o produto tem uma imagem */
    if (produto.imagem) {
        if (produto.imagem instanceof File) {
            const reader = new FileReader();
            reader.onload = function () {
                imagem.src = reader.result;
            };
            reader.readAsDataURL(produto.imagem);
        } else {
            imagem.src = produto.imagem;
        }
    } else {
        imagem.src = 'placeholder_imagem.png'; 
    }
    imagem.alt = 'Imagem do produto';

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('card-container--info');

    const nomeProduto = document.createElement('p');
    nomeProduto.textContent = produto.produto;
   
    const valorProduto = document.createElement('div');
    valorProduto.classList.add('card-container--value');

    const valor = document.createElement('p');
    valor.textContent = `R$ ${produto.valor.toFixed(2)}`;

    const lixoIcon = document.createElement('img');
    lixoIcon.classList.add('lixo');
    lixoIcon.src = 'img/lixo.png';
    lixoIcon.alt = 'Ícone de eliminação';

    valorProduto.appendChild(valor);
    valorProduto.appendChild(lixoIcon);

    infoContainer.appendChild(nomeProduto);
    infoContainer.appendChild(valorProduto);

    card.appendChild(imagem);
    card.appendChild(infoContainer);

    const containerProdutos = document.querySelector('.produtos');
    containerProdutos.id = 'todosProdutos';

    containerProdutos.appendChild(card);

    /* Evento para excluir um produto */
    lixoIcon.addEventListener('click', async () => {
        try {
            const confirmacao = confirm("Tem certeza que deseja excluir este produto?");
            if (confirmacao) {
                card.remove();
                const produtosRestantes = containerProdutos.querySelectorAll('.card');
                if (produtosRestantes.length === 0) {
                    containerProdutos.textContent = 'Sem Produto no Estoque';
                }
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    });
}

/* Manipulação do formulário de adição de produtos */
const formProduto = document.getElementById("form-produto");

formProduto.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const nome = document.getElementById("nome").value;
        const valor = parseFloat(document.getElementById("valor").value);
        const imagem = document.getElementById("imagem").files[0];

        const novoProduto = {
            produto: nome,
            valor: valor,
            imagem: imagem,
        };

        todosProdutos.push(novoProduto);

        formProduto.reset();

        await criarCardProduto(novoProduto);

        /* Mensagem de sucesso */
        const sucessoSpan = document.createElement("span");
        sucessoSpan.textContent = "Produto inserido com sucesso";
        sucessoSpan.style.color = "blue"; 
        formProduto.appendChild(sucessoSpan);

        setTimeout(() => {
            formProduto.removeChild(sucessoSpan);
        }, 3000); 
    } catch (error) {
        console.error("Erro ao adicionar novo produto:", error);
    }
});

/* Inicializa a exibição dos produtos ao carregar a página */
mostrarProdutos();
