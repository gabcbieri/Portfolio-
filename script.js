const projetos = document.querySelectorAll('.projeto-card[data-filtravel="true"]');
const gruposTecnologias = document.querySelectorAll(".projeto-tecnologias");
const botaoVerTodos = document.getElementById("verTodosBtn");
const botoesFiltro = document.querySelectorAll(".filtro-btn");
const secoesAnimadas = document.querySelectorAll(".sobre, .projetos, .contato, .codigo");
const limiteInicial = 8;
const mediaDispositivoMenor = window.matchMedia("(max-width: 900px)");

let filtroAtual = "all";
let expandido = false;

function combinaFiltro(card, filtro) {
  if (filtro === "all") return true;

  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const filtroNormalizado = normalizar(filtro);
  const spansTecnologia = card.querySelectorAll(".projeto-tecnologias span");

  return Array.from(spansTecnologia).some((span) => {
    const valor = normalizar(span.textContent || "");
    return valor === filtroNormalizado;
  });
}

function atualizarVisibilidadeProjetos() {
  let visiveisNoFiltro = 0;

  projetos.forEach((projeto) => {
    const passaFiltro = combinaFiltro(projeto, filtroAtual);
    projeto.classList.toggle("oculto-filtro", !passaFiltro);

    if (passaFiltro) visiveisNoFiltro += 1;
  });

  const aplicarLimite = filtroAtual === "all" && !expandido;
  let contador = 0;

  projetos.forEach((projeto) => {
    if (projeto.classList.contains("oculto-filtro")) {
      projeto.classList.remove("hidden");
      return;
    }

    if (aplicarLimite && contador >= limiteInicial) {
      projeto.classList.add("hidden");
    } else {
      projeto.classList.remove("hidden");
      contador += 1;
    }
  });

  if (!botaoVerTodos) return;

  const precisaMostrarBotao = filtroAtual === "all" && !expandido && visiveisNoFiltro > limiteInicial;
  botaoVerTodos.style.display = precisaMostrarBotao ? "block" : "none";
}

function atualizarFiltroAtivo(botaoClicado) {
  botoesFiltro.forEach((botao) => {
    const ativo = botao === botaoClicado;
    botao.classList.toggle("ativo", ativo);
    botao.setAttribute("aria-pressed", String(ativo));
  });
}

gruposTecnologias.forEach((grupo) => {
  const totalLinguagens = grupo.querySelectorAll("span").length;
  if (totalLinguagens > 0 && totalLinguagens % 2 === 0) {
    grupo.classList.add("duas-colunas");
  }
});

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    const novoFiltro = botao.dataset.filter || "all";
    filtroAtual = novoFiltro;
    expandido = filtroAtual !== "all";
    atualizarFiltroAtivo(botao);
    atualizarVisibilidadeProjetos();
  });
});

if (botaoVerTodos) {
  botaoVerTodos.addEventListener("click", () => {
    expandido = true;
    atualizarVisibilidadeProjetos();
  });
}

projetos.forEach((projeto) => {
  projeto.addEventListener("click", (event) => {
    if (!mediaDispositivoMenor.matches) return;
    if (event.target.closest(".projeto-links a")) return;

    const jaAtivo = projeto.classList.contains("ativo");
    projetos.forEach((item) => item.classList.remove("ativo"));
    if (!jaAtivo) projeto.classList.add("ativo");
  });
});

document.addEventListener("click", (event) => {
  if (!mediaDispositivoMenor.matches) return;
  if (!event.target.closest(".projeto-card")) {
    projetos.forEach((projeto) => projeto.classList.remove("ativo"));
  }
});

mediaDispositivoMenor.addEventListener("change", (event) => {
  if (!event.matches) {
    projetos.forEach((projeto) => projeto.classList.remove("ativo"));
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visivel");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  secoesAnimadas.forEach((secao) => {
    secao.classList.add("sessao-reveal");
    observer.observe(secao);
  });
} else {
  secoesAnimadas.forEach((secao) => secao.classList.add("visivel"));
}

atualizarVisibilidadeProjetos();
