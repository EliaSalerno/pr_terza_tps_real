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
      "Il funzionamento tecnico delle macchine virtuali: hypervisor di tipo 1 e 2, CPU e memoria virtuali, dischi, rete, snapshot e cloni, pregi, limiti e ambiti di utilizzo. La dispensa si chiude con la procedura tipica di laboratorio e con le domande di verifica, ed è il presupposto per tutte le attività pratiche. Completa l'approfondimento sulle Guest Additions, l'integrazione tra host e guest.",
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
      },
      {
        titolo: "Guest Additions di VirtualBox",
        descrizione:
          "Cosa sono, a cosa servono e quando si installano i driver che integrano host e guest: schermo, mouse, appunti e trascinamento file.",
        argomenti: [
          "host e guest",
          "driver e servizi",
          "risoluzione dello schermo",
          "mouse integrato",
          "appunti condivisi",
          "trascinamento file",
          "VBoxWindowsAdditions.exe"
        ],
        file: "teoria/guest_additions_virtualbox.html"
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
    breve: "Esercitazioni progressive su Windows",
    approfondimento:
      "Utenti e file, gruppi, condivisione in rete: esercitazioni che partono da una macchina clonata e si complicano passo passo. Ogni documento indica la macchina, lo snapshot e gli utenti da usare, ed è pensato per essere ripetibile. Accanto agli esercizi di rete c'è un simulatore interattivo che mostra come i permessi di condivisione e quelli NTFS si combinano, applicando alla pratica il principio del «vale il più restrittivo». Una guida ai comandi da Prompt dei comandi raccoglie le stesse operazioni delle prime attività (net user, net localgroup, icacls) con esempi eseguibili. Chiude la parte un laboratorio sui registri eventi, con missioni, automazione e una piccola indagine forense.",
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
      },
      {
        titolo: "In rete vince il permesso più restrittivo",
        descrizione:
          "Simulatore interattivo: una cartella condivisa attraversa due filtri in serie, i permessi di condivisione SMB e i permessi NTFS. L'utente ottiene il più restrittivo dei due, mentre in locale conta solo l'NTFS.",
        argomenti: [
          "permessi di condivisione",
          "permessi NTFS",
          "accesso effettivo",
          "accesso locale",
          "SMB",
          "Nega vs Consenti"
        ],
        file: "attività/Condivisioni di rete_ vince il permesso più restrittivo.html"
      },
      {
        titolo: "Guida ai comandi CMD: utenti, gruppi e permessi",
        descrizione:
          "Manuale pratico del Prompt dei comandi: net user e net localgroup, scadenza di password e account, criteri di blocco, icacls e takeown, utenti di dominio e strumenti PowerShell richiamabili da CMD.",
        argomenti: [
          "cmd.exe",
          "net user",
          "net localgroup",
          "net accounts",
          "scadenza password",
          "blocco account",
          "icacls e takeown",
          "ACL e permessi NTFS",
          "dominio e Active Directory",
          "PowerShell e winget"
        ],
        file: "attività/Conf_windows_comandi.html"
      },
      {
        titolo: "Laboratorio: il registro eventi di Windows",
        descrizione:
          "Il diario di bordo di Windows: aprire il Visualizzatore eventi, leggere e filtrare gli eventi, interrogare i log con Get-WinEvent e wevtutil, creare eventi e collegare attività, fino a un'indagine forense in laboratorio.",
        argomenti: [
          "Visualizzatore eventi",
          "eventvwr.msc",
          "registri Applicazione, Sicurezza, Sistema",
          "ID evento e livelli",
          "filtri e visualizzazioni",
          "Get-WinEvent e wevtutil",
          "eventcreate",
          "attività collegate agli eventi",
          "indagine forense"
        ],
        file: "attività/Laboratorio_registro_eventi_windows.html"
      },
      {
        titolo: "Attività 7: Active Directory – Dominio, OU, utenti e workstation",
        descrizione:
          "Esercitazione su Active Directory: creazione e gestione di un dominio, unità organizzative, utenti, gruppi e join di workstation al dominio, con verifica dei criteri e delle autorizzazioni.",
        argomenti: [
          "Active Directory",
          "Dominio",
          "OU",
          "Utenti e gruppi",
          "Computer nel dominio",
          "Join al dominio",
          "Group Policy",
          "Autenticazione"
        ],
        file: "attività/active_directory.html"
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
