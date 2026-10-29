/*
  INDICE DEL SITO
  Tutta la struttura del sito (gruppi, categorie, documenti, collegamenti) è definita qui.
  Per aggiungere un nuovo argomento:
    1. inserire il file HTML (e il PDF, se presente) nella cartella opportuna;
    2. aggiungere un oggetto in "documenti" della sezione giusta (o una nuova sezione).
  Campi di una sezione:
    gruppo         -> id del gruppo in "GRUPPI" (teoria oppure attivita)
    categoria      -> sottocategoria mostrata sotto il titolo del gruppo
    etichetta      -> etichetta breve mostrata sulla card
    breve          -> testo in poche parole mostrato sulla card dell'indice
    approfondimento-> testo della scheda che si apre cliccando la card
    nota           -> avviso per le sezioni senza documenti
  Nessun altro file va modificato: index.html e assets/sito.js si aggiornano da soli.
*/
window.GRUPPI = [
  {
    id: "teoria",
    titolo: "Teoria",
    breve:
      "Tutto il materiale di studio: fondamenti delle macchine virtuali, integrazione host-guest, sicurezza di Windows e guide per preparare l'ambiente di laboratorio."
  },
  {
    id: "attivita",
    titolo: "Attività",
    breve:
      "Tutte le esercitazioni di laboratorio, raccolte in una sezione unica e ordinate per argomento: utenti e permessi, reti, registro eventi, Active Directory e riepilogo."
  }
];

