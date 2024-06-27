const formulario = document.getElementById("formulario");
const input = document.getElementById("input");
const listaTarea = document.getElementById("lista-tareas");
const template = document.getElementById("template").content;
const fragment = document.createDocumentFragment();

let tareas = {};

document.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("tareas")) tareas = JSON.parse(localStorage.getItem("tareas"));
  pintarTareas();
});

listaTarea.addEventListener("click", (e) => {
  btnAccion(e);
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  setTarea(e);
});

const setTarea = (e) => {
  if (input.value.trim() === "") return console.log("No hay nada");
  const tarea = {
    id: Date.now(),
    texto: input.value,
    estado: false,
  };
  tareas[tarea.id] = tarea;

  formulario.reset();
  input.focus();

  pintarTareas();
};

const pintarTareas = () => {
  localStorage.setItem("tareas", JSON.stringify(tareas))

  if (Object.values(tareas).length === 0) {
    listaTarea.innerHTML = `
    <div class="alert alert-dark text-center">
    No hay tareas pendientes
    </div>`;

    return
  }
  listaTarea.innerHTML = "";
  Object.values(tareas).forEach((tarea) => {
    const clon = template.cloneNode(true);
    clon.querySelector("p").textContent = tarea.texto;
    if (tarea.estado) {
      clon
        .querySelector(".alert")
        .classList.replace("alert-warning", "alert-primary");
      clon
        .querySelectorAll(".fas")[0]
        .classList.replace("fa-check-circle", "fa-undo-alt");
      clon.querySelector("p").style.textDecoration = "line-through";
    }
    clon.querySelectorAll(".fas")[0].dataset.id = tarea.id;
    clon.querySelectorAll(".fas")[1].dataset.id = tarea.id;
    fragment.appendChild(clon);
  });
  listaTarea.appendChild(fragment);
};

const btnAccion = (e) => {
  if (e.target.classList.contains("fa-check-circle")) {
    tareas[e.target.dataset.id].estado = true;
    pintarTareas();
  }

  if (e.target.classList.contains("fa-minus-circle")) {
    delete tareas[e.target.dataset.id];
    pintarTareas();
  }

  if (e.target.classList.contains("fa-undo-alt")) {
    tareas[e.target.dataset.id].estado = false;
    pintarTareas();
  }

  e.stopPropagation();
};
