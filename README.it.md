# 🌌 Alien MU/TH/UR 6000 — Guida Completa all'Installazione e Personalizzazione

### *Modulo di Interfaccia Terminale Retro-Futurista Sincronizzato per ALIEN RPG (Foundry VTT v14)*

Questo repository contiene la versione personalizzata e localizzata del modulo **Alien MU/TH/UR 6000** (originariamente creato da *ShazProd*). Simula un terminale di computer a fosfori verdi degli anni '80, consentendo ai giocatori di interagire in tempo reale con l'intelligenza artificiale della colonia.

---

## 💛 Supporta il Progetto
Se questo modulo ha contribuito a elevare la tensione e l'immersione nelle tue sessioni di **Alien RPG**, considera di supportare gli sviluppatori per incoraggiare nuovi aggiornamenti!
* **Creatore Originale (ShazProd):** Supporta il creatore del modulo originale accedendo al profilo di [ShazProd su GitHub](https://github.com/ShazProd).
* **Sviluppatore del Fork (KorujaSedex123):** Se apprezzi la localizzazione e la nuova funzionalità dei Comandi Personalizzati del GM, supporta questo fork:
  * [☕ Offri un Caffè (Ko-fi)](https://ko-fi.com/korujasedex)
  * [☕ Offri un Caffè (Buy me a Coffee)](https://buymeacoffee.com/brunogrzegm)
  * 🔑 **PIX**: `https://livepix.gg/korujasedex`

---

## 🤝 Crediti Speciali & Ringraziamenti
Questo repository è un fork localizzato e personalizzato dello straordinario modulo **Alien MU/TH/UR 6000** creato originariamente dal talentuoso sviluppatore **ShazProd** ([@ShazProd](https://github.com/ShazProd)).
* Vogliamo esprimere la nostra più profonda gratitudine a **ShazProd** per aver sviluppato l'incredibile estetica e meccanica del terminale originale (come effetti CRT, effetti di digitazione macchina, protocolli di hacking, modalità spettatore, controlli ambientali e il conto alla rovescia nucleare).

---

## ✨ Riepilogo delle Funzionalità

### 🛠️ Funzionalità del Modulo Base (Sviluppato da ShazProd)
* 📟 **Estetica CRT Analogica**: Linee di scansione CRT pesanti, effetti di digitazione meccanica, sfarfallio della luminosità ed effetti di glitch visivi sincronizzati.
* 👁️ **Modalità Spettatore Specchio**: I giocatori possono guardare lo schermo dell'operatore attivo in tempo reale, condividendo lo stesso identico flusso di testo e gli stessi glitch!
* 🔌 **Protocollo di Hacking Dinamico**: Digitando `HACK` si avvia una richiesta di bypass della sicurezza. Il Game Master (GM) riceve un pop-up interattivo per approvare o negare istantaneamente l'hacking.
* 🚨 **Protocollo CERBERUS**: Conto alla rovescia per l'autodistruzione nucleare con avvisi rossi a schermo intero, sirene e disconnessione automatica della sessione al termine.
* 🎮 **Controlli Ambientali**: Comandi approvati dal GM per bloccare/sbloccare porte, controllare l'illuminazione (`LIGHTS DIM/SHUTDOWN`), scaricare gas o operare le capsule criogeniche.

### ⚙️ Funzionalità del Fork Personalizzato (Aggiunto da KorujaSedex123)
* 🌐 **Localizzazione Completa**: Traduzione integrata direttamente con la terminologia ufficiale del gioco di ruolo di Alien.
* 🔧 **Comandi di Gioco Personalizzati del GM**: I GM possono registrare i propri comandi di terminale e risposte (come indizi nascosti, segreti di lore o direttive aziendali) direttamente tramite il menu di configurazione dei moduli di Foundry VTT in un formato JSON estremamente semplice — **senza bisogno di modificare il codice!**

---

## 🚀 Installazione Rapida
Per installare questa edizione personalizzata del modulo nel tuo Foundry VTT:
1. Nella schermata principale di configurazione di Foundry VTT, naviga su **Add-on Modules**.
2. Clicca su **Install Module**.
3. Nel campo **Manifest URL**, incolla il link sottostante:
   ```
   https://github.com/KorujaSedex123/alien-mu-th-ur-pt-br/releases/latest/download/module.json
   ```
4. Clicca su **Install** e attendi il completamento del processo.
5. Abilita il modulo nelle impostazioni del tuo mondo sotto **Manage Modules**.

---

## ⚙️ Guida ai Comandi di Gioco Personalizzati del GM

I GM possono configurare i propri comandi personalizzati nelle impostazioni del modulo Foundry VTT inserendo un oggetto JSON semplice. 

### Esempio di Configurazione:
```json
{
  "REGISTRI": "ACCESSO AI REGISTRI DI BORDO... [12/04/2179]: Rilevato aumento della temperatura nel settore G-14.",
  "DIRETTIVA": "DIRETTIVA WEYLAND-YUTANI: Proteggere la tecnologia aliena a tutti i costi. L'equipaggio è sacrificabile."
}
```

Quando un giocatore digita `REGISTRI` o `DIRETTIVA` nel terminale, MU/TH/UR risponderà con i messaggi configurati dal GM!

---

*Manuale generato in conformità con la Direttiva Speciale 937. La sicurezza degli asset aziendali è la nostra massima priorità.*
