# Il diario di bordo di Windows

### Laboratorio sui registri eventi: diventa un detective dei log

**Classe:** 3ª Informatica
**Lavori:** in coppia, ognuno con la propria macchina virtuale
**Durata:** 3 incontri da 2 ore

**Nomi della coppia:** ______________________ e ______________________

---

## Di cosa si tratta?

Ogni volta che Windows si accende, si spegne, avvia un programma, ferma un servizio o qualcuno sbaglia la password, **scrive una riga in un diario**. Questo diario si chiama **registro eventi** e si consulta con il **Visualizzatore eventi**.

Chi lavora nell'informatica lo usa ogni giorno per:

- capire **perché un computer si è bloccato**
- scoprire **chi ha fatto cosa** e **quando**
- accorgersi se qualcuno sta provando a entrare in un sistema senza permesso

Alla fine del laboratorio saprai fare tutte e tre le cose. L'ultimo incontro sarà una vera **indagine**: scoprirai cosa è successo su un computer solo leggendo i suoi log.

## Cosa sarai in grado di fare

Alla fine potrai dire "so farlo" a queste cose:

- [ ] Spiegare cos'è un evento e a cosa serve un registro
- [ ] Aprire il Visualizzatore eventi e leggere un evento (origine, ID, livello, data)
- [ ] Distinguere i registri Applicazione, Sicurezza, Sistema e Installazione
- [ ] Filtrare gli eventi e creare una visualizzazione personalizzata
- [ ] Interrogare i log da PowerShell con `Get-WinEvent` e da prompt con `wevtutil`
- [ ] Creare eventi tuoi e far partire un'azione automatica quando compaiono
- [ ] Ricostruire una cronologia partendo solo dai log

---

## Prima di iniziare (checklist rapida)

- [ ] Hai fatto uno **snapshot "pulito"** della VM? (così puoi sempre tornare indietro)
- [ ] Sai accedere come **amministratore** e come utente **`studente1`**?
- [ ] Apri **PowerShell come amministratore**: senza, il registro Sicurezza non si legge
- [ ] Sai dove salvare il lavoro a fine ora (cartella condivisa o repository)?

> **Regola d'oro:** i log contengono dati personali, come i nomi utente. Si analizzano **solo sulle macchine del laboratorio** o su quelle tue. Mai sul computer di qualcun altro senza permesso.

---

## Incontro 1: Conosciamo i registri

### Come è fatto un evento

Ogni evento ha sempre questi campi. Imparali, ti serviranno ovunque:

| Campo | Cosa ti dice |
|---|---|
| **Data e ora** | Quando è successo |
| **Origine** | Chi lo ha scritto (un servizio, un programma, il sistema) |
| **ID evento** | Un numero che identifica il tipo di fatto |
| **Livello** | Quanto è importante: Informazioni, Avviso, Errore, Critico |
| **Utente / Computer** | Con quale account e su quale macchina |

### Missione 1: Esplora

Apri il Visualizzatore eventi (premi Win + R, scrivi `eventvwr.msc`, premi Invio).

Compila:

| Registro | Quanti eventi contiene? | A cosa pensi che serva? |
|---|---|---|
| Applicazione | | |
| Sicurezza | | |
| Sistema | | |
| Installazione | | |

### Missione 2: Schede evento

Scegli **3 eventi**, uno per livello diverso, e compila una scheda per ciascuno.

| | Evento 1 | Evento 2 | Evento 3 |
|---|---|---|---|
| Livello | | | |
| Origine | | | |
| ID | | | |
| Cosa significa (con parole tue) | | | |

### Missione 3: Caccia agli ID

Nel registro **Sistema**, cerca questi ID e scrivi quando compare l'ultima volta:

| ID | Significato | Ultima volta (data/ora) |
|---|---|---|
| 6005 / 6006 | Avvio / arresto del servizio registro eventi (ti dice quando il PC è stato acceso e spento) | |
| 41 | Riavvio imprevisto (Kernel-Power) | |
| 1074 | Arresto o riavvio avviato da un utente o da un processo | |
| 7036 | Un servizio ha cambiato stato | |

> **Suggerimento:** usa "Filtra registro corrente" nel pannello a destra e scrivi l'ID nel campo apposito.

### Missione 4: Provoca un evento

1. Apri `services.msc`
2. Trova **Spooler di stampa**, fermalo e poi riavvialo
3. Torna nel registro Sistema e cerca gli eventi **7036** appena generati

Hai trovato entrambi (arresto e avvio)? Scrivi qui l'ora di ciascuno: ____________ / ____________

### Missione 5: Le impostazioni del log

Tasto destro sul registro Sistema → **Proprietà**. Annota:

- Dimensione massima del log: ____________
- Cosa succede quando si riempie? ____________________________________

**Domanda per riflettere:** cosa potrebbe succedere se il log fosse troppo piccolo? E troppo grande su un disco quasi pieno?

---

## Incontro 2: Filtri, sicurezza e riga di comando

### Parte A: Il registro Sicurezza

Qui Windows annota chi entra e chi prova a entrare.

| ID | Significato |
|---|---|
| 4624 | Accesso riuscito |
| 4625 | Accesso **non** riuscito |
| 4634 | Disconnessione |
| 4720 | Account utente creato |
| 4672 | Accesso con privilegi speciali |

**Missione:**

1. Prova ad accedere come `studente1` con la **password sbagliata per 3 volte**
2. Poi accedi con la **password giusta**
3. Torna come amministratore e ricostruisci la sequenza dai log

