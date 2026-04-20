const data = JSON.parse(localStorage.getItem("produto"))

const nomeEl = document.getElementById("produto-nome")
const precoEl = document.getElementById("produto-preco")
const imgEl = document.getElementById("produto-img")
const select = document.getElementById("produto-tamanho")

nomeEl.textContent = data.nome

const precos = data.precos || {}
let precoAtual = data.preco

function atualizarPreco() {
    const tamanho = select.value
    precoAtual = precos[tamanho] ?? data.preco
    precoEl.textContent = "R$ " + Number(precoAtual).toFixed(2).replace(".", ",")
}

select.onchange = atualizarPreco
atualizarPreco()

const imagens = data.imagens || [
    "https://via.placeholder.com/400?text=1",
    "https://via.placeholder.com/400?text=2",
    "https://via.placeholder.com/400?text=3"
]

let imgIndex = 0

const left = document.querySelector(".img-arrow.left")
const right = document.querySelector(".img-arrow.right")

function trocarImg() {
    imgEl.classList.add("fade")

    setTimeout(() => {
        imgEl.src = imagens[imgIndex]
        imgEl.classList.remove("fade")
    }, 200)
}

left.onclick = () => {
    imgIndex = (imgIndex - 1 + imagens.length) % imagens.length
    trocarImg()
}

right.onclick = () => {
    imgIndex = (imgIndex + 1) % imagens.length
    trocarImg()
}

// AUTO SLIDE
setInterval(() => {
    imgIndex = (imgIndex + 1) % imagens.length
    trocarImg()
}, 3000)