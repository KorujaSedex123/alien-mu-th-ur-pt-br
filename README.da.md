# 🌌 Alien MU/TH/UR 6000 — Komplet installations- og tilpasningsvejledning

### *Synkroniseret retro-futuristisk terminalgrænseflade til ALIEN RPG (Foundry VTT v14)*

Dette depot indeholder den tilpassede og lokaliserede version af **Alien MU/TH/UR 6000**-modulet (oprindeligt oprettet af *ShazProd*). Det simulerer en grøn-fosfor computerterminal fra 80'erne, hvilket gør det muligt for spillere at interagere i realtid med koloniens kunstige intelligens.

---

## 💛 Støt Projektet
Hvis dette modul har hjulpet med at øge spændingen og indlevelsen ved dit **Alien RPG**-bord, kan du overveje at støtte udviklerne for at opmuntre til nye opdateringer!
* **Oprindelig Skaber (ShazProd):** Overvej at støtte skaberen af det originale modul ved at besøge profilen for [ShazProd på GitHub](https://github.com/ShazProd).
* **Udvikler af gaffelen (KorujaSedex123):** Hvis du nyder lokaliseringen og den nye funktion til brugerdefinerede GM-kommandoer, kan du støtte denne gaffel:
  * [☕ Køb en Kaffe (Ko-fi)](https://ko-fi.com/korujasedex)
  * [☕ Køb en Kaffe (Buy me a Coffee)](https://buymeacoffee.com/brunogrzegm)
  * 🔑 **PIX**: `https://livepix.gg/korujasedex`

---

## 🤝 Særlig anerkendelse og tak
Dette depot er en lokaliseret og tilpasset gaffel af det fantastiske **Alien MU/TH/UR 6000**-modul, oprindeligt skabt af den talentfulde udvikler **ShazProd** ([@ShazProd](https://github.com/ShazProd)).
* Vi ønsker at udtrykke vores dybeste taknemmelighed til **ShazProd** for at have udviklet den utrolige æstetik og mekanik i den originale terminal (såsom CRT-effekter, skrivemaskineeffekter, hackingprotokoller, tilskuertilstand, miljøkontrol og atomnedtælling).

---

## ✨ Funktionsoversigt

### 🛠️ Funktioner i basismodulet (Udviklet af ShazProd)
* 📟 **Analog CRT-æstetik**: Tunge CRT-scanningslinjer, skrivemaskine-skriveeffekter, lysstyrkeflimren og synkroniserede visuelle glitch-effekter.
* 👁️ **Spejl-tilskuertilstand**: Spillere kan se terminalen for den aktive operatør i realtid og dele nøjagtig samme tekststrøm og terminalfejl!
* 🔌 **Dynamisk hackingprotokol**: At skrive `HACK` starter en anmodning om sikkerhedsforbigåelse. Game Master (GM) får en interaktiv pop-up til øjeblikkeligt at godkende eller afvise hacket.
* 🚨 **CERBERUS-protokol**: Atom-selvdestruktionsnedtælling med røde advarselssløjfer på fuld skærm, sirener og automatisk logafbrydelse ved detonation.
* 🎮 **Miljøkontrol**: GM-godkendte terminalkommandoer til at låse/låse op for døre, styre belysning (`LIGHTS DIM/SHUTDOWN`), udlufte gas eller betjene kryogene kapsler.

### ⚙️ Brugerdefinerede gaffelfunktioner (Tilføjet af KorujaSedex123)
* 🌐 **Komplet lokalisering**: Fuld oversettelse direkte kortlagt til den officielle terminologi for Alien rollespilsbøger.
* 🔧 **Dynamiske brugerdefinerede GM-kommandoer**: GM'er kan registrere deres egne terminalmeddelelser og svar (såsom skjulte spor, lore-hemmeligheder eller virksomhedsdirektiver) direkte via modulsindstillingsmenuen i Foundry VTT i et simpelt JSON-format — **ingen koderedigering påkrævet!**

---

## 🚀 Hurtig installation
Sådan installeres denne tilpassede udgave af modulet i din Foundry VTT:
1. Naviger til **Add-on Modules** på Foundry VTT's hovedopsætningsskærm.
2. Klik på **Install Module**.
3. Indsæt linket nedenfor i feltet **Manifest URL**:
   ```
   https://github.com/KorujaSedex123/alien-mu-th-ur-pt-br/releases/latest/download/module.json
   ```
4. Klik på **Install** og vent, indtil processen er fuldført.
5. Aktiver modulet i dine verdensindstillinger under **Manage Modules**.

---

## ⚙️ Vejledning til brugerdefinerede GM-kommandoer

GM'er kan konfigurere deres egne brugerdefinerede kommandoer i Foundry VTT-modulindstillingerne ved at indtaste et simpelt JSON-objekt.

### Eksempel på konfiguration:
```json
{
  "LOGGE": "ADGANG TIL LOGBØGER... [12/04/2179]: Temperaturstigning registreret i sektor G-14.",
  "DIREKTIV": "WEYLAND-YUTANI DIREKTIV: Beskyt fremmed teknologi for enhver pris. Besætningen kan ofres."
}
```

Når en spiller skriver `LOGGE` o `DIREKTIV` i terminalen, vil MU/TH/UR svare med de meddelelser, der er konfigureret af GM!

---

*Vejledning genereret i overensstemmelse med specialdirektiv 937. Virksomhedens aktiver har den absolut højeste prioritet.*
