# Attività di laboratorio (2 VM): configurare l'archivio di StudioVerdi Srl

**Argomenti:** utenti, gruppi, criteri password, permessi NTFS, condivisioni di rete, verifiche da una postazione client, tutto da Prompt dei comandi
**Durata:** 3-4 ore (due lezioni)
**Modalità:** **individuale**, con **due macchine virtuali** a testa
**Materiale:** due VM Windows 10/11 sulla stessa rete virtuale, Prompt dei comandi **come amministratore**, la guida `guida-utenti-gruppi-permessi-windows.md`

---

## 1. Obiettivi

Al termine dell'attività sarai in grado di:

- creare e gestire utenti e gruppi locali da riga di comando;
- impostare criteri di password e di blocco account;
- assegnare permessi NTFS a gruppi con `icacls`, applicando il principio del privilegio minimo;
- condividere una cartella in rete con `net share` e capire come si combinano permessi di condivisione e permessi NTFS;
- verificare la configurazione **come la vedrebbe un dipendente**, collegandoti da un altro PC con `net use`;
- documentare il lavoro in modo professionale.

---

## 2. Lo scenario

**StudioVerdi Srl** è una piccola azienda di distribuzione di articoli per ufficio con sei dipendenti, un tecnico informatico e uno stagista appena arrivato.

La titolare, Laura Russo, ha acquistato un nuovo PC che farà da **archivio documenti** dell'azienda: i dipendenti dovranno collegarsi **dai loro PC di ufficio, tramite la rete interna**, per aprire e salvare i file. Finora i documenti erano in una cartella senza protezioni: pochi mesi fa un file di preventivi è stato cancellato per errore e i dati degli stipendi sono stati letti da chi non doveva.

**Tu sei il tecnico informatico incaricato** di configurare l'archivio prima di lunedì mattina e di verificare che funzioni da un PC di ufficio. Il promemoria della titolare:

> *"Voglio che ognuno veda solo i documenti del proprio reparto. Il magazzino deve poter lavorare in autonomia, i commerciali devono poter controllare le giacenze ma non modificarle, io devo poter leggere tutto ma non devo rischiare di cancellare qualcosa per sbaglio. Lo stagista può solo consultare i documenti comuni, e a fine stage il suo accesso deve chiudersi da solo. Le password devono essere solide e dopo troppi tentativi sbagliati l'account deve bloccarsi."*

---

## 3. Le due macchine virtuali

| VM | Nome PC | Ruolo | Dove si lavora |
|---|---|---|---|
| VM 1 | `ARCHIVIO` | Il PC che ospita i documenti: qui si creano utenti, gruppi, cartelle, permessi e condivisione | Tutte le fasi di configurazione |
| VM 2 | `CLIENT` | Il PC di ufficio di un dipendente: serve a provare l'accesso come lo farebbero gli utenti reali | Fasi di verifica |

Le due VM devono stare sulla **stessa rete virtuale** (ad esempio "Rete NAT" in VirtualBox, o una rete privata/interna nel programma che usi) e vedersi tra loro.

Gli utenti **esistono solo su `ARCHIVIO`**. Da `CLIENT` ci si collegherà con le loro credenziali, scrivendo il nome utente come `ARCHIVIO\nomeutente`.

---

## 4. Chi lavora in azienda

| Nome e cognome | Nome utente | Ruolo | Reparto / gruppi |
|---|---|---|---|
| (tu) | `adminit` | Tecnico informatico | Amministratori di `ARCHIVIO` |
| Laura Russo | `lrusso` | Titolare | Direzione, Dipendenti |
| Marta Rossi | `mrossi` | Responsabile amministrativa | Amministrazione, Dipendenti |
| Anna Bianchi | `abianchi` | Impiegata amministrativa | Amministrazione, Dipendenti |
| Giulio Verdi | `gverdi` | Commerciale | Commerciale, Dipendenti |
| Sara Neri | `sneri` | Commerciale | Commerciale, Dipendenti |
| Paolo Gialli | `pgialli` | Magazziniere | Magazzino, Dipendenti |
| Tommaso Stage | `tstage` | Stagista (fino al 31/01/2027) | Stagisti |

**Gruppi da creare:** `Direzione`, `Amministrazione`, `Commerciale`, `Magazzino`, `Dipendenti`, `Stagisti`.

---

## 5. Requisiti di sicurezza

**Criteri password e blocco account**

| Criterio | Valore richiesto |
|---|---|
| Lunghezza minima password | 10 caratteri |
| Durata massima password | 60 giorni |
| Durata minima password | 1 giorno |
| Password precedenti non riutilizzabili | 5 |
| Tentativi errati prima del blocco | 5 |
| Durata del blocco | 15 minuti |
| Finestra di osservazione dei tentativi | 15 minuti |

