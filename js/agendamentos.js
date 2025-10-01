import { db } from "../js/fireBaseConfig.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const form = document.getElementById("form-agendamento");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cliente = document.getElementById("cliente").value.trim();
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;

  if (!cliente || !servico || !data || !hora) {
    mensagem.textContent = " Preencha todos os campos!";
    return;
  }

  try {
    await addDoc(collection(db, "agendamentos"), { cliente, servico, data, hora });
    mensagem.textContent = " Agendamento salvo com sucesso!";
    form.reset();
  } catch (error) {
    mensagem.textContent = " Erro ao salvar agendamento.";
    console.error(error);
  }
});
