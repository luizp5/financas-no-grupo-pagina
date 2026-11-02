/*
 * CONFIGURAÇÃO DA PÁGINA DO WHITE LABEL (/whitelabel/)
 * ----------------------------------------------------
 * Contatos, Pixel e Google Analytics vêm do config.js da raiz (window.SITE).
 * Aqui fica só o que é da venda da licença. Sem linkCompra, os botões das
 * ofertas levam para o WhatsApp de vendas.
 */
window.WL = {
  // Link do checkout da licença (ex.: TucaPay). Vazio = os botões abrem o
  // WhatsApp de vendas com a mensagem abaixo.
  linkCompra: '',

  // WhatsApp de vendas, com DDI e DDD, só números. Vazio = usa o
  // whatsappSuporte do config.js da raiz.
  whatsappVendas: '5511945676825',
  mensagemWhatsapp: 'Oi! Vi a página e quero ter o meu app de finanças no WhatsApp com a minha marca.',
  // Mensagem do botão fixo do WhatsApp, no canto direito da página.
  mensagemDuvidas: 'Olá, gostaria de tirar algumas dúvidas sobre o Whitelabel da Dona Conta',

  // Link do grupo de demonstração ao vivo. Vazio = "Ver a demonstração"
  // rola até as conversas da própria página.
  linkDemo: '',

  // As opções de compra, em reais. de = preço antigo, riscado acima do valor
  // (opcional); condicao = aviso logo abaixo do preço (opcional); setup = valor cobrado uma vez; mensal = mensalidade (null =
  // não tem). Sem os dois, a página mostra "sob consulta". linkCompra vazio =
  // usa o linkCompra geral.
  ofertas: [
    {
      nome: 'Código-fonte Liberado',
      descricao: 'O código completo do produto é seu, para instalar no seu servidor e modificar como quiser.',
      de: 1997,
      setup: 497,
      condicao: 'Valor das 100 primeiras licenças. Depois, volta a R$ 1.997,00.',
      mensal: null,
      destaque: false,
      inclui: [
        'Código-fonte completo do produto',
        'Sua marca, no seu próprio servidor',
        'Liberdade para modificar e evoluir',
        'Instalação, atualizações e correções por sua conta'
      ],
      linkCompra: 'https://checkout.tucapay.net/c/donaconta-whitelabel?plan=dcd933ca-f68c-4f98-ad5e-909aeb610ce8'
    }
  ],

  // Bônus da licença. A página do cliente final está no PRD como bônus; os
  // outros itens do PRD (identidade de exemplo, figurinhas, guia de
  // aquecimento de número) só entram aqui depois de confirmados.
  bonus: [
    'Página de vendas do cliente final pronta, que lê preços e marca ao vivo do seu app'
  ],

  // Garantia que aparece abaixo das ofertas.
  garantia: 'Direito de arrependimento de 7 dias, conforme o Código de Defesa do Consumidor.',

  // Resposta do FAQ "Vou ter suporte e atualizações?".
  respostaSuporte: 'Você recebe o código completo e segue com as suas próprias modificações, atualizações e correções, sem mensalidade.',

  // Valores iniciais do simulador de receita.
  simulador: {
    clientes: 200,
    mensalidade: 49,
    custoFixo: 150 // VPS (~R$ 89) + proxy (~R$ 25) + créditos da OpenAI (~US$ 5), por mês
  }
};
