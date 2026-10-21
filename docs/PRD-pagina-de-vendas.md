# PRD — Página de vendas do Dona Conta

17/10/2026 · Guilherme · versão viva no [Claude Doc](https://claude.ai/code/artifact/797e3149-167b-4d90-929a-fcd871efc263)

> **Conferido na versão 1.19.5 do sistema** (`origin/main` de `C:\Users\luizp\Documents\APPs\financas-no-grupo`, commit `a3e81a2`, de 17/10/2026), em 21/10/2026. A primeira versão deste PRD foi escrita sobre a 1.11.2. O que mudou entre as duas está em "O que mudou da 1.11.2 para a 1.19.5", logo abaixo do mapa do produto.

## Objetivo e tese central

A página vende uma ideia só: **o problema nunca foi falta de app, é esquecer de registrar — e no grupo, um lembra o outro.** Tudo na página serve para provar essa frase.

**Objetivo.** Levar o visitante a começar o teste grátis pelo botão "Assinar", que abre `app.<domínio>/assinar/<código>`. Meta secundária: quem não assina agora deixa o WhatsApp ou segue o perfil.

**Público principal.** Casais e famílias que dividem as contas da casa. Já tentaram planilha, app de banco ou app de registro pelo WhatsApp (PoupeJá e parecidos) e largaram em poucas semanas.

**Público secundário.** Quem mora sozinho mas quer alguém junto para cobrar (sócio, irmão, colega de casa).

**A dor, nas palavras do fundador.** "Mesmo testando app de registro no WhatsApp, eu esqueço de registrar." O app solo depende da disciplina de uma pessoa só. Quando ela falha um dia, falha a semana, e o controle morre.

**A virada.** Em vez de mandar o gasto para um número, o casal manda no grupo onde estão os dois e a Dona Conta. Cada lançamento aparece para o outro, um lembra o outro todo dia, e a Dona Conta mantém os dois sincronizados.

**Por que isso é diferente (o mecanismo único).**

- **Solo vira dupla:** a cobrança deixa de ser só sua.
- **O registro fica visível:** o outro vê na hora o que entrou e o que saiu, sem perguntar.
- **Zero app novo:** acontece no WhatsApp, onde o casal já conversa o dia inteiro.

**Tom.** Conversa de casa, sem jargão financeiro. Fala de "a gente", de mercado, de conta de luz, de fim de mês. Nada de "gestão financeira inteligente".

## Mapa do produto: o que a página pode prometer

Tudo abaixo existe e funciona na versão 1.19.5, conferido no código em 21/10/2026. A coluna da direita é a frase pronta para a página. O que não existe está na última seção.

**Desde a 1.17, os envios automáticos dependem do plano.** Avisos de vencimento, avisos de meta na manhã, lembretes da agenda, resumo periódico e figurinhas são recursos que o Admin liga ou desliga em cada plano. Os planos antigos ficaram com tudo ligado, mas **um plano novo nasce com os envios automáticos desligados**. Antes de publicar, confira se o plano do botão (`planoBotao`) tem "Avisos de vencimento" e "Resumo periódico" marcados: a tese da página depende deles. A lista `included[]` de `/v1/public/plans` mostra o que está ligado.

| Área | O que a pessoa faz | Como falar na página |
| --- | --- | --- |
| Grupo automático | O grupo "Minhas finanças" nasce sozinho depois de confirmar o WhatsApp (teste) ou de pagar. O casal é adicionado direto | "Em 2 minutos o grupo de vocês está pronto. Sem instalar nada." |
| Lançar por texto | "gastei 45,90 no almoço", "recebi 2.000 de salário"; vários itens numa mensagem só | "Escreva como você fala. Ela entende." |
| Lançar por áudio | Áudio de até 10 minutos, transcrito e registrado | "Na correria, manda um áudio." |
| Lançar por foto | Foto da nota ou do comprovante; na dúvida ela mostra o que leu e pede "sim" | "Tirou foto da nota? Pronto, tá lançado." |
| Categoria sozinha | 14 categorias prontas com palavras-chave; dá para criar as suas | "Mercado vai para Alimentação sem você pensar." |
| Cartões e contas | Acha o cartão pelo nome ("no inter"), pergunta numerada se houver dúvida, parcelamento em 10x cai em cada fatura | "Ela sabe em qual cartão foi e em que fatura cai cada parcela." |
| Contas a pagar | "vence a luz dia 10" vira conta em aberto; "paguei GF8656" dá baixa | "Nenhuma conta esquecida." |
| Perguntas | "quanto gastei com mercado?", "qual meu saldo?", "o que vence em setembro?", "estourei alguma meta?" | "Pergunte como perguntaria ao seu parceiro." |
| Quem lançou | "quanto a Ana gastou este mês?"; cada lançamento guarda o nome de quem lançou | "Os dois veem tudo, com o nome de quem lançou. Sem cobrança, sem surpresa." |
| Corrigir e apagar | "o almoço de ontem foi 32", "apaga o último" (apagar pede "sim") | "Errou? Fala que ela corrige." |
| Agenda | "consulta terça às 15h", com lembrete antes | "Compromissos da casa no mesmo lugar." |
| Avisos no grupo | 08h: o que vence hoje e o que atrasou; 19h: o que vence amanhã; horários ajustáveis; só manda quando há algo | "Todo dia de manhã ela avisa os dois no grupo." |
| Resumo da semana no grupo (1.15) | Padrão: domingo, 19h, no fuso da conta. Traz quanto entrou, quanto saiu, a comparação com o período anterior, o maior gasto, as metas perto do limite e as contas dos próximos 7 dias, com links que abrem a tela certa do app. Período sem lançamento não tem resumo. O Admin pode mudar para quinzenal ou mensal; o responsável desliga em Perfil → Avisos | "Todo domingo, o resumo da semana chega no grupo para os dois." |
| Link do app nas respostas (1.14) | "quanto gastei este mês?" termina com o link que abre os Relatórios já naquele período | "Quer ver mais? A resposta já vem com o link do gráfico." |
| Metas de gasto | Teto do mês e limite por categoria; aviso a partir do % escolhido, na própria resposta do lançamento | "Ela avisa antes de estourar, não depois." |
| Figurinhas (1.13) | Figurinha sorteada junto da confirmação, no máximo uma a cada 30 min por grupo. **Todas começam desligadas**: só existe se o Admin subir figurinhas. A conta pode desligar | Só citar se a instalação tiver figurinhas ativas. Não está na página padrão. |
| Portal | Painel com nota de saúde financeira 0–100, lançamentos com filtros, relatórios com exportação em CSV, PDF e Excel, contas, cartões e faturas, metas, recorrentes, parcelamentos, agenda | "No celular é conversa. No painel, a visão completa." |
| App no celular | Instalável na tela inicial (PWA), tema claro e escuro | "Instale na tela do celular como um app." |
| Pessoas e papéis | Responsável e participante; adicionar pessoa pelo portal | "Coloque quem divide as contas com você." |
| Privacidade | Cada pessoa aceita no privado antes de ser lida; dados de outra conta nunca aparecem; áudio e foto não ficam guardados | "Seus dados são só de vocês." |
| Assinatura | Teste grátis sem cartão **ou** 1º pagamento promocional (nunca os dois no mesmo plano: a API só devolve `introPriceCents` quando `trialDays` é 0); Pix ou cartão; mensal, trimestral, semestral ou anual | "Teste grátis, sem cartão." |
| Troca de plano (1.19) | Subir de plano cobra só a diferença dos dias que faltam; descer vale no vencimento e dá para desfazer. Só quem paga a assinatura troca o plano ou a forma de pagamento | "Mudou de ideia? Troque de plano e pague só a diferença." (só se houver mais de um plano à venda) |

**O ganho que só o grupo dá.** Os avisos das 08h e das 19h e o resumo de domingo chegam no grupo, então os dois recebem juntos. É a prova concreta de "um lembra o outro": a cobrança não depende da disciplina de ninguém.

### O que mudou da 1.11.2 para a 1.19.5

Conferido no `CHANGELOG.md` e no código em 21/10/2026.

| Versão | O que mudou para quem usa | Efeito na página |
| --- | --- | --- |
| 1.12.0 | A API libera, de qualquer origem e sem cookie, planos, marca, imagens da marca e termos | A página lê preço, cores e logo ao vivo |
| 1.13.0–1.13.2 | Figurinhas junto das confirmações no grupo, se o Admin subir; a conta pode desligar | Não citar na página padrão |
| 1.14.0 | Abertura do grupo com o link do app; resposta de relatório termina com o link já no período | Cartão novo em "Tudo o que ela faz" |
| 1.15.0–1.16.0 | **Resumo periódico no grupo**, semanal por padrão (domingo, 19h). A IA pode reescrever no tom da assistente. Período sem lançamento fica em silêncio (padrão) ou recebe um lembrete curto a cada 3 semanas | Resolve a lacuna 4. Entra no "Um dia com…", nos prints e na pilha de valor |
| 1.17.0 | Envios automáticos viram recursos do plano; plano novo nasce com eles desligados | Conferir o plano do botão antes de publicar |
| 1.18.0 | Cartões dos planos no portal com ✓ e ✕; pagamento num popup só | Nada |
| 1.19.0–1.19.5 | Troca de plano proporcional; só quem paga troca o plano | Só vale citar com dois planos à venda |

**Continua igual:** não há botão de cancelar no portal (o aviso do fim do preço promocional ainda diz "para mudar de plano ou cancelar, o responsável pela conta entra no portal, em Perfil"); a marca pública ainda não devolve o nome da assistente; o teto padrão segue em 200 mensagens por dia.

## Estrutura da página, seção por seção

São 14 seções, nesta ordem. A copy é um modelo. `{marca}` e `{assistente}` vêm do `config.js` (no Dona Conta, os dois são "Dona Conta"). Todo botão "Começar teste grátis" leva a `app.<domínio>/assinar/<código>`.

### 1. Topo (hero)

**Objetivo:** em 5 segundos o visitante entende o que é, para quem é e o que fazer.

- **Headline:** "Você não precisa de mais um app de finanças. Precisa de alguém que te lembre de usar."
- **Sub:** "A {assistente} fica no grupo do WhatsApp com você e quem divide as contas. Cada gasto lançado aparece para os dois, e um lembra o outro todo dia."
- **CTA:** "Começar teste grátis". Logo abaixo: "Sem cartão. Pronto em 2 minutos."
- **Visual:** um celular com o grupo "Minhas finanças" aberto. Ela manda "gastei 230 no mercado", ele manda um áudio, e a {assistente} confirma as duas mensagens.
- **Link secundário:** "Entrar", no canto, para `app.<domínio>/login`.

### 2. A dor

**Objetivo:** o visitante se reconhece.

- **Título:** "Você já baixou um app de finanças. Talvez três."
- **Corpo:** "Na primeira semana você lançou tudo. Na segunda, esqueceu o almoço. Na terceira, o mercado. No fim do mês, o app mostrava metade da verdade, e você desistiu."
- **Três cartões de sintoma:**
    - "Chega o fim do mês e ninguém sabe para onde foi o dinheiro."
    - "Um dos dois paga a conta, o outro não fica sabendo."
    - "A conta de luz venceu e cada um achou que o outro tinha pago."

### 3. Por que os apps falham

**Objetivo:** tirar a culpa da pessoa e pôr no modelo solo. É a seção que separa o {marca} de PoupeJá e parecidos, sem citar nomes.

- **Título:** "O problema não é você. É fazer sozinho."
- **Corpo:** "Todo app de registro, até os de WhatsApp, depende de uma pessoa só lembrar todo santo dia. Ninguém sustenta isso. Dieta, academia e finanças funcionam melhor quando alguém faz junto."
- **Visual:** comparação em duas colunas. "App solo: você manda para um número, ninguém vê, ninguém cobra." contra "{marca}: vocês mandam no grupo, os dois veem, um lembra o outro."

### 4. A virada: o grupo

**Objetivo:** apresentar o mecanismo único.

- **Título:** "Por isso a {assistente} mora no grupo de vocês."
- **Três pilares, um ícone cada:**
    - **Um lembra o outro.** "Viu o lançamento dele e lembrou do seu."
    - **Os dois sincronizados.** "Ninguém precisa perguntar quanto sobrou."
    - **Ela cobra os dois.** "Todo dia às 8h ela avisa no grupo o que vence. Os dois leem."
- **História do fundador (opcional, fica forte):** "Eu testei os apps de WhatsApp e esquecia de lançar. Quando passei a lançar no grupo com a minha esposa, a gente parou de esquecer." Com foto real do casal, se for possível.

### 5. Como funciona em 3 passos

- **1. Crie a conta:** "Nome, e-mail e WhatsApp. Confirme o código."
- **2. O grupo nasce sozinho:** "A {assistente} cria o grupo e coloca você. Depois, adicione quem divide as contas."
- **3. Lance falando:** "Texto, áudio ou foto da nota. Ela organiza."
- **CTA:** "Criar meu grupo agora".

### 6. Veja na prática (conversa real)

**Objetivo:** mostrar, não dizer. É a seção que mais converte.

- **Visual:** 4 ou 5 prints reais do grupo, em carrossel no celular e em grade no computador:
    - lançamento por texto com o código de confirmação;
    - áudio transcrito;
    - foto de nota;
    - "quanto gastamos com mercado este mês?";
    - o aviso das 8h;
    - o resumo de domingo (1.15+).
- Cada print leva uma legenda de uma linha.

### 7. Um dia com a {assistente}

**Objetivo:** fazer o casal se imaginar usando.

- **Formato:** linha do tempo vertical.
    - **08h:** "Bom dia! Vence hoje: internet R$ 99,90."
    - **12h:** ela lança o almoço por áudio.
    - **15h:** ele manda foto do comprovante da farmácia.
    - **19h:** "Vence amanhã: cartão Nubank."
    - **22h:** "quanto sobrou para o mês?" e a resposta na hora.
- **E no domingo, 19h:** o resumo da semana chega no grupo (quanto entrou, quanto saiu, o maior gasto e o que vence).
- **Fecho:** "Nenhum dos dois abriu um app. Os dois sabem exatamente onde estão."

### 8. Tudo o que ela faz

**Objetivo:** justificar o preço com volume de entrega.

- **Formato:** grade de 9 a 12 cartões, cada um com benefício + uma linha.
- **Fonte:** a coluna "Como falar na página" do mapa do produto, acima.
- **Ordem:** áudio e foto, categoria sozinha, cartões e parcelas, contas a pagar e baixa, perguntas, quem lançou, corrigir falando, metas que avisam antes, agenda e lembretes.

### 9. O painel completo

- **Título:** "No WhatsApp é conversa. No painel, a visão completa."
- **Visual:** print do painel no computador e no celular. Destaque para a nota de saúde financeira, o "para onde foi seu dinheiro" e a exportação em PDF e Excel.
- **Linha:** "Instale na tela do celular como um app."

### 10. Para quem é / para quem não é

- **É para:**
    - casais que dividem as contas;
    - famílias;
    - quem já desistiu de planilha e de app;
    - quem mora com alguém.
- **Não é para:**
    - quem quer controlar investimentos;
    - quem quer conectar o banco e não lançar nada;
    - empresas.
- Ser honesto aqui aumenta a confiança e diminui o cancelamento.

### 11. Depoimentos

- **Formato:** prints de WhatsApp ou vídeo curto de casais reais, com nome e cidade.
- **Enquanto não houver depoimentos:** usar o depoimento do fundador e tirar a seção. **Nunca usar depoimento inventado.**

### 12. Oferta e preço

Está detalhada na próxima seção deste PRD. Na página, os cartões dos planos vêm ao vivo da API.

### 13. Perguntas frequentes

São 8 a 10 perguntas em sanfona, tiradas das objeções da próxima seção.

### 14. Chamada final + rodapé

- **Título:** "Daqui a 30 dias vocês vão saber para onde foi cada real. Juntos."
- **CTA:** "Começar teste grátis".
- **Rodapé:** logo, links de Termos e Privacidade, e-mail de suporte, CNPJ e "Entrar".

### Regras que valem para a página toda

- **Botão principal:** um tipo só, repetido nas seções 1, 5, 8, 12 e 14.
- **Celular:** menu fixo com "Começar teste grátis" depois que a pessoa rola o topo.
- **Imagens:** prints reais do produto. Banco de imagem só nas fotos de pessoas.
- **Peso:** abaixo de 1 MB no celular, imagens em WebP, carregamento rápido.

## Oferta, preço e objeções

A oferta se apoia no teste grátis sem cartão. O risco fica zero para o visitante, e o grupo começa a funcionar no primeiro dia.

**Como montar o bloco de preço (seção 12)**

- **Cartões dos planos:** vêm de `/v1/public/plans` com nome, preço por ciclo, dias grátis e o selo "Mais escolhido". Se a chamada falhar, a página usa o preço do `config.js`.
- **Seletor de ciclo:** só aparece quando o plano tem mais de um ciclo (mensal, trimestral, semestral, anual). O ciclo mais longo mostra quanto custa por mês e quanto economiza.
- **Ancoragem:** "Menos que um lanche por semana para nunca mais perder uma conta." A frase só vai para a página se o preço real couber nela.
- **Primeira cobrança promocional:** quando o plano tiver (só plano sem teste grátis), aparece como "1º mês por R$ X". O aviso de quando o preço cheio começa fica visível. O sistema já manda esse aviso no grupo 3 dias antes.
- **Abaixo do botão:** "Sem cartão no teste. Pix ou cartão depois. Seus dados ficam guardados mesmo se parar."

**Pilha de valor:** listar o que a pessoa recebe, um item por linha, antes do preço.

- assistente no grupo do casal;
- lançamento por texto, áudio e foto;
- avisos diários de vencimento;
- resumo da semana no grupo, todo domingo;
- metas que avisam antes de estourar;
- painel com relatórios e exportação;
- app na tela do celular;
- agenda com lembretes.

**Garantia:** o teste grátis já é a garantia. Para quem paga direto, vale a garantia legal de 7 dias do CDC em compra online. A página deve dizer como pedir.

### Objeções e respostas (viram o FAQ)

| Objeção | Resposta na página |
| --- | --- |
| "Já tentei app e larguei." | "Você largou porque estava sozinho. No grupo, um lembra o outro, e a {assistente} lembra os dois." |
| "Meu parceiro não vai usar." | "Ele não precisa instalar nada nem aprender nada: é mandar mensagem num grupo. E mesmo que só você lance, ele vê tudo e recebe os avisos." |
| "É seguro? A IA lê minhas mensagens?" | "Ela só lê o grupo de vocês, e cada pessoa autoriza antes. Áudio e foto não ficam guardados. Ninguém de fora vê os dados da sua conta." |
| "Preciso dar a senha do banco?" | "Não. Nada de banco conectado: você manda o gasto, ela organiza." |
| "Dá trabalho lançar tudo?" | "É uma mensagem, um áudio ou uma foto. Menos de 10 segundos." |
| "E se ela entender errado?" | "Na dúvida ela pergunta. Errou? Fala 'o almoço foi 32' e ela corrige." |
| "Funciona para a família toda?" | "Sim, dá para colocar quem divide as contas. Cada lançamento mostra quem lançou." |
| "Preciso de cartão para testar?" | "Não. No fim do teste você escolhe se quer assinar." |
| "E se eu parar de pagar?" | "O acesso pausa, mas tudo o que vocês lançaram continua guardado." |
| "Como cancelo?" | Provisória, até existir o botão (lacuna 2): "Fale com o suporte pelo WhatsApp ou e-mail. A renovação é encerrada e o acesso continua até o fim do que já foi pago." Conferir com o suporte que isso é feito de verdade antes de publicar. |

**Preços reais:** estão em aberto neste PRD. A página os lê ao vivo dos planos cadastrados no Admin.

## Requisitos técnicos do modelo white label

A página é um bônus que o comprador sobe em qualquer hospedagem. São arquivos estáticos, sem Node, sem build e sem banco, e tudo o que muda de instalação para instalação fica num arquivo só.

**Repositório:** `APPs/financas-no-grupo-pagina`, separado do sistema, com versionamento próprio.

```
financas-no-grupo-pagina/
├── index.html        a página; cada trecho editável marcado com comentário
├── config.js         tudo o que o comprador troca
├── css/  js/         estilo e comportamento
├── assets/           logo, prints do produto, fotos (trocar mantendo o nome)
├── COMO-USAR.html    guia de 1 página: trocar a marca, publicar, ligar o pixel
└── docs/             este PRD (não vai para a hospedagem)
```

**O `config.js`:**

```js
window.SITE = {
  marca: 'Dona Conta',
  assistente: 'Dona Conta',          // a API pública ainda não devolve esse nome
  app: 'https://app.donaconta.com.br',
  planoBotao: 'familia',             // código do link /assinar/<código>
  precosReserva: [{ plano: 'familia', ciclo: 'mensal', valor: 29.9, diasGratis: 7 }],
  whatsappSuporte: '5511999999999',
  emailSuporte: 'contato@donaconta.com.br',
  cnpj: '00.000.000/0001-00',
  pixelMeta: '', googleAnalytics: ''
};
```

Os valores acima são de exemplo, não preços decididos.

**Na construção (21/10/2026), o `config.js` ganhou:** `api` (no Dona Conta a API fica em `api.donaconta.com.br`, não no `app.`; vazio = o mesmo do app, `false` = não chama o sistema), `coresDaApi`, `logoDaApi` (desligado: o logo do Admin hoje tem mais de 500 KB), `printsProntos`, `fundador`, `lancheReais` (a frase de ancoragem só aparece se o plano custar menos que isso por semana), `empresa` e `instagram`.

**Produção em 21/10/2026:** `api.donaconta.com.br` ainda não tem a 1.12 (o CORS só aceita `https://app.donaconta.com.br`) e `/v1/public/plans` devolve `[]`. Até atualizar e cadastrar um plano público, a página mostra os preços de reserva. Lista vazia também cai na reserva.

**O que vem ao vivo do sistema** (liberado na versão 1.12.0 da API, PR #40)

| Dado | Rota | Uso na página |
| --- | --- | --- |
| Planos à venda | `GET /v1/public/plans` | Nome, descrição, selo, lista "inclui", pessoas, preço por ciclo, preço promocional, dias grátis |
| Marca | `GET /v1/brand/public` | Nome do produto, 3 cores, e-mail de suporte, título e descrição de SEO |
| Logo e ícones | `GET /v1/brand/assets/<tipo>` | Logo claro e escuro, favicon, imagem de compartilhamento |
| Termos | Link para `app.<domínio>/termos` e `/privacidade` | Rodapé; o app já mostra a versão publicada |

Formato de cada plano em `/v1/public/plans` (de `packages/contracts/src/signup.ts` do sistema): `code`, `name`, `description`, `highlight`, `included[]`, `people` (`null` = sem limite), `prices[]` com `interval` (`monthly` | `quarterly` | `semiannual` | `yearly`), `priceCents` e `introPriceCents` (texto em centavos), e `trialDays`.

Todos os links "Começar" levam `?utm_*` adiante. Assim o Admin mede cada campanha nos números do link do plano.

**Regras de funcionamento**

- **API fora do ar:** a página mostra os preços do `config.js` e nunca fica com o bloco de preço vazio.
- **Cores:** a página usa as cores da marca vindas da API. Se a API não responder, usa as do CSS.
- **Celular primeiro:** o layout começa em 360 px. Lighthouse de 90 ou mais no celular.
- **SEO:** título, descrição e imagem de compartilhamento (Open Graph). No WhatsApp, o link aparece com imagem.
- **Pixel e GA:** só carregam se o ID estiver preenchido. Evento `Lead` no clique em "Começar teste grátis".
- **Cookies:** aviso de cookies só quando o pixel estiver ligado.
- **Publicação testada em:** Hostinger/cPanel (subir a pasta), Netlify (arrastar a pasta) e Cloudflare Pages. O passo a passo de cada um vai no `COMO-USAR.html`.

**Domínio**

- `dominio.com.br` e `www` → a página.
- `app.dominio.com.br` → o sistema.
- O cookie de login do app continua só no `app.`, e a página nunca o recebe.

## O que não prometer, decisões em aberto e próximos passos

A página só promete o que está no mapa do produto. Os itens abaixo não existem na 1.19.5 (conferido em 21/10/2026), e citá-los geraria cancelamento e reclamação. Reconfira a cada versão nova do sistema.

**Não prometer**

- **Conexão com banco** (Open Finance) ou importação de extrato: não existe.
- **Lançar no privado:** só funciona no grupo.
- **PDF, documento ou vídeo pelo WhatsApp:** não são lidos; só texto, áudio e foto.
- **Criar recorrência pelo WhatsApp:** só pelo portal.
- **Relatório em PDF no WhatsApp:** no grupo, a resposta é texto; a exportação é no painel.
- **Lembrete diário para lançar:** continua não existindo. O resumo da semana existe desde a 1.15; o único lembrete de "ninguém lançou" é o do período vazio, desligado por padrão e no máximo a cada 3 semanas. Prometa "o resumo de domingo", nunca "ela lembra vocês de lançar todo dia".
- **Resumo mensal:** só se o Admin escolher "mensal" ou "semanal + mensal". O padrão é semanal.
- **Figurinhas:** só se o Admin subir as figurinhas. Todas nascem desligadas.
- **Cancelar pelo portal:** não há botão. Até existir, o FAQ manda falar com o suporte.
- **Teste grátis e 1º mês promocional no mesmo plano:** o sistema não deixa. É um ou outro.
- **Objetivos de poupança** ("juntar para a viagem"): as metas são limites de gasto.
- **Investimentos, outras moedas, boleto, push, app nas lojas:** não existem.
- **Dois fatores no portal do cliente:** existe só no Admin.
- **"Ilimitado":** o teto padrão é de 200 mensagens por dia por conta.
- **"WhatsApp oficial":** o sistema usa um número comum, não a API oficial da Meta.
- **Dicas de economia:** podem ser citadas, mas nunca como consultoria financeira.

**Lacunas que pesam na venda.** São pequenas, e vale resolver no sistema antes de anunciar.

Situação na 1.19.5:

1. **Lembrete para lançar — aberta.** A tese é "um lembra o outro". Um aviso no grupo à noite ("Ninguém lançou nada hoje. Teve gasto?") reforça a promessa e é a funcionalidade mais alinhada à dor. A 1.15 trouxe só o lembrete de período vazio do resumo, que é semanal e vem desligado.
2. **Cancelar a assinatura — aberta.** Não há botão no portal. E o aviso de fim do preço promocional ainda diz "para mudar de plano ou cancelar, o responsável pela conta entra no portal, em Perfil", um caminho que não existe. Enquanto isso, a página responde "Como cancelo?" mandando para o suporte.
3. **Nome da assistente na API pública — aberta.** `/v1/brand/public` não devolve `assistantName` (o campo existe só na visão do Admin), então hoje ele vai no `config.js`. Com uma mudança pequena na API, a página passa a lê-lo sozinha.
4. **Resumo semanal no grupo — resolvida na 1.15.** Domingo, 19h, com entrou, saiu, comparação, maior gasto, metas e contas da semana.

**Decisões em aberto**

- [ ] Preço do plano principal, ciclos à venda e se vai ter preço promocional
- [ ] Quantos dias de teste grátis (7 ou 14)
- [ ] Plano único ou dois planos (individual × casal/família)
- [ ] Usar a história do fundador com foto real do casal
- [ ] Domínio final da página do Dona Conta e quem publica
- [ ] Resolver as lacunas 1 e 2 antes do lançamento ou depois

**Próximos passos**

1. Reconferir o mapa do produto e o "Não prometer" contra a versão atual do sistema.
2. Fechar as decisões acima.
3. Gravar os prints reais do grupo e do painel com dados de exemplo.
4. Construir a página neste repositório, preenchida com os dados do Dona Conta.
5. Publicar a página do Dona Conta e medir os cliques e cadastros pelos números do link.
6. Empacotar como bônus do white label, com o `COMO-USAR.html`.