Compila la cronologia:

| Ora | ID | Cosa è successo |
|---|---|---|
| | | |
| | | |
| | | |
| | | |

Nell'evento 4624 cerca il **Tipo di accesso**: 2 = interattivo (alla tastiera), 3 = di rete, 7 = sblocco schermo. Quale hai trovato tu? ____________

### Parte B: Filtri e visualizzazioni personalizzate

Scorrere migliaia di eventi non ha senso: bisogna **filtrare**.

1. Usa "Filtra registro corrente" per mostrare solo gli **Errori** delle ultime 24 ore
2. Crea una **visualizzazione personalizzata** chiamata "Errori ultime 24 ore"
3. Creane una seconda chiamata "Tentativi di accesso falliti" (registro Sicurezza, ID 4625)
4. Esporta una visualizzazione (`.xml`) e un registro (`.evtx`) e salvali nella cartella di consegna

### Parte C: Da riga di comando

Gli informatici veri automatizzano. Apri **PowerShell come amministratore** e prova:

```powershell
# Ultimi 10 eventi del registro Sistema
Get-WinEvent -LogName System -MaxEvents 10

# Solo errori (livello 2) delle ultime 24 ore
Get-WinEvent -FilterHashtable @{LogName='System'; Level=2; StartTime=(Get-Date).AddDays(-1)}

# Accessi falliti
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}

# Equivalente "classico"
wevtutil qe System /c:5 /rd:true /f:text
```

Cosa cambia tra `Get-WinEvent` e `wevtutil`? Scrivilo con parole tue: ______________________________________

**Sfida bonus:** conta gli eventi per origine con `Group-Object` ed esporta il risultato in un file CSV. Suggerimento: ti serviranno `Group-Object`, `Sort-Object` ed `Export-Csv`.

---

## Incontro 3: Automazione e indagine finale

### Parte A: Crea i tuoi eventi

Puoi scrivere tu stesso nel registro con questo comando:

```cmd
eventcreate /T INFORMATION /ID 100 /L APPLICATION /SO LabInformatica /D "Avvio esercitazione"
```

**Missione:** crea almeno 3 eventi con **ID** e **livelli diversi** (INFORMATION, WARNING, ERROR) e ritrovali nel registro Applicazione.

| ID usato | Livello | Descrizione | Trovato? |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

### Parte B: Windows reagisce da solo

Sai far scattare un'azione automatica quando compare un certo evento?

1. Nel Visualizzatore eventi seleziona il tuo evento con ID 100
2. Tasto destro → **Collega attività a questo evento**
3. Come azione scegli di avviare un programma o uno script che scrive una riga in un file di testo
4. Genera di nuovo l'evento 100 e controlla che il file si aggiorni

Funziona? [ ] Sì [ ] No. Se no, cosa hai provato per risolvere? ______________________

### Parte C: Progetto finale "Indagine forense in laboratorio"

È il momento di mettere alla prova tutto quello che hai imparato.

**Come funziona:**

1. Ogni coppia compie una sequenza di azioni sulla propria VM (accessi sbagliati, creazione di un utente, arresto di un servizio, riavvio forzato) e se la annota **in segreto**
2. Poi le coppie **si scambiano le VM**
3. Senza aver visto le note dei compagni, ricostruite cosa è successo usando solo i log

**Cosa devi consegnare: un rapporto con**

- [ ] **Cronologia** ricostruita, con data, ora e ID di ogni evento importante
- [ ] **Schermate** dei log che hanno provato quello che dici
- [ ] **Conclusioni:** cosa è accaduto e quale account lo ha fatto
- [ ] Un confronto finale con le note della coppia avversaria: avete indovinato tutto?

**Schema per la cronologia:**

| Ora | ID | Registro | Cosa è successo | Quale account |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

### Sfide extra (per chi finisce prima)

- Configura le **sottoscrizioni eventi** tra due VM (Windows Event Collector e WinRM)
- Scrivi uno script PowerShell che **segnala gli accessi falliti ripetuti**
- Cancella il registro Sicurezza e cerca l'evento **1102**: cosa ti dice? Perché è così importante per chi indaga?

---

## Come verrai valutato

| Cosa guardiamo | Peso |
|---|---|
| La cronologia che hai ricostruito è corretta | 35% |
| Usi bene filtri, visualizzazioni e comandi | 25% |
| Il rapporto è chiaro e ben fatto | 20% |
| Hai completato le schede dei primi due incontri | 10% |
| Collabori bene con il compagno e lavori con metodo | 10% |

---

## Se qualcosa non funziona

| Problema | Cosa fare |
|---|---|
| Il registro Sicurezza non si apre o è vuoto | Hai aperto il programma **come amministratore**? |
| Ci sono pochissimi eventi | La VM è nuova: genera tu gli eventi (riavvii, servizi, accessi) |
| Non trovi un evento | Controlla il registro giusto e l'intervallo di tempo del filtro |
| Hai combinato un disastro | Ripristina lo **snapshot pulito** e ricomincia |

---

## Alla fine dell'ora

- [ ] Salva il lavoro nella cartella di consegna
- [ ] Controlla che i file esportati (`.xml`, `.evtx`, `.csv`) ci siano
- [ ] Ripristina lo snapshot della VM se richiesto dal docente

**Autovalutazione:** su una scala da 1 a 5, quanto ti senti sicuro nel leggere un registro eventi? ______

Fai una breve descrizione del registro eventi visto sino ad ora_____________________________
