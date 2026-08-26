# 🌌 Alien MU/TH/UR 6000 — Volledige Installatie- en Aanpassingsgids

### *Gesynchroniseerde Retro-Futuristische Terminalinterface voor ALIEN RPG (Foundry VTT v14)*

Deze repository bevat de aangepaste en gelokaliseerde versie van de **Alien MU/TH/UR 6000** module (oorspronkelijk gemaakt door *ShazProd*). Het simuleert een groen-fosfor computerterminal uit de jaren '80, waarmee spelers in realtime kunnen communiceren met de kunstmatige intelligentie van de kolonie.

---

## 💛 Steun het Project
Als deze module heeft geholpen om de spanning en immersie aan je **Alien RPG**-tafel te verhogen, overweeg dan om de ontwikkelaars te steunen om nieuwe updates te stimuleren!
* **Originele Maker (ShazProd):** Overweeg om de maker van de originele module te steunen door zijn profiel op [ShazProd op GitHub](https://github.com/ShazProd) te bezoeken.
* **Ontwikkelaar van de Fork (KorujaSedex123):** Als je geniet dier de lokalisatie en de nieuwe functie voor Aangepaste GM-commando's, steun dan deze fork:
  * [☕ Koop een Koffie (Ko-fi)](https://ko-fi.com/korujasedex)
  * [☕ Koop een Koffie (Buy me a Coffee)](https://buymeacoffee.com/brunogrzegm)
  * 🔑 **PIX**: `https://livepix.gg/korujasedex`

---

## 🤝 Speciale Dank & Erkenning
Deze repository is een gelokaliseerde en aangepaste fork van de spectaculaire **Alien MU/TH/UR 6000**-module, oorspronkelijk gemaakt door de getalenteerde ontwikkelaar **ShazProd** ([@ShazProd](https://github.com/ShazProd)).
* We willen onze diepste dank betuigen aan **ShazProd** voor het ontwikkelen van de ongelooflijke esthetiek en mechanica van de originele terminal (zoals CRT-effecten, typemachine-effecten, hackprotocollen, toeschouwersmodus, omgevingscontroles en het nucleaire aftellen).

---

## ✨ Overzicht van Functies

### 🛠️ Basismodule-functies (Ontwikkeld door ShazProd)
* 📟 **Analoge CRT-esthetiek**: Zware CRT-scanlines, typemachine-typeringseffecten, helderheidsflikkering en gesynchroniseerde visuelle glitch-effecten.
* 👁️ **Spiegel Toeschouwersmodus**: Spelers kunnen de terminal van de actieve operator in realtime bekijken, met exact dezelfde tekststroom en terminalglitches!
* 🔌 **Dynamisch Hackprotocol**: Typen van `HACK` start een beveiligingsomleidingsverzoek. De Game Master (GM) krijgt een interactieve pop-up om de hack direct goed te keuren of te weigeren.
* 🚨 **CERBERUS-protocol**: Nucleaire zelfvernietigingscountdown met rode waarschuwingslussen op het volledige scherm, sirenes en automatische uitlogging bij ontploffing.
* 🎮 **Omgevingscontroles**: Door de GM goedgekeurde terminalcommando's om deuren te vergrendelen/ontgrendelen, verlichting te regelen (`LIGHTS DIM/SHUTDOWN`), gas af te blazen of cryogene capsules te bedienen.

### ⚙️ Aangepaste Fork-functies (Toegevoegd by KorujaSedex123)
* 🌐 **Volledige Lokalisatie**: Volledige vertaling die direct aansluit bij de officiële terminologie van de Alien rollenspelboeken.
* 🔧 **Dynamische Aangepaste GM-commando's**: GM's kunnen hun eigen terminalprompts en antwoorden (zoals verborgen aanwijzingen, lore-geheimen of bedrijfsrichtlijnen) rechtstreeks registreren via het Foundry VTT Module Settings-menu in een eenvoudig JSON-formaat — **geen codewijziging vereist!**

---

## 🚀 Snelle Installatie
Om deze aangepaste editie van de module in je Foundry VTT te installeren:
1. Navigeer in het hoofdscherm van Foundry VTT naar **Add-on Modules**.
2. Klik op **Install Module**.
3. Plak de onderstaande link in het veld **Manifest URL**:
   ```
   https://github.com/KorujaSedex123/alien-mu-th-ur-pt-br/releases/latest/download/module.json
   ```
4. Klik op **Install** en wacht tot het proces is voltooid.
5. Schakel de module in bij je wereldinstellingen onder **Manage Modules**.

---

## ⚙️ Handleiding voor Aangepaste GM-commando's

GMs kunnen hun eigen aangepaste commando's configureren in de instellingen van de Foundry VTT-module door een eenvoudig JSON-object in te voeren.

### Voorbeeldconfiguratie:
```json
{
  "LOGBOEKEN": "TOEGANG TOT LOGBOEKEN... [12/04/2179]: Temperatuurstijging gedetecteerd in sector G-14.",
  "RICHTLIJN": "WEYLAND-YUTANI RICHTLIJN: Bescherm buitenaardse technologie ten koste van tutto. Bemanning is opofferbaar."
}
```

Als een speler `LOGBOEKEN` of `RICHTLIJN` in de terminal typt, antwoordt MU/TH/UR met de door de GM geconfigureerde berichten!

---

*Handleiding gegenereerd in overeenstemming met Speciale Richtlijn 937. De veiligheid van bedrijfsactiva is onze absolute prioriteit.*
