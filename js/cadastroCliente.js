import { db } from './firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function getInput(){
    return {
        nome: document.getElementById("nome"),
        email: document.getElementById("email"),
        telefone: document.getElementById("telefone")
    }
}

function getValores({nome, email, telefone}){
    return {
        nome: nome.value.trim(),
        email: email.value.trim(),
        telefone: telefone.value.trim()
    }
}

document.getElementById("btnEnviar").addEventListener("click", async function (){
    const Inputs = getInput()
    const dados = getValores(Inputs)

    if (!dados.nome || !dados.email || !dados.telefone) {
        alert("Todos os campos devem ser preenchidos!")
        return
    }

    try{
        const ref = await addDoc(collection(db, "clientes"), dados)
        console.log("ID do documento", ref.id)
        alert("Cliente cadastrado com sucesso.")
    } catch (e){
        console.log("Erro:", e)
    }
})
