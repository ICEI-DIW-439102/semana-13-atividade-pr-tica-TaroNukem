const API_URL = "http://localhost:3000/autores";

async function fetchItems() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Erro ao buscar autores.");
        }

        return await response.json();

    } catch (erro) {
        console.error(erro);
        return [];
    }
}


function createCard(autor) {

    const card = document.createElement("div");

    card.className = "card-livro";

    card.innerHTML = `
        <img src="${autor.imagem}" alt="${autor.nome}">

        <h2>${autor.nome}</h2>

        <p>${autor.descricaoCurta}</p>

        <p><strong>${autor.categoria}</strong></p>

        <p>Valor: ${autor.valor}</p>

        <a href="detalhes.html?id=${autor.id}">
            Ver Perfil
        </a>
    `;

    return card;
}


function renderCards(autores) {

    const lista = document.getElementById("lista-autores");

    if (!lista) return;

    lista.innerHTML = "";

    autores.forEach(autor => {
        lista.appendChild(createCard(autor));
    });

}


function iniciarSlider(autores) {

    const slideContainer = document.getElementById("slide-container");

    if (!slideContainer) return;

    const destaques = autores.filter(
        autor => autor.destaque
    );

    let indice = 0;

    function mostrarSlide() {

        const autor = destaques[indice];

        slideContainer.innerHTML = `
            <div class="slide-card">

                <img src="${autor.imagem}" alt="${autor.nome}">

                <div class="slide-info">

                    <h2>${autor.nome}</h2>

                    <p>${autor.descricaoCurta}</p>

                    <a href="detalhes.html?id=${autor.id}">
                        Ver Perfil
                    </a>

                </div>

            </div>
        `;

    }

    mostrarSlide();

    document.getElementById("proximo")?.addEventListener("click", () => {

        indice++;

        if (indice >= destaques.length) {
            indice = 0;
        }

        mostrarSlide();

    });

    document.getElementById("anterior")?.addEventListener("click", () => {

        indice--;

        if (indice < 0) {
            indice = destaques.length - 1;
        }

        mostrarSlide();

    });

}


async function carregarHome() {

    const lista = document.getElementById("lista-autores");

    if (!lista) return;

    const autores = await fetchItems();

    renderCards(autores);

    iniciarSlider(autores);

}


async function carregarDetalhes() {

    const detalhes = document.getElementById("detalhes");

    if (!detalhes) return;

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        detalhes.innerHTML = "<h2>ID não informado.</h2>";

        return;

    }

    try {

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {

            detalhes.innerHTML = "<h2>Autor não encontrado.</h2>";

            return;

        }

        const autor = await response.json();

        detalhes.innerHTML = `
            <div class="perfil-detalhe">

                <img src="${autor.imagem}" alt="${autor.nome}">

                <div>

                    <h1>${autor.nome}</h1>

                    <p>${autor.descricaoCompleta}</p>

                    <p>
                        <strong>Nascimento:</strong>
                        ${autor.nascimento}
                    </p>

                    <p>
                        <strong>Nacionalidade:</strong>
                        ${autor.nacionalidade}
                    </p>

                    <p>
                        <strong>Movimento:</strong>
                        ${autor.movimento}
                    </p>

                    <p>
                        <strong>Categoria:</strong>
                        ${autor.categoria}
                    </p>

                    <p>
                        <strong>Valor:</strong>
                        ${autor.valor}
                    </p>

                    <p>
                        <strong>Tags:</strong>
                        ${autor.tags.join(", ")}
                    </p>

                </div>

            </div>
        `;

        const livros = document.getElementById("livros");

        livros.innerHTML = "";

        autor.livros.forEach(livro => {

            livros.innerHTML += `
                <div class="card-livro">

                    <img src="${livro.imagem}" alt="${livro.titulo}">

                    <h3>${livro.titulo}</h3>

                    <p>${livro.descricao}</p>

                </div>
            `;

        });

    } catch (erro) {

        console.error(erro);

        detalhes.innerHTML = "<h2>Erro ao carregar autor.</h2>";

    }

}


document.addEventListener("DOMContentLoaded", () => {

    carregarHome();

    carregarDetalhes();

});