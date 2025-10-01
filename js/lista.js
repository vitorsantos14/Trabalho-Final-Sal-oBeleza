import { db } from "../js/fireBaseConfig.js";
import { collection, getDocs, doc, deleteDoc, setDoc, getDoc } 
  from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const listaAgendamentosDiv = document.getElementById("lista-agendamentos");
let edicao = null; // Variável global para edição

async function buscarAgendamentos() {
  const snapshot = await getDocs(collection(db, "agendamentos"));
  const agendamentos = [];
  snapshot.forEach(docSnap => {
    agendamentos.push({ id: docSnap.id, ...docSnap.data() });
  });
  return agendamentos;
}


async function carregarListaDeAgendamentos() {
  listaAgendamentosDiv.innerHTML = "<p>Carregando agendamentos...</p>";

  try {
    const agendamentos = await buscarAgendamentos();
    renderizarListaDeAgendamentos(agendamentos);
  } catch (erro) {
    console.log("Erro ao carregar agendamentos:", erro);
    listaAgendamentosDiv.innerHTML = "<p>Erro ao carregar agendamentos.</p>";
  }
}


function renderizarListaDeAgendamentos(agendamentos) {
  listaAgendamentosDiv.innerHTML = "";

  if (agendamentos.length === 0) {
    listaAgendamentosDiv.innerHTML = "<p>Nenhum agendamento cadastrado ainda ;(</p>";
    return;
  }

  for (let ag of agendamentos) {
    const agDiv = document.createElement("div");
    agDiv.classList.add("agendamento-item");
    agDiv.innerHTML = `
      <strong>Cliente:</strong> ${ag.cliente} <br>
      <strong>Serviço:</strong> ${ag.servico} <br>
      <strong>Data:</strong> ${ag.data} <br>
      <strong>Hora:</strong> ${ag.hora} <br>
      <button class="btn-Excluir" data-id="${ag.id}">Excluir</button>
      <button class="btn-Editar" data-id="${ag.id}">Editar</button>
    `;
    listaAgendamentosDiv.appendChild(agDiv);
  }

  addEventListeners();
}

async function excluirAgendamento(id) {
  try {
    await deleteDoc(doc(db, "agendamentos", id));
    console.log("Agendamento excluído:", id);
    return true;
  } catch (erro) {
    console.log("Erro ao excluir agendamento:", erro);
    alert("Erro ao excluir agendamento.");
    return false;
  }
}

async function buscarAgendamentoPorId(id) {
  try {
    const docSnap = await getDoc(doc(db, "agendamentos", id));
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
  } catch (erro) {
    console.log("Erro ao buscar agendamento:", erro);
    return null;
  }
}

async function lidarClique(event) {
  const btnExcluir = event.target.closest(".btn-Excluir");
  const btnEditar = event.target.closest(".btn-Editar");

  if (btnExcluir) {
    const id = btnExcluir.dataset.id;
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      const sucesso = await excluirAgendamento(id);
      if (sucesso) carregarListaDeAgendamentos();
    }
  }

  if (btnEditar) {
    const id = btnEditar.dataset.id;
    const ag = await buscarAgendamentoPorId(id);
    if (!ag) return;

    edicao = {
      cliente: document.getElementById("editar-cliente"),
      servico: document.getElementById("editar-servico"),
      data: document.getElementById("editar-data"),
      hora: document.getElementById("editar-hora"),
      id: document.getElementById("editar-id"),
      formulario: document.getElementById("form-edicao")
    };

    edicao.cliente.value = ag.cliente;
    edicao.servico.value = ag.servico;
    edicao.data.value = ag.data;
    edicao.hora.value = ag.hora;
    edicao.id.value = ag.id;

    edicao.formulario.style.display = "block";
  }
}


document.getElementById("btnSalvarEdicao").addEventListener("click", async () => {
  const id = edicao.id.value;
  const novosDados = {
    cliente: edicao.cliente.value.trim(),
    servico: edicao.servico.value.trim(),
    data: edicao.data.value,
    hora: edicao.hora.value
  };

  try {
    await setDoc(doc(db, "agendamentos", id), novosDados);
    alert("Agendamento atualizado com sucesso!");
    edicao.formulario.style.display = "none";
    carregarListaDeAgendamentos();
  } catch (erro) {
    console.log("Erro ao atualizar agendamento:", erro);
    alert("Erro ao atualizar agendamento.");
  }
});


document.getElementById("btnCancelarEdicao").addEventListener("click", () => {
  edicao.formulario.style.display = "none";
});


function addEventListeners() {
  listaAgendamentosDiv.addEventListener("click", lidarClique);
}


document.addEventListener("DOMContentLoaded", carregarListaDeAgendamentos);
