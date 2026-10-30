/*
 * CONVERSAS ANIMADAS DA PÁGINA DO WHITE LABEL
 * ------------------------------------------------
 * Cada roteiro é uma conversa que passa em loop numa janela. Os textos seguem
 * os modelos padrão do sistema (agent-messages.ts e fixed-messages.ts) e o que
 * sai de verdade no grupo. Os dados são fictícios.
 *
 * Passos:
 *   { de: 'Ana', texto: '...' }     a pessoa digita e envia
 *   { de: 'Beto', audio: '0:05' }   a pessoa grava e envia um áudio
 *   { de: 'Ana', foto: 'cupom' }    a pessoa anexa uma foto ('cupom' ou 'nota')
 *   { ela: [linhas] }               o assistente digita e responde
 *   { ela: [linhas], figurinha: true }  ...e manda a figurinha depois
 *   { aviso: [linhas], hora: '08:00' }  mensagem automática, sem "digitando"
 *
 * Em qualquer resposta, painel: { ... } atualiza o mini gráfico daquela conversa
 * (o estado inicial de cada um fica em WL_PAINEIS, no fim deste arquivo).
 *
 * Nas linhas: '' pula linha e '*texto' sai em negrito. d traz as datas do dia,
 * para a conversa nunca parecer antiga.
 */
