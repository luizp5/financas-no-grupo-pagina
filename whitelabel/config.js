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
  whatsappVendas: '',
  mensagemWhatsapp: 'Oi! Vi a página e quero ter o meu app de finanças no WhatsApp com a minha marca.',

  // Link do grupo de demonstração ao vivo. Vazio = "Ver a demonstração"
  // rola até as conversas da própria página.
  linkDemo: '',

  // As opções de compra, em reais. setup = valor cobrado uma vez; mensal =
  // mensalidade (null = não tem). Sem os dois, a página mostra "sob
  // consulta". linkCompra vazio = usa o linkCompra geral.
  ofertas: [
    {
      nome: 'Licença + Implantação',
      descricao: 'A gente entrega instalado na sua VPS e cuida das atualizações e correções.',
      setup: 397,
      mensal: 197,
      destaque: true,
      inclui: [
        'Instalado e configurado na sua VPS',
        'Domínio, número de WhatsApp e Asaas conectados',
        'Marca, cores e assistente configurados',
        'Atualizações e correções enquanto a mensalidade estiver ativa'
      ],
      linkCompra: ''
    },
    {
      nome: 'Código-fonte',
      descricao: 'Você recebe o código completo para modificar como quiser e seguir com as suas próprias atualizações.',
      setup: 997,
      mensal: null,
      destaque: false,
      inclui: [
        'Código-fonte completo do produto',
        'Liberdade para modificar e evoluir',
        'Instalação, atualizações e correções por sua conta'
      ],
      linkCompra: ''
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
  respostaSuporte: 'Depende da opção. Na Licença + Implantação, a gente entrega instalado na sua VPS e cuida das atualizações e correções enquanto a mensalidade estiver ativa. Na compra do código-fonte, você recebe o código completo e segue com as suas próprias modificações e atualizações.',

  // Valores iniciais do simulador de receita.
  simulador: {
    clientes: 200,
    mensalidade: 49,
    custoFixo: 150 // VPS (~R$ 89) + proxy (~R$ 25) + créditos da OpenAI (~US$ 5), por mês
  }
};
