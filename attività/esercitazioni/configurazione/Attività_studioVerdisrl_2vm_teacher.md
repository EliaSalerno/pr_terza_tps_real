# Attività StudioVerdi Srl (2 VM): soluzione e note per il docente

Documento di accompagnamento alla traccia `attivita-classe-studiosverdi-2vm-traccia-studente.md`. **Non distribuire agli studenti prima della consegna.**

Rispetto alla versione a coppie cambiano tre cose:

- ogni studente lavora da solo con **due VM**: `ARCHIVIO` (configurazione) e `CLIENT` (verifiche);
- i test non usano più `runas` ma **accessi di rete** con `net use`, quindi entrano in gioco **condivisione e permessi NTFS insieme**;
- c'è una nuova **fase 0** per preparare rete e nomi delle macchine.

---

## 1. Preparazione dell'aula

**Risorse per studente (indicative)**

| VM | RAM | CPU | Disco |
|---|---|---|---|
| `ARCHIVIO` | 2-4 GB | 2 vCPU | 40-60 GB |
| `CLIENT` | 2-4 GB | 2 vCPU | 40-60 GB |

Con una classe numerosa la memoria è il collo di bottiglia. Alternative: dischi differenziali / cloni collegati a un'immagine base, oppure usare come `CLIENT` una VM più leggera o il PC fisico del laboratorio (purché raggiunga `ARCHIVIO` in rete).

**Rete virtuale**

| Programma | Impostazione consigliata |
|---|---|
| VirtualBox | "Rete NAT" (le VM comunicano tra loro, hanno DHCP e accesso a Internet) |
| VMware | Rete personalizzata / LAN segment, oppure NAT |
| Hyper-V | Switch interno o privato (senza DHCP: serve assegnare gli IP a mano) |

Le due VM di **uno stesso studente** devono vedersi; le VM di studenti diversi non devono necessariamente poterlo fare, anzi è preferibile isolarle per evitare collisioni di nomi (`ARCHIVIO` e `CLIENT` sono uguali per tutti).

**Altre indicazioni**

- Usare edizioni **Pro** o equivalenti; vanno bene anche Home perché l'attività usa solo comandi da prompt.
- Se si clonano le VM, assicurarsi che ogni macchina abbia un **nome diverso** all'interno della stessa rete virtuale.
- Salvare uno **snapshot "pulito"** di entrambe le VM (dopo il nome e la rete) per ripetere l'esercizio.
- Controllare in anticipo la **lingua** di Windows (vedi sezione 6).
- Gli studenti usano un utente **amministratore locale** su entrambe le VM e il prompt **come amministratore**.

**Scansione dei tempi (indicativa)**

| Fase | Tempo |
|---|---|
| Presentazione dello scenario e lettura dei requisiti | 15 min |
| Fase 0 (nomi, rete, ping) | 20-30 min |
| Fasi 1-5 (criteri, gruppi, utenti, appartenenze, account integrati) | 45 min |
| Fase 6 (cartelle, permessi, condivisione) | 45 min |
| Fase 7 (verifiche da `CLIENT`) | 40 min |
| Fase 8 e relazione | 30 min |
| Discussione finale | 15 min |

Il lavoro individuale rende i tempi più variabili: conviene fissare **punti di controllo** (fine fase 0, fine fase 5, fine fase 6) in cui il docente verifica a campione.

---

## 2. Soluzione comando per comando

I nomi sono scritti in inglese: adattarli alla lingua del sistema.

### Fase 0: preparazione (su entrambe le VM)

Rinominare il PC (su `ARCHIVIO`; su `CLIENT` usare `CLIENT`):

```
powershell -Command "Rename-Computer -NewName ARCHIVIO -Restart"
```

Dopo il riavvio, impostare la rete come privata e abilitare condivisione file e ping:

```
powershell -Command "Get-NetConnectionProfile | Set-NetConnectionProfile -NetworkCategory Private"
netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes
netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes
```

Nelle versioni italiane i gruppi di regole si chiamano `"Condivisione file e stampanti"` e `"Individuazione rete"`.

Verifica:

```
hostname
ipconfig
ping ARCHIVIO
```

Se il nome non si risolve, `ping` all'indirizzo IP letto con `ipconfig` su `ARCHIVIO`. Se le VM non hanno DHCP (Hyper-V con switch interno), assegnare gli IP a mano. Il nome dell'interfaccia (qui `Ethernet`) va controllato con `netsh interface show interface`:

```
netsh interface ip set address name="Ethernet" static 192.168.50.10 255.255.255.0
```

(`ARCHIVIO` = `192.168.50.10`, `CLIENT` = `192.168.50.11`.)

### Fase 1 (su `ARCHIVIO`): criteri

```
net accounts /minpwlen:10 /maxpwage:60 /minpwage:1 /uniquepw:5 /lockoutthreshold:5 /lockoutduration:15 /lockoutwindow:15
net accounts
```

### Fase 2: gruppi

```
for %G in (Direzione Amministrazione Commerciale Magazzino Dipendenti Stagisti) do net localgroup %G /add
net localgroup
```

### Fase 3: utenti

```
net user lrusso Cambiami2026! /add /fullname:"Laura Russo" /comment:"Titolare"
net user mrossi Cambiami2026! /add /fullname:"Marta Rossi" /comment:"Responsabile amministrativa"
net user abianchi Cambiami2026! /add /fullname:"Anna Bianchi" /comment:"Impiegata amministrativa"
net user gverdi Cambiami2026! /add /fullname:"Giulio Verdi" /comment:"Commerciale"
net user sneri Cambiami2026! /add /fullname:"Sara Neri" /comment:"Commerciale"
net user pgialli Cambiami2026! /add /fullname:"Paolo Gialli" /comment:"Magazziniere"
net user tstage Cambiami2026! /add /fullname:"Tommaso Stage" /comment:"Stagista" /expires:31/01/2027
```

Se `adminit` va creato:

```
net user adminit * /add /fullname:"Tecnico IT"
net localgroup Administrators adminit /add
```

### Fase 4: appartenenza ai gruppi

```
net localgroup Direzione lrusso /add
net localgroup Amministrazione mrossi /add
net localgroup Amministrazione abianchi /add
net localgroup Commerciale gverdi /add
net localgroup Commerciale sneri /add
net localgroup Magazzino pgialli /add
net localgroup Stagisti tstage /add
for %U in (lrusso mrossi abianchi gverdi sneri pgialli) do net localgroup Dipendenti %U /add
```

Verifica con due metodi, ad esempio:

```
net localgroup Commerciale
net user gverdi
```

### Fase 5: account integrati

```
net user Guest /active:no
net user Administrator /active:no
net user
```

Nelle versioni italiane: `Ospite` e `Amministratore`.

### Fase 6: cartelle, permessi NTFS e condivisione

```
mkdir C:\Azienda
icacls C:\Azienda /inheritance:d
icacls C:\Azienda /remove Users
icacls C:\Azienda /remove "Authenticated Users"
icacls C:\Azienda /grant Dipendenti:RX
icacls C:\Azienda /grant Stagisti:RX

mkdir C:\Azienda\Direzione C:\Azienda\Amministrazione C:\Azienda\Commerciale C:\Azienda\Magazzino C:\Azienda\Comune

icacls C:\Azienda\Direzione /grant Direzione:(OI)(CI)M
icacls C:\Azienda\Amministrazione /grant Amministrazione:(OI)(CI)M
icacls C:\Azienda\Amministrazione /grant Direzione:(OI)(CI)RX
icacls C:\Azienda\Commerciale /grant Commerciale:(OI)(CI)M
icacls C:\Azienda\Commerciale /grant Direzione:(OI)(CI)RX
icacls C:\Azienda\Magazzino /grant Magazzino:(OI)(CI)M
icacls C:\Azienda\Magazzino /grant Commerciale:(OI)(CI)RX
icacls C:\Azienda\Magazzino /grant Direzione:(OI)(CI)RX
icacls C:\Azienda\Comune /grant Dipendenti:(OI)(CI)M
icacls C:\Azienda\Comune /grant Stagisti:(OI)(CI)RX
```

Condivisione:

```
net share Azienda=C:\Azienda /grant:Dipendenti,CHANGE /grant:Stagisti,READ /remark:"Archivio StudioVerdi"
net share Azienda
```

Verificare in anticipo che nella vostra versione di Windows `net share` accetti più opzioni `/grant` (la documentazione prevede di ripeterla per più gruppi). In alternativa, equivalente in PowerShell:

