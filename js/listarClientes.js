import { db } from "./firebaseConfig.js"
import { getDoc, getDocs, collection, doc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

async function buscarClientes() {
    const dadosBanco = await getDocs(collection(db, "clientes"))
    const clientes = []
    for (const doc of dadosBanco.docs){
        clientes.push({id: doc.id, ...doc.data()})
    }
    return clientes;
}

const listaClienteDiv = document.getElementById("listar-clientes");

async function carregarListaDeClientes() {
    listaClienteDiv.innerHTML = '<p> Carregando Lista de Clientes... </p>'
    try{
        const clientes = await buscarClientes()
        renderizarListaDeClientes(clientes)
    }catch (error) {
        console.log("Erro ao carregar clientes: ", error);
        listaClienteDiv.innerHTML = '<p> Erro ao carregar lista </p>'
    }
}

function renderizarListaDeClientes(clientes){
    listaClienteDiv.innerHTML = ""

    if(clientes.length === 0){
        listaClienteDiv.innerHTML = '<p> Nenhum cliente cadastrado ainda! </p>'
        return
    }

    for (let cliente of clientes){
        const clienteDiv = document.createElement("div");
        clienteDiv.classList.add('funcionario-item');
        clienteDiv.innerHTML = ` 
        <strong>Nome:</strong> ${cliente.nome} <br>
        <strong>Email:</strong> ${cliente.email} <br>
        <strong>Telefone:</strong> ${cliente.telefone} <br>
        <button class="btn-Excluir" data-id="${cliente.id}">Excluir</button>
        <button class="btn-Editar" data-id="${cliente.id}">Editar</button>
        `
        listaClienteDiv.appendChild(clienteDiv)
    } 
    addEventListener();
}

async function excluirCliente(idCliente) {
    try{
        const documentoDeletar = doc(db, "clientes", idCliente);
        await deleteDoc(documentoDeletar)
        return true;
    }catch (erro){
        console.log("Erro ao excluir cliente", erro)
        alert("Erro ao excluir cliente.")
        return false;
    }
}

let edicao = null;

async function lidarClique(evento) {
    const btnExcluir = evento.target.closest('.btn-Excluir')
    if(btnExcluir){
        if(confirm("Deseja realmente excluir este cliente?")){
            const idCliente = btnExcluir.dataset.id;
            const ok = await excluirCliente(idCliente)
            if(ok) carregarListaDeClientes();
        }
    }

    const btnEditar = evento.target.closest('.btn-Editar')
    if (btnEditar){
        const idCliente = btnEditar.dataset.id
        const cliente = await buscarClientePorId(idCliente)

        edicao = getValoresEditar()
        edicao.editarNome.value = cliente.nome
        edicao.editarEmail.value = cliente.email
        edicao.editarTelefone.value = cliente.telefone
        edicao.editarId.value = cliente.id

        edicao.formularioEdicao.style.display = 'block'
    }
}

function getValoresEditar() {
    return {
        editarNome: document.getElementById("editar-nome"),
        editarEmail: document.getElementById("editar-email"),
        editarTelefone: document.getElementById("editar-telefone"),
        editarId: document.getElementById("editar-id"),
        formularioEdicao: document.getElementById("formulario-edicao")
    }
}

async function buscarClientePorId(id) {
    try{
        const clienteDoc = doc(db, "clientes", id)
        const dadoAtual = await getDoc(clienteDoc)
        if (dadoAtual.exists()){
            return {id: dadoAtual.id, ...dadoAtual.data()}
        }
        return null;
    } catch (erro){
        console.log("Erro ao buscar cliente", erro)
        return null
    }
}

document.getElementById("btnSalvarEdicao").addEventListener("click", async () => {
    const id = edicao.editarId.value;
    const novosDados = {
        nome: edicao.editarNome.value.trim(),
        email: edicao.editarEmail.value.trim(),
        telefone: edicao.editarTelefone.value.trim(),
    }

    try{
        const ref = doc(db, "clientes", id)
        await setDoc(ref, novosDados)
        alert("Cliente atualizado com sucesso!")
        edicao.formularioEdicao.style.display = 'none'
        carregarListaDeClientes();
    } catch (error){
        alert("Erro ao atualizar cliente.")
    }
})

document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
    document.getElementById("formulario-edicao").style.display = 'none'
})

function addEventListener(){
    listaClienteDiv.addEventListener("click", lidarClique)
}

document.addEventListener("DOMContentLoaded", carregarListaDeClientes)
