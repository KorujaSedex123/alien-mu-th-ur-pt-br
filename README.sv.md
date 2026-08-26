# 🌌 Alien MU/TH/UR 6000 — Fullständig Installations- och Anpassningsguide

### *Synkroniserat retro-futuristiskt terminalgränssnitt för ALIEN RPG (Foundry VTT v14)*

Detta arkiv innehåller den anpassade och lokaliserade versionen av **Alien MU/TH/UR 6000**-modulen (ursprungligen skapad av *ShazProd*). Den simulerar en grön-fosfor dataterminal från 80-talet, vilket gör det möjligt för spelare att interagera i realtid med kolonins artificiella intelligens.

---

## 💛 Stöd Projektet
Om den här modulen har hjälpt till att höja spänningen och inlevelsen vid ditt **Alien RPG**-bord, överväg att stödja utvecklarna för att uppmuntra nya uppdateringar!
* **Ursprunglig Skapare (ShazProd):** Överväg att stödja skaparen av den ursprungliga modulen genom att besöka profilen för [ShazProd på GitHub](https://github.com/ShazProd).
* **Utvecklare av gaffeln (KorujaSedex123):** Om du uppskattar lokaliseringen och den nya funktionen för anpassade GM-kommandon, stöd den här gaffeln:
  * [☕ Köp en Kaffe (Ko-fi)](https://ko-fi.com/korujasedex)
  * [☕ Köp en Kaffe (Buy me a Coffee)](https://buymeacoffee.com/brunogrzegm)
  * 🔑 **PIX**: `https://livepix.gg/korujasedex`

---

## 🤝 Särskilt erkännande & Tack
Detta arkiv är en lokaliserad och anpassad gaffel av den fantastiska **Alien MU/TH/UR 6000**-modulen som ursprungligen skapades av den begåvade utvecklaren **ShazProd** ([@ShazProd](https://github.com/ShazProd)).
* Vi vill uttrycka vår djupaste tacksamhet till **ShazProd** för att han har utvecklat den otroliga estetiken och mekaniken i den ursprungliga terminalen (såsom CRT-effekter, skrivmaskinseffekter, hackningsprotokoll, åskådarläge, miljöreglage och klockan för kärnvapennedräkning).

---

## ✨ Funktionsöversikt

### 🛠️ Basmodulsfunktioner (Utvecklad av ShazProd)
* 📟 **Analog CRT-estetik**: Tunga CRT-skanningslinjer, skrivmaskinsliknande skrivning, ljusstyrkeflimmer och synkroniserade visuella glitch-effekter.
* 👁️ **Spegelläge för åskådare**: Spelare kan titta på den aktiva operatörens terminal i realtid och dela exakt samma textflöde och terminalfel!
* 🔌 **Dynamiskt hackningsprotokoll**: Att skriva `HACK` startar en begäran om säkerhetsförbikoppling. Game Master (GM) får en interaktiv pop-up för att omedelbart godkänna eller neka hacket.
* 🚨 **CERBERUS-protokoll**: Kärnvapensjälvförstörelsenecountdown med röda varningsslingor på helskärm, sirener och automatisk utloggning vid detonation.
* 🎮 **Miljöreglering**: GM-godkända terminalkommandon för att låsa/låsa upp dörrar, styra belysning (`LIGHTS DIM/SHUTDOWN`), ventilera gas eller styra kryogena kapslar.

### ⚙️ Anpassade gaffelfunktioner (Tillagd av KorujaSedex123)
* 🌐 **Komplett lokalisering**: Fullständig översättning direkt mappad till den officiella terminologin för Alien rollspelsböcker.
* 🔧 **Dynamiska anpassade GM-kommandon**: GM kan registrera sina egna terminalkommandon och svar (såsom dolda ledtrådar, lore-hemligheter eller företagsdirektiv) direkt via modulsinställningarna i Foundry VTT i ett enkelt JSON-format — **ingen kodredigering krävs!**

---

## 🚀 Snabbinstallation
För att installera denna anpassade version av modulen i din Foundry VTT:
1. Navigera till **Add-on Modules** på Foundry VTT:s huvudinställningsskärm.
2. Klicka på **Install Module**.
3. Klistra in länken nedan i fältet **Manifest URL**:
   ```
   https://github.com/KorujaSedex123/alien-mu-th-ur-pt-br/releases/latest/download/module.json
   ```
4. Klicka på **Install** och vänta på att processen är klar.
5. Aktivera modulen i dina världsinställningar under **Manage Modules**.

---

## ⚙️ Guide för anpassade GM-kommandon

GM kan konfigurera sina egna anpassade kommando i modulsinställningarna för Foundry VTT genom att ange ett enkelt JSON-objekt.

### Exempel på konfiguration:
```json
{
  "LOGG": "ÅTKOMST TILL LOGGBÖCKER... [12/04/2179]: Temperaturökning upptäckt i sektor G-14.",
  "DIREKTIV": "WEYLAND-YUTANI DIREKTIV: Skydda utomjordisk teknologi till varje pris. Besättningen är umbärlig."
}
```

När en spelare skriver `LOGG` eller `DIREKTIV` i terminalen svarar MU/TH/UR med de meddelanden som konfigurerats av GM!

---

*Handbok genererad i enlighet med specialdirektiv 937. Säkerheten för företagets tillgångar är vår absoluta prioritet.*