```
powershell -Command "New-SmbShare -Name Azienda -Path C:\Azienda -ChangeAccess Dipendenti -ReadAccess Stagisti"
```

**Perché funziona**

- `C:\` concede di norma a `Users` e `Authenticated Users` diritti ereditabili. Con `/inheritance:d` quelle voci diventano esplicite su `C:\Azienda` e solo a quel punto si possono rimuovere con `/remove`.
- Le sottocartelle create **dopo** ereditano da `C:\Azienda` solo le voci con flag `(OI)(CI)`, cioè `SYSTEM` e `Administrators`.
- `Dipendenti` e `Stagisti` hanno `RX` su `C:\Azienda` **senza** `(OI)(CI)`: servono per elencare la radice, non si propagano.
- La condivisione dà ai gruppi permessi **larghi**: l'accesso fine è controllato dai permessi NTFS. L'accesso effettivo da rete è l'**intersezione** dei due livelli, cioè prevale il più restrittivo.
- `Stagisti` ha `READ` sulla condivisione **e** `RX` su NTFS, quindi la protezione dalla scrittura è doppia.
- `adminit` non è nei gruppi della condivisione ed è pensato per lavorare sulla console di `ARCHIVIO`, non da rete: un account amministratore locale collegandosi da rete ottiene di norma un token limitato (restrizioni UAC remote), quindi non è da usare per i test.

### Fase 7: verifiche da `CLIENT`

Sequenza tipo per `gverdi`:

```
net use * /delete /y
net use Z: \\ARCHIVIO\Azienda /user:ARCHIVIO\gverdi *
dir Z:\
dir Z:\Amministrazione
echo prova > Z:\Commerciale\prova.txt
dir Z:\Magazzino
echo prova > Z:\Magazzino\prova.txt
```

Esiti attesi: `dir Z:\` elenca le cinque cartelle (anche quelle a cui non si ha accesso: vedi sezione 5); `dir Z:\Amministrazione` e `echo ... > Z:\Magazzino\prova.txt` danno *Accesso negato*; il file in `Commerciale` viene creato.

Per cambiare utente: `net use * /delete /y`, poi nuovo `net use`.

Per il test 14: `net view \\ARCHIVIO` (con una connessione aperta, o con `/user:`), che deve mostrare `Azienda`.

**Test del blocco (test 15)**

```
net use \\ARCHIVIO\Azienda /user:ARCHIVIO\tstage sbagliata
```

Ripetere. Gli errori attesi sono *errore di sistema 1326* (credenziali errate) fino alla soglia e poi *1909* (account bloccato). Dopo il blocco anche la password giusta viene rifiutata. Alcune connessioni ritentano automaticamente l'autenticazione, quindi l'account può bloccarsi **prima** del quinto comando: non è un errore dello studente.

Su `ARCHIVIO`, per sbloccare:

```
net user tstage /active:yes
```

### Fase 8: chiusura

Dopo i test, obbligo di cambio password per tutti:

```
for %U in (lrusso mrossi abianchi gverdi sneri pgialli tstage) do net user %U /logonpasswordchg:yes
```

Da `CLIENT` il nuovo collegamento come `gverdi` deve essere rifiutato; tipicamente compare l'*errore di sistema 1907* (la password deve essere cambiata prima di accedere). Verificare in anticipo il comportamento sulle vostre VM. Per annullare l'obbligo: `net user gverdi /logonpasswordchg:no`.

### Esiti attesi della tabella dei test

| N. | Esito atteso | Motivo |
|---|---|---|
| 1 | Negato | `Commerciale` non è nelle ACL di `Amministrazione` |
| 2 | Riuscito | `Commerciale` ha Modifica; la condivisione concede `CHANGE` a `Dipendenti` |
| 3 | Riuscito | `Commerciale` ha Lettura su `Magazzino` |
| 4 | Negato | Solo lettura su NTFS |
| 5 | Riuscito | `Magazzino` ha Modifica |
| 6 | Negato | `Magazzino` non è nelle ACL di `Commerciale` |
| 7 | Riuscito | `Amministrazione` ha Modifica |
| 8 | Negato | Solo `Direzione` entra in `Direzione` |
| 9 | Riuscito | `Direzione` ha Lettura |
| 10 | Negato | `Direzione` ha solo Lettura sui reparti |
| 11 | Riuscito | `Stagisti` ha Lettura su `Comune` |
| 12 | Negato | Lettura su NTFS e `READ` sulla condivisione |
| 13 | Negato | `Stagisti` non è nelle ACL |
| 14 | Compare `Azienda` | Condivisione creata |
| 15 | Bloccato | Soglia 5 tentativi |
| 16 | 31/01/2027 | `/expires:31/01/2027` |
| 17 | OK | `net user tstage /active:yes` |
| 18 | Rifiutato | Obbligo di cambio password |

---

## 3. Script completo per `ARCHIVIO` (sfida bonus 1)

Salvare come `configura_archivio.bat` ed eseguire **come amministratore**. Le variabili iniziali permettono di adattarlo alla lingua di Windows. In un file `.bat` le variabili del ciclo `for` si scrivono `%%`.

```bat
@echo off
setlocal