**Altre regole**

1. Tutti gli account iniziano con la password temporanea `Cambiami2026!` e devono **cambiarla al primo accesso** (si imposta per ultimo, dopo i test).
2. L'account **Ospite** (*Guest*) e l'**Administrator** integrato devono essere disattivati su `ARCHIVIO`.
3. L'account dello stagista deve **scadere il 31/01/2027**.
4. Il tecnico `adminit` è l'unico utente nel gruppo degli amministratori di `ARCHIVIO`.

---

## 6. Cartelle, permessi NTFS e condivisione

Crea su `ARCHIVIO` la struttura `C:\Azienda` con cinque sottocartelle. Nella tabella: **M** = modifica, **L** = sola lettura (lettura ed esecuzione), **–** = nessun accesso.

| Cartella | Direzione | Amministrazione | Commerciale | Magazzino | Dipendenti | Stagisti |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| `C:\Azienda\Direzione` | M | – | – | – | – | – |
| `C:\Azienda\Amministrazione` | L | M | – | – | – | – |
| `C:\Azienda\Commerciale` | L | – | M | – | – | – |
| `C:\Azienda\Magazzino` | L | – | L | M | – | – |
| `C:\Azienda\Comune` | – | – | – | – | M | L |

In tutte le cartelle gli **Administrators** e **SYSTEM** hanno controllo completo. Nessun altro gruppo (in particolare `Users` e `Authenticated Users`) deve avere accesso.

**Condivisione di rete:** la cartella `C:\Azienda` va condivisa con il nome `Azienda`, con questi permessi **di condivisione**:

| Gruppo | Permesso di condivisione |
|---|---|
| `Dipendenti` | Modifica (`CHANGE`) |
| `Stagisti` | Lettura (`READ`) |

I permessi di condivisione sono **più larghi** della tabella NTFS: a decidere cosa si può davvero fare sarà il più restrittivo dei due livelli.

---

## 7. Fasi di lavoro

Per ogni fase scrivi i comandi che hai usato nel **registro di configurazione** (sezione 11). I riferimenti indicano le sezioni della guida.

### Fase 0: preparazione delle VM (su entrambe)

1. Assegna i nomi `ARCHIVIO` e `CLIENT` e riavvia.
2. Controlla che entrambe siano sulla stessa rete virtuale e leggi i loro indirizzi IP.
3. Verifica la comunicazione: da `CLIENT` raggiungi `ARCHIVIO` con `ping`, prima per nome e poi, se il nome non si risolve, per indirizzo IP.
4. Se il ping fallisce, controlla il profilo di rete (deve essere **Privato**) e il firewall (la regola *Condivisione file e stampanti* deve essere attiva su `ARCHIVIO`).

> **Suggerimenti:** `hostname`, `ipconfig`, `ping NOME`. Per rinominare il PC puoi usare PowerShell da CMD: `powershell -Command "Rename-Computer -NewName ARCHIVIO -Restart"`. Scrivi gli IP nel registro: ti serviranno se la risoluzione dei nomi non funziona.

### Fase 1 (su `ARCHIVIO`): criteri password e blocco account

Imposta i criteri della sezione 5 con un unico comando e verifica il risultato.
*Riferimento: guida, sezione 4.*

### Fase 2 (su `ARCHIVIO`): creazione dei gruppi

Crea i sei gruppi e controlla con un comando che esistano tutti.
*Riferimento: guida, sezione 5.*

> **Suggerimento:** il ciclo `for` di CMD ripete un comando per più nomi: `for %G in (uno due tre) do echo %G`. In un file `.bat` la variabile si scrive `%%G`.

### Fase 3 (su `ARCHIVIO`): creazione degli utenti

Crea i sette utenti della tabella (e `adminit` se non esiste già) con nome completo e password temporanea. **Non** impostare ancora l'obbligo di cambio password. Imposta la scadenza dell'account dello stagista.
*Riferimento: guida, sezioni 2 e 3.*

### Fase 4 (su `ARCHIVIO`): appartenenza ai gruppi

Inserisci ogni utente nei gruppi della sezione 4. Verifica l'appartenenza di almeno tre utenti con due metodi diversi.
*Riferimento: guida, sezioni 5 e 6.*

### Fase 5 (su `ARCHIVIO`): account da disattivare

Disattiva l'account Ospite e l'Administrator integrato e controlla l'esito.

> **Attenzione:** i nomi degli account integrati dipendono dalla lingua di Windows (*Ospite* e *Amministratore* nelle versioni italiane). Verificali con `net user`.

