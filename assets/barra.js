(function () {
  "use strict";

  if (!document.body || document.getElementById("barra-sito")) {
    return;
  }

  var script = document.currentScript;
  var root =
    script && script.src
      ? script.src.replace(/assets\/barra\.js(?:\?.*)?$/, "")
      : "../";

  var stile = document.createElement("style");
  stile.textContent = [
    "#barra-sito{position:sticky;top:0;z-index:100;display:flex;align-items:center;",
    "justify-content:space-between;gap:12px;padding:7px 14px;",
    "font:600 13px/1.4 system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}",
    "#barra-sito a,#barra-sito button{font:inherit;color:inherit;background:none;border:0;",
    "cursor:pointer;text-decoration:none}",
    "#barra-sito a{padding:3px 8px;border-radius:6px}",
    "#barra-sito a:hover{background:rgba(127,127,127,.18)}",
    "#barra-sito .barra-titolo{font-weight:500;opacity:.75;overflow:hidden;",
    "text-overflow:ellipsis;white-space:nowrap}",
    "#barra-sito .barra-stampa{padding:3px 10px;border:1px solid rgba(127,127,127,.45);",
    "border-radius:6px;opacity:.85}",
    "#barra-sito .barra-stampa:hover{opacity:1}",
    "@media (max-width:640px){#barra-sito .barra-titolo{display:none}}",
    "@media print{#barra-sito{display:none!important}}"
  ].join("");
  document.head.appendChild(stile);

  var barra = document.createElement("div");
  barra.id = "barra-sito";
  barra.setAttribute("role", "navigation");
  barra.setAttribute("aria-label", "Navigazione del sito");

  var indietro = document.createElement("a");
  indietro.href = root + "index.html";
  indietro.textContent = "\u2190 Indice";

  var titolo = document.createElement("span");
  titolo.className = "barra-titolo";
  titolo.textContent = document.title;

  var stampa = document.createElement("button");
  stampa.type = "button";
  stampa.className = "barra-stampa";
  stampa.textContent = "Stampa";
  stampa.addEventListener("click", function () {
    window.print();
  });

  barra.appendChild(indietro);
  barra.appendChild(titolo);
  barra.appendChild(stampa);

  function leggiSfondo(elemento) {
    var valore = getComputedStyle(elemento).backgroundColor;
    var m = String(valore).match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,]+([\d.]+))?/);
    if (!m) {
      return null;
    }
    if (m[4] !== undefined && parseFloat(m[4]) === 0) {
      return null;
    }
    return { r: parseFloat(m[1]), g: parseFloat(m[2]), b: parseFloat(m[3]) };
  }

  function adattaColori() {
    var stileCorpo = getComputedStyle(document.body);
    var sfondo = leggiSfondo(document.body) || leggiSfondo(document.documentElement) ||
      { r: 255, g: 255, b: 255 };
    var luminanza =
      (0.2126 * sfondo.r + 0.7152 * sfondo.g + 0.0722 * sfondo.b) / 255;
    var scuro = luminanza <= 0.5;

    barra.style.color = stileCorpo.color || (scuro ? "#e6e8eb" : "#1f2328");
    barra.style.backgroundColor = scuro ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)";
    barra.style.borderBottom =
      "1px solid " + (scuro ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.10)");

    var accento = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    indietro.style.color = accento || "";

    var padding = stileCorpo.paddingTop || "0px";
    barra.style.marginTop = "-" + padding;
  }

  adattaColori();
  document.body.insertBefore(barra, document.body.firstChild);

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var cambio = function () {
      adattaColori();
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", cambio);
    } else if (mq.addListener) {
      mq.addListener(cambio);
    }
  }
})();