REM ======= ADATTARE ALLA LINGUA DI WINDOWS =======
set ADM=Administrators
set USR=Users
set AUTH=Authenticated Users
set GUEST=Guest
set BUILTINADM=Administrator
REM  Italiano: Amministratori / Utenti / Utenti autenticati / Ospite / Amministratore
REM ===============================================

set PWD=Cambiami2026!

echo [1/8] Criteri password e blocco account
net accounts /minpwlen:10 /maxpwage:60 /minpwage:1 /uniquepw:5 /lockoutthreshold:5 /lockoutduration:15 /lockoutwindow:15

echo [2/8] Gruppi
for %%G in (Direzione Amministrazione Commerciale Magazzino Dipendenti Stagisti) do net localgroup %%G /add

echo [3/8] Utenti
net user lrusso   %PWD% /add /fullname:"Laura Russo"   /comment:"Titolare"
net user mrossi   %PWD% /add /fullname:"Marta Rossi"   /comment:"Responsabile amministrativa"
net user abianchi %PWD% /add /fullname:"Anna Bianchi"  /comment:"Impiegata amministrativa"
net user gverdi   %PWD% /add /fullname:"Giulio Verdi"  /comment:"Commerciale"
net user sneri    %PWD% /add /fullname:"Sara Neri"     /comment:"Commerciale"
net user pgialli  %PWD% /add /fullname:"Paolo Gialli"  /comment:"Magazziniere"
net user tstage   %PWD% /add /fullname:"Tommaso Stage" /comment:"Stagista" /expires:31/01/2027

echo [4/8] Appartenenza ai gruppi
net localgroup Direzione lrusso /add
net localgroup Amministrazione mrossi /add
net localgroup Amministrazione abianchi /add
net localgroup Commerciale gverdi /add
net localgroup Commerciale sneri /add
net localgroup Magazzino pgialli /add
net localgroup Stagisti tstage /add
for %%U in (lrusso mrossi abianchi gverdi sneri pgialli) do net localgroup Dipendenti %%U /add

echo [5/8] Account integrati
net user %GUEST% /active:no
net user %BUILTINADM% /active:no

echo [6/8] Cartelle e permessi NTFS
mkdir C:\Azienda
icacls C:\Azienda /inheritance:d
icacls C:\Azienda /remove "%USR%"
icacls C:\Azienda /remove "%AUTH%"
icacls C:\Azienda /grant Dipendenti:RX
icacls C:\Azienda /grant Stagisti:RX

mkdir C:\Azienda\Direzione
mkdir C:\Azienda\Amministrazione
mkdir C:\Azienda\Commerciale
mkdir C:\Azienda\Magazzino
mkdir C:\Azienda\Comune

icacls C:\Azienda\Direzione /grant Direzione:(OI)(CI)M
icacls C:\Azienda\Amministrazione /grant Amministrazione:(OI)(CI)M
icacls C:\Azienda\Amministrazione /grant Direzione:(OI)(CI)RX
icacls C:\Azienda\Commerciale /grant Commerciale:(OI)(CI)M
icacls C:\Azienda\Commerciale /grant Direzione:(OI)(CI)RX
icacls C:\Azienda\Magazzino /grant Magazzino:(OI)(CI)M
icacls C:\Azienda\Magazzino /grant Commerciale:(OI)(CI)RX
icacls C:\Azienda\Magazzino /grant Direzione:(OI)(CI)RX
icacls C:\Azienda\Comune /grant Dipendenti:(OI)(CI)M
icacls C:\Azienda\Comune /grant Stagisti:(OI)(CI)RX

