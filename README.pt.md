# 🌌 MU/TH/UR 6000 — Guia Completo de Instalação e Customização
### *Módulo de Terminal Retro-Futurista Sincronizado para ALIEN RPG (Foundry VTT v14)*

Este repositório contém a versão customizada e totalmente traduzida para **Português (Brasil)** do módulo **Alien MU/TH/UR 6000** (original de *ShazProd*). Ele simula uma interface de terminal de computador dos anos 80, permitindo que os jogadores interajam em tempo real com a inteligência artificial da colônia *Acheron-Beta*.

---

## 🚀 1. Recursos Principais

*   **Estética Retro-Analógica:** Efeito de digitação mecânica (*typewriter*), linhas de varredura CRT (*scanlines*), oscilação de brilho e efeitos de interferência/glitch visual pesados sincronizados em tempo real.
*   **Modo Espetador Espelhado:** Os jogadores que não estão operando o console podem assistir à sessão de terminal do operador ativo, vendo os mesmos glitches e textos em tempo real.
*   **Áudio Sincronizado:** Cliques táticos de digitação, som de retorno de carro, alarmes corporativos e ruídos de erro.
*   **Protocolo de Hack Dinâmico:** Os jogadores podem digitar `HACK` para forçar privilégios de administrador. O Mestre (GM) recebe um pop-up instantâneo para decidir o **SUCESSO** ou a **FALHA** da invasão.
*   **Diretrizes Especiais:** Acesso a ordens sigilosas da Weyland-Yutani (como as Diretrizes Especiais `754`, `899`, `931`, `937`, `939` e `966`) após um hacking bem-sucedido.
*   **Protocolo CÉRBERO (Cerberus):** Solicitação de contagem regressiva para a auto-destruição nuclear da estação, com tela piscando em vermelho, sirenes em loop e desligamento automático do terminal após a detonação.
*   **Controles Ambientais:** Comandos para controlar portas (`DOORS LOCK/UNLOCK`), luzes (`LIGHTS DIM/SHUTDOWN/RESTORE`), vazamento de gás (`GAS`) e liberação criogênica (`CRYO POD/RELEASE`) com autorização do Mestre.

---

## 📥 2. Instalação Local (Desenvolvimento)

Para editar os arquivos e rodar o módulo em seu ambiente local do **Foundry VTT v14**, clone este repositório diretamente dentro da sua pasta de dados de usuário:

```bash
cd "Caminho/Para/Seu/Foundry/Data/modules"
git clone https://github.com/ShazProd/alien-mu-th-ur.git alien-mu-th-ur
```

---

## 🇧🇷 3. Ativação do Idioma Português (Brasil)

O arquivo de tradução completa **`pt-BR.json`** já foi desenvolvido e mapeado 1:1 com as chaves oficiais. Para ativá-lo:

1. Certifique-se de que o arquivo **`pt-BR.json`** está dentro de `/alien-mu-th-ur/lang/`.
2. Abra o arquivo **`module.json`** na raiz do módulo e declare o arquivo de português no bloco `"languages"`:

```json
  "languages": [
    {
      "lang": "en",
      "name": "English",
      "path": "lang/en.json"
    },
    {
      "lang": "pt-BR",
      "name": "Português (Brasil)",
      "path": "lang/pt-BR.json"
    }
  ]
```

3. Configure o idioma padrão do seu Foundry VTT ou do seu usuário para **Português (Brasil)**.
4. Reinicie o Foundry ou digite `/reload` no chat do jogo.

---

## ⌨️ 4. Comandos de Terminal Disponíveis

### Comandos Básicos (Qualquer Jogador):
*   `HELP`: Exibe as instruções básicas de uso e os comandos iniciais disponíveis.
*   `STATUS`: Exibe o diagnóstico operacional e as condições de energia da base.
*   `CLEAR`: Limpa todas as linhas de texto anteriores da tela (sincronizado para espectadores).
*   `EXIT`: Encerra a conexão e fecha a janela do terminal.
*   `/M [mensagem]`: Abre um canal de transmissão direto e confidencial com a IA (o Mestre responde como MÃE digitando de volta).

### Comandos de Invasão (Apenas Silas Finch / Hackers):
*   `HACK`: Inicia uma tentativa de quebra de criptografia para obter privilégios de administrador.

### Comandos Especiais (Disponíveis Pós-Hack ou para Capitães):
*   `ORDERS [Código]`: Exibe as diretrizes de prioridade corporativa confidenciais.
    *   `754`: Investigar sinais de transmissão extraterrestre. Tripulação descartável.
    *   `899`: Capturar espécimes biológicos para armas especiais. Tripulação descartável.
    *   `931`: Conter contaminação ativa de patógenos. Ativar quarentena.
    *   `937`: Proteção absoluta do espécime Xenomorfo. Tripulação descartável.
    *   `939`: Extrair e transportar amostras puras. Confidencialidade absoluta.
    *   `966`: Proteger artefatos alienígenas/Engenheiros. Tripulação descartável.
*   `CERBERUS`: Inicia o protocolo nuclear de auto-destruição de Acheron-Beta (requer confirmação do GM).

---

## ⚙️ 5. Personalizando seus Próprios Protocolos

### A. Traduzindo ou Alterando Textos de Resposta:
Abra o arquivo **`lang/pt-BR.json`** no seu editor de código e edite os valores entre aspas à direita de cada chave. Você pode alterar as mensagens de erro, as descrições das ordens especiais ou os alertas de segurança:

```json
"SpecialOrders": {
  "937": {
    "name": "DIRETRIZ CORPORATIVA EXCLUSIVA 937",
    "description": "Ordem de contingência ativada. Prioridade de aquisição: Organismo adaptativo. Sobrevivência da equipe secundária."
  }
}
```

### B. Adicionando Novos Comandos Físicos no Script:
Para criar comandos adicionais (ex: `PURGA` ou `SOBRECARGA`), abra a pasta **`scripts/`**, localize o arquivo JavaScript interpretador de comandos e declare a nova condicional:

```javascript
case 'PURGA':
  if (isAdmin) {
    this.sendToTerminal("INICIANDO EXPULSÃO DE CO2 NOS DUTOS DE VENTILAÇÃO...");
    // Sua lógica de ativação de efeito/porta aqui...
  } else {
    this.sendToTerminal("ACESSO NEGADO. PRIVILÉGIOS DE ADMINISTRADOR EXIGIDOS.");
  }
  break;
```

---

## 🌌 6. Atmosfera Recomendada de Jogo

Para extrair o potencial máximo de horror tecnológico na sua sessão de *ALIEN RPG*, ative e integre os seguintes módulos parceiros:
1.  **Weyland - Alien RPG Theme:** Para estilizar todas as planilhas, menus e janelas de diário do Foundry no mesmo verde-fóforo corporativo da MÃE.
2.  **FXMaster:** Ative o filtro "CRT/VHS" em tela cheia para simular que a tela de todos os jogadores é um monitor analógico durante o combate.
3.  **Shared Vision:** Simule as *helmet cams* (câmeras de capacete). O operador do terminal permanece na segurança de uma sala fechada ditando instruções para os soldados com base no que enxerga das câmeras deles no mapa!

---
*Manual gerado em total conformidade com a Diretiva Especial 937. A segurança dos ativos da companhia é nossa prioridade absoluta.*
