# 🌌 Alien MU/TH/UR 6000 — Hub Multilingue & Édition Personnalisée en Portugais Brésilien

## 💛 Soutenir le Projet / Support the Project

Si ce module vous a aidé à augmenter la tension et l'immersion dans vos parties d'**Alien RPG**, pensez à soutenir les développeurs pour encourager de nouvelles mises à jour !

*   **Créateur Original (ShazProd) :** Pensez à soutenir le créateur du module original et toute son incroyable base esthétique et sonore en visitant le profil de [ShazProd sur GitHub](https://github.com/ShazProd).
*   **Développeur du Fork & Commandes du MJ (KorujaSedex123) :** Si vous avez apprécié la traduction complète en portugais (pt-BR) et la nouvelle fonctionnalité de Commandes Personnalisées du Maître de Jeu (MJ), soutenez la continuité et l'amélioration de ce fork :
    *   [☕ Offrir un café (Ko-fi)](https://ko-fi.com/korujasedex)
    *   [☕ Offrir un café (Buy me a Coffee)](https://buymeacoffee.com/brunogrzegm)
    *   🔑 **PIX** : `https://livepix.gg/korujasedex`

---

```
================================================================================
 W E Y L A N D - Y U T A N I    ----    C O R P．
 M U / T H / U R    6 0 0 0    S Y S T E M
================================================================================
```

Bienvenue dans le dépôt de l'interface de terminal **MU/TH/UR 6000** pour **Foundry VTT**. Ce projet apporte le terminal d'ordinateur rétro-futuriste à phosphore vert du Nostromo directement dans vos sessions de jeu sur table **Alien RPG**, créant une atmosphère d'horreur de science-fiction hautement immersive.

---

## 🤝 Crédits Spéciaux & Remerciements

Ce dépôt est un fork localisé et personnalisé du spectaculaire module **Alien MU/TH/UR 6000** créé à l'origine par le talentueux développeur **ShazProd** ([@ShazProd](https://github.com/ShazProd)).

*   **Anglais (Créateur Original) :** Nous voulons exprimer notre plus profonde gratitude à **ShazProd** pour avoir développé la base, l'esthétique et les mécaniques incroyables du terminal original (telles que les effets visuels CRT, les effets de machine à écrire, les protocoles de piratage, le mode spectateur, les contrôles environnementaux et le compte à rebours nucléaire). Ce projet n'existerait pas sans leur travail acharné et leur dévouement envers la communauté d'Alien RPG. Merci, ShazProd, de nous avoir donné l'interface informatique ultime avec laquelle jouer ! 🛸
*   **Portuguais (Cette Version) :** Cette version développée par **KorujaSedex123** élargit le travail original de **ShazProd**, en apportant la traduction complète en portugais brésilien (`pt-BR`) et en ajoutant la fonctionnalité innovante de **Commandes Personnalisées du MJ** via l'interface de configuration de Foundry VTT.

---

## 🌐 Langues de Documentation / Idiomas de Documentação

Veuillez choisir votre langue pour accéder à la documentation et aux fonctionnalités spécifiques :

*   🇧🇷 **Português (Brasil)**: [README.pt.md](README.pt.md) *(Manual em Português com suporte a Comandos Customizados)*
*   🇬🇧 **English**: [README.en.md](README.en.md) *(English documentation featuring Custom GM Commands)*
*   🇪🇸 **Español**: [README.es.md](README.es.md) *(Documentación en Español)*
*   🇫🇷 **Français**: [README.fr.md](README.fr.md) *(Documentation en Français)*
*   🇩🇪 **Deutsch**: [README.de.md](README.de.md) *(Deutsche Dokumentation)*
*   🇮🇹 **Italiano**: [README.it.md](README.it.md)
*   🇳🇱 **Nederlands**: [README.nl.md](README.nl.md)
*   🇳🇴 **Norsk**: [README.no.md](README.no.md)
*   🇸🇪 **Svenska**: [README.sv.md](README.sv.md)
*   🇩🇰 **Dansk**: [README.da.md](README.da.md)

---

## ✨ Aperçu des Fonctionnalités

### 🛠️ Fonctionnalités de Base du Module (Développées par ShazProd)

*   📟 **Esthétique CRT Analogique** : Lignes de balayage CRT prononcées, effets de saisie mécanique (machine à écrire), scintillement de la luminosité et effets de glitch visuel synchronisés en temps réel.
*   👁️ **Mode Spectateur Miroir** : Les joueurs peuvent observer le terminal de l'opérateur actif en temps réel, partageant exactement le même flux de texte et les mêmes glitchs d'affichage !
*   🔌 **Protocole de Piratage Dynamique** : Saisir `HACK` lance une demande de contournement de sécurité. Le Maître de Jeu (MJ) reçoit une fenêtre contextuelle interactive pour approuver ou refuser instantanément le piratage.
*   🚨 **Protocole CERBERUS** : Compte à rebours d'auto-destruction nucléaire avec boucles d'alerte rouge en plein écran, sirènes et déconnexion automatique de la session lors de la détonation.
*   🎮 **Contrôles Environnementaux** : Commandes de terminal approuvées par le MJ pour verrouiller/déverrouiller les portes, contrôler l'éclairage (`LIGHTS DIM/SHUTDOWN`), évacuer le gaz ou faire fonctionner les caissons cryogéniques.

### 🇧🇷 Fonctionnalités du Fork Personnalisé (Ajoutées par KorujaSedex123)

*   🌐 **Localisation à 100% en Portugais Brésilien** : Traduction complète mappée directement sur la terminologie officielle des livres d'Alien RPG de l'éditeur *New Order* (Stress, Panique, Ordres Spéciaux).
*   ⚙️ **Commandes MJ Personnalisées Dynamiques** : Les MJ peuvent enregistrer leurs propres invites et réponses de terminal (telles que des indices cachés, des secrets d'histoire ou des directives d'entreprise) directement via le menu de configuration du module Foundry VTT au format JSON simple — **aucune modification de code n'est requise !**

---

## 🚀 Installation Rapide

Pour installer cette édition personnalisée du module dans votre Foundry VTT (v14 recommandée) :

1.  Dans l'écran principal de configuration de Foundry VTT, allez dans **Add-on Modules**.
2.  Cliquez sur **Install Module**.
3.  Dans le champ **Manifest URL**, collez le lien ci-dessous :
    ```
    https://github.com/KorujaSedex123/alien-mu-th-ur-pt-br/releases/latest/download/module.json
    ```
4.  Cliquez sur **Install** et attendez que le processus se termine.
5.  Activez le module dans les paramètres de votre monde sous **Manage Modules**.

---

## 🛠️ Contribution

Les contributions sont les bienvenues ! Si vous souhaitez traduire les nouvelles fonctionnalités dans d'autres langues, corriger un bug ou suggérer de nouvelles ressources :

1.  Faites un **Fork** de ce dépôt.
2.  Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingImprovement`).
3.  Validez vos modifications (`git commit -m 'Add some amazing feature'`).
4.  Poussez vers la branche (`git push origin feature/AmazingImprovement`).
5.  Ouvrez une **Pull Request**.

---
*Manuel généré en conformité avec les directives Weyland-Yutani. La sécurité des actifs de la compagnie est notre priorité absolue.*
