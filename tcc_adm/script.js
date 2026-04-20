// Banner
const slides = document.querySelector(".slides")
const navLines = document.querySelectorAll(".nav-line")
const nextBtn = document.querySelector(".right")
const prevBtn = document.querySelector(".left")

let index = 1
const totalSlides = 4

slides.style.transform = `translateX(-100%)`

//Animaçao do banner
function updateSlider() {
    slides.style.transition = "transform .6s ease"
    slides.style.transform = `translateX(-${index * 100}%)`
    updateNav()
}

function updateNav() {
    navLines.forEach(line => line.classList.remove("active"))

    let navIndex = index - 1
    if (navIndex < 0) navIndex = totalSlides - 1
    if (navIndex >= totalSlides) navIndex = 0

    navLines[navIndex].classList.add("active")
}

function nextSlide() {
    index++
    if (index > totalSlides + 1) index = totalSlides + 1
    updateSlider()
}

function prevSlide() {
    index--
    if (index < 0) index = 0
    updateSlider()
}

//Muda o banner pro proximo
nextBtn.onclick = () => {
    nextSlide()
    resetAutoSlide()
}

//Muda o banner pro anterior
prevBtn.onclick = () => {
    prevSlide()
    resetAutoSlide()
}

navLines.forEach(line => {
    line.addEventListener("click", () => {
        index = Number(line.dataset.index)
        updateSlider()
        resetAutoSlide()
    })
})

slides.addEventListener("transitionend", () => {
    if (index === totalSlides + 1) {
        slides.style.transition = "none"
        index = 1
        slides.style.transform = `translateX(-100%)`
    }

    if (index === 0) {
        slides.style.transition = "none"
        index = totalSlides
        slides.style.transform = `translateX(-${index * 100}%)`
    }
})

//Define o intervalo entre a transicao dos banners
let autoSlide = setInterval(nextSlide, 5000)

//reseta tudo ao terminar os slides
function resetAutoSlide() {
    clearInterval(autoSlide)
    autoSlide = setInterval(nextSlide, 5000)
}

updateNav()

// filtrar e ordenar os produtos
const btnFilter = document.getElementById("btnFilter")
const btnOrganize = document.getElementById("btnOrganize")
const dropFilter = document.getElementById("dropFilter")
const dropOrganize = document.getElementById("dropOrganize")
const cards = document.querySelectorAll(".card2")
const container = document.querySelector(".products-grid")
const categories = document.getElementById("categories-title")

// filtrar produto (categorias)
btnFilter.onclick = () => {
    dropFilter.style.display =
        dropFilter.style.display === "flex" ? "none" : "flex"
    dropOrganize.style.display = "none"
}

// organizar o produto (tamanho, valor etc)
btnOrganize.onclick = () => {
    dropOrganize.style.display =
        dropOrganize.style.display === "flex" ? "none" : "flex"
    dropFilter.style.display = "none"
}

// filtra o produto
document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.onclick = () => {
        let filtro = btn.dataset.filter
        categories.textContent = btn.textContent
        cards.forEach(card => {
            if (filtro === "all") {
                card.style.display = "block"
            } else {
                card.style.display =
                    card.dataset.categoria === filtro ? "block" : "none"
            }
        })
    }
})

// ordena o produto
document.querySelectorAll("[data-sort]").forEach(btn => {
    btn.onclick = () => {
        let tipo = btn.dataset.sort
        let list = [...cards]
        if (tipo === "preco-menor") {
            list.sort((a, b) => a.dataset.preco - b.dataset.preco)
        }
        if (tipo === "preco-maior") {
            list.sort((a, b) => b.dataset.preco - a.dataset.preco)
        }
        if (tipo === "tamanho") {
            const ordem = { P: 1, M: 2, G: 3 }
            list.sort((a, b) =>
                ordem[a.dataset.tamanho] - ordem[b.dataset.tamanho]
            )
        }
        list.forEach(el => container.appendChild(el))
    }
})

// detecta se o dispositivo é mobile (com base nos pixels)
function isMobile() {
    return window.innerWidth <= 768
}