### Fase 6 (su `ARCHIVIO`): cartelle, permessi e condivisione

1. Crea `C:\Azienda` e le cinque sottocartelle.
2. Su `C:\Azienda`: interrompi l'ereditarietà conservando le voci, rimuovi `Users` e `Authenticated Users`, poi consenti a `Dipendenti` e `Stagisti` la sola lettura **limitata a quella cartella**.
3. Per ogni sottocartella assegna i permessi della tabella della sezione 6.
4. Controlla ogni cartella con `icacls` e confronta con la tabella.
5. Condividi `C:\Azienda` con il nome `Azienda` e i permessi di condivisione richiesti. Controlla il risultato con `net share Azienda`.
*Riferimento: guida, sezione 7.*

> **Suggerimenti:** le sottocartelle ereditano da `C:\Azienda` solo ciò che ha i flag `(OI)(CI)`: rifletti su cosa significa per `Administrators` e `SYSTEM`. Per la condivisione consulta `net share /?`: l'opzione `/grant` si può ripetere più volte.

### Fase 7 (da `CLIENT`): verifiche come un dipendente

Esegui i test della sezione 8 da `CLIENT`. Per collegarti come un utente:

```
net use Z: \\ARCHIVIO\Azienda /user:ARCHIVIO\gverdi *
```

L'asterisco fa digitare la password in modo nascosto. Poi lavori sull'unità `Z:` come farebbe l'utente (`dir Z:\Magazzino`, `echo prova > Z:\Commerciale\prova.txt`, ...).

**Prima di cambiare utente** devi chiudere la connessione, perché Windows non permette due identità diverse verso lo stesso server:

```
net use * /delete /y
```

Altri comandi utili: `net view \\ARCHIVIO` (elenca le condivisioni), `net use` (mostra le connessioni aperte).

> **Importante:** completa **tutti i test** prima della fase 8. Con l'obbligo di cambio password attivo i collegamenti non funzionerebbero.

### Fase 8 (su `ARCHIVIO`): chiusura

1. Dopo i test, imposta per tutti gli utenti l'obbligo di cambiare la password al primo accesso.
2. Da `CLIENT` riprova a collegarti come `gverdi`: osserva cosa succede (test 18).
3. Prepara la relazione per la titolare (sezione 9).

---

## 8. Test di verifica

