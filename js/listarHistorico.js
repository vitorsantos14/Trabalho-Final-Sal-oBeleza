import { db } from './firebaseConfig.js'
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"

const listaDiv = document.getElementById("listar-historico")


async function buscarHistorico() {
    const dados = await getDocs(collection(db, "historico"))
    const historicos = []
    dados.forEach(doc => {
        historicos.push({ id: doc.id, ...doc.data() })
    })
    return historicos
}


function renderizarLista(historicos) {
    listaDiv.innerHTML = ""

    if (historicos.length === 0) {
        listaDiv.innerHTML = "<p>Nenhum histórico cadastrado.</p>"
        return
    }

    historicos.forEach(item => {
        const div = document.createElement("div")
        div.classList.add("historico-item")
        div.innerHTML = `
            <strong>Cliente:</strong> ${item.cliente} <br>
            <strong>Serviço:</strong> ${item.servico} <br>
            <strong>Produto:</strong> ${item.produto} <br>
            <button class="btnEditar" data-id="${item.id}">Editar</button>
            <button class="btnExcluir" data-id="${item.id}">Excluir</button>
            <hr>
        `
        listaDiv.appendChild(div)
    })

    adicionarEventos()
}


function adicionarEventos() {
    document.querySelectorAll(".btnExcluir").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id
            const confirmar = confirm("Tem certeza que deseja excluir?")
            if (!confirmar) return

            try {
                await deleteDoc(doc(db, "historico", id))
                alert("Histórico excluído com sucesso!")
                carregarHistorico()
            } catch (e) {
                console.error("Erro ao excluir:", e)
                alert("Erro ao excluir.")
            }
        })
    })

    document.querySelectorAll(".btnEditar").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id
            const ref = doc(db, "historico", id)
            const docSnap = await getDoc(ref)
            if (docSnap.exists()) {
                const dados = docSnap.data()
                document.getElementById("editar-cliente").value = dados.cliente
                document.getElementById("editar-servico").value = dados.servico
                document.getElementById("editar-produto").value = dados.produto
                document.getElementById("editar-id").value = id
                document.getElementById("formulario-edicao").style.display = "block"
            }
        })
    })
}


document.getElementById("btnSalvarEdicao").addEventListener("click", async () => {
    const id = document.getElementById("editar-id").value
    const novosDados = {
        cliente: document.getElementById("editar-cliente").value.trim(),
        servico: document.getElementById("editar-servico").value.trim(),
        produto: document.getElementById("editar-produto").value.trim()
    }

    if (!novosDados.cliente || !novosDados.servico || !novosDados.produto) {
        alert("Preencha todos os campos.")
        return
    }

    try {
        await updateDoc(doc(db, "historico", id), novosDados)
        alert("Histórico atualizado com sucesso!")
        document.getElementById("formulario-edicao").style.display = "none"
        carregarHistorico()
    } catch (e) {
        console.error("Erro ao editar:", e)
        alert("Erro ao editar histórico.")
    }
})


document.getElementById("btnCancelarEdicao").addEventListener("click", () => {
    document.getElementById("formulario-edicao").style.display = "none"
})


async function carregarHistorico() {
    listaDiv.innerHTML = "<p>Carregando histórico...</p>"
    const historicos = await buscarHistorico()
    renderizarLista(historicos)
}

document.addEventListener("DOMContentLoaded", carregarHistorico)
