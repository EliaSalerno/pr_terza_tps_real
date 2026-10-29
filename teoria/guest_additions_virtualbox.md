# Guest Additions di VirtualBox

Le Guest Additions sono un insieme di driver e servizi installati all'interno della macchina virtuale, cioè nel sistema operativo guest (ad esempio Windows 11), per migliorare il funzionamento della VM in collaborazione con VirtualBox.

## Che cosa sono

Sono componenti sviluppati da Oracle per VirtualBox e vengono installati come se fossero software del sistema operativo guest. Permettono alla macchina virtuale di "capire" di essere eseguita in un ambiente virtualizzato e di interagire meglio con l'host, cioè con il computer fisico che sta eseguendo VirtualBox.

## A cosa servono

Le Guest Additions servono soprattutto a rendere l'uso della VM più naturale e più comodo:

- migliorano la risoluzione dello schermo;
- permettono di ridimensionare la finestra della VM in modo automatico;
- consentono al mouse di muoversi senza dover premere il tasto host;
- facilitano lo scambio di appunti tra host e guest;
- permettono il trascinamento di file tra i due ambienti;
- migliorano le prestazioni grafiche;
- rendono il sistema più stabile e reattivo durante l'uso quotidiano.

## Benefici pratici

Grazie alle Guest Additions, la macchina virtuale diventa molto più semplice da usare:

- non si ha più il problema del mouse "bloccato" dentro la finestra;
- il desktop della VM si adatta meglio alla finestra di VirtualBox;
- è più facile copiare testo, immagini e file tra il computer reale e la VM;
- l'esperienza d'uso è più simile a quella di un computer normale;
- si lavora in modo più rapido durante le esercitazioni e le attività di laboratorio.

## Quando si installano

Di solito si installano dopo aver completato l'installazione del sistema operativo guest, quando la VM è già accesa e pronta all'uso. In VirtualBox questo passaggio avviene nel menu:

- Dispositivi
- Inserisci immagine CD delle Guest Additions

Poi, all'interno della macchina virtuale, si apre l'unità CD e si esegue il file `VBoxWindowsAdditions.exe`.

## In sintesi

Le Guest Additions sono fondamentali per avere una macchina virtuale più facile da usare, con migliori prestazioni, migliore grafica e maggiore integrazione con il computer host. Senza di esse, la VM continua a funzionare, ma risulta più lenta, più scomoda e meno praticata per il lavoro quotidiano.