window.INDICE = [
  {
    id: "teoria-fondamenti",
    gruppo: "teoria",
    categoria: "Fondamenti",
    etichetta: "Dispensa",
    titolo: "Le macchine virtuali",
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
    id: "teoria-guest-additions",
    gruppo: "teoria",
    categoria: "Integrazione host-guest",
    etichetta: "Approfondimento",
    titolo: "Guest Additions di VirtualBox",
    breve: "Driver e servizi che integrano host e guest",
    approfondimento:
      "Cosa sono, a cosa servono e quando si installano i driver che integrano host e guest: schermo, mouse, appunti e trascinamento file. Un approfondimento che completa la lezione sulle macchine virtuali.",
    documenti: [
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
    id: "teoria-privilegi",
    gruppo: "teoria",
    categoria: "Sicurezza di Windows",
    etichetta: "Approfondimento",
    titolo: "Privilegi Windows assegnabili a un utente",
    breve: "Diritti utente, livelli di rischio e token di accesso",
    approfondimento:
      "Elenco dei privilegi che si possono concedere a un account tramite Criteri di sicurezza locali e Assegnazione diritti utente (secpol.msc). Il livello di rischio è una valutazione orientativa per la sicurezza; il documento distingue i privilegi presenti nel token dai diritti di accesso e spiega come interpretarli.",
    documenti: [
      {
        titolo: "Privilegi Windows assegnabili a un utente",
        descrizione:
          "Tabella interattiva dei privilegi assegnabili da secpol.msc, con livello di rischio, ricerca e distinzione tra privilegi e diritti di accesso.",
        argomenti: [
          "privilegi Windows",
          "secpol.msc",
          "diritti utente",
          "token di accesso",
          "whoami /priv",
          "livello di rischio",
          "minimo privilegio"
        ],
        file: "teoria/Privilegi_windows_assegnabili.html"
      }
    ]
  },
  {
    id: "teoria-installazione",
    gruppo: "teoria",
    categoria: "Preparazione dell'ambiente",
    etichetta: "Guida",
    titolo: "Installazione delle macchine virtuali",
    breve: "Windows 11 e Alpine Linux, una volta sola",
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
        file: "teoria/installazione/creazione_macchina.html",
        pdf: "teoria/installazione/pdf/Guida_ creare la macchina virtuale Windows 11 con VirtualBox.pdf"
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
        file: "teoria/installazione/intro_alpine.html",
        pdf: "teoria/installazione/pdf/Guida Completa_ Configurazione Alpine Linux su VM.pdf"
      }
    ]
  },
  {
    id: "attivita-utenti-file",
    gruppo: "attivita",
    categoria: "Utenti, gruppi e permessi",
    etichetta: "Attività 1",
    titolo: "Utenti e file",
    breve: "Account locali, ereditarietà e permessi NTFS",
    approfondimento:
      "Clonazione, rinominamento dei computer, utenti e permessi su cartella1: si parte da una macchina clonata e si verifica l'effetto dell'ereditarietà, delle identità speciali e del passaggio da sola lettura a modifica.",
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
      }
    ]
  },
  {
    id: "attivita-gruppi",
    gruppo: "attivita",
    categoria: "Utenti, gruppi e permessi",
    etichetta: "Attività 2",
    titolo: "Gruppi",
    breve: "Autorizzazioni per ruolo e token di accesso",
    approfondimento:
      "Autorizzazioni assegnate a gruppo1 su cartella2, verifica con utente3 fuori gruppo e poi inserito: serve una nuova sessione perché le modifiche ai gruppi entrino nel token di accesso.",
    documenti: [
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
      }
    ]
  },
  {
    id: "attivita-comandi",
    gruppo: "attivita",
    categoria: "Utenti, gruppi e permessi",
    etichetta: "Guida CMD",
    titolo: "Guida ai comandi CMD",
    breve: "net user, net localgroup, icacls e takeown",
    approfondimento:
      "Manuale pratico del Prompt dei comandi: net user e net localgroup, scadenza di password e account, criteri di blocco, icacls e takeown, utenti di dominio e strumenti PowerShell richiamabili da CMD.",
    documenti: [
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
      }
    ]
  },
  {
    id: "attivita-condivisione",
    gruppo: "attivita",
    categoria: "Reti e condivisioni",
    etichetta: "Attività 3",
    titolo: "Condivisione in rete",
    breve: "Rete interna, IP statici, SMB e permessi",
    approfondimento:
      "Rete interna fra WINDOWS-1 e WINDOWS-2, IP statici, firewall e cartella Condivisione1 in sola lettura: si passa dai permessi NTFS locali alla condivisione delle risorse su rete.",
    documenti: [
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
    id: "attivita-permesso-restrittivo",
    gruppo: "attivita",
    categoria: "Reti e condivisioni",
    etichetta: "Simulatore",
    titolo: "In rete vince il permesso più restrittivo",
    breve: "Condivisione SMB e NTFS: due filtri in serie",
    approfondimento:
      "Simulatore interattivo: una cartella condivisa attraversa due filtri in serie, i permessi di condivisione SMB e i permessi NTFS. L'utente ottiene il più restrittivo dei due, mentre in locale conta solo l'NTFS.",
    documenti: [
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
        file: "attività/esercitazioni/configurazione/Condivisioni di rete_ vince il permesso più restrittivo.html"
      }
    ]
  },
  {
    id: "attivita-registro-eventi",
    gruppo: "attivita",
    categoria: "Registro eventi",
    etichetta: "Laboratorio",
    titolo: "Il registro eventi di Windows",
    breve: "Log, filtri, PowerShell e indagine forense",
    approfondimento:
      "Il diario di bordo di Windows: aprire il Visualizzatore eventi, leggere e filtrare gli eventi, interrogare i log con Get-WinEvent e wevtutil, creare eventi e collegare attività, fino a un'indagine forense in laboratorio.",
    documenti: [
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
        file: "attività/esercitazioni/configurazione/Laboratorio_registro_eventi_windows.html"
      }
    ]
  },
  {
    id: "attivita-active-directory",
    gruppo: "attivita",
    categoria: "Active Directory",
    etichetta: "Attività 7",
    titolo: "Dominio, OU, utenti e workstation",
    breve: "Gestire le workstation con Active Directory",
    approfondimento:
      "Esercitazione su Active Directory: creazione e gestione di un dominio, unità organizzative, utenti, gruppi e join di workstation al dominio, con verifica dei criteri e delle autorizzazioni.",
    documenti: [
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
    id: "attivita-riepilogo",
    gruppo: "attivita",
    categoria: "Esercitazioni di riepilogo",
    etichetta: "Attività 8",
    titolo: "Ufficio commerciale",
    breve: "Scenario aziendale completo con collaudo finale",
    approfondimento:
      "Esercitazione completa su uno scenario aziendale: gruppi e utenti locali da CMD, criteri password, permessi NTFS secondo una matrice, condivisione di rete, script di accesso e collaudo finale.",
    documenti: [
      {
        titolo: "Attività 8: ufficio commerciale (esercitazione di riepilogo)",
        descrizione:
          "Esercitazione completa su uno scenario aziendale: gruppi e utenti locali da CMD, criteri password, permessi NTFS secondo una matrice, condivisione di rete, script di accesso e collaudo finale.",
        argomenti: [
          "net user e net localgroup",
          "net accounts",
          "criteri password e blocco account",
          "icacls",
          "permessi NTFS",
          "minimo privilegio",
          "condivisione SMB",
          "script di accesso",
          "collaudo e documentazione"
        ],
        file: "attività/att_conf_windows_ufficio.html"
      }
    ]
  },
  {
    id: "attivita-linux",
    gruppo: "attivita",
    categoria: "Linux (in preparazione)",
    etichetta: "In preparazione",
    titolo: "Attività su Linux (Alpine e Bash)",
    breve: "Alpine e Bash: sezione in lavorazione",
    approfondimento:
      "La base di partenza è la guida ad Alpine Linux nella sezione Teoria, alla voce Preparazione dell'ambiente.",
    nota:
      "Le attività dedicate a Linux verranno pubblicate qui man mano, con lo stesso formato di quelle Windows (documento HTML stampabile, obiettivo, sintesi e argomenti teorici da conoscere).",
    documenti: []
  }
];
