  const projetos = document.querySelectorAll(".projeto-card");
  const botao = document.getElementById("verTodosBtn");
  const limite = 8;

  if (projetos.length > limite) {
    botao.style.display = "block";

    projetos.forEach((projeto, index) => {
      if (index >= limite) {
        projeto.classList.add("hidden");
      }
    });
  }

  botao.addEventListener("click", () => {
    projetos.forEach(projeto => projeto.classList.remove("hidden"));
    botao.style.display = "none";
  });