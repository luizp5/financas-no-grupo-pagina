/*
 * CONFIGURAÇÃO DA PÁGINA
 * ----------------------
 * Tudo o que muda de uma instalação para outra está aqui. Troque os valores,
 * salve e recarregue a página. Não precisa mexer em mais nada para a página
 * funcionar (o guia completo está em COMO-USAR.html).
 *
 * Os preços e dias de teste abaixo são EXEMPLO. Eles só aparecem quando o
 * sistema não responde: com o sistema no ar, a página mostra os planos
 * cadastrados no Admin.
 */
window.SITE = {
  // Nome do produto e da assistente, como aparecem nos textos da página.
  marca: 'Dona Conta',
  assistente: 'Dona Conta', // a API pública ainda não devolve esse nome

  // Endereço do app (cadastro, login, termos). Sem barra no fim.
  app: 'https://app.donaconta.com.br',

  // Endereço da API, se ela não estiver no mesmo endereço do app. Vazio = o
  // mesmo do app; false = não chama o sistema. No Dona Conta, a API fica em
  // api.donaconta.com.br.
  api: 'https://api.donaconta.com.br',

  // Código do plano dos botões "Começar teste grátis" (o fim do link
  // /assinar/<código>, que aparece em Admin → Planos).
  planoBotao: 'familia',

  // Preço de reserva: aparece só se o sistema não responder. EXEMPLO.
  // ciclo: 'mensal', 'trimestral', 'semestral' ou 'anual'.
  precosReserva: [
    {
      plano: 'familia',
      nome: 'Família',
      descricao: 'Para o casal ou a família que divide as contas da casa.',
      destaque: true,
      pessoas: 4,
      inclui: ['Lançar por áudio', 'Lançar por foto de comprovante', 'Avisos de vencimento', 'Resumo periódico', 'Metas e limites', 'Relatórios'],
      ciclo: 'mensal',
      valor: 29.9,
      diasGratis: 7
    }
  ],

  // Valor de um lanche, em reais. A frase "Menos que um lanche por semana"
  // só aparece se o plano mensal custar menos que isso por semana.
  lancheReais: 20,

  // Contato e dados da empresa, no rodapé e no FAQ.
  whatsappSuporte: '5511999999999', // com DDI e DDD, só números (EXEMPLO)
  emailSuporte: 'contato@donaconta.com.br',
  empresa: '', // razão social; vazio = não mostra
  cnpj: '00.000.000/0001-00', // EXEMPLO; vazio = não mostra
  instagram: '', // ex.: 'donaconta'; vazio = não mostra

  // Cores e logo vindos do sistema (Admin → Marca). Com false, a página usa
  // as cores de css/estilo.css e os arquivos de assets/.
  coresDaApi: true,
  logoDaApi: false, // o logo do Admin hoje pesa mais de 500 KB; veja COMO-USAR.html

  // Prints reais do grupo e do painel. Com false, a página mostra marcadores.
  // Com true, ela usa os arquivos de assets/prints/ (veja os nomes lá).
  printsProntos: false,

  // História do fundador. Com false, a seção some.
  fundador: {
    mostrar: true,
    nome: 'Guilherme, fundador',
    foto: '' // ex.: 'assets/fundador.webp'; vazio = mostra o mascote
  },

  // Medição. Vazio = não carrega nada e não mostra aviso de cookies.
  pixelMeta: '', // só os números do ID do Pixel
  googleAnalytics: '' // ex.: 'G-XXXXXXXXXX'
};
