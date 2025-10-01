import { db } from './../js/firebaseConfig.js'
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"




function getInputs() {
    return {
        cliente: document.getElementById('cliente'),
        servico: document.getElementById('servico'),
        produto: document.getElementById('produto')
    }
}

function getValores({ cliente, servico, produto }) {
    return {
        cliente: cliente.value.trim(),
        servico: servico.value.trim(),
        produto: produto.value.trim(),
        
    }
}

function limpar({ cliente, servico, produto }) {
    cliente.value = ''
    servico.value = ''
    produto.value = ''
}

document.getElementById("btnEnviar").addEventListener('click', async function () {
    const Inputs = getInputs()
    const dados = getValores(Inputs)

    console.log("Inputs:", Inputs)
    console.log("Dados:", dados)

    if (!dados.cliente || !dados.servico || !dados.produto) {
        alert("Preencha todos os campos.")
        return
    }

    try {
        const ref = await addDoc(collection(db, "historico"), dados)
        console.log("ID do documento", ref.id)
        limpar(Inputs)
        alert("Histórico cadastrado com sucesso!")
    } catch (e) {
        console.error("Erro: ", e)
        alert("Erro ao cadastrar histórico.")
    }
})
 document.getElementById("btnExcluir").addEventListener("click", async function () {
    if (!ultimoIdRegistrado) {
        alert("Nenhum histórico recente selecionado para excluir.")
        return
    }

    const confirmar = confirm("Tem certeza que deseja excluir este histórico?")
    if (!confirmar) return

    try {
        const docRef = doc(db, "historico", ultimoIdRegistrado)
        await deleteDoc(docRef)
        alert("Histórico excluído com sucesso!")
        limpar(getInputs())
        ultimoIdRegistrado = null
    } catch (e) {
        console.error("Erro ao excluir:", e)
        alert("Erro ao excluir histórico.")
    }
})


document.getElementById("btnEditar").addEventListener("click", async function () {
    if (!ultimoIdRegistrado) {
        alert("Nenhum histórico recente selecionado para editar.")
        return
    }

    const Inputs = getInputs()
    const novosDados = getValores(Inputs)

    if (!novosDados.cliente || !novosDados.servico || !novosDados.produto) {
        alert("Preencha todos os campos antes de editar.")
        return
    }

    try {
        const docRef = doc(db, "historico", ultimoIdRegistrado)
        await updateDoc(docRef, novosDados)
        alert("Histórico atualizado com sucesso!")
        limpar(Inputs)
        ultimoIdRegistrado = null;
    } catch (e) {
        console.error("Erro ao editar:", e)
        alert("Erro ao editar histórico.")
    }
})