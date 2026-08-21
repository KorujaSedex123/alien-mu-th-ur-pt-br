/**
 * Módulo: Alien MU/TH/UR 6000 - Configurações de Comandos Personalizados
 * 
 * Este arquivo contém a lógica para registrar a configuração no Foundry VTT
 * e a função auxiliar para processar os comandos customizados do mestre.
 */

Hooks.once("init", () => {
  // Registra a configuração de comandos personalizados na aba do módulo
  game.settings.register("alien-mu-th-ur-pt-br", "customCommands", {
    name: "Comandos Personalizados do MU/TH/UR",
    hint: "Insira uma lista de comandos em formato JSON. Exemplo: [{\"input\": \"auto-destruicao\", \"output\": \"Sequência de autodestruição iniciada. T-minus 10 minutos.\"}]",
    scope: "world",      // Apenas o mestre (GM) pode editar
    config: true,        // Exibe na aba de configurações do Foundry
    type: String,        // Salva os dados como uma string de texto longa
    default: "[]",       // Inicializa com um array JSON vazio
    onChange: value => {
      console.log("MU/TH/UR 6000: Comandos personalizados atualizados pelo Mestre!");
    }
  });
});

/**
 * Função para verificar se um comando digitado corresponde a um comando personalizado
 * cadastrado pelo Mestre nas configurações do módulo.
 * 
 * @param {string} inputComando - O comando digitado pelo jogador no terminal.
 * @returns {string|null} - Retorna o texto da resposta se houver correspondência, ou null caso contrário.
 */
export function getCustomMuthurCommandResponse(inputComando) {
  if (!inputComando) return null;

  // Recupera o texto salvo na configuração
  const jsonComandos = game.settings.get("alien-mu-th-ur-pt-br", "customCommands");
  
  if (!jsonComandos || jsonComandos.trim() === "" || jsonComandos === "[]") {
    return null;
  }

  try {
    // Converte a string JSON de volta para array de objetos
    const comandosPersonalizados = JSON.parse(jsonComandos);

    if (Array.isArray(comandosPersonalizados)) {
      // Normaliza o input digitado (removendo espaços extras e ignorando maiúsculas/minúsculas)
      const inputNormalizado = inputComando.toLowerCase().trim();

      // Procura se algum comando personalizado cadastrado bate com o digitado
      const comandoEncontrado = comandosPersonalizados.find(
        comando => comando.input && comando.input.toLowerCase().trim() === inputNormalizado
      );

      if (comandoEncontrado) {
        return comandoEncontrado.output;
      }
    }
  } catch (error) {
    console.error("MU/TH/UR 6000 | Erro ao analisar o JSON de comandos personalizados:", error);
  }

  return null;
}
