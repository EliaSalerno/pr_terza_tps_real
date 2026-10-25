# Guida a utenti, gruppi, domini e permessi in Windows da Prompt dei comandi

Guida pratica: prima la teoria, poi i comandi spiegati sezione per sezione.

**Convenzioni**

- I comandi si eseguono in `cmd.exe`. Il prompt di CMD mostra `C:\Users\TuoNome>`, quello di PowerShell mostra `PS C:\Users\TuoNome>`.
- I comandi che modificano utenti, gruppi e permessi richiedono il prompt **avviato come amministratore** (tasto destro, *Esegui come amministratore*).
- Sostituisci `utente`, `gruppo`, `password`, `NOMEPC` e `C:\cartella` con i valori reali.
- Alcuni nomi (gruppi, giorni della settimana, formati data) cambiano con la lingua di Windows: in caso di dubbio usa `comando /?`.

---

## Indice

1. [Teoria](#1-teoria)
2. [Gestione degli utenti](#2-gestione-degli-utenti)
3. [Scadenza di password e account](#3-scadenza-di-password-e-account)
4. [Criteri password e blocco account](#4-criteri-password-e-blocco-account)
5. [Gestione dei gruppi](#5-gestione-dei-gruppi)
6. [Informazioni su utenti e sessioni](#6-informazioni-su-utenti-e-sessioni)
7. [Permessi su file e cartelle](#7-permessi-su-file-e-cartelle)
8. [Utenti e gruppi di dominio](#8-utenti-e-gruppi-di-dominio)
9. [Strumenti grafici e PowerShell](#9-strumenti-grafici-e-powershell)
10. [Domande frequenti](#10-domande-frequenti)
11. [Appendice: installare Git, VS Code e Claude Code](#11-appendice-installare-git-vs-code-e-claude-code)

---

# 1. Teoria

## 1.1 Utenti

Un **utente** (account) è l'identità con cui una persona, un servizio o un programma accede al sistema. Ogni account ha:

- un **nome** e una **password** (o altro metodo di accesso);
- un **SID** (*Security Identifier*), un identificativo univoco che Windows usa internamente al posto del nome. I permessi sono assegnati al SID, per questo ricreare un utente con lo stesso nome non gli restituisce i permessi del vecchio account;
- un **profilo** (cartella in `C:\Users\nome`) con documenti e impostazioni;
- l'appartenenza a uno o più **gruppi**.

**Tipi di account**

| Tipo | Dove vive | Note |
|---|---|---|
| Account locale | Sul singolo PC | Valido solo su quel computer |
| Account Microsoft | Online, collegato al PC | Tipico di Windows 10/11 domestico |
| Account di dominio | Sul controller di dominio (Active Directory) | Valido su tutti i PC del dominio |

**Account integrati**

- `Administrator` (*Amministratore*): amministratore integrato, spesso disattivato di default.
- `Guest` (*Ospite*): accesso limitato, disattivato di default.
- `DefaultAccount` e `WDAGUtilityAccount`: account di sistema, non vanno toccati.

**Account standard e amministratore**: un utente standard può usare il PC ma non modificare il sistema; un amministratore può installare software e gestire utenti. Si diventa amministratori entrando nel gruppo `Administrators`.

## 1.2 Gruppi

Un **gruppo** è un insieme di utenti (e a volte di altri gruppi). Serve a **gestire i permessi in blocco**: invece di dare un permesso a 30 utenti, lo si dà a un gruppo e si inseriscono gli utenti nel gruppo.

**Gruppi locali integrati più usati**

| Gruppo (inglese) | A cosa serve |
|---|---|
| `Administrators` | Controllo totale del PC |
| `Users` | Utenti standard |
| `Guests` | Accesso minimo |
| `Power Users` | Gruppo storico, oggi di scarso utilizzo |
| `Remote Desktop Users` | Possono collegarsi con Desktop remoto |
| `Backup Operators` | Possono fare e ripristinare backup ignorando alcuni permessi |

Nelle versioni italiane di Windows i nomi possono essere tradotti (ad esempio *Amministratori*, *Utenti*). Con `net localgroup` vedi l'elenco reale sul tuo PC.

**Buona pratica (AGDLP)**: negli ambienti con dominio si inseriscono gli **A**ccount in gruppi **G**lobali, i gruppi globali in gruppi **D**omain **L**ocal, e a questi ultimi si assegnano i **P**ermessi.

## 1.3 Domini

Un **gruppo di lavoro** (*workgroup*) è la modalità predefinita di casa e piccolo ufficio: ogni PC ha i propri utenti e le proprie regole, e nessuno gestisce gli account in modo centralizzato.

Un **dominio** è una rete in cui utenti, gruppi e computer sono gestiti in modo **centralizzato** da uno o più server chiamati **controller di dominio** (*Domain Controller*), che eseguono **Active Directory Domain Services (AD DS)**.

**Concetti chiave**

- **Active Directory**: il database centrale di utenti, gruppi, computer e criteri.
- **Account di dominio**: si autentica sul controller di dominio, quindi lo stesso utente accede da qualsiasi PC del dominio. Si indica come `DOMINIO\utente` oppure `utente@dominio.local` (formato UPN).
- **OU** (*Organizational Unit*): contenitore per organizzare utenti e computer, utile per applicare regole diverse a reparti diversi.
- **Criteri di gruppo** (*GPO, Group Policy Object*): impostazioni applicate automaticamente a utenti e computer (criteri password, blocco account, restrizioni, installazione software).
- **Kerberos**: protocollo di autenticazione usato nel dominio.

**Ambiti dei gruppi di dominio**

| Ambito | Può contenere | Uso tipico |
|---|---|---|
| Domain Local | Utenti e gruppi di qualsiasi dominio | Assegnare permessi su risorse |
| Global | Utenti e gruppi dello stesso dominio | Raggruppare utenti per ruolo |
| Universal | Utenti e gruppi di qualsiasi dominio della foresta | Gruppi che attraversano più domini |

I gruppi possono inoltre essere di **sicurezza** (assegnano permessi) o di **distribuzione** (solo liste di posta).

**Differenze pratiche locale/dominio**

- I comandi `net user` e `net localgroup` agiscono sull'archivio **locale** del PC.
- Per agire sul dominio servono `/domain` oppure strumenti dedicati (RSAT, PowerShell con modulo ActiveDirectory).
- I criteri password di un utente di dominio sono decisi dai criteri di gruppo del dominio, non da `net accounts` sul singolo PC.

## 1.4 Permessi su file e cartelle

Su un volume **NTFS** ogni file e cartella ha una **ACL** (*Access Control List*, elenco di controllo di accesso): una lista di voci chiamate **ACE** (*Access Control Entry*). Ogni ACE dice che un certo utente o gruppo (identificato dal SID) ha o non ha un certo diritto.

**Concetti fondamentali**

- **Proprietario** (*owner*): chi ha creato l'oggetto o ne ha preso il possesso; può sempre modificarne i permessi.
- **Permessi di base**:

| Permesso | Significato |
|---|---|
| Controllo completo (`F`) | Tutto, compreso cambiare permessi e prendere il possesso |
| Modifica (`M`) | Leggere, scrivere, creare, eliminare |
| Lettura ed esecuzione (`RX`) | Aprire ed eseguire |
| Lettura (`R`) | Solo leggere |
| Scrittura (`W`) | Solo scrivere |

- **Consenti e Nega**: una voce *Nega* **ha la precedenza** su una voce *Consenti*. Usala con parsimonia perché rende i permessi difficili da capire.
- **Ereditarietà**: i permessi di una cartella si propagano a sottocartelle e file. Si può interrompere l'ereditarietà e impostare permessi specifici.
- **Permessi cumulativi**: i permessi effettivi di un utente sono la somma di quelli assegnati a lui e a tutti i gruppi di cui fa parte, tenendo conto dei *Nega*.
- **Permessi NTFS e di condivisione**: se una cartella è condivisa in rete, valgono sia i permessi di condivisione sia quelli NTFS, e prevale il **più restrittivo** dei due.
- **Principio del privilegio minimo**: assegna solo i permessi indispensabili, preferibilmente a gruppi e non a singoli utenti.

**Comandi principali**: `icacls` (visualizza e modifica le ACL) e `takeown` (prende il possesso di un oggetto).

---

# 2. Gestione degli utenti

Comando principale: **`net user`**.

| Azione | Comando |
|---|---|
| Elenca tutti gli utenti locali | `net user` |
| Dettagli di un utente | `net user utente` |
| Crea utente con password | `net user utente password /add` |
| Crea utente e chiede la password (non resta nella cronologia) | `net user utente * /add` |
| Elimina utente | `net user utente /delete` |
| Cambia password | `net user utente nuovapassword` |
| Cambia password chiedendola | `net user utente *` |
| Attiva account | `net user utente /active:yes` |
| Disattiva account | `net user utente /active:no` |
| Nome completo | `net user utente /fullname:"Mario Rossi"` |
| Descrizione | `net user utente /comment:"Ufficio contabilità"` |
| Impedisce all'utente di cambiare la password | `net user utente /passwordchg:no` |
| Password facoltativa | `net user utente /passwordreq:no` |
| Cartella home | `net user utente /homedir:C:\percorso` |
| Percorso del profilo | `net user utente /profilepath:percorso` |
| Script di accesso | `net user utente /scriptpath:file.bat` |
| Limita gli orari di accesso | `net user utente /times:M-F,08:00-18:00` |

**Spiegazioni**

- `net user` senza argomenti mostra solo i nomi; con il nome dell'utente mostra data di ultimo accesso, scadenza password, gruppi di appartenenza e altro.
- Usare `*` al posto della password fa digitare la password in modo nascosto: è più sicuro perché non resta nella cronologia dei comandi.
- `/times` usa abbreviazioni dei giorni che dipendono dalla lingua del sistema (in inglese `M,T,W,Th,F,Sa,Su`). In caso di dubbio consulta `net help user`.
- Per attivare gli account integrati: `net user Administrator /active:yes` (o `Amministratore` nelle versioni italiane).
- Eliminare un utente **non** cancella la sua cartella in `C:\Users`.

**Esempio completo: creare un utente standard**

```
net user mrossi * /add /fullname:"Mario Rossi" /comment:"Contabilità"
net localgroup Users mrossi /add
```

---

# 3. Scadenza di password e account

Sono due cose distinte:

- la **scadenza della password**: dopo N giorni l'utente deve cambiarla;
- la **scadenza dell'account**: a una certa data l'account non può più accedere.

## 3.1 Scadenza della password

**Passo 1: imposta la durata massima per tutti gli utenti locali (in giorni)**

```
net accounts /maxpwage:90
```

Per toglierla: `net accounts /maxpwage:unlimited`. Per vedere i valori attuali: `net accounts`.

**Passo 2: assicurati che l'utente non abbia "La password non scade mai"**

Se questa opzione è attiva, il limite precedente viene ignorato.

```
powershell -Command "Set-LocalUser -Name utente -PasswordNeverExpires $false"
```

Per l'opposto (password che non scade mai):

```
powershell -Command "Set-LocalUser -Name utente -PasswordNeverExpires $true"
```

**Passo 3 (facoltativo): obbliga a cambiare la password al prossimo accesso**

```
net user utente /logonpasswordchg:yes
```

**Verifica**

```
net user utente
```

Controlla le righe "Password impostata il", "Scadenza password" e "Password modificabile".

## 3.2 Scadenza dell'account

```
net user utente /expires:31/12/2026
net user utente /expires:never
```

Il formato della data dipende dalle impostazioni regionali (in Italia di solito `gg/mm/aaaa`).

**Cosa succede il 1° gennaio 2027?**

- Fino al 31/12/2026 l'utente accede normalmente (la data indica la fine di quel giorno).
- Dal 1° gennaio 2027 l'account risulta **scaduto**: non può più accedere e Windows mostra un messaggio che indica che l'account è scaduto.
- L'account **non viene eliminato**: profilo, file e appartenenza ai gruppi restano intatti.
- Non è nemmeno "disabilitato" in senso formale: `net user utente` mostrerà `Account attivo: Sì` e `Account scade: 31/12/2026`, ma l'accesso resta bloccato.
- Una sessione già aperta alla scadenza non viene di norma interrotta subito, ma al successivo login o sblocco dello schermo l'accesso fallisce.
- Servizi e attività pianificate eseguiti con quell'utente smetteranno di funzionare.

**Per riattivarlo**

```
net user utente /expires:never
net user utente /expires:31/12/2027
```

**Verifica con PowerShell**

```
powershell -Command "Get-LocalUser utente | Select Name,Enabled,AccountExpires"
```

**Imposta la scadenza a 30 giorni da oggi con PowerShell**

```
powershell -Command "Set-LocalUser -Name utente -AccountExpires (Get-Date).AddDays(30)"
```

---

# 4. Criteri password e blocco account

Comando principale: **`net accounts`**. Agisce sui criteri del PC locale (o del dominio con `/domain`).

## 4.1 Criteri password

| Azione | Comando |
|---|---|
| Mostra i criteri attuali | `net accounts` |
| Durata massima della password (giorni) | `net accounts /maxpwage:90` |
| Nessuna scadenza | `net accounts /maxpwage:unlimited` |
| Durata minima prima di poterla cambiare (giorni) | `net accounts /minpwage:1` |
| Lunghezza minima | `net accounts /minpwlen:8` |
| Cronologia: quante vecchie password non si possono riutilizzare | `net accounts /uniquepw:5` |

## 4.2 Blocco account (*account lockout*)

Il **blocco account** è una protezione contro chi tenta di indovinare una password con tentativi ripetuti: dopo troppi errori Windows blocca temporaneamente l'account, anche se poi viene inserita la password giusta.

Tre parametri:

**`/lockoutthreshold:N` (soglia)**: dopo quanti tentativi falliti l'account viene bloccato. Con `0` il blocco è disattivato (spesso è il valore predefinito).

```
net accounts /lockoutthreshold:5
```

**`/lockoutduration:minuti` (durata del blocco)**: per quanto tempo l'account resta bloccato. Passato il tempo si sblocca da solo. Con `0` resta bloccato finché un amministratore non lo sblocca.

```
net accounts /lockoutduration:30
```

**`/lockoutwindow:minuti` (finestra di osservazione)**: nei criteri grafici si chiama *"Reimposta contatore di blocco account dopo"*. È il tempo che deve trascorrere **dall'ultimo tentativo fallito, senza altri errori**, perché il contatore degli errori torni a zero.

```
net accounts /lockoutwindow:30
```

**Esempio completo**

```
net accounts /lockoutthreshold:5 /lockoutduration:30 /lockoutwindow:30
```

Con questi valori: se si sbaglia la password 5 volte con errori ravvicinati (a meno di 30 minuti l'uno dall'altro) l'account si blocca per 30 minuti.

**Esempio di funzionamento (soglia 5, finestra 30 minuti)**

- Alle 10:00 sbagli la password 3 volte: contatore = 3.
- Alle 10:40 sbagli ancora: sono passati più di 30 minuti dall'ultimo errore, il contatore era tornato a 0 e ora vale 1.
- Se invece alle 10:20 sbagli altre 2 volte, il contatore arriva a 5 e l'account si blocca.

**Vincoli**

- La finestra deve essere **minore o uguale** alla durata del blocco.
- Ha effetto solo se la soglia è maggiore di 0.

**Sbloccare un account bloccato**

```
net user utente /active:yes
```

**Verificare lo stato**

```
net accounts
net user utente
```

**Consigli**

- Soglie troppo basse (1-2 tentativi) bloccano utenti legittimi che sbagliano a digitare: valori ragionevoli sono 5-10.
- Un attaccante può sfruttare il blocco per mettere fuori uso account altrui sbagliando apposta la password: evita durate eccessive.
- Tieni sempre un secondo account amministratore, per non restare tagliato fuori se l'unico amministratore si blocca.

In un dominio questi criteri si impostano con i criteri di gruppo, dove la voce si trova in *Criteri account → Criteri di blocco account*. `secpol.msc` mostra la stessa struttura per il PC locale.

---

# 5. Gestione dei gruppi

Comando principale: **`net localgroup`** (gruppi locali).

| Azione | Comando |
|---|---|
| Elenca i gruppi | `net localgroup` |
| Membri di un gruppo | `net localgroup gruppo` |
| Crea gruppo | `net localgroup gruppo /add` |
| Crea gruppo con descrizione | `net localgroup gruppo /add /comment:"descrizione"` |
| Elimina gruppo | `net localgroup gruppo /delete` |
| Aggiungi utente al gruppo | `net localgroup gruppo utente /add` |
| Rimuovi utente dal gruppo | `net localgroup gruppo utente /delete` |

**Esempi**

```
net localgroup Administrators
net localgroup Administrators utente /add
net localgroup "Remote Desktop Users" utente /add
net localgroup Contabilita /add /comment:"Reparto contabilità"
net localgroup Contabilita mrossi /add
```

**Note**

- I nomi con spazi vanno tra virgolette.
- Nelle versioni italiane i nomi dei gruppi integrati possono essere tradotti: controllali con `net localgroup`.
- Aggiungere un utente a `Administrators` gli dà il controllo totale del PC: fallo con cautela.
- Le modifiche all'appartenenza ai gruppi hanno effetto al **successivo accesso** dell'utente.

---

# 6. Informazioni su utenti e sessioni

## 6.1 Chi sono e che privilegi ho

| Azione | Comando |
|---|---|
| Utente corrente | `whoami` |
| Gruppi e SID dell'utente | `whoami /groups` |
| Privilegi dell'utente | `whoami /priv` |
| Tutto insieme | `whoami /all` |
| Utente in formato UPN (dominio) | `whoami /upn` |
| Nome utente da variabile | `echo %USERNAME%` |
| Dominio o nome del PC da variabile | `echo %USERDOMAIN%` |

## 6.2 Sessioni

| Azione | Comando |
|---|---|
| Elenca le sessioni attive | `query user` (o `quser`) |
| Sessioni su un altro PC | `query user /server:NOMEPC` |
| Disconnette una sessione | `logoff ID_SESSIONE` |
| Disconnette l'utente corrente | `logoff` |

L'`ID_SESSIONE` si legge nella colonna ID dell'output di `query user`.

## 6.3 Eseguire programmi come un altro utente

```
runas /user:utente cmd
runas /user:DOMINIO\utente "notepad.exe"
runas /savecred /user:utente programma.exe
```

`/savecred` salva la password nel sistema: è comodo ma poco sicuro, meglio evitarlo.

---

# 7. Permessi su file e cartelle

Comandi principali: **`icacls`** e **`takeown`**.

## 7.1 Cos'è `icacls`

`icacls` permette di **visualizzare, modificare, salvare, ripristinare e reimpostare** le ACL di file e cartelle. È l'evoluzione dei vecchi comandi `cacls` e `xcacls`, ormai obsoleti, e aggiunge la gestione dell'ereditarietà e dei livelli di integrità.

## 7.2 Comandi di base

| Azione | Comando |
|---|---|
| Mostra i permessi | `icacls C:\cartella` |
| Dà controllo completo a un utente (con ereditarietà) | `icacls C:\cartella /grant utente:(OI)(CI)F` |
| Dà modifica a un gruppo | `icacls C:\cartella /grant gruppo:(OI)(CI)M` |
| Dà sola lettura | `icacls C:\cartella /grant utente:(OI)(CI)R` |
| Nega un permesso | `icacls C:\cartella /deny utente:(OI)(CI)W` |
| Rimuove le voci *consenti* di un utente | `icacls C:\cartella /remove:g utente` |
| Rimuove le voci *nega* di un utente | `icacls C:\cartella /remove:d utente` |
| Rimuove tutte le voci di un utente | `icacls C:\cartella /remove utente` |
| Azzera i permessi ai valori ereditati | `icacls C:\cartella /reset /t` |
| Imposta il proprietario | `icacls C:\cartella /setowner utente /t` |
| Interrompe l'ereditarietà copiando le voci | `icacls C:\cartella /inheritance:d` |
| Interrompe l'ereditarietà rimuovendo le voci ereditate | `icacls C:\cartella /inheritance:r` |
| Riattiva l'ereditarietà | `icacls C:\cartella /inheritance:e` |
| Salva le ACL in un file | `icacls C:\cartella /save acl.txt /t` |
| Ripristina le ACL da file | `icacls C:\ /restore acl.txt` |

## 7.3 Sigle dei permessi

| Sigla | Significato |
|---|---|
| `F` | Controllo completo |
| `M` | Modifica |
| `RX` | Lettura ed esecuzione |
| `R` | Sola lettura |
| `W` | Sola scrittura |
| `D` | Eliminazione |

## 7.4 Flag di ereditarietà

| Flag | Significato |
|---|---|
| `(OI)` | *Object Inherit*: si applica ai file contenuti |
| `(CI)` | *Container Inherit*: si applica alle sottocartelle |
| `(IO)` | *Inherit Only*: vale solo per gli elementi contenuti, non per la cartella stessa |
| `(NP)` | *No Propagate*: non si propaga oltre il primo livello |

Combinazione più comune: `(OI)(CI)` per applicare il permesso alla cartella, alle sottocartelle e ai file.

## 7.5 Opzioni utili

| Opzione | Significato |
|---|---|
| `/t` | Applica anche a sottocartelle e file |
| `/c` | Continua anche in caso di errori |
| `/q` | Modalità silenziosa |

## 7.6 Prendere il possesso (`takeown`)

Se non hai più accesso a una cartella, prima ne prendi il possesso e poi ti assegni i permessi:

```
takeown /f C:\cartella /r /d s
icacls C:\cartella /grant utente:(OI)(CI)F /t
```

`/r` agisce in modo ricorsivo; `/d` indica la risposta da dare quando non si può elencare una cartella (`s` nelle versioni italiane, `y` in quelle inglesi).

## 7.7 Esempio completo: cartella riservata a un gruppo

```
mkdir C:\Contabilita
icacls C:\Contabilita /inheritance:d
icacls C:\Contabilita /remove Users
icacls C:\Contabilita /grant Contabilita:(OI)(CI)M
icacls C:\Contabilita /grant Administrators:(OI)(CI)F
icacls C:\Contabilita
```

Cosa fa: crea la cartella, ne stacca l'ereditarietà conservando le voci attuali, toglie l'accesso al gruppo `Users`, dà modifica al gruppo `Contabilita` e controllo completo agli amministratori, poi mostra il risultato.

---

# 8. Utenti e gruppi di dominio

Servono un PC appartenente al dominio e privilegi adeguati.

| Azione | Comando |
|---|---|
| Dettagli di un utente di dominio | `net user utente /domain` |
| Crea utente di dominio | `net user utente password /add /domain` |
| Elenca i gruppi di dominio | `net group /domain` |
| Membri di un gruppo di dominio | `net group "Domain Admins" /domain` |
| Aggiunge utente a un gruppo di dominio | `net group gruppo utente /add /domain` |
| Criteri password del dominio | `net accounts /domain` |
| Mostra i criteri di gruppo applicati | `gpresult /r` |
| Aggiorna subito i criteri di gruppo | `gpupdate /force` |
| Trova un controller di dominio | `nltest /dsgetdc:NOMEDOMINIO` |

**Note**

- `net group` agisce sui gruppi del dominio, mentre `net localgroup` agisce sui gruppi locali del PC.
- I criteri di password e di blocco account di un utente di dominio dipendono dai criteri di gruppo del dominio.
- Con gli strumenti RSAT installati sono disponibili anche comandi come `dsquery` e `dsget`; per l'amministrazione avanzata di Active Directory si usa di solito PowerShell con il modulo ActiveDirectory.

---

# 9. Strumenti grafici e PowerShell

## 9.1 Strumenti grafici lanciabili dal prompt

| Comando | Cosa apre |
|---|---|
| `lusrmgr.msc` | Utenti e gruppi locali |
| `netplwiz` | Gestione account utente |
| `control userpasswords2` | Come `netplwiz` |
| `compmgmt.msc` | Gestione computer |
| `secpol.msc` | Criteri di sicurezza locali |
| `gpedit.msc` | Editor criteri di gruppo locali |

`lusrmgr.msc`, `secpol.msc` e `gpedit.msc` non sono disponibili nelle edizioni Home di Windows.

## 9.2 Comandi PowerShell richiamabili da cmd

Più completi di `net user` per alcune operazioni:

```
powershell -Command "Get-LocalUser"
powershell -Command "Get-LocalGroup"
powershell -Command "Get-LocalGroupMember -Group Administrators"
powershell -Command "Set-LocalUser -Name utente -PasswordNeverExpires $false"
powershell -Command "Set-LocalUser -Name utente -AccountExpires (Get-Date).AddDays(30)"
powershell -Command "Get-LocalUser utente | Select Name,Enabled,PasswordLastSet,PasswordExpires,LastLogon"
```

**Nota su `wmic`**: comandi come `wmic useraccount list brief` funzionano ancora in molte versioni, ma Microsoft ha dichiarato `wmic` deprecato e lo rimuove dalle versioni più recenti di Windows. Meglio `net user` o PowerShell.

---

# 10. Domande frequenti

**Cosa significa `icacls`?**
È il comando per gestire le ACL (*Access Control List*) di file e cartelle. È la versione migliorata (*improved*) del vecchio `cacls` (*Control Access Control Lists*).

**Il 1° gennaio, dopo `/expires:31/12/2026`, l'account è disabilitato o eliminato?**
Né l'uno né l'altro: risulta scaduto, quindi non può più accedere, ma non viene eliminato. Vedi la [sezione 3.2](#32-scadenza-dellaccount).

**Cos'è la finestra di conteggio dei tentativi (`/lockoutwindow`)?**
Il tempo che deve passare dall'ultimo errore, senza altri errori, perché il contatore dei tentativi falliti torni a zero. Vedi la [sezione 4.2](#42-blocco-account-account-lockout).

**Qual è la differenza tra `net user` e `net localgroup`?**
`net user` gestisce gli utenti, `net localgroup` i gruppi locali. Per il dominio si aggiunge `/domain` oppure si usa `net group`.

**Come vedo a quali gruppi appartiene un utente?**
`net user utente` (sezione "Appartenenze al gruppo locale") oppure, per l'utente corrente, `whoami /groups`.

**Come sblocco un account bloccato per troppi tentativi?**
Da amministratore: `net user utente /active:yes`.

**Le modifiche ai gruppi sono immediate?**
Hanno effetto al successivo accesso dell'utente: se l'utente è connesso deve uscire e rientrare.

---

# 11. Appendice: installare Git, VS Code e Claude Code

Comandi da eseguire in `cmd.exe`.

**Git**

```
winget install --id Git.Git -e --source winget
```

**Visual Studio Code**

```
winget install --id Microsoft.VisualStudioCode -e --source winget
```

**Claude Code** (installazione nativa, comando per CMD)

```
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

Se compare l'errore `The token '&&' is not a valid statement separator`, sei in PowerShell e non in CMD.

**Dopo l'installazione**

Chiudi e riapri il prompt dei comandi, così il PATH viene aggiornato, poi verifica:

```
git --version
code --version
claude --version
```

Configura Git:

```
git config --global user.name "Il Tuo Nome"
git config --global user.email "tua@email.it"
```

Avvia un progetto:

```
cd C:\percorso\del\progetto
code .
claude
```
