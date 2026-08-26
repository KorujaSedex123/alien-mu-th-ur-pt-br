# 🌌 Alien MU/TH/UR 6000 — Full installasjon og tilpasningsveiledning

### *Synkronisert retro-futuristisk terminalgrensesnitt for ALIEN RPG (Foundry VTT v14)*

Dette depotet inneholder den tilpassede og lokaliserte versjonen av **Alien MU/TH/UR 6000**-modulen (opprinnelig opprettet av *ShazProd*). Den simulerer en grønn-fosfor dataterminal fra 80-tallet, slik at spillere kan samhandle i sanntid med koloniens kunstige intelligens.

---

## 💛 Støtt Prosjektet
Hvis denne modulen har bidratt til å øke spenningen og innlevelsen ved **Alien RPG**-bordet ditt, kan du vurdere å støtte utviklerne for å oppmuntre til nye oppdateringer!
* **Opprinnelig skaper (ShazProd):** Vurder å støtte skaperen av den opprinnelige modulen ved å besøke profilen til [ShazProd på GitHub](https://github.com/ShazProd).
* **Utvikler av gaffelen (KorujaSedex123):** Hvis du liker lokaliseringen og den nye funksjonen for tilpassede GM-kommandoer, kan du støtte denne gaffelen:
  * [☕ Kjøp en Kaffe (Ko-fi)](https://ko-fi.com/korujasedex)
  * [☕ Kjøp en Kaffe (Buy me a Coffee)](https://buymeacoffee.com/brunogrzegm)
  * 🔑 **PIX**: `https://livepix.gg/korujasedex`

---

## 🤝 Spesielle poeng og anerkjennelse
Dette depotet er en lokalisert og tilpasset gaffel av den spektakulære **Alien MU/TH/UR 6000**-modulen opprinnelig opprettet av den talentfulle utvikleren **ShazProd** ([@ShazProd](https://github.com/ShazProd)).
* Vi ønsker å uttrykke vår dypeste takknemlighet til **ShazProd** for å ha utviklet den utrolige estetikken og mekanikken til den originale terminalen (som CRT-effekter, skrivemaskineffekter, hackingprotokoller, tilskuermodus, miljøkontroller og kjernefysisk nedtelling).

---

## ✨ Funksjonsoversikt

### 🛠️ Basismodul-funksjoner (Utviklet av ShazProd)
* 📟 **Analog CRT-estetikk**: Tunge CRT-skanningslinjer, skrivemaskin-skriveeffekter, lysstyrkeflimmer og synkroniserte visuelle glitch-effekter.
* 👁️ **Speil-tilskuermodus**: Spillere kan se terminalen til den aktive operatøren i sanntid, og dele nøyaktig samme tekststrøm og terminalfeil!
* 🔌 **Dynamisk hackingprotokoll**: Skrive `HACK` starter en forespørsel om sikkerhetsforbigang. Game Master (GM) får en interaktiv pop-up for umiddelbart å godkjenne eller avvise hacket.
* 🚨 **CERBERUS-protokoll**: Kjernefysisk selvdestruksjonsnedtelling med røde advarselsløkker på full skjerm, sirener og automatisk utlogging av økten ved detonasjon.
* 🎮 **Miljøkontroller**: GM-godkjente terminalkommandoer for å låse/låse opp dører, kontrollere belysning (`LIGHTS DIM/SHUTDOWN`), lufte gass eller betjene kryogene kapsler.

### ⚙️ Tilpassede gaffelfunksjoner (Lagt til av KorujaSedex123)
* 🌐 **Fullstendig lokalisering**: Komplett oversettelse direkte kartlagt til den offisielle terminologien til Alien rollespillbøker.
* 🔧 **Dynamiske tilpassede GM-kommandoer**: GMer kan registrere sine egne terminalmeldinger og svar (som skjulte ledetråder, lore-hemmeligheter eller bedriftsdirektiver) direkte via Foundry VTT-modulinnstillingsmenyen i et enkelt JSON-format — **ingen kodeendring kreves!**

---

## 🚀 Rask installasjon
For å installere denne tilpassede utgaven av modulen i din Foundry VTT:
1. I hovedoppsettskjermen for Foundry VTT, naviger til **Add-on Modules**.
2. Klikk på **Install Module**.
3. Lim inn lenken nedenfor i **Manifest URL**-feltet:
   ```
   https://github.com/KorujaSedex123/alien-mu-th-ur-pt-br/releases/latest/download/module.json
   ```
4. Klikk på **Install** og vent til prosessen er fullført.
5. Aktiver modulen i verdenens innstillinger under **Manage Modules**.

---

## ⚙️ Veiledning for tilpassede GM-kommandoer

GMer kan konfigurere sine egne tilpassede kommandoer i Foundry VTT-modulinnstillingene ved å skrive inn et enkelt JSON-objekt.

### Eksempel på konfigurasjon:
```json
{
  "LOGG": "TILGANG TIL LOGGBØKER... [12.04.2179]: Temperaturstigning oppdaget i sektor G-14.",
  "DIREKTIV": "WEYLAND-YUTANI-DIREKTIV: Beskytt fremmed teknologi for enhver pris. Mannskapet kan ofres."
}
```

Når en spiller skriver `LOGG` eller `DIREKTIV` i terminalen, vil MU/TH/UR svare med meldingene konfigurati av GM!

---

*Håndbok generert i samsvar med spesialdirektiv 937. Sikkerheten til bedriftens eiendeler er vår absolutte prioritet.*
