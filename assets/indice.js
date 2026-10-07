/*
  INDICE DEL SITO
  Tutta la struttura del sito (sezioni, documenti, collegamenti) è definita qui.
  Per aggiungere un nuovo argomento:
    1. inserire il file HTML (e il PDF, se presente) nella cartella opportuna;
    2. aggiungere un oggetto in "documenti" della sezione giusta (o una nuova sezione).
  Nessun altro file va modificato: index.html e assets/sito.js si aggiornano da soli.
*/
window.INDICE = [
  {
    id: "teoria",
    parte: "Parte I",
    titolo: "Teoria",
    descrizione:
      "Il funzionamento delle macchine virtuali: hypervisor, CPU, memoria, disco, rete, pregi e limiti.",
    documenti: [
      {
        titolo: "Lezione: le macchine virtuali",
        descrizione:
          "Dispensa stampabile che ripercorre in sintesi tutta la parte teorica: cos'è una VM, tipi di hypervisor, risorse, rete, snapshot e cloni, VM contro container, procedura tipica di laboratorio e domande di verifica.",
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
    descrizione:
      "Le guide di preparazione dell'ambiente: si seguono una volta sola, prima delle attività, perché tutte le esercitazioni partono da una macchina già pronta e clonabile.",
    documenti: [
      {
        titolo: "Creare la macchina virtuale Windows 11",
        descrizione:
          "Costruire da zero la macchina Windows 11 che fa da base a tutte le attività: hardware virtuale (EFI, TPM 2.0, Secure Boot), installazione con l'utente admin, Guest Additions, snapshot «Installazione pulita» e cloni Windows 1 / Windows 2 con MAC reinizializzato.",
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
          "Guida introduttiva a una seconda VM leggera: rete in NAT, installazione persistente con setup-alpine e setup-disk, repository di apk, Bash come shell predefinita e sincronizzazione dell'orologio con chrony.",
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
    descrizione:
      "Le esercitazioni di laboratorio, ordinate per argomento. Ogni attività indica la macchina e lo snapshot da usare.",
    documenti: [
      {
        titolo: "Attività 1: utenti e file",
        descrizione:
          "Clonazione della macchina madre, rinominamento dei computer in WINDOWS-1 e WINDOWS-2, creazione di utente1 e utente2 e lavoro sui permessi di cartella1: ereditarietà rimossa, diritto Interactive eliminato, sola lettura poi modifica.",
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
          "Creazione del gruppo gruppo1 con utente1 e utente2, autorizzazioni assegnate al gruppo su cartella2, verifica con utente3 fuori gruppo e poi inserito: i nuovi permessi valgono solo dopo una nuova sessione.",
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
          "Rete interna tra WINDOWS-1 e WINDOWS-2, firewall disattivato, IP statici, accesso a \\\\WINDOWS-1 con l'utente rete1 e cartella condivisa Condivisione1 in sola lettura.",
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
    descrizione: "",
    nota:
      "Sezione predisposta ma ancora vuota: le attività dedicate a Linux verranno pubblicate qui man mano, con lo stesso formato di quelle Windows (documento HTML stampabile, obiettivo, sintesi e argomenti teorici da conoscere). La base di partenza è la guida introduttiva ad Alpine Linux nella Parte II.",
    documenti: []
  }
];
