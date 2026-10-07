(function () {
  "use strict";

  var dati = window.INDICE || [];
  var contenuti = document.getElementById("contenuti");
  var barraParti = document.getElementById("parti");
  var nessunRisultato = document.getElementById("nessun-risultato");
  var campo = document.getElementById("ricerca");
  var pulsanteTema = document.getElementById("tema");

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

  function testoRicerca(testo, argomenti) {
    return (testo + " " + (argomenti || []).join(" ")).toLowerCase();
  }

  function renderDocumento(doc) {
    var html =
      '<article class="documento" data-testo="' +
      esc(testoRicerca(doc.titolo + " " + (doc.descrizione || ""), doc.argomenti)) +
      '">' +
      "<h3>" + esc(doc.titolo) + "</h3>";

    if (doc.descrizione) {
      html += "<p>" + esc(doc.descrizione) + "</p>";
    }

    if (doc.argomenti && doc.argomenti.length) {
      html += '<ul class="tag">';
      for (var i = 0; i < doc.argomenti.length; i++) {
        html += "<li>" + esc(doc.argomenti[i]) + "</li>";
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
    html += "</div></article>";
    return html;
  }

  function renderSezione(sezione) {
    var documenti = sezione.documenti || [];
    var testoSezione = [sezione.titolo, sezione.descrizione, sezione.nota].join(" ");

    var html = '<section class="sezione" id="' + esc(sezione.id) + '" data-testo="' +
      esc(testoSezione.toLowerCase()) + '">' +
      '<div class="sezione-testa">' +
      '<span class="etichetta">' + esc(sezione.parte || sezione.titolo) + "</span>" +
      "<h2>" + esc(sezione.titolo) + "</h2>" +
      (documenti.length
        ? '<span class="contatore">' + documenti.length +
          (documenti.length === 1 ? " documento" : " documenti") + "</span>"
        : "") +
      "</div>";

    if (sezione.descrizione) {
      html += "<p>" + esc(sezione.descrizione) + "</p>";
    }

    if (documenti.length) {
      html += '<div class="griglia">';
      for (var i = 0; i < documenti.length; i++) {
        html += renderDocumento(documenti[i]);
      }
      html += "</div>";
    }

    if (sezione.nota) {
      html += '<div class="vuota">' + esc(sezione.nota) + "</div>";
    }

    html += "</section>";
    return html;
  }

  function render() {
    if (!contenuti) {
      return;
    }

    var htmlSezioni = "";
    var htmlParti = "";

    for (var i = 0; i < dati.length; i++) {
      var sezione = dati[i];
      htmlSezioni += renderSezione(sezione);
      htmlParti +=
        '<a href="#' + esc(sezione.id) + '" data-sezione="' + esc(sezione.id) + '">' +
        esc(sezione.titolo) + "</a>";
    }

    contenuti.innerHTML = htmlSezioni;
    if (barraParti) {
      barraParti.innerHTML = htmlParti;
    }
  }

  function filtra() {
    var q = (campo && campo.value ? campo.value : "").trim().toLowerCase();
    var sezioni = contenuti ? contenuti.querySelectorAll(".sezione") : [];
    var almenoUnaVisibile = false;

    for (var i = 0; i < sezioni.length; i++) {
      var sezione = sezioni[i];
      var documenti = sezione.querySelectorAll(".documento");
      var visibili = 0;

      for (var j = 0; j < documenti.length; j++) {
        var coincide = !q || documenti[j].getAttribute("data-testo").indexOf(q) !== -1;
        documenti[j].hidden = !coincide;
        if (coincide) {
          visibili++;
        }
      }

      var sezioneVisibile =
        visibili > 0 ||
        (documenti.length === 0 && (!q || sezione.getAttribute("data-testo").indexOf(q) !== -1));

      sezione.hidden = !sezioneVisibile;
      if (sezioneVisibile) {
        almenoUnaVisibile = true;
      }

      var voce = barraParti
        ? barraParti.querySelector('[data-sezione="' + sezione.id + '"]')
        : null;
      if (voce) {
        voce.hidden = !sezioneVisibile;
      }
    }

    if (nessunRisultato) {
      nessunRisultato.hidden = almenoUnaVisibile;
    }
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

  function impostaTema(salvato) {
    if (salvato) {
      document.documentElement.setAttribute("data-theme", salvato);
    }
    aggiornaPulsanteTema();
  }

  var temaSalvato = null;
  try {
    temaSalvato = window.localStorage.getItem("sito-tema");
  } catch (e) {
    temaSalvato = null;
  }
  impostaTema(temaSalvato);

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

  render();
  filtra();

  if (campo) {
    campo.addEventListener("input", filtra);
    campo.addEventListener("search", filtra);
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
})();