window.WL_CONVERSAS = function (d) {
  var link = 'app.suamarca.com.br/reports';

  return {
    texto: [
      { de: 'Ana', texto: 'gastei 45,90 no almoço' },
      { ela: [
        '✅ Sua despesa foi adicionada com sucesso. Atenção para não ultrapassar os gastos.',
        '',
        '🔴 Tipo: Despesa',
        '📲 Descrição: Almoço',
        '💰 Valor: R$ 45,90',
        '📍 Categoria: Alimentação',
        '✅ Pagamento: À vista',
        '🗓️ Data: ' + d.hoje,
        '👉 Código: GF8656'
      ], painel: { itens: [
        { nome: 'Entrou', valor: 6180, cor: 'verde' },
        { nome: 'Saiu', valor: 5586.59, cor: 'rosa' },
        { nome: 'A pagar', valor: 480, cor: 'ambar' }
      ] } },
      { de: 'Beto', texto: 'recebi 3000 de salário' },
      { ela: [
        '✅ Sua receita foi adicionada com sucesso. Parabéns por mais essa receita!',
        '',
        '✅ Tipo: Receita',
        '📲 Descrição: Salário',
        '💰 Valor: R$ 3.000,00',
        '📍 Categoria: Salário',
        '🗓️ Data: ' + d.hoje,
        '👉 Código: DP5SA2'
      ], figurinha: true, painel: { itens: [
        { nome: 'Entrou', valor: 9180, cor: 'verde' },
        { nome: 'Saiu', valor: 5586.59, cor: 'rosa' },
        { nome: 'A pagar', valor: 480, cor: 'ambar' }
      ] } },
      { de: 'Ana', texto: 'boleto de 300 da escola vence dia 15' },
      { ela: [
        '🗓️ Seu lançamento foi agendado e ficou em aberto.',
        '',
        '📌 Tipo: Despesa',
        '📲 Descrição: Boleto da escola',
        '💰 Valor: R$ 300,00',
        '📍 Categoria: Educação',
        '⏳ Situação: Em aberto (ainda não pago)',
        '🗓️ Vencimento: ' + d.dia15,
        '👉 Código: K7WQ2M'
      ], painel: { itens: [
        { nome: 'Entrou', valor: 9180, cor: 'verde' },
        { nome: 'Saiu', valor: 5586.59, cor: 'rosa' },
        { nome: 'A pagar', valor: 780, cor: 'ambar' }
      ] } }
    ],

    audio: [
      { de: 'Beto', audio: '0:05' },
      { ela: [
        '✅ Sua compra no cartão foi adicionada com sucesso. Atenção para não ultrapassar os gastos.',
        '',
        '🔴 Tipo: Despesa',
        '📲 Descrição: Mercado',
        '💰 Valor: R$ 212,40',
        '📍 Categoria: Alimentação',
        '💳 Cartão: Nubank',
        '🧾 Entra na fatura que vence em: ' + d.fatura,
        '🗓️ Data: ' + d.hoje,
        '👉 Código: Q3YPEC'
      ], painel: { atual: 1332.4 } },
      { de: 'Ana', audio: '0:03' },
      { ela: [
        'Sobraram R$ 3.593,41 em ' + d.mes + ': entraram R$ 9.180,00 e saíram R$ 5.586,59.',
        '',
        '👉 Gráficos e detalhes no app: ' + link
      ], painel: { stats: [
        { rotulo: 'Sobrou no mês', valor: 3593.41 },
        { rotulo: 'Próximo compromisso', texto: 'Nenhum' }
      ] } },
      { de: 'Beto', audio: '0:04' },
      { ela: [
        '✅ Compromisso marcado!',
        '',
        '📌 Dentista',
        '🗓️ ' + d.proximaTerca + ' às 15:00',
        '⏰ Lembrete: 15 minutos antes, neste grupo.',
        '👉 Código: P4AUW9'
      ], painel: { stats: [
        { rotulo: 'Sobrou no mês', valor: 3593.41 },
        { rotulo: 'Próximo compromisso', texto: 'Dentista, 15:00' }
      ] } }
    ],

    foto: [
      { de: 'Ana', foto: 'cupom' },
      { ela: [
        '✅ Sua despesa foi adicionada com sucesso. Atenção para não ultrapassar os gastos.',
        '',
        '🔴 Tipo: Despesa',
        '📲 Descrição: Farmácia',
        '💰 Valor: R$ 105,40',
        '📍 Categoria: Saúde',
        '✅ Pagamento: À vista',
        '🗓️ Data: ' + d.hoje,
        '👉 Código: 69NM87'
      ], painel: { itens: [
        { nome: 'Alimentação', valor: 1560.1, cor: 'azul' },
        { nome: 'Moradia', valor: 1437.9, cor: 'verde' },
        { nome: 'Saúde', valor: 285.4, cor: 'rosa' },
        { nome: 'Transporte', valor: 320, cor: 'ambar' }
      ] } },
      { de: 'Beto', foto: 'nota' },
      { ela: [
        'Achei isto na imagem, mas não tenho certeza:',
        '• Posto de gasolina — R$ 200,00',
        '',
        'Confirma que está certo? Responda "sim" para eu registrar, ou "não" para descartar.'
      ] },
      { de: 'Beto', texto: 'sim' },
      { ela: [
        '✅ Sua despesa foi adicionada com sucesso. Atenção para não ultrapassar os gastos.',
        '',
        '🔴 Tipo: Despesa',
        '📲 Descrição: Posto de gasolina',
        '💰 Valor: R$ 200,00',
        '📍 Categoria: Transporte',
        '✅ Pagamento: À vista',
        '🗓️ Data: ' + d.hoje,
        '👉 Código: ZVDDSE'
      ], painel: { itens: [
        { nome: 'Alimentação', valor: 1560.1, cor: 'azul' },
        { nome: 'Moradia', valor: 1437.9, cor: 'verde' },
        { nome: 'Saúde', valor: 285.4, cor: 'rosa' },
        { nome: 'Transporte', valor: 520, cor: 'ambar' }
      ] } }
    ],

    parcelado: [
      { de: 'Beto', texto: 'comprei TV 3000 em 10x no Nubank' },
      { ela: [
        '✅ Sua compra no cartão foi adicionada com sucesso. Atenção para não ultrapassar os gastos.',
        '',
        '🔴 Tipo: Despesa',
        '📲 Descrição: TV',
        '💰 Valor: R$ 3.000,00',
        '📍 Categoria: Compras',
        '💳 Cartão: Nubank',
        '🤔 Parcelas: 10x de R$ 300,00',
        '🧾 Entra na fatura que vence em: ' + d.fatura,
        '🗓️ Data: ' + d.hoje,
        '👉 Código: HBK7MG'
      ], painel: { valores: [1120, 940, 820, 730, 680, 600] } },
      { de: 'Ana', texto: 'comprei sofá 2400 em 12x no inter' },
      { ela: [
        'Encontrei 2 cartões com o nome "inter":',
        '1 - Inter Black',
        '2 - Inter Gold',
        '',
        'Em qual dos cartões posso registrar Sofá? Digite 1 ou 2.'
      ] },
      { de: 'Ana', texto: '1' },
      { ela: [
        '✅ Sua compra no cartão foi adicionada com sucesso. Atenção para não ultrapassar os gastos.',
        '',
        '🔴 Tipo: Despesa',
        '📲 Descrição: Sofá',
        '💰 Valor: R$ 2.400,00',
        '📍 Categoria: Casa',
        '💳 Cartão: Inter Black',
        '🤔 Parcelas: 12x de R$ 200,00',
        '🧾 Entra na fatura que vence em: ' + d.fatura,
        '🗓️ Data: ' + d.hoje,
        '👉 Código: JTEEQT'
      ], painel: { valores: [1320, 1140, 1020, 930, 880, 800] } }
    ],

    perguntas: [
      { de: 'Beto', texto: 'quanto a Ana gastou este mês?' },
      { ela: [
        'A Ana gastou R$ 1.284,30 em ' + d.mes + '. O maior gasto foi Mercado, com R$ 486,20.',
        '',
        '👉 Gráficos e detalhes no app: ' + link
      ], painel: { mostra: 45 } },
      { de: 'Ana', texto: 'resumo do mês' },
      { ela: [
        '*📊 Resumo de ' + d.mesAno,
        '',
        '🟢 Receitas: R$ 9.180,00',
        '🔴 Despesas: R$ 5.586,59',
        '💰 Saldo: R$ 3.593,41',
        '',
        '*Para onde foi o dinheiro',
        '• Alimentação: R$ 1.560,10',
        '• Moradia: R$ 1.437,90',
        '• Delivery: R$ 424,50',
        '• Assinaturas: R$ 194,00'
      ], painel: { mostra: 75 } },
      { de: 'Beto', texto: 'estourei alguma meta?' },
      { ela: [
        '*🎯 Metas de ' + d.mes,
        '',
        '🔴 *Delivery: R$ 424,50 de R$ 200,00 (212%) · estourou em R$ 224,50',
        '🟢 *Mercado: R$ 586,00 de R$ 800,00 (73%) · restam R$ 214,00',
        '',
        '👉 Gráficos e detalhes no app: ' + link
      ], painel: { mostra: 100, selo: '1 meta estourada', seloTipo: 'alerta' } }
    ],

    baixa: [
      { aviso: [
        '*⚠️ Em atraso',
        '· Conta de energia — R$ 98,90 · venceu 10/10 · W6F4VC',
        '',
        'Total: R$ 98,90',
        'Se já pagou, responda: *paguei <código>'
      ], hora: '08:00' },
      { de: 'Ana', texto: 'paguei o W6F4VC' },
      { ela: ['✅ Marquei como pago: Conta de energia — R$ 98,90 · vencimento 10/10 (W6F4VC).'], painel: {
        atual: 5, selo: 'Tudo em dia', seloTipo: 'ok', stats: [
          { rotulo: 'Em atraso', valor: 0 },
          { rotulo: 'Lançamentos do mês', numero: 42 }
        ] } },
      { de: 'Beto', texto: 'apaga o último' },
      { ela: ['Confirma apagar "Almoço" de R$ 45,90 (código GF8656)? Responda "sim" para apagar.'] },
      { de: 'Beto', texto: 'sim' },
      { ela: ['🗑️ Apaguei: Almoço — R$ 45,90 · código GF8656'], painel: { stats: [
        { rotulo: 'Em atraso', valor: 0 },
        { rotulo: 'Lançamentos do mês', numero: 41 }
      ] } }
    ],

    guardar: [
      { de: 'Ana', texto: 'guardei 200 pra viagem' },
      { ela: [
        '💰 Guardado: R$ 200,00 na Viagem Foz.',
        'Viagem Foz: R$ 2.600,00 de R$ 5.000,00 (52%). Faltam R$ 2.400,00: R$ 800,00 por mês até 10/01/2027.',
        '🎉 A Viagem Foz passou de 50%!'
      ], painel: { atual: 2600, stats: [
        { rotulo: 'Livre', valor: 7305.53 },
        { rotulo: 'Guardado em metas', valor: 3700 }
      ] } },
      { de: 'Beto', texto: 'recebi 3000 de salário, guarda 10% na reserva' },
      { ela: [
        '💰 Guardado: R$ 300,00 na Reserva.',
        'Reserva: R$ 1.400,00 guardados.'
      ], painel: { stats: [
        { rotulo: 'Livre', valor: 7005.53 },
        { rotulo: 'Guardado em metas', valor: 4000 }
      ] } },
      { ela: [
        '✅ Sua receita foi adicionada com sucesso. Parabéns por mais essa receita!',
        '',
        '✅ Tipo: Receita',
        '📲 Descrição: Salário',
        '💰 Valor: R$ 3.000,00',
        '📍 Categoria: Salário',
        '🗓️ Data: ' + d.hoje,
        '👉 Código: DP5SA2'
      ], painel: { stats: [
        { rotulo: 'Livre', valor: 10005.53 },
        { rotulo: 'Guardado em metas', valor: 4000 }
      ] } },
      { de: 'Ana', texto: 'como está a viagem?' },
      { ela: [
        '*💰 Metas de guardar',
        'Viagem Foz: R$ 2.600,00 de R$ 5.000,00 (52%). Faltam R$ 2.400,00: R$ 800,00 por mês até 10/01/2027.'
      ] }
    ]
  };
};