echo [7/8] Condivisione di rete
net share Azienda=C:\Azienda /grant:Dipendenti,CHANGE /grant:Stagisti,READ /remark:"Archivio StudioVerdi"
net share Azienda

echo [8/8] Fine. Dopo i test da CLIENT eseguire il cambio password obbligatorio:
echo   for %%U in (lrusso mrossi abianchi gverdi sneri pgialli tstage) do net user %%U /logonpasswordchg:yes
endlocal
pause
```

Il cambio password obbligatorio resta volutamente **fuori** dallo script: va eseguito dopo i test, altrimenti i collegamenti da `CLIENT` verrebbero rifiutati.

---

## 4. Script di ripristino per `ARCHIVIO`

Utile per far ripetere l'esercizio senza snapshot. Eseguire come amministratore.

```bat
@echo off
net share Azienda /delete
for %%U in (lrusso mrossi abianchi gverdi sneri pgialli tstage) do net user %%U /delete
for %%G in (Direzione Amministrazione Commerciale Magazzino Dipendenti Stagisti) do net localgroup %%G /delete
rmdir /s /q C:\Azienda
net accounts /minpwlen:0 /maxpwage:42 /minpwage:0 /uniquepw:0 /lockoutthreshold:0
echo Ripristino completato. I profili in C:\Users non sono stati eliminati.
pause
```

Su `CLIENT` basta `net use * /delete /y`. I valori iniziali di `net accounts` possono differire: annotarli prima con `net accounts`.
Se `rmdir` fallisce per ACL danneggiate: `takeown /f C:\Azienda /r /d s` (`/d y` in inglese), poi `icacls C:\Azienda /grant Administrators:(OI)(CI)F /t`, poi di nuovo `rmdir`.

---

## 5. Approfondimenti per la discussione

1. **Permessi di condivisione + NTFS:** da rete vale il più restrittivo dei due. Chiedere agli studenti di dimostrarlo: ad esempio cambiare la condivisione di `Dipendenti` in `READ` e riprovare il test 2 (la scrittura in `Commerciale` deve fallire anche se NTFS la consente).
2. **Strategia comune:** condivisione con permessi larghi, controllo fine con NTFS. Perché? Perché i permessi NTFS valgono sia in locale sia da rete e si ereditano; quelli di condivisione sono un solo livello per tutta la cartella.
3. **Cartelle visibili ma non accessibili:** `dir Z:\` mostra anche le cartelle degli altri reparti. Si può nasconderle con l'enumerazione basata sull'accesso: `powershell -Command "Set-SmbShare -Name Azienda -FolderEnumerationMode AccessBased -Force"`. Chiedere se è utile o se rivela informazioni.
4. **Principio del privilegio minimo e gruppi:** nuovo commerciale = una sola riga di comando. Collegare alle richieste della titolare.
5. **Ereditarietà:** perché prima `/inheritance:d` e poi `/remove`.
6. **Nega e Consenti:** la soluzione non usa `/deny`; spiegare perché *Nega* prevale e rende le ACL difficili da leggere.
7. **Blocco account via rete:** gli attacchi di tipo *password guessing* contro la condivisione sono bloccati dalla soglia, ma un malintenzionato può anche **bloccare apposta** un account altrui (denial of service).
8. **Limiti e dominio:** gli account sono locali a `ARCHIVIO`, quindi ogni dipendente deve conoscere credenziali "dell'archivio" distinte da quelle del proprio PC. Con più PC e utenti diventa necessario un dominio Active Directory (guida, sezioni 1.3 e 8). Come estensione avanzata si può proporre una terza VM con Windows Server.
9. **Sicurezza reale:** la password temporanea è uguale per tutti e nota agli studenti; i dati viaggiano in rete (SMB cifrato solo se abilitato); i permessi NTFS non proteggono dall'accesso fisico al disco (serve BitLocker).

---

## 6. Errori frequenti e come intervenire

| Sintomo | Causa probabile | Come aiutare |
|---|---|---|
| "Il nome di gruppo non esiste" per `Administrators`, `Users`, ecc. | Windows in italiano | Usare i nomi tradotti |
| Sintassi strana, `The token '&&' ...` | Si sta usando PowerShell, non CMD | Aprire *Prompt dei comandi* (senza `PS` nel prompt) |
| "Errore di sistema 5" durante la configurazione | CMD non avviato come amministratore | Riavviare il prompt come amministratore |
| `%G non previsto` in un `.bat` | `%G` va scritto `%%G` negli script | Raddoppiare i `%` |
| `net user ... /add` fallisce per requisiti password | Criteri attivi (lunghezza 10) e password semplice | Usare maiuscole, minuscole, numeri e simboli |
| `/expires` dà "data non valida" | Formato data diverso dalle impostazioni regionali | Provare `gg/mm/aaaa` o `mm/gg/aaaa` |
| `/remove Users` non toglie nulla | Eredità non interrotta prima | Eseguire prima `/inheritance:d` |
| Gli utenti vedono ancora cartelle altrui | Rimasti `Users` o `Authenticated Users` | `icacls` e rimuovere le voci mancanti |
| Permessi non applicati alle sottocartelle | Mancano `(OI)(CI)` | Rieseguire `/grant` con i flag |
| `icacls` in un `.bat` dà errore di sintassi | Parentesi dentro un blocco `( ... )` | Evitare i blocchi con parentesi, oppure `^(OI^)^(CI^)` |
| `ping ARCHIVIO` non risponde | Profilo di rete pubblico, firewall, VM su reti diverse | Profilo privato, regole del firewall, stessa rete virtuale; provare con l'IP |
| *Errore di sistema 53* (percorso di rete non trovato) | Nome non risolto, firewall, condivisione non creata | Usare l'IP, controllare il firewall e `net share` su `ARCHIVIO` |
| *Errore di sistema 67* (nome di rete non trovato) | Nome della condivisione errato | Controllare `net share` |
| *Errore di sistema 1219* (connessioni multiple con credenziali diverse) | Connessione già aperta con un altro utente | `net use * /delete /y` |
| *Errore di sistema 1326* (credenziali errate) | Password sbagliata o nome utente senza `ARCHIVIO\` | Usare `ARCHIVIO\utente` e la password temporanea |
| *Errore di sistema 5* da `net use` | L'utente non è coperto dai permessi di condivisione | Controllare `net share Azienda` e i gruppi dell'utente |
| Accesso negato anche ai dipendenti in `Comune` | Mancano le voci su `C:\Azienda` o la condivisione | Controllare `icacls C:\Azienda` e `net share Azienda` |
| *Errore di sistema 1909* (account bloccato) | Soglia di blocco raggiunta | `net user utente /active:yes` e attendere |
| Collegamento rifiutato per tutti gli utenti | `/logonpasswordchg:yes` impostato prima dei test | `net user utente /logonpasswordchg:no` |
| `adminit` non accede alla condivisione da `CLIENT` | Token limitato per gli amministratori locali in rete | Non è un errore: `adminit` lavora sulla console di `ARCHIVIO` |
| Un utente appena aggiunto a un gruppo non ha ancora i nuovi permessi | Il token si aggiorna al nuovo accesso | Chiudere la connessione (`net use * /delete /y`) e riconnettersi |
| Le due VM hanno lo stesso nome | Clonazione senza rinominare | Rinominare con `Rename-Computer` |

---

## 7. Griglia di correzione rapida

| Elemento | Verifica rapida del docente |
|---|---|
| Fase 0 | `hostname` corretto su entrambe; `ping` tra le VM riuscito |
| Criteri | `net accounts` mostra i 7 valori richiesti |
| Gruppi | `net localgroup` mostra i 6 gruppi |
| Utenti | `net user` mostra i 7 utenti; `net user tstage` mostra la scadenza al 31/01/2027 |
| Appartenenze | `net localgroup Dipendenti` elenca 6 utenti (non `tstage`) |
| Account integrati | `Guest` e `Administrator`: "Account attivo: No" |
| Permessi NTFS | `icacls C:\Azienda\<cartella>` coerente con la matrice, senza `Users` né `Authenticated Users` |
| Condivisione | `net share Azienda`: `Dipendenti` CHANGE e `Stagisti` READ |
| Test | Tabella compilata; esiti coerenti con la sezione 2; schermata del test negato |
| Relazione | Linguaggio non tecnico, motiva le scelte, nomina i rischi residui |