Compila la colonna "Esito ottenuto" con **OK** o **NO**; se il risultato non è quello atteso, correggi la configurazione su `ARCHIVIO` e ripeti il test. Tutti i test da `CLIENT` usano il percorso `\\ARCHIVIO\Azienda\...` (o l'unità `Z:`).

| N. | Da | Utente | Azione | Esito atteso | Esito ottenuto |
|---|---|---|---|---|---|
| 1 | CLIENT | `gverdi` | Aprire `Amministrazione` | Accesso negato | |
| 2 | CLIENT | `gverdi` | Creare un file in `Commerciale` | Riuscito | |
| 3 | CLIENT | `gverdi` | Leggere i file in `Magazzino` | Riuscito | |
| 4 | CLIENT | `gverdi` | Creare un file in `Magazzino` | Accesso negato | |
| 5 | CLIENT | `pgialli` | Creare un file in `Magazzino` | Riuscito | |
| 6 | CLIENT | `pgialli` | Aprire `Commerciale` | Accesso negato | |
| 7 | CLIENT | `mrossi` | Creare un file in `Amministrazione` | Riuscito | |
| 8 | CLIENT | `mrossi` | Aprire `Direzione` | Accesso negato | |
| 9 | CLIENT | `lrusso` | Leggere i file in `Amministrazione` | Riuscito | |
| 10 | CLIENT | `lrusso` | Creare un file in `Amministrazione` | Accesso negato | |
| 11 | CLIENT | `tstage` | Leggere i file in `Comune` | Riuscito | |
| 12 | CLIENT | `tstage` | Creare un file in `Comune` | Accesso negato | |
| 13 | CLIENT | `tstage` | Aprire `Commerciale` | Accesso negato | |
| 14 | CLIENT | `sneri` | `net view \\ARCHIVIO` | Compare la condivisione `Azienda` | |
| 15 | CLIENT | `tstage` | Collegarsi con password sbagliata 5 volte di seguito, poi con quella giusta | Account bloccato | |
| 16 | ARCHIVIO | `adminit` | `net user tstage`: leggere la scadenza dell'account | 31/01/2027 | |
| 17 | ARCHIVIO | `adminit` | Sbloccare `tstage` dopo il test 15 | Account di nuovo utilizzabile | |
| 18 | CLIENT | `gverdi` | Collegarsi dopo l'obbligo di cambio password | Collegamento rifiutato (password da cambiare) | |

> Esegui il test 15 per ultimo tra quelli che usano `tstage`; il test 17 serve a ripristinarlo. Per sbloccare l'account vedi la guida, sezione 4.2.

---

## 9. Consegna

Consegna **un file** (documento o markdown) con:

1. il **registro di configurazione**: per ogni fase i comandi usati, in ordine, con una riga di spiegazione e l'indicazione della VM su cui sono stati eseguiti;
2. la **tabella dei test** compilata;
3. tre **schermate**: `icacls` su una cartella a scelta, `net share Azienda`, e un test da `CLIENT` con accesso negato;
4. una **relazione breve (10-15 righe)** per la titolare, in linguaggio non tecnico, che spiega cosa è stato fatto e perché i dati sono ora più protetti.

---

## 10. Domande di riflessione

1. Perché si assegnano i permessi a **gruppi** e non ai singoli utenti? Cosa succederebbe se arrivasse un nuovo commerciale?
2. Se `gverdi` appartenesse anche al gruppo `Magazzino`, quali permessi avrebbe sulla cartella `Magazzino`?
3. Perché è sconsigliato usare il permesso **Nega** invece di non concedere l'accesso?
4. Quando ti colleghi da `CLIENT`, i permessi che valgono sono quelli della **condivisione**, quelli **NTFS** o entrambi? Quale prevale? Porta un esempio preso dai tuoi test.
5. Perché la condivisione è stata creata con permessi larghi (`CHANGE` ai dipendenti) e non con quelli esatti di ogni reparto? Dove conviene controllare gli accessi in modo fine?
6. Cosa cambierebbe se `tstage` avesse `CHANGE` sulla condivisione ma `RX` su NTFS? E il contrario?
7. Una soglia di blocco di **2 tentativi** sarebbe una buona idea? E una durata di blocco di **0 minuti**?
8. Cosa accade al profilo e ai file dello stagista dopo il 31/01/2027?
9. Quali vantaggi darebbe un **dominio** con Active Directory a un'azienda con 20 PC rispetto a questa configurazione con account locali su una sola macchina?

---

## 11. Registro di configurazione (modello)

| Fase | VM | Comando | Cosa fa |
|---|---|---|---|
| 0 | ARCHIVIO / CLIENT | | |
| 1 | ARCHIVIO | | |
| 2 | ARCHIVIO | | |
| 3 | ARCHIVIO | | |
| 4 | ARCHIVIO | | |
| 5 | ARCHIVIO | | |
| 6 | ARCHIVIO | | |
| 7 | CLIENT | | |
| 8 | ARCHIVIO / CLIENT | | |

---

## 12. Sfide bonus

1. **Script:** scrivi un file `.bat` che esegue le fasi 1-6 su `ARCHIVIO` in modo ripetibile.
2. **Postazione sicura:** su `CLIENT` crea un utente standard `ufficio`, togli i privilegi di amministratore all'utente di uso quotidiano e disattiva l'account Ospite. Spiega che rischio riduce.
3. **Orari:** limita l'accesso di `tstage` ai giorni lavorativi dalle 08:00 alle 18:00 (attenzione alle abbreviazioni dei giorni nella lingua del sistema) e prova a collegarti fuori orario modificando l'orario della VM, se possibile.
4. **Backup dei permessi:** con `icacls /save` salva le ACL di `C:\Azienda`, modificale di proposito e ripristinale con `/restore`.
5. **Collegamento automatico:** crea su `CLIENT` un file `.bat` che collega `Z:` ad `ARCHIVIO` chiedendo le credenziali, e spiega perché è pericoloso salvare la password nello script.

---

## 13. Griglia di valutazione (100 punti)

| Criterio | Punti |
|---|---|
| Preparazione delle VM e rete funzionante (fase 0) | 5 |
| Criteri password e blocco account corretti e verificati | 10 |
| Gruppi creati correttamente | 5 |
| Utenti creati con dati e scadenza stagista corretti | 10 |
| Appartenenza ai gruppi corretta e verificata | 5 |
| Account Ospite e Administrator disattivati | 5 |
| Struttura cartelle e rimozione dei gruppi non autorizzati | 10 |
| Permessi NTFS per reparto corretti (tabella sezione 6) | 15 |
| Condivisione di rete corretta | 5 |
| Tabella dei test compilata e coerente con i risultati | 10 |
| Registro di configurazione chiaro, con indicazione della VM | 10 |
| Relazione alla titolare e risposte alle domande | 10 |
| **Totale** | **100** |

Bonus: fino a 10 punti per le sfide della sezione 12.