/* Mini gráfico de cada conversa, no estado em que ela começa. tipo: barras,
   progresso, rosca, colunas ou linha. */
window.WL_PAINEIS = function (d) {
  return {
    texto: {
      tipo: 'barras', titulo: 'Este mês', selo: 'Ao vivo', seloTipo: 'ok', maximo: 10000,
      itens: [
        { nome: 'Entrou', valor: 6180, cor: 'verde' },
        { nome: 'Saiu', valor: 5540.69, cor: 'rosa' },
        { nome: 'A pagar', valor: 480, cor: 'ambar' }
      ]
    },
    audio: {
      tipo: 'progresso', titulo: 'Fatura Nubank', selo: 'Vence ' + d.faturaCurta, atual: 1120, total: 3000,
      stats: [
        { rotulo: 'Sobrou no mês', texto: '—' },
        { rotulo: 'Próximo compromisso', texto: 'Nenhum' }
      ]
    },
    foto: {
      tipo: 'rosca', titulo: 'Para onde foi o dinheiro', selo: 'Ao vivo', seloTipo: 'ok',
      itens: [
        { nome: 'Alimentação', valor: 1560.1, cor: 'azul' },
        { nome: 'Moradia', valor: 1437.9, cor: 'verde' },
        { nome: 'Saúde', valor: 180, cor: 'rosa' },
        { nome: 'Transporte', valor: 320, cor: 'ambar' }
      ]
    },
    parcelado: {
      tipo: 'colunas', titulo: 'Próximas faturas', selo: 'Ao vivo', seloTipo: 'ok', maximo: 1500,
      meses: d.meses, valores: [820, 640, 520, 430, 380, 300]
    },
    perguntas: {
      tipo: 'linha', titulo: 'Saldo do mês', selo: 'Ao vivo', seloTipo: 'ok', mostra: 15,
      pontos: [12, 20, 16, 30, 26, 42, 38, 54, 50, 66, 62, 78],
      stats: [
        { rotulo: 'Entrou', valor: 9180 },
        { rotulo: 'Saiu', valor: 5586.59 },
        { rotulo: 'Saldo', valor: 3593.41 }
      ]
    },
    baixa: {
      tipo: 'progresso', titulo: 'Contas de ' + d.mes, selo: '1 em atraso', seloTipo: 'alerta',
      atual: 4, total: 5, contagem: true,
      stats: [
        { rotulo: 'Em atraso', valor: 98.9 },
        { rotulo: 'Lançamentos do mês', numero: 42 }
      ]
    },
    guardar: {
      tipo: 'progresso', titulo: 'Viagem Foz', selo: 'Em dia', seloTipo: 'ok', atual: 2400, total: 5000,
      stats: [
        { rotulo: 'Livre', valor: 7505.53 },
        { rotulo: 'Guardado em metas', valor: 3500 }
      ]
    }
  };
};
