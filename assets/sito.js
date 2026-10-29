(function () {
  "use strict";

  var dati = window.INDICE || [];
  var gruppi = window.GRUPPI || [];
  var contenuti = document.getElementById("contenuti");
  var overlay = document.getElementById("scheda-overlay");
  var corpoScheda = document.getElementById("scheda-corpo");
  var titoloScheda = document.getElementById("scheda-titolo");
  var parteScheda = document.getElementById("scheda-parte");
  var pulsanteChiudi = document.getElementById("scheda-chiudi");
  var pulsanteTema = document.getElementById("tema");
  var chiaveSezione = null;

  function esc(testo) {
    return String(testo === null || testo === undefined ? "" : testo).replace(
      /[&<>"]/g,
      function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      }
    );
  }

  function percorso(p) {
    return encodeURI(p);
  }

  function trovaSezione(id) {
    for (var i = 0; i < dati.length; i++) {
      if (dati[i].id === id) {
        return dati[i];
      }
    }
    return null;
  }

  function trovaGruppo(id) {
    for (var i = 0; i < gruppi.length; i++) {
      if (gruppi[i].id === id) {
        return gruppi[i];
      }
    }
    return null;
  }

  function etichettaSezione(sezione) {
    var parti = [];
    var gruppo = trovaGruppo(sezione.gruppo);
    if (gruppo) {
      parti.push(gruppo.titolo);
    }
    if (sezione.categoria) {
      parti.push(sezione.categoria);
    }
    return parti.join(" · ") || sezione.parte || "";
  }

  function renderCard(sezione) {
    var documenti = sezione.documenti || [];
    var contatore = documenti.length
      ? documenti.length + (documenti.length === 1 ? " documento" : " documenti")
      : "In preparazione";
    var etichetta = sezione.etichetta || sezione.parte || "";

    return (
      '<button class="card-sezione" type="button" data-sezione="' +
      esc(sezione.id) +
      '" aria-haspopup="dialog">' +
      (etichetta ? '<span class="etichetta">' + esc(etichetta) + "</span>" : "") +
      '<span class="card-titolo">' + esc(sezione.titolo) + "</span>" +
      '<span class="card-breve">' + esc(sezione.breve || "") + "</span>" +
      '<span class="card-piede">' +
      '<span class="contatore">' + esc(contatore) + "</span>" +
      '<span class="apri-scheda">Apri la scheda</span>' +
      "</span>" +
      "</button>"
    );
  }

  function render() {
    if (!contenuti) {
      return;
    }

    var ordineGruppi = [];
    var perGruppo = {};

    for (var i = 0; i < dati.length; i++) {
      var sezione = dati[i];
      var idGruppo = sezione.gruppo || "altro";
      var categoria = sezione.categoria || "Documenti";

      if (!perGruppo[idGruppo]) {
        perGruppo[idGruppo] = { categorie: [], perCategoria: {} };
        ordineGruppi.push(idGruppo);
      }

      var gruppo = perGruppo[idGruppo];
      if (!gruppo.perCategoria[categoria]) {
        gruppo.perCategoria[categoria] = [];
        gruppo.categorie.push(categoria);
      }
      gruppo.perCategoria[categoria].push(sezione);
    }

    var html = "";
    for (var g = 0; g < ordineGruppi.length; g++) {
      var id = ordineGruppi[g];
      var datiGruppo = perGruppo[id];
      var meta = trovaGruppo(id) || { titolo: id, breve: "" };

      html += '<section class="gruppo-sezioni">';
      html += '<div class="gruppo-testa">';
      html += '<h2 class="gruppo-titolo">' + esc(meta.titolo) + "</h2>";
      if (meta.breve) {
        html += '<p class="gruppo-breve">' + esc(meta.breve) + "</p>";
      }
      html += "</div>";

      for (var c = 0; c < datiGruppo.categorie.length; c++) {
        var nomeCategoria = datiGruppo.categorie[c];
        html += '<div class="categoria-sezioni">';
        html += '<h3 class="categoria-titolo">' + esc(nomeCategoria) + "</h3>";
        html += '<div class="griglia-sezioni">';
        var sezioni = datiGruppo.perCategoria[nomeCategoria];
        for (var s = 0; s < sezioni.length; s++) {
          html += renderCard(sezioni[s]);
        }
        html += "</div></div>";
      }

      html += "</section>";
    }

    contenuti.innerHTML = html;
  }

  function corpo(sezione) {
    var documenti = sezione.documenti || [];
    var html = "";

    if (sezione.approfondimento) {
      html += '<p class="scheda-testo">' + esc(sezione.approfondimento) + "</p>";
    }

    if (documenti.length) {
      html += '<ul class="lista-documenti">';
      for (var i = 0; i < documenti.length; i++) {
        var doc = documenti[i];
        html += "<li><h3>" + esc(doc.titolo) + "</h3>";
        if (doc.descrizione) {
          html += "<p>" + esc(doc.descrizione) + "</p>";
        }
        if (doc.argomenti && doc.argomenti.length) {
          html += '<ul class="tag">';
          for (var j = 0; j < doc.argomenti.length; j++) {
            html += "<li>" + esc(doc.argomenti[j]) + "</li>";
          }
          html += "</ul>";
        }
        html += '<div class="collegamenti">';
        if (doc.file) {
          html += '<a class="apri" href="' + esc(percorso(doc.file)) + '">Apri il documento</a>';
        }
        if (doc.pdf) {
          html +=
            '<a class="pdf" href="' + esc(percorso(doc.pdf)) +
            '" target="_blank" rel="noopener">Versione PDF</a>';
        }
        html += "</div></li>";
      }
      html += "</ul>";
    }

    if (sezione.nota) {
      html += '<p class="scheda-nota">' + esc(sezione.nota) + "</p>";
    } else if (!documenti.length) {
      html += '<p class="scheda-nota">Nessun documento disponibile per ora.</p>';
    }

    html +=
      '<div class="scheda-piede"><button class="pulsante" type="button" data-chiudi>Chiudi</button></div>';
    return html;
  }

  function apriScheda(id, apertoDa) {
    var sezione = trovaSezione(id);
    if (!sezione || !overlay) {
      return;
    }
    parteScheda.textContent = etichettaSezione(sezione);
    titoloScheda.textContent = sezione.titolo;
    corpoScheda.innerHTML = corpo(sezione);
    chiaveSezione = apertoDa || null;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    if (pulsanteChiudi) {
      pulsanteChiudi.focus();
    }
  }

  function chiudiScheda() {
    if (!overlay || overlay.hidden) {
      return;
    }
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (chiaveSezione && document.contains(chiaveSezione)) {
      chiaveSezione.focus();
    }
    chiaveSezione = null;
  }

  function temaEffettivo() {
    var attuale = document.documentElement.getAttribute("data-theme");
    if (attuale) {
      return attuale;
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function aggiornaPulsanteTema() {
    if (!pulsanteTema) {
      return;
    }
    var scuro = temaEffettivo() === "dark";
    pulsanteTema.textContent = scuro ? "Tema scuro" : "Tema chiaro";
    pulsanteTema.setAttribute("aria-pressed", scuro ? "true" : "false");
    pulsanteTema.setAttribute(
      "aria-label",
      scuro ? "Passa al tema chiaro" : "Passa al tema scuro"
    );
  }

  if (contenuti) {
    contenuti.addEventListener("click", function (evento) {
      var card =
        evento.target && evento.target.closest
          ? evento.target.closest("[data-sezione]")
          : null;
      if (card) {
        apriScheda(card.getAttribute("data-sezione"), card);
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function (evento) {
      if (evento.target === overlay) {
        chiudiScheda();
      }
      var cheChiude =
        evento.target && evento.target.closest
          ? evento.target.closest("[data-chiudi]")
          : null;
      if (cheChiude) {
        chiudiScheda();
      }
    });
  }

  if (pulsanteChiudi) {
    pulsanteChiudi.addEventListener("click", chiudiScheda);
  }

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      chiudiScheda();
    }
  });

  var temaSalvato = null;
  try {
    temaSalvato = window.localStorage.getItem("sito-tema");
  } catch (e) {
    temaSalvato = null;
  }
  if (temaSalvato) {
    document.documentElement.setAttribute("data-theme", temaSalvato);
  }
  aggiornaPulsanteTema();

  if (pulsanteTema) {
    pulsanteTema.addEventListener("click", function () {
      var prossimo = temaEffettivo() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", prossimo);
      try {
        window.localStorage.setItem("sito-tema", prossimo);
      } catch (e) {
        /* memoria non disponibile */
      }
      aggiornaPulsanteTema();
    });
  }

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var cambio = function () {
      if (!document.documentElement.getAttribute("data-theme")) {
        aggiornaPulsanteTema();
      }
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", cambio);
    } else if (mq.addListener) {
      mq.addListener(cambio);
    }
  }

  render();
})();
