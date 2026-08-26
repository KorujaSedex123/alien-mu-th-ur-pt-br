# 🌌 Alien MU/TH/UR 6000 — Hub Multilingüe y Edición Especial en Español

## 💛 Apoya el Proyecto / Support the Project
¡Si este módulo te ayudó a elevar la tensión y la inmersión en tu mesa de **Alien RPG**, considera apoyar a los desarrolladores para incentivar nuevas actualizaciones!

* **Creador Original (ShazProd):** Considera apoyar al creador del módulo original y de toda su increíble base estética y de efectos de sonido accediendo al perfil de [ShazProd en GitHub](https://github.com/ShazProd).
* **Desarrollador de la Bifurcación (Fork) y Comandos del Director (KorujaSedex123):** Si te gustó la traducción completa al portugués brasileño (`pt-BR`), las adaptaciones multilingües y la nueva función de Comandos Personalizados del Director de Juego, apoya la continuidad y mejora de este fork:
  * [☕ Compra un Café (Ko-fi)](https://ko-fi.com/korujasedex)
  * [☕ Compra un Café (Buy me a Coffee)](https://buymeacoffee.com/brunogrzegm)
  * 🔑 **PIX**: `https://livepix.gg/korujasedex`

---

```
================================================================================
W E Y L A N D - Y U T A N I    ----    C O R P．
M U / T H / U R    6 0 0 0    S Y S T E M
================================================================================
```

Bienvenido al repositorio de la interfaz de terminal **MU/TH/UR 6000** para **Foundry VTT**. Este proyecto lleva la terminal retrofuturista de fósforo verde de la Nostromo directamente a tus sesiones de juego de **Alien RPG**, creando una atmósfera de terror y ciencia ficción sumamente inmersiva.

---

## 🤝 Créditos Especiales y Agradecimientos
Este repositorio es una bifurcación (fork) localizada y personalizada del espectacular módulo **Alien MU/TH/UR 6000** creado originalmente por el talentoso desarrollador **ShazProd** ([@ShazProd](https://github.com/ShazProd)).

* **Inglés (Creador Original):** Queremos expresar nuestro más profundo agradecimiento a **ShazProd** por desarrollar la increíble base, estética y mecánicas de la terminal original (como los efectos visuales de CRT, el efecto de máquina de escribir, los protocolos de hackeo, el modo espectador, los controles ambientales y la cuenta regresiva nuclear). ¡Este proyecto no existiría sin su arduo trabajo y dedicación a la comunidad de Alien RPG! 🛸
* **Español (Esta Versión):** Esta versión desarrollada por **KorujaSedex123** expande el trabajo original de **ShazProd**, permitiendo la localización multilingüe completa e introduciendo la innovadora función de **Comandos Personalizados del Director de Juego (GM)** a través de la interfaz de configuración de Foundry.

---

## 🌐 Idiomas de Documentación / Documentation Languages
Por favor, elige tu idioma para acceder a la documentación específica y sus características:

* 🇧🇷 **Português (Brasil)**: [README.md](README.md) *(Manual en portugués con soporte de Comandos Personalizados)*
* 🇬🇧 **English**: [README.en.md](README.en.md) *(English documentation featuring Custom GM Commands)*
* 🇪🇸 **Español**: [README.es.md](README.es.md) *(Documentación en español con soporte de Comandos Personalizados)*
* 🇫🇷 **Français**: [README.fr.md](README.fr.md)
* 🇩🇪 **Deutsch**: [README.de.md](README.de.md)
* 🇮🇹 **Italiano**: [README.it.md](README.it.md)
* 🇳🇱 **Nederlands**: [README.nl.md](README.nl.md)
* 🇳🇴 **Norsk**: [README.no.md](README.no.md)
* 🇸🇪 **Svenska**: [README.sv.md](README.sv.md)
* 🇩🇰 **Dansk**: [README.da.md](README.da.md)

---

## ✨ Desglose de Características

### 🛠️ Características del Módulo Base (Desarrollado por ShazProd)
* 📟 **Estética CRT Analógica**: Líneas de exploración CRT pronunciadas, efectos de escritura mecánica, parpadeo de brillo y efectos de interferencia visual (glitch) sincronizados en tiempo real.
* 👁️ **Modo Espectador Espejo**: ¡Los jugadores pueden observar la terminal del operador activo en tiempo real, compartiendo exactamente el mismo flujo de texto y distorsiones de la terminal!
* 🔌 **Protocolo Dinámico de Hackeo**: Al escribir `HACK` se inicia una solicitud para eludir la seguridad. El Director de Juego (GM) recibe una ventana interactiva emergente para aprobar o denegar el hackeo al instante.
* 🚨 **Protocolo CERBERUS**: Cuenta regresiva de autodestrucción nuclear con bucles de advertencia rojos a pantalla completa, sirenas y cierre automático de sesión al finalizar la cuenta.
* 🎮 **Controles Ambientales**: Comandos de terminal aprobados por el GM para bloquear/desbloquear puertas, controlar la iluminación (`LIGHTS DIM/SHUTDOWN`), liberar gas o manipular cápsulas criogénicas.

### 🇪🇸 Características de la Bifurcación (Añadido por KorujaSedex123)
* 🌐 **Traducción y Adaptación Completa**: Localización limpia adaptada a la terminología oficial de los manuales de Alien RPG (Estrés, Pánico, Órdenes Especiales).
* ⚙️ **Comandos Dinámicos Personalizados para el GM**: Los Directores de Juego pueden registrar sus propias entradas y respuestas de terminal (como pistas ocultas, secretos de trasfondo o directivas corporativas) directamente desde el menú de Configuración del Módulo de Foundry VTT en un formato JSON simple, **¡sin necesidad de editar código!**

---

## 🚀 Instalación Rápida
Para instalar esta edición personalizada del módulo en tu Foundry VTT (se recomienda v14):

1. En la pantalla principal de configuración de Foundry VTT, ve a **Add-on Modules** (Módulos adicionales).
2. Haz clic en **Install Module** (Instalar módulo).
3. En el campo **Manifest URL**, pega el siguiente enlace:
   ```
   https://github.com/KorujaSedex123/alien-mu-th-ur-pt-br/releases/latest/download/module.json
   ```
4. Haz clic en **Install** y espera a que finalice el proceso.
5. Habilita el módulo en la configuración de tu mundo dentro de **Manage Modules** (Gestionar módulos).

---

## 🛠️ Contribuciones
¡Las contribuciones son enormemente bienvenidas! Si deseas traducir las nuevas características a otros idiomas, corregir algún error o sugerir nuevas adiciones:

1. Haz un **Fork** de este repositorio.
2. Crea tu rama de características (`git checkout -b feature/AmazingImprovement`).
3. Confirma tus cambios (`git commit -m 'Add some amazing feature'`).
4. Sube la rama (`git push origin feature/AmazingImprovement`).
5. Abre una **Pull Request**.

---