// popup do produto (NO PC APENAS)
const popup = document.getElementById("product-popup")
const popupContent = document.querySelector(".popup-content")

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []
let autoSlideImg = null // CORREÇÃO GLOBAL

function formatPrice(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",")
}

//função que cria o popup dos produtos
function criarPopup(card) {
    const nome = card.querySelector("h3").textContent
    const precoBase = Number(card.dataset.preco)

    // preço dos produtos
    const precos = {}
    if (card.dataset.precos) {
        card.dataset.precos.split(",").forEach(item => {
            const [tam, val] = item.split(":")
            if (tam && val) precos[tam] = Number(val)
        })
    }

    // estoqye
    const estoque = {}
    if (card.dataset.estoque) {
        card.dataset.estoque.split(",").forEach(item => {
            const [tam, val] = item.split(":")
            estoque[tam] = Number(val)
        })
    }

    // tamanho do produto
    const tamanhos = card.dataset.tamanhos.split(",")
    let tamanhoSelecionado = card.dataset.tamanho

    // estado/valor padrão
    let quantidade = 1
    let precoUnitario = precos[tamanhoSelecionado] ?? precoBase

    // =imagem dos produtos
    const imagens = card.dataset.imagens ? card.dataset.imagens.split(",") : ["imagens/ecobag.png"]

    let imgIndex = 0

    // html do popup dos produtos
    popupContent.innerHTML = `
        <button class="close-popup">&times;</button>

        <div class="popup-body">
            <div class="popup-left">
                <button class="img-arrow left">&#10094;</button>
                <img src="${imagens[0]}" class="popup-img">
                <button class="img-arrow right">&#10095;</button>
            </div>

            <div class="popup-right">
                <h2>${nome}</h2>
                <p class="price"></p>

                <div class="sizes">
                    <p>Selecionar tamanho:</p>
                    ${tamanhos.map(t => {
                        const semEstoque = estoque[t] === 0
                        return `
                            <button 
                                data-size="${t}" 
                                ${semEstoque ? "disabled" : ""}
                                class="${t === tamanhoSelecionado ? "active" : ""}">
                                ${t}
                            </button>
                        `
                    }).join("")}
                </div>

                <p class="stock"></p>

                <div class="quantity">
                    <p>Quantidade:</p>
                    <div class="qty-box">
                        <button class="qty-minus">-</button>
                        <span class="qty-value">1</span>
                        <button class="qty-plus">+</button>
                    </div>
                </div>

                <button class="buy">Comprar</button>
                <button class="cart-add">Adicionar ao carrinho</button>
            </div>
        </div>
    `

    // elementos do html
    const priceElement = document.querySelector(".price")
    const stockElement = document.querySelector(".stock")
    const sizeButtons = document.querySelectorAll(".sizes button")
    const cartBtn = document.querySelector(".cart-add")
    const buyBtn = document.querySelector(".buy")

    const qtyMinus = document.querySelector(".qty-minus")
    const qtyPlus = document.querySelector(".qty-plus")
    const qtyValue = document.querySelector(".qty-value")

    const img = document.querySelector(".popup-img")
    const left = document.querySelector(".img-arrow.left")
    const right = document.querySelector(".img-arrow.right")

    //atualiza o preço ao mudar a quantidade
    function atualizarPreco() {
        const total = precoUnitario * quantidade
        priceElement.textContent = formatPrice(total)
    }
    //atualiza a quantidade ao mudar de tamanho
    function atualizarQtdUI() {
        qtyValue.textContent = quantidade
    }
    //atualiza o estoque do produto
    function atualizarEstoque() {
        const qtd = estoque[tamanhoSelecionado] ?? 0
        stockElement.textContent =
            qtd > 0 ? `Em estoque: ${qtd}` : "Sem estoque"
    }
    //troca a imagem do produto
    function trocarImagem(novoIndex) {
        img.classList.add("fade")
        setTimeout(() => {
            imgIndex = novoIndex
            img.src = imagens[imgIndex]
            img.classList.remove("fade")
        }, 120)
    }
    //troca a imagem do produto automaticamente
    function iniciarAutoSlide() {
        clearInterval(autoSlideImg)
        autoSlideImg = setInterval(() => {
            trocarImagem((imgIndex + 1) % imagens.length)
        }, 3000)
    }

    // init
    atualizarPreco()
    atualizarQtdUI()
    atualizarEstoque()
    iniciarAutoSlide()

    // quantidade do produto
    qtyPlus.onclick = () => {
        const estoqueAtual = estoque[tamanhoSelecionado] ?? 0
        if (quantidade < estoqueAtual) {
            quantidade++
            atualizarQtdUI()
            atualizarPreco()
        }
    }

    qtyMinus.onclick = () => {
        if (quantidade > 1) {
            quantidade--
            atualizarQtdUI()
            atualizarPreco()
        }
    }

    // botoões de tamanho do produto
    sizeButtons.forEach(btn => {
        btn.onclick = () => {
            tamanhoSelecionado = btn.dataset.size

            sizeButtons.forEach(b => b.classList.remove("active"))
            btn.classList.add("active")

            precoUnitario = precos[tamanhoSelecionado] ?? precoBase

            quantidade = 1

            atualizarPreco()
            atualizarQtdUI()
            atualizarEstoque()
        }
    })

    // banner de imagens dos produtos
    left.onclick = () => {
        clearInterval(autoSlideImg)
        trocarImagem((imgIndex - 1 + imagens.length) % imagens.length)
        iniciarAutoSlide()
    }

    right.onclick = () => {
        clearInterval(autoSlideImg)
        trocarImagem((imgIndex + 1) % imagens.length)
        iniciarAutoSlide()
    }

    // carrinho
    cartBtn.onclick = () => {
        //impede que o usuario compre um produto sem estoque
        if (quantidade > (estoque[tamanhoSelecionado] ?? 0)) {
            cartBtn.textContent = "Estoque insuficiente"
            return
        }
        //adiciona os atributos do produto ao carrinho 
        carrinho.push({
            nome,
            tamanho: tamanhoSelecionado,
            preco: precoUnitario,
            quantidade: quantidade
        })
        //adiciona o produto ao carrinho
        localStorage.setItem("carrinho", JSON.stringify(carrinho))
        cartBtn.textContent = "Adicionado com sucesso"
    }

    // botao de comprar
    buyBtn.onclick = () => {
        //impede que o usuario compre um produto com um tamanho que não tenha estoque
        if ((estoque[tamanhoSelecionado] ?? 0) <= 0) {
            buyBtn.textContent = "Sem estoque"
            return
        }

        const produto = {
            nome,
            tamanho: tamanhoSelecionado,
            preco: precoUnitario,
            quantidade
        }
        //redireciona o usuario para o getway se ele clicar no botao de comprar
        localStorage.setItem("compraDireta", JSON.stringify(produto))
        window.location.href = "checkout.html"
    }

    //fecha o popup
    document.querySelector(".close-popup").onclick = fecharPopup
}
// Comprar produto (pelo o celular)
cards.forEach(card => {
    card.onclick = () => {
        if (isMobile()) {
            const nome = card.querySelector("h3").textContent
            const preco = card.dataset.preco
            // imagens vindas do produto
            let imagens = []
            if (card.dataset.imagens) {
                imagens = card.dataset.imagens.split(",")
            }
            localStorage.setItem("produto", JSON.stringify({
                nome,
                preco,
                imagens
            }))
            window.location.href = "produto.html"
            return
        }
        criarPopup(card)
        popup.classList.add("active")
        document.body.style.overflow = "hidden"
    }
})
function atualizarPreco() {
    const total = precoAtual * quantidade
    priceElement.textContent = formatPrice(total)
}
// Fecha o popup
function fecharPopup() {
    clearInterval(autoSlideImg)
    popup.classList.remove("active")
    document.body.style.overflow = "auto"
}
popup.addEventListener("click", (e) => {
    if (e.target === popup) fecharPopup()
})
// Pesquisa no mobile
const searchIcon = document.querySelector(".search-icon")
const mobileSearch = document.querySelector(".mobile-search")
searchIcon.onclick = () => {
    mobileSearch.style.display =
        mobileSearch.style.display === "block" ? "none" : "block"
}