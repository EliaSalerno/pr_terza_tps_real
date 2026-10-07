/*
  INDICE DEL SITO
  Tutta la struttura del sito (sezioni, documenti, collegamenti) è definita qui.
  Per aggiungere un nuovo argomento:
    1. inserire il file HTML (e il PDF, se presente) nella cartella opportuna;
    2. aggiungere un oggetto in "documenti" della sezione giusta (o una nuova sezione).
  Campi di una sezione:
    breve          -> testo in poche parole mostrato sulla card dell'indice
    approfondimento-> testo della scheda che si apre cliccando la card
    nota           -> avviso per le sezioni senza documenti
  Nessun altro file va modificato: index.html e assets/sito.js si aggiornano da soli.
*/
window.INDICE = [
  {
    id: "teoria",
    parte: "Parte I",
    titolo: "Teoria",
    breve: "Cos'è una VM e come funziona sotto il cofano",
    approfondimento:
      "Il funzionamento tecnico delle macchine virtuali: hypervisor di tipo 1 e 2, CPU e memoria virtuali, dischi, rete, snapshot e cloni, pregi, limiti e ambiti di utilizzo. La dispensa si chiude con la procedura tipica di laboratorio e con le domande di verifica, ed è il presupposto per tutte le attività pratiche.",
    documenti: [
      {
        titolo: "Lezione: le macchine virtuali",
        descrizione:
          "Panoramica stampabile: VM, hypervisor, risorse, rete, snapshot, container e domande di verifica.",
        argomenti: [
          "macchina virtuale",
          "hypervisor",
          "CPU e memoria",
          "dischi",
          "rete",
          "snapshot e cloni",
          "container"
        ],
        file: "teoria/Lezione_ le macchine virtuali.html"
      }
    ]
  },
  {
    id: "installazione",
    parte: "Parte II",
    titolo: "Installazione",
    breve: "Preparare l'ambiente, una volta sola",
    approfondimento:
      "Le guide per creare le macchine di partenza: Windows 11 con VirtualBox e Alpine Linux. Si seguono una volta sola, prima delle attività, perché ogni esercizio parte da una macchina già pronta, con snapshot «pulito» e cloni riutilizzabili.",
    documenti: [
      {
        titolo: "Creare la macchina virtuale Windows 11",
        descrizione:
          "Da zero a VM pronta: hardware virtuale, installazione di Windows 11, Guest Additions, snapshot e cloni.",
        argomenti: [
          "VirtualBox",
          "Windows 11",
          "EFI, TPM 2.0, Secure Boot",
          "dischi dinamici",
          "Guest Additions",
          "snapshot e cloni",
          "esportazione OVA"
        ],
        file: "installazione/creazione_macchina.html",
        pdf: "installazione/pdf/Guida_ creare la macchina virtuale Windows 11 con VirtualBox.pdf"
      },
      {
        titolo: "Alpine Linux in macchina virtuale",
        descrizione:
          "Dal live su disco: rete in NAT, setup-alpine, repository di apk, Bash e sincronizzazione dell'orologio.",
        argomenti: [
          "Alpine Linux",
          "NAT e DHCP",
          "apk",
          "Bash",
          "OpenRC",
          "NTP e chrony",
          "console"
        ],
        file: "installazione/intro_alpine.html",
        pdf: "installazione/pdf/Guida Completa_ Configurazione Alpine Linux su VM.pdf"
      }
    ]
  },
  {
    id: "attivita",
    parte: "Parte III",
    titolo: "Attività",
    breve: "Tre esercitazioni progressive su Windows",
    approfondimento:
      "Utenti e file, gruppi, condivisione in rete: tre esercitazioni che partono da una macchina clonata e si complicano passo passo. Ogni documento indica la macchina, lo snapshot e gli utenti da usare, ed è pensato per essere ripetibile.",
    documenti: [
      {
        titolo: "Attività 1: utenti e file",
        descrizione:
          "Clonazione, rinominamento dei computer, utenti e permessi su cartella1 (ereditarietà, Interactive, sola lettura → modifica).",
        argomenti: [
          "cloni e MAC",
          "SID",
          "account locali",
          "permessi NTFS",
          "ereditarietà",
          "identità speciali"
        ],
        file: "attività/Conf_windows_att1.html",
        pdf: "attività/pdf/Configurazione Windows – Attività 1 – Utenti e file.pdf"
      },
      {
        titolo: "Attività 2: gruppi",
        descrizione:
          "Autorizzazioni assegnate a gruppo1 su cartella2, verifica con utente3 fuori gruppo e poi inserito: servono una nuova sessione.",
        argomenti: [
          "gruppi locali",
          "token di accesso",
          "autorizzazioni",
          "lusrmgr.msc",
          "edizione Pro"
        ],
        file: "attività/Conf_windows_att2.html",
        pdf: "attività/pdf/Configurazione Windows – Attività 2 – Gruppi.pdf"
      },
      {
        titolo: "Attività 3: condivisione in rete",
        descrizione:
          "Rete interna fra WINDOWS-1 e WINDOWS-2, IP statici, firewall e cartella Condivisione1 in sola lettura.",
        argomenti: [
          "rete interna",
          "modalità di rete",
          "IP statici e APIPA",
          "firewall",
          "SMB",
          "condivisioni vs NTFS"
        ],
        file: "attività/Conf_windows_att3.html",
        pdf: "attività/pdf/Configurazione Windows – Attività 3 – Condivisione in rete.pdf"
      }
    ]
  },
  {
    id: "linux",
    parte: "In preparazione",
    titolo: "Attività su Linux (Alpine e Bash)",
    breve: "Alpine e Bash: sezione in lavorazione",
    approfondimento:
      "La base di partenza è la guida ad Alpine Linux nella Parte II.",
    nota:
      "Le attività dedicate a Linux verranno pubblicate qui man mano, con lo stesso formato di quelle Windows (documento HTML stampabile, obiettivo, sintesi e argomenti teorici da conoscere).",
    documenti: []
  }
];
