# Macchine virtuali — teoria e attività

Repository dedicato allo studio delle **macchine virtuali**: una parte teorica che ne
spiega il funzionamento tecnico, i vantaggi, i limiti e gli ambiti di utilizzo, e una
parte pratica con le guide di preparazione dell'ambiente e le attività di laboratorio.

L'obiettivo è comprendere non solo *come si usa* un hypervisor, ma *come funziona
sotto*: perché una macchina virtuale "rallenta", perché l'orologio interno va fuori
sincronia, perché uno snapshot non è un backup, perché una cartella condivisa è una
scorciatoia comoda ma pericolosa.

## Struttura del repository

```
.
├── README.md                              ← questo file (teoria + indice)
├── teoria/
│   └── Lezione_ le macchine virtuali.html  ← lezione teorica stampabile (panoramica)
├── installazione/                         ← guide preliminari: preparare l'ambiente
│   ├── creazione_macchina.html            ← creare e installare la macchina Windows 11
│   ├── intro_alpine.html                  ← guida introduttiva ad Alpine Linux in VM
│   └── pdf/                               ← copie stampabili delle guide
└── attività/                              ← esercitazioni
    ├── Conf_windows_att1.html             ← Configurazione Windows – Attività 1 (utenti e file)
    ├── Conf_windows_att2.html             ← Configurazione Windows – Attività 2 (gruppi)
    ├── Conf_windows_att3.html             ← Configurazione Windows – Attività 3 (rete)
    └── pdf/                               ← copie stampabili delle attività
```

Il repository è suddiviso in tre cartelle distinte:

- **`teoria/`** — la **lezione** sulle macchine virtuali in formato stampabile, la
  dispensa che accompagna la [Parte I](#parte-i--teoria).
- **`installazione/`** — le guide di **preparazione dell'ambiente**: come si crea e si
  installa una macchina virtuale. Vanno lette una volta sola, prima delle attività,
  perché tutte le esercitazioni partono da una macchina già pronta e clonabile.
- **`attività/`** — le **esercitazioni** vere e proprie, ordinate per argomento.

Ogni documento è un HTML autonomo, ottimizzato per la stampa in A4, che contiene la
traccia passo-passo, le note sulle differenze tra versioni del sistema, gli avvisi
sui passaggi che si sbagliano più spesso e i suggerimenti pratici. Questo README funge
da **indice**: riassume l'obiettivo di ciascun documento, la sintesi di cosa si fa e
gli **argomenti teorici da conoscere** prima di affrontarlo, rimandando poi al file di
dettaglio.

Il contenuto è organizzato in tre parti:

| Parte | Cosa contiene |
|---|---|
| [**Parte 1 - Teoria**](#parte-i--teoria) | il funzionamento delle macchine virtuali: hypervisor, CPU, memoria, disco, rete, pregi e limiti |
| [**Parte 2 - Installazione**](#parte-ii--installazione) | le guide di preparazione: macchina Windows 11 e Alpine Linux |
| [**Parte 3 - Attività**](#parte-iii--attività) | le esercitazioni di laboratorio con sintesi e prerequisiti teorici |

---

# Parte I — Teoria

📄 [`teoria/Lezione_ le macchine virtuali.html`](<teoria/Lezione_ le macchine virtuali.html>)
— *Lezione: le macchine virtuali*: dispensa stampabile che ripercorre in sintesi i
punti di questa parte (cos'è una VM, tipi di hypervisor, risorse, rete, snapshot e
cloni, VM contro container, procedura tipica di laboratorio e domande di verifica).

## 1. Che cos'è una macchina virtuale

Una macchina virtuale (**VM**, *Virtual Machine*) è un computer completo — processore,
memoria, disco, scheda di rete — costruito interamente via software dentro un altro
computer, detto **host**.

Il concetto fondamentale è quello di **virtualizzazione**: le risorse fisiche
dell'host (CPU, RAM, disco, rete) vengono astratte e ridistribuite in risorse virtuali
identiche per ciascun ospite. L'hardware non sa di essere condiviso; ogni sistema
operativo ospite (**guest**) è convinto di avere la macchina tutta per sé.

In pratica, installare Windows in una macchina virtuale non è "installare Windows su
Windows": il guest possiede un proprio hardware virtuale, un proprio kernel, i propri
driver, il proprio filesystem e il proprio indirizzo MAC. È indistinguibile da una
macchina fisica, se non per i dettagli tecnici che il virtualizzatore rivela.

### Perché esiste la virtualizzazione

- **Costo**: un server fisico costa molto più di macchine virtuali equivalenti. Con la
  consolidazione, decine di sistemi operativi diversi convivono sullo stesso hardware.
- **Isolamento**: un guasto o un errore in un guest non deve coinvolgere gli altri né
  l'host. È la stessa logica dei container, ma applicata all'intero sistema operativo.
- **Flessibilità e velocità**: creare, clonare, avviare, sospendere, distruggere una
  macchina costa secondi. Si possono mantenere decine di "punti di ripristino" di un
  ambiente senza moltiplicare l'hardware.
- **Eterogeneità**: un singolo host (Linux) può eseguire Windows, Linux e macOS
  legittimamente, cosa impossibile su una singola macchina fisica.
- **Riproducibilità**: un ambiente può essere consegnato come una macchina portabile
  (cartella o immagine) e ripristinato identico altrove.

## 2. Architettura: l'hypervisor

Il componente software che crea e gestisce le macchine virtuali è l'**hypervisor**
(conosciuto anche come *Virtual Machine Monitor* o VMM). Si interpone tra
l'hardware fisico e i sistemi operativi ospite.

```
┌──────────────────────────────────────────────────────┐
│  Guest 1 (Windows 11)  Guest 2 (Alpine)  Guest 3 ... │
├──────────────────────────────────────────────────────┤
│  Device driver virtuali   │  Hypervisor (VMM)        │
├──────────────────────────────────────────────────────┤
│  Hardware fisico: CPU · RAM · Disco · NIC · USB      │
└──────────────────────────────────────────────────────┘
```

Le funzioni dell'hypervisor sono:

- **Creare e distruggere** macchine virtuali.
- **Tradurre** le istruzioni della CPU emulata in istruzioni reali (o eseguirle
  direttamente, se c'è assistenza hardware).
- **Virtualizzare le periferiche**: ogni guest vede un controller disco, una scheda di
  rete, un controller USB propri, che in realtà sono risorse condivise sull'host.
- **Schedulare** l'esecuzione: decidere quale guest usa la CPU e per quanto tempo.
- **Gestire l'isolamento** tra i guest e l'accesso controllato alle risorse dell'host.

### Tipologia 1 vs Tipologia 2

| | **Hypervisor di tipo 1 (bare metal)** | **Hypervisor di tipo 2 (hosted)** |
|---|---|---|
| **Dove gira** | direttamente sull'hardware | sopra un sistema operativo già installato |
| **Prestazioni** | molto alte, minori livelli di traduzione | più basse, l'hypervisor compete con l'host OS |
| **Affidabilità** | l'hypervisor non è un processo, non è "spento" da un crash | se l'host OS si blocca, tutte le VM si fermano |
| **Esempi** | Hyper-V, KVM, Xen, VMware ESXi, Proxmox VE | VirtualBox, VMware Workstation, Parallels Desktop |
| **Uso tipico** | server, data center, cloud | postazione di lavoro, laboratorio, formazione |

Nel laboratorio di questo repository si usa **Oracle VirtualBox 7.x**, un hypervisor di
tipo 2: è gratuito, multipiattaforma e pensato anche per l'uso personale, didattico e
di laboratorio. Attenzione soltanto alle **funzioni estese** (pacchetto *Extension
Pack*): il passthrough USB 2.0/3.0 e il supporto per le webcam funzionano solo se
l'Extension Pack è installato e sono gratuiti esclusivamente per uso personale o
didattico.

### Confronto rapido tra gli hypervisor più diffusi

| Hypervisor | Tipo | Sistema operativo | Note |
|---|---|---|---|
| VirtualBox 7.x | 2 | Windows, Linux, macOS | snapshot e cloni molto pratici, ottimo per laboratori |
| VMware Workstation / Player | 2 | Windows, Linux | prestazioni elevate, Player gratuito solo per uso personale |
| Hyper-V | 1 | Windows Server, Linux (host), anche Windows client | integrato in Windows Pro/Enterprise; in Home è disponibile solo "Virtual Machine Platform" (per WSL2 e Docker) |
| QEMU / KVM | 1 (KVM) | Linux | open source, estremamente flessibile, base di Proxmox e di molte cloud |
| Proxmox VE | 1 | Linux (Debian) | interfaccia web, KVM per VM e LXC per container |

### Virtualizzazione completa vs para-virtualizzazione

L'ospite potrebbe girare sul processore reale senza che l'hypervisor modifichi una
sola istruzione: è la **virtualizzazione completa** (*full virtualization*), e
funziona perché il processore esegue codice in modalità privilegiata anche quando
l'istruzione è "sconosciuta". È il modello di VirtualBox e VMware con
assistenza hardware attiva.

Nella **para-virtualizzazione** l'hypervisor modifica l'architettura virtuale per
esporsi al guest in modo da semplificare la traduzione: il guest è consapevole di
essere virtualizzato e usa driver più efficienti, a prezzo di portare il proprio
kernel. È il modello di Xen e di Hyper-V.

### Assistenza hardware

I moderni processori riservano un insieme di funzioni alle macchine virtuali:

- **Intel VT-x / AMD-V**: esecuzione nativa delle istruzioni dell'ospite, senza
  traduzione. Deve essere **abilitata nel BIOS/UEFI** del PC fisico, altrimenti
  l'hypervisor non parte.
- **EPT (Extended Page Tables) / NPT (Nested Page Tables)**: il processore gestisce
  direttamente la traduzione degli indirizzi virtuali del guest in indirizzi fisici,
  accelerando la memoria.
- **IOMMU (Intel VT-d / AMD-Vi)**: remap sicuro delle periferiche, per passare un
  dispositivo fisico direttamente a una VM (passthrough).

Queste funzioni esistono anche perché i sistemi operativi moderni ne hanno bisogno per
funzionare: **Windows 11**, ad esempio, si rifiuta di installarsi senza **TPM 2.0** e
**Secure Boot**, ed è proprio l'hypervisor a fornire virtualmente quel chip.

## 3. La CPU vista dall'ospite

Ogni macchina virtuale vede un numero di **vCPU** (CPU virtuali). Non esistono core
fisici dedicati a ciascuna macchina: l'hypervisor **schedula** le vCPU sui core reali
con un meccanismo di *time-slicing*, alternando l'esecuzione a intervalli molto brevi.

- **Sovrallocazione**: si possono assegnare 8 vCPU a una VM su un host con 4 core
  fisici. Funziona, ma in caso di carico reale le VM competono e i tempi di risposta
  peggiorano. Le vCPU non "accumulano" potenza di calcolo.
- **Overhead**: il contesto dell'hypervisor e il salvataggio/ripristino del contesto
  della CPU a ogni cambio di vCPU costano tempo. Con l'assistenza hardware
  (VT-x/AMD-V) l'overhead è contenuto; senza, in emulazione software, le VM possono
  essere **5-10 volte più lente** del nativo.
- **Pinning**: con l'allocazione fissa, una vCPU viene legata a un core fisico,
  azzerando il jitter e sfruttando cache e cache di terzo livello condivise. È la
  scelta giusta per carichi sensibili a latenza (database, VM con licenze).
- **CPUID**: l'hypervisor decide quali funzioni della CPU esporre. Alcune
  istruzioni sono mascherate o emulate (ad esempio i metadati di sicurezza), quindi
  un programma che interroga il processore riceve risposte "virtuali".

Un aspetto spesso dimenticato è l'**orologio**. La macchina virtuale non ha un orologio
proprio: il tempo è derivato dal timer dell'host e dalla frequenza TSC, che su guest
non virtualizzata può essere letta in modo incoerente. Risultato: dopo sospensioni,
ripristini da snapshot e spegnimenti prolungati, l'ora della VM **deriva** e i servizi
che si basano sul tempo (autenticazione Kerberos, TLS, log, `cron`, firme
digitali) falliscono con errori fuorvianti. La correzione è sincronizzare il guest con
un server NTP esterno: è l'operazione descritta nella guida introduttiva ad Alpine
Linux presente in `installazione/`.

## 4. La memoria

La RAM dell'host è ripartita fra le VM. L'hypervisor mantiene una **tabella di
traduzione** (per-page) che associa la memoria fisica dell'host alle pagine virtuali
del guest: da qui il termine *shadow page tables* e il supporto EPT/NPT.

- **Overcommit**: la somma della RAM assegnata alle VM può superare la RAM fisica
  dell'host. È lecito finché i picchi non coincidono, perché le pagine usate di rado
  possono essere riportate su disco.
- **Ballooning**: un driver installato nel guest ("balloon driver") si gonfia
  all'interno della VM; l'hypervisor vede le pagine liberate e le riclaims per altri
  guest. È il meccanismo standard per il memory overcommit automatico nei data center.
- **Memory compression / swap nel guest**: Windows e Linux comprimono in memoria le
  pagine fredde prima di scaricarle su disco, riducendo le page fault verso il disco.
- **Page sharing e deduplicazione**: pagine identiche tra più VM possono condividere
  la stessa memoria fisica con copia-on-write.
- **Memory hot-add**: la RAM può essere aumentata a macchina accesa, con un impatto
  minimo e senza reinstallare il sistema operativo.

## 5. La memoria di massa

Il disco di una VM non è un disco: è un **file** (o un insieme di file) sull'host.

- **Thin provisioning** (predefinito in VirtualBox): il file occupa solo lo spazio
  effettivamente scritto, pur dichiarando una dimensione massima. Un disco "da 64 GB"
  appena creato pesa pochi megabyte.
- **Thick provisioning**: lo spazio è riservato interamente in anticipo. Più
  prevedibile, meno efficiente.
- **Copia-on-write (COW)**: alla prima scrittura su un blocco, il blocco originale viene
  copiato altrove. È la base di snapshot e cloni collegati.
- **Controller virtuale**: l'hypervisor presenta al guest un controller SATA, NVMe o
  **VirtIO**. VirtIO è il più veloce perché il driver del guest è consapevole della
  virtualizzazione ed evita operazioni costose; richiede però driver specifici
  (presenti in Linux e in Windows, installabili con i *Guest Additions* / *integration
  services*).

### Snapshot

Uno **snapshot** congela lo stato della macchina in un istante. In pratica:

1. l'hypervisor crea un **disco differenziale** (in sola lettura) che riceve tutte le
   scritture successive;
2. lo stato in memoria viene salvato soltanto se la macchina è spenta o se si sceglie
   esplicitamente di **ricordare** la macchina.

Da qui derivano le tre regole pratiche:

1. **uno snapshot non è un backup**. È un meccanismo di *annullamento*, pensato per
   esperimenti brevi. I dischi differenziali crescono a ogni scrittura, creano un
   albero di dipendenze e, se la macchina è stata "ricordata", occupano anche GB di
   RAM su disco.
2. **meglio a macchina spenta**, o comunque senza "ricordare lo stato", per evitare
   incoerenze del filesystem e corruzione.
3. **vanno eliminati**: le prestazioni degradano con ogni snapshot ancora in catena.
   È buona norma fare un clone della macchina "pulita" e usare quello per gli
   esercizi ripetibili, come suggerito nelle attività Windows.

### Cloni

- **Clone completo**: una copia indipendente. Richiede tempo e spazio, ma è
  sicuro: si può cancellare l'originale.
- **Clone collegato** (*linked clone*): un disco differenziale che dipende dall'
  originale, del quale va regolata la lettura. È istantaneo, ma l'originale non può
  essere spostato né eliminato. Perfetto per creare gli ambienti di prova.

Il clone completo va sempre accompagnato dal **reinizializzo dell'indirizzo MAC** di
ogni scheda di rete: due VM con lo stesso MAC nella stessa rete provocano conflitti
e comportamenti anomali della rete. Allo stesso modo vanno rigenerati gli
identificatori univoci della macchina (*SID* su Windows, *machine-id* su Linux) se
servono identità di dominio o di rete distinte.

### Esportazione e backup

La macchina si può esportare in formati standard (**OVA/OVF** standardizzati da
OVF, **VDI** di VirtualBox, **VDI/VMDK/QCOW2** specifici dell'hypervisor) e
ricostruire altrove. Il backup robusto resta quello **a freddo**: macchina spenta,
file copiati in un archivio, verifica periodica di ripristino. Backup a macchina
accesa sono possibili con quiescenza della memoria, ma non sono equivalenti.

## 6. La rete

Ogni VM ha una o più **schede di rete virtuali** che l'hypervisor collega a una rete
reale tramite un dispositivo fisico sull'host. Le modalità di collegamento disponibili
in VirtualBox sono:

| Modalità | Come funziona | Quando usarla |
|---|---|---|
| **NAT** (predefinita) | l'hypervisor fa da router: la VM esce su Internet con l'IP dell'host, ma non è raggiungibile dall'esterno | il caso più comune; semplice e sicuro |
| **Ponte** (*bridged*) | la VM si collega direttamente alla rete fisica e ottiene un IP dal router di casa/ufficio, come se fosse un PC a sé | quando servono altri dispositivi della rete per raggiungerla (server, DHCP, stampanti) |
| **Solo host** (*host-only*) | rete isolata fra l'host e le VM, senza accesso a Internet | laboratorio: più VM che devono comunicare solo tra loro e con l'host |
| **Rete interna** | rete isolata fra le VM, senza contatto con host né con la rete fisica | test di sicurezza, simulazione di una rete "sporca" |

In **NAT** si possono definire **regole di inoltro porte** che espongono una porta
dell'host e la inoltrano a una porta della VM: è il modo più semplice per pubblicare un
server di laboratorio, sapendo che l'apertura è sull'host e va chiusa al termine
delle prove.

Attenzione alle impostazioni che influenzano il traffico: la **MTU** (con l'etichettatura
802.1Q e i tunnel la dimensione utile si riduce) e la **velocità della scheda virtuale**
possono essere **limate artificialmente** dall'hypervisor, diventando un collo di
bottiglia non evidente.

Queste modalità sono messe in pratica nell'**Attività 3** (condivisione in rete), dove
si lavora in rete interna — proprio la scelta adatta quando due macchine devono
comunicare fra loro senza essere raggiungibili dall'esterno.

## 7. Periferiche virtuali e integrazione con l'host

L'hypervisor non presenta all'ospite l'hardware reale, ma un insieme di
**dispositivi virtuali**: controller disco virtuale, chipset (ICH9, virtio), timer,
tastiera, mouse, video, controller USB, orologio.

Per offrire funzionalità di comodo esistono i **Guest Additions** (VirtualBox) o gli
**integration services** (VMware, Hyper-V): pacchetti installati *dentro* il guest che
aggiungono driver per l'hardware virtuale e canali di comunicazione con l'host. Tra le
funzionalità tipiche:

- cartelle condivise tra host e guest;
- copia/incolla bidirezionale e trascinamento dei file;
- accelerazione grafica 3D e adattamento automatico alla risoluzione;
- ridimensionamento automatico della finestra;
- sincronizzazione dell'orologio con l'host.

Altre funzioni di comodo, come il **passthrough USB** (cioè l'assegnazione a una VM di
una periferica fisica collegata all'host) e la webcam pass-through, sono invece
funzioni dell'hypervisor, disponibili solo con l'Extension Pack.

**Attenzione di sicurezza**: queste funzioni sono canali di comunicazione
bidirezionali tra due ambienti che dovrebbero restare separati. Condivisione di
cartelle, clipboard e drag-and-drop vanno disattivate quando si esaminano file o
software non fidati: sono i vettori più comuni di fuga di dati (e di exploit) dalle
macchine virtuali. Il passthrough USB è la modalità più delicata in assoluto,
perché espone all'ospite un dispositivo hardware reale.

## 8. Ciclo di vita e manutenzione

Il percorso pratico di una macchina virtuale, identico per un portatile di scuola e
per un server di produzione:

1. **Creazione** — scelta del tipo di sistema, dell'hardware virtuale, della CPU, della
   RAM, del disco, del controller e delle impostazioni firmware.
2. **Configurazione** — rete, utenti, servizi, sicurezza, aggiornamenti.
3. **Istantanea e clonazione** — per poter tornare a un punto noto.
4. **Uso e manutenzione** — aggiornamenti, monitoraggio delle risorse, verifica dei
   backup.
5. **Esportazione o archiviazione** — e verifica periodica che il ripristino
   funzioni davvero.

Riguardo alle risorse, va ricordato che **ogni VM avviata consuma memoria e CPU per
sempre**, anche se inattiva: le VM ferme si sospendono o si spengono, non si lasciano
in esecuzione "tanto per stare lì". Sospensione e snapshot sono economici, ma se lo
snapshot è stato creato con la macchina accesa e *ricordata*, il file della macchina
contiene anche lo stato in memoria.

Un limite spesso ignorato è la **licenza**: il software installato in una VM deve
essere licenziato come qualsiasi altra copia. Nel laboratorio questo vale soprattutto
per Windows, dove l'edizione scelta in fase di installazione (Home, Pro, Education)
determina anche le funzioni disponibili — strumenti come *Utenti e gruppi locali*
(`lusrmgr.msc`) esistono solo nelle edizioni Pro, Enterprise ed Education.

## 9. Pregi e difetti

### Pregi

- **Isolamento**: guasti, errori e reinstallazioni restano confinati alla singola VM.
- **Consolidamento**: decine di servizi su un solo server fisico, con riduzione dei
  costi di acquisto, energia e raffreddamento.
- **Isolamento dei carichi di lavoro**: un picco di CPU o di I/O in una VM non
  compromette le altre.
- **Provisioning delle risorse**: ogni VM si dimensiona in base al proprio carico reale
  e può essere ridimensionata o spostata.
- **Disponibilità e ripristino**: snapshot, cloni, backup e ripristino sono operazioni
  rapide e ripetibili.
- **Flessibilità**: installare e provare sistemi operativi, versioni e architetture
  diverse senza toccare l'hardware.
- **Portabilità**: un ambiente è un insieme di file, copiabile su un'altra macchina o
  su un supporto esterno.
- **Riproducibilità**: si consegna un ambiente identico a quello di sviluppo, evitando
  la classica differenza "funziona sulla mia macchina".
- **Eterogeneità**: un unico hypervisor di tipo 1 Linux ospita Linux, Windows e macOS.
- **Sicurezza e analisi**: ambiente usa-e-getta per analizzare codice sospetto,
  malware o configurazioni, senza rischiare l'host.

### Difetti e limiti

- **Overhead di prestazioni**: le VM non sono veloci come il nativo. Le operazioni
  molto intensive su disco, rete e grafica soffrono maggiormente, e le vCPU in
  sovrallocazione producono tempi di risposta instabili.
- **Consumo di risorse**: l'hypervisor consuma memoria e CPU proprie; la
  virtualizzazione "gratis" non esiste. Su un portatile con 8 GB di RAM, due VM
  Windows 11 sono già al limite.
- **Accesso non immediato all'hardware**: GPU dedicate, porte specifiche, schede di
  rete fisiche, USB particolari restano difficili da usare; il passthrough è
  complesso e a volte instabile.
- **Latenza e sovraccarico di I/O**: se tutte le VM insistono sullo stesso disco
  fisico, le prestazioni crollano. Servono dischi separati, SSD o storage di rete.
- **Complessità operativa**: snapshot dimenticati, cloni non più validi, licenze,
  dischi che occupano più del previsto, configurazioni di rete che si intrecciano.
- **L'hypervisor è un SINGLE POINT OF FAILURE**: con un hypervisor di tipo 2, un
  problema del sistema operativo host ferma tutte le macchine virtuali contemporaneamente.
- **Non è un confine di sicurezza assoluto**: i bug dell'hypervisor esistono e sono
  stati sfruttati (ci sono state evasioni pubblicizzate su VirtualBox e VMware). Per
  analizzare contenuti davvero ostili servono sandbox dedicate, non la VM del PC di
  lavoro.
- **Dimensione**: le macchine occupano molto più spazio di quanto dichiarato, soprattutto
  con catene di snapshot.
- **Aggiornamenti e portabilità**: un'immagine può non avviare su un hypervisor diverso
  o dopo un aggiornamento maggiore senza interventi.

## 10. Esempi d'uso

**Laboratorio didattico** — è il caso di questo repository. Installare più sistemi
operativi sullo stesso portatile, ricreare ambienti identici per ogni studente,
ripetere esercizi distruttivi (formattare, cambiare permessi, disattivare servizi)
senza conseguenze, e poter annullare tutto con uno snapshot.

**Sviluppo e test** — ogni sviluppatore lavora con macchine preconfigurate per
database, server applicativi e ambienti di integrazione, isolate dal proprio PC.
Le VM sono l'antenato diretto dei container, usati ancora quando serve un kernel
diverso, un test di versioni di sistema operativo o l'isolamento completo.

**Server e consolidamento** — un hypervisor di tipo 1 su un server fisico ospita
macchine con ruoli diversi (file server, database, applicazioni, controller di
dominio), con riduzione dei costi e maggiore semplicità di gestione.

**Compatibilità e sistemi legacy** — mantenere in esercizio un sistema operativo o
un'applicazione che non girerebbero su hardware attuale, isolati in una VM con le
proprie licenze.

**Analisi della sicurezza e laboratorio malware** — esaminare file sospetti,
eseguire codice non fidato, ricostruire un attacco, in un ambiente che si può
distruggere. Da abbinare a reti isolate e all'uso di snapshot.

**Formazione** — le VM permettono di far pratica su sistemi operativi, reti e
configurazioni che sarebbe troppo costoso o pericoloso distruggere su hardware reale,
e di mostrare configurazioni identiche a tutti gli allievi.

**Ripristino e continuità operativa** — un server guasto viene ricostruito come
immagine su un'altra macchina; le macchine fungono da copia di sicurezza "calda" e
possono essere migrate a caldo su un altro host fisico per manutenzione senza
interruzione di servizio.

**Ambiente di ricerca e sperimentazione** — configurazioni esotiche, kernel non
standard, prove di rete: si clona, si prova, si butta.

## 11. VM, container o bare metal?

Non sono alternative equivalenti: rispondono a esigenze diverse.

| | **Macchina virtuale** | **Container** | **Bare metal (fisico)** |
|---|---|---|---|
| **Livello di isolamento** | sistema operativo completo, kernel separato | processi con spazi di nomi e cgroups, kernel condiviso | nessuno: è la macchina |
| **Prestazioni** | alto costo di avvio e di I/O | basso costo, vicino al nativo | massime |
| **Tempo di avvio** | secondi o minuti | millisecondi | — |
| **Sovrapposizione dell'OS** | qualsiasi guest | solo lo stesso kernel dell'host | — |
| **Risorse per VM** | pesante, con sovrallocazione possibile | leggere | — |
| **Uso tipico** | sistemi diversi, test, legacy, isolamento forte | servizi, microservizi, CI/CD | carichi estremi, HW dedicato (GPU) |

In questo progetto si usano macchine virtuali perché l'obiettivo è amministrare il
sistema operativo, non eseguire un singolo processo: servono utenti, permessi, gruppi,
servizi e configurazione di rete.

---

# Parte II — Installazione

Le guide di questa sezione costituiscono la **preparazione dell'ambiente** e vanno
seguite **una volta sola**, prima delle attività: tutte le esercitazioni partono da
una macchina virtuale già pronta, con snapshot della situazione "pulita" e cloni
riutilizzabili.

Prima di qualsiasi attività occorre avere una macchina virtuale Windows 11
funzionante, con l'utente `admin`, le Guest Additions installate, uno snapshot
dell'installazione pulita e i due cloni `Windows 1` e `Windows 2`. La guida ad
Alpine Linux prepara invece la base per le attività Linux, ancora in fase di
aggiunta.

## Requisiti e materiali

| Cosa serve | Dettaglio |
|---|---|
| **PC ospitante** | almeno 8 GB di RAM (meglio 16) e 64 GB liberi su disco (meglio SSD) |
| **Virtualizzazione hardware** | Intel VT-x o AMD-V/SVM **attiva nel BIOS/UEFI**, altrimenti l'hypervisor non parte |
| **Oracle VirtualBox 7.x** | dal sito ufficiale `virtualbox.org`: la versione 7 gestisce TPM 2.0 e Secure Boot, richiesti da Windows 11. L'*Extension Pack* va installato solo per uso personale/didattico e serve per passthrough USB e webcam (vedi [§7](#7-periferiche-virtuali-e-integrazione-con-lhost)) |
| **ISO di Windows 11** | dal sito Microsoft, "Scarica l'immagine del disco (ISO)", immagine multi-edizione, lingua italiana; non serve alcun account |
| **ISO di Alpine Linux** | dal sito `alpinelinux.org`, immagine *standard* (quella installabile anche da CD virtuale) |

Se VirtualBox risulta insolitamente lento su un PC Windows, il sospetto è che
Hyper-V, WSL2 o l'"Integrità della memoria" stiano rubando l'ipervisore a
VirtualBox: vedere la tabella dei problemi frequenti nella guida Windows.

## Creare la macchina virtuale Windows 11

📄 [`installazione/creazione_macchina.html`](installazione/creazione_macchina.html)

**Obiettivo.** Costruire da zero la macchina virtuale Windows 11 che fa da base a
tutte le attività Windows, con un'hardware virtuale adeguato, l'installazione già
completata e le condizioni di lavoro dell'aula.

**In sintesi.** Si crea la macchina `Windows` scegliendo come immagine l'ISO di
Windows 11 e come edizione **Windows 11 Pro** (indispensabile: la Home non ha
`lusrmgr.msc`, `gpedit.msc` né l'ingresso in dominio). Si imposta l'installazione
automatica con l'utente `admin`, si assegnano 4 GB di RAM, 2 CPU, un disco da 64 GB
non pre-allocato e si abilita EFI, TPM 2.0 e Secure Boot, che Windows 11 esige. Dopo
l'installazione si installano le Guest Additions, si sospendono gli aggiornamenti e
la sospensione, si attivano estensioni nomi file ed elementi nascosti in Esplora file.
Infine si crea lo snapshot "Installazione pulita" e i due cloni `Windows 1` e
`Windows 2` a MAC reinizializzato, utilizzabili per tutte le attività.

**Argomenti toccati.** Creazione guidata della VM, scelta dell'hardware virtuale
(EFI, TPM 2.0, Secure Boot), installazione automatica di VirtualBox e alternativa
manuale con account locale, Guest Additions, dischi dinamici, scelta dell'edizione,
funzionamento di Windows senza codice di attivazione e licenze alternative
legittime, snapshot e cloni, esportazione in formato OVA per allineare gli altri PC
dell'aula, tabella dei problemi frequenti (virtualizzazione disattivata nel BIOS,
conflitti con Hyper-V/WSL2, blocco TPM, mouse integrato).

**Nota operativa.** Non avviare la macchina prima di aver controllato le impostazioni
del punto 3 della guida (EFI, TPM 2.0, Secure Boot): se Windows 11 si rifiuta di
installarsi, è quasi sempre lì il problema.

**Argomenti teorici da conoscere.** Dalla [Parte I](#parte-i--teoria): [§1](#1-che-cosè-una-macchina-virtuale)
cosa significa installare un sistema operativo dentro un'altra macchina; [§2](#2-architettura-lhypervisor)
VirtualBox è un hypervisor di **tipo 2**, e VT-x/AMD-V va attivata nel BIOS, mentre
TPM 2.0 e Secure Boot sono forniti **virtualmente** dall'hypervisor (senza di essi
Windows 11 non si installa); [§5](#5-la-memoria-di-massa) dischi **dinamici**
(thin provisioning: 64 GB dichiarati che occupano pochi MB), funzionamento di
**snapshot** e **cloni**, perché va reinizializzato il **MAC** e come si esporta in
OVA; [§6](#6-la-rete) la modalità **NAT** usata durante l'installazione; [§7](#7-periferiche-virtuali-e-integrazione-con-lhost)
cosa fanno le **Guest Additions** e perché appunti condivisi e cartelle condivise
vanno disattivati lavorando con file non fidati; [§8](#8-ciclo-di-vita-e-manutenzione)
licenze e differenza tra edizione Home e Pro (alla base dell'obbligo di scegliere
Windows 11 Pro).

## Guida introduttiva: Alpine Linux in macchina virtuale

📄 [`installazione/intro_alpine.html`](installazione/intro_alpine.html)

**Obiettivo.** Allestire una seconda macchina virtuale, leggera e velocissima, basata
su **Alpine Linux**, che fa da base alle attività Linux: rete in NAT, installazione
persistente su disco, gestore dei pacchetti, shell Bash, sincronizzazione
dell'orologio e minimi comfort da console.

**In sintesi.** Dalla ISO live si avvia la macchina con la scheda di rete in **NAT**
e si esegue `setup-alpine`, scegliendo l'interfaccia `eth0` e il metodo `dhcp`, poi
`setup-disk` per installare su disco in modo persistente. Se `apk` riporta
`No mirror found` o `unable to select package`, si verifica la versione con
`cat /etc/alpine-release` e si riscrive `/etc/apk/repositories`, poi `apk update`.
Si installa **Bash** e la si rende shell predefinita (`chsh` o modifica di
`/etc/passwd`), al posto della `ash` di default. Si installa **`chrony`** e si avvia
il servizio NTP per correggere la *clock drift* delle macchine virtuali, si aggiunge
l'editor `micro` e infine i font console più leggibili (pacchetto `font-terminus` o
fattore di scala di VirtualBox).

**Argomenti toccati.** Rete in NAT e indirizzamento DHCP, script guidati
`setup-alpine`/`setup-disk`, repository e indice di `apk`, differenze rispetto a
Ubuntu/Debian (`apk` vs `apt`, **OpenRC** vs `systemd`, `musl libc` vs `glibc`),
cambio della shell predefinita, servizi con `rc-update`/`rc-service`, client NTP con
`chrony`, editor da terminale, font della console e tabella dei comandi principali.

**Argomenti teorici da conoscere.** Dalla [Parte I](#parte-i--teoria): [§1](#1-che-cosè-una-macchina-virtuale)
e [§2](#2-architettura-lhypervisor) guest e hypervisor, [§3](#3-la-cpu-vista-dallospite)
il paragrafo sull'**orologio**: perché la VM perde l'ora dopo sospensioni e snapshot e
perché serve la sincronizzazione NTP (è esattamente ciò che risolve `chrony`),
[§6](#6-la-rete) modalità **NAT** e DHCP, [§7](#7-periferiche-virtuali-e-integrazione-con-lhost)
periferiche virtuali e Guest Additions, [§11](#11-vm-container-o-bare-metal)
differenza tra macchina virtuale e container (Alpine in VM è una macchina
completa, non un container). Concetti base del sistema: differenza fra sistema
operativo *live* e installato su disco, ruolo di `/etc/passwd` e `/etc/shadow`, e
la logica dei repository nel gestore dei pacchetti.

**Nota operativa.** Lasciare la scheda di rete in NAT: è la modalità che condivide
Internet dell'host con il guest ed è sufficiente per tutte le prove. La sospensione
della macchina è la causa più comune di orologio fuori sincro: se `chronyc
tracking` segnala scostamenti, riavviare il servizio.

---

# Parte III — Attività

## Stato del progetto

Le attività sono **in continua aggiunta**: l'elenco di questa sezione non è da
considerarsi completo e viene aggiornato man mano che vengono svolte nuove prove.

Per il momento sono documentate **soltanto attività su Windows**; l'elenco relativo
crescerà sia con nuove attività Windows sia con attività dedicate a
**Linux / Alpine Linux**, che verranno aggiunte in una sezione separata (già
predisposta più in basso).

Tutte le attività si svolgono con **Oracle VirtualBox 7.x** su un PC fisico con
virtualizzazione hardware abilitata nel BIOS/UEFI.

## Sintesi delle attività

| # | Attività | Sintesi | Argomenti teorici da conoscere |
|---|---|---|---|
| **1** | [Utenti e file](#configurazione-windows--attività-1-utenti-e-file) | Clonazione della macchina madre in `Windows 1`/`Windows 2`, rinominamento in `WINDOWS-1`/`WINDOWS-2`, creazione di `utente1` e `utente2`, permessi su `cartella1` (ereditarietà rimossa, diritto *Interactive* eliminato, sola lettura → modifica) | [§2](#2-architettura-lhypervisor), [§5](#5-la-memoria-di-massa) (cloni e MAC); ACL ed ereditarietà, identità speciali, admin vs standard |
| **2** | [Gruppi](#configurazione-windows--attività-2-gruppi) | Creazione di `gruppo1` con `utente1`/`utente2`, autorizzazioni assegnate al gruppo su `cartella2`, verifica con `utente3` fuori gruppo e poi inserito | [§5](#5-la-memoria-di-massa), [§8](#8-ciclo-di-vita-e-manutenzione) (edizione Pro); gruppi locali e token di accesso, nuova sessione |
| **3** | [Condivisione in rete](#configurazione-windows--attività-3-condivisione-in-rete) | Rete interna tra `WINDOWS-1` e `WINDOWS-2`, firewall disattivato, IP statici, accesso a `\\WINDOWS-1` con `rete1`, cartella condivisa `Condivisione1` in sola lettura | [§5](#5-la-memoria-di-massa), [§6](#6-la-rete) (modalità di rete, DHCP/APIPA); SMB, autorizzazioni di condivisione vs NTFS, cache credenziali |

## Attività su Windows

**Prerequisiti.** Le tre attività seguenti si svolgono sulle macchine `WINDOWS-1` e
`WINDOWS-2` ottenute dai cloni della macchina base, quindi richiedono di aver
completato prima la guida [Creare la macchina virtuale
Windows 11](#creare-la-macchina-virtuale-windows-11). Ogni attività indica in
apertura la macchina e lo snapshot da usare, perché le verifiche richiedono spesso
di cambiare utente più volte e quindi di poter tornare a un punto noto.

### Configurazione Windows – Attività 1: utenti e file

📄 [`attività/Conf_windows_att1.html`](attività/Conf_windows_att1.html)

**Obiettivo.** Creare e gestire macchine virtuali Windows 11 e verificare la corretta
separazione tra i diversi ambienti: prima di tutto con il **clonaggio** (una macchina
"madre" da cui derivare le altre due) e con il **rinominamento** del computer, poi
con la gestione degli **account utente** e infine con i **permessi sulle cartelle**.

**In sintesi.** Si installa Windows 11 in una macchina chiamata `Windows` con
l'utente `admin`, se ne fanno due cloni completi (`Windows 1`, `Windows 2`) con nuovi
indirizzi MAC, e si rinominano i computer in `WINDOWS-1` e `WINDOWS-2`. Su una delle
due macchine si creano gli utenti standard `utente1` e `utente2`; poi si lavora sui
permessi: nella cartella `cartella1` si rimuove l'ereditarietà, si elimina il diritto
al gruppo speciale *Interactive* e si concede a `utente2` l'accesso in sola lettura,
per verificarne l'effetto e poi cambiarlo in modifica.

**Argomenti toccati.** Clonaggio completo e reinizializzo del MAC, configurazione
hardware della VM (EFI, TPM 2.0, Secure Boot), installazione non presidiata, nomi
computer, creazione di account locali, distinzione fra account amministratori e
standard, ereditarietà delle autorizzazioni, identità speciali (*Interactive*,
*Everyone*, *Users*), permessi per utente, rimozione dell'ereditarietà.

**Argomenti teorici da conoscere.** Dalla [Parte I](#parte-i--teoria): [§2](#2-architettura-lhypervisor)
che cos'è l'hypervisor e come gestisce i guest, [§5](#5-la-memoria-di-massa)
differenza tra **clone completo** e **clone collegato**, snapshot come punto di
ripristino, perché ogni clone ha bisogno di un **MAC** (e di un **SID**) propri,
[§7](#7-periferiche-virtuali-e-integrazione-con-lhost) cosa fanno le Guest
Additions (schermo ridimensionabile e mouse integrato, utili quando si cambia utente
più volte).
Concetti Windows da padroneggiare prima di iniziare: la
differenza tra account **amministratore** e **standard** (e il token di accesso che
viene costruito al login), la struttura di una **ACL** e le sue voci (**ACE**), il
significato dell'**ereditarietà** delle autorizzazioni e della sua conversione in
autorizzazioni **esplicite**, e le **identità speciali** (*Interactive*,
*Everyone*, *Users*), che non sono gruppi che si possono modificare ma descrittori
calcolati dal sistema.

**Nota operativa.** Creare prima uno snapshot della macchina "pulita": le verifiche
sui permessi richiedono di cambiare utente più volte e l'esercizio deve essere
ripetibile.

### Configurazione Windows – Attività 2: gruppi

📄 [`attività/Conf_windows_att2.html`](attività/Conf_windows_att2.html)

**Obiettivo.** Passare dalla gestione dei permessi **per utente** della prima
attività alla gestione **per gruppo**, verificando che le autorizzazioni si applichino
automaticamente a tutti i membri e che l'aggiunta di un nuovo membro produca effetti
senza toccare le autorizzazioni della cartella.

**In sintesi.** Si creano gli utenti `utente1`, `utente2`, `utente3` e il gruppo
`gruppo1` con dentro `utente1` e `utente2`. Sulla cartella `cartella2` si convertono le
autorizzazioni ereditate in esplicite, si eliminano i diritti dei gruppi *Interactive*,
*Users* ed *Everyone*, lasciando solo `SYSTEM`, `Administrators` e il proprietario, e si
assegna a `gruppo1` l'accesso in sola lettura. Si verifica che i due membri possano
leggere ma non scrivere e che `utente3`, non facendo parte del gruppo, non abbia
accesso. A `gruppo1` si aggiungono poi i diritti di modifica, infine si iscrive
`utente3` al gruppo e si verifica che acquisisca i permessi dopo un nuovo accesso.

**Argomenti toccati.** Creazione di gruppi locali, appartenenza ai gruppi, strumento
`lusrmgr.msc` (disponibile solo nelle edizioni Pro/Enterprise/Education, con
alternativa da riga di comando `net localgroup`), autorizzazioni assegnate a un gruppo,
effetto della conversione dell'ereditarietà, necessità di una **nuova sessione** perché
le variazioni di appartenenza ai gruppi vengano applicate.

**Argomenti teorici da conoscere.** Dalla [Parte I](#parte-i--teoria): [§5](#5-la-memoria-di-massa)
snapshot e cloni come base di partenza dell'esercizio, [§8](#8-ciclo-di-vita-e-manutenzione)
perché l'edizione scelta in fase di installazione condiziona gli strumenti
disponibili (`lusrmgr.msc` esiste solo in Pro/Enterprise/Education). Concetti Windows
da padroneggiare: l'idea stessa di **gestire i permessi per ruolo** anziché per
singolo utente, la distinzione fra **gruppo locale** e identità speciali, e soprattutto
il motivo per cui l'aggiunta a un gruppo non ha effetto subito: l'elenco dei gruppi
finisce nel **token di accesso** costruito al momento del login, quindi servono un
disconnessione e un nuovo accesso. Riandare anche al concetto di **ACL** e di
autorizzazioni **esplicite** trattato nell'attività 1.

**Nota operativa.** Se si riutilizza `Windows 1` dell'attività 1, gli utenti
`utente1`/`utente2` esistono già: usare `Windows 2` o ripristinare lo snapshot.

### Configurazione Windows – Attività 3: condivisione in rete

📄 [`attività/Conf_windows_att3.html`](attività/Conf_windows_att3.html)

**Obiettivo.** Passare dai permessi NTFS applicati localmente (attività 1 e 2) alla
**condivisione delle risorse su rete**: mettere in comunicazione due macchine virtuali
e verificare che l'accesso a una cartella remota sia governato da credenziali e
permessi, non dalla presenza fisica del disco.

**In sintesi.** Le due macchine vengono collegate in modalità **Rete interna** di
VirtualBox, che le isola dalla rete esterna, con lo stesso nome di rete su entrambe e
MAC diversi. Si disabilita il firewall di Windows Defender, altrimenti blocca i
pacchetti `ping`, e si assegnano indirizzi IP statici (192.168.10.1 e 192.168.10.2,
maschera 255.255.255.0) perché nella rete interna non esiste un server DHCP. Su
`WINDOWS-1` si crea l'utente `rete1`, poi da `WINDOWS-2`, come `rete2`, si accede a
`\\WINDOWS-1` fornendo le credenziali di `rete1`. Infine `Cartella1` viene condivisa
come `Condivisione1` con diritti di sola lettura per `rete1`, e si verifica che
l'utente remoto possa leggere ma non scrivere.

**Argomenti toccati.** Modalità di rete di VirtualBox (NAT, ponte, solo host, rete
interna) e loro implicazioni, MAC e addressing statico, assenza di DHCP nella rete
interna e indirizzi APIPA `169.254.x.x`, firewall Windows Defender come causa
tipica dei ping che non funzionano, condivisione di rete in Windows, autorizzazioni
di condivisione, autenticazione con account locali e cache delle credenziali
(`net use * /delete`), condivisioni amministrative nascoste come `C$`, risoluzione dei
nomi e uso dell'indirizzo IP al posto del nome.

**Argomenti teorici da conoscere.** Dalla [Parte I](#parte-i--teoria): [§6](#6-la-rete)
la tabella delle **modalità di rete** di VirtualBox (NAT, ponte, solo host, rete
interna), perché nella rete interna non c'è un server **DHCP** e cosa succede con
gli indirizzi **APIPA** `169.254.x.x`, ruolo del firewall; [§5](#5-la-memoria-di-massa)
perché i due cloni devono avere **MAC** distinti; [§7](#7-periferiche-virtuali-e-integrazione-con-lhost)
attenzione a non confondere le **cartelle condivise host-guest** di VirtualBox (un
canale dell'hypervisor, non un servizio di rete) con la **condivisione SMB** fra due
guest, che è quello che si esercita qui. Concetti Windows da padroneggiare: cos'è
**SMB/CIFS** e come un'esplorazione di rete usa credenziali, la differenza fra
**autorizzazioni di condivisione** e **autorizzazioni NTFS** (in caso di conflitto
vince la più restrittiva), il comportamento della **cache delle credenziali** e il
comando `net use * /delete`, infine risoluzione dei nomi (NetBIOS/mDNS) e uso
dell'indirizzo IP quando il nome non viene risolto.

**Nota operativa.** Le due macchine devono stare sulla stessa rete interna con lo
stesso nome (per esempio `intnet`): se i cloni sono stati creati con l'opzione di
reinizializzo del MAC gli indirizzi sono già diversi, altrimenti rigenerare il MAC
manualmente. Il firewall disattivato è accettabile solo perché la rete è isolata:
riattivarlo al termine dell'esercizio.

## Attività su Linux (Alpine Linux e Bash)

Questa sezione è **predisposta ma ancora vuota**: le attività dedicate a Linux non
sono state ancora inserite. Verranno pubblicate qui man mano, con lo stesso formato
delle attività Windows (documento HTML stampabile, obiettivo, sintesi e argomenti
teorici da conoscere).

La base di partenza è la guida introduttiva già presente nel repository e descritta
in [Parte II](#guida-introduttiva-alpine-linux-in-macchina-virtuale), che copre
l'installazione di Alpine Linux in macchina virtuale, la gestione della rete, del
gestore dei pacchetti e della shell:

📄 [`installazione/intro_alpine.html`](installazione/intro_alpine.html) — *Guida
introduttiva: Alpine Linux in Macchina Virtuale* (rete in NAT, `setup-alpine`,
`setup-disk`, ripristino dei repository con `apk`, Bash come shell predefinita,
sincronizzazione dell'ora con `chrony`, editor `micro`, font della console e tabella
dei comandi principali).

**Punti di partenza previsti per le attività Linux.**

- **Installazione e configurazione di Alpine in VM** con `setup-alpine`, rete in NAT o
  in modalità solo host, `setup-disk` per l'installazione persistente su disco.
- **Il gestore dei pacchetti `apk`** e la differenza rispetto a `apt`/`dnf`, inclusa la
  gestione dei repository in `/etc/apk/repositories` e gli errori di selezione dei
  pacchetti.
- **Bash**: installazione, impostazione come shell predefinita con `chsh`, gestione di
  `ash` e delle differenze di sintassi.
- **OpenRC** al posto di systemd: `rc-update`, `rc-service` e `/etc/init.d`.
- **Sincronizzazione dell'orologio con NTP** (`chrony`), collegata direttamente al
  problema della *clock drift* delle macchine virtuali descritto in
  [§3](#3-la-cpu-vista-dallospite).
- **Permessi, proprietari e gruppi** su file e cartelle (`chmod`, `chown`, `chgrp`),
  ripresi in chiave POSIX sulle attività Windows.
- **Gestione degli utenti e dei gruppi** (`adduser`, `addgroup`, file `/etc/passwd`,
  `/etc/group`, `/etc/shadow`).
- **Rete in Alpine**: configurazione dell'interfaccia, DHCP, `/etc/network/interfaces`,
  diagnostica con `ip`, `ping`, `ss`, `dig`.

---

## Riferimenti

- Oracle VirtualBox – Manuale utente: <https://docs.oracle.com/virtualbox/>
- Microsoft – Panoramica sull'hypervisor Hyper-V:
  <https://learn.microsoft.com/it-it/windows-server/virtualization/hyper-v/>
- Microsoft – Identità speciali e descrittori di sicurezza:
  <https://learn.microsoft.com/it-it/windows/security/identity-protection/access-control/special-identities>
- Alpine Linux – Documentazione: <https://wiki.alpinelinux.org/wiki/Main_Page>
- Alpine Linux – `apk(8)`: <https://wiki.alpinelinux.org/wiki/Alpine_Package_Keeper>
- QEMU/KVM – Documentazione: <https://www.qemu.org/docs/master/>
