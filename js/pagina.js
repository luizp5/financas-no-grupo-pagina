/*
 * Comportamento da página de vendas. Não precisa editar este arquivo: tudo o
 * que muda por instalação fica no config.js.
 *
 * - Preenche marca, contatos e links do app a partir do config.js.
 * - Mostra os planos de reserva na hora e troca pelos planos do sistema
 *   (/v1/public/plans) quando ele responde.
 * - Aplica as cores (e, se ligado, o logo) de /v1/brand/public.
 * - Leva os utm_* do endereço para todos os links /assinar/<código>.
 * - Carrega o Pixel da Meta e o Google Analytics só com o ID preenchido.
 */
(function () {
  'use strict';

  var cfg = window.SITE || {};
  var app = semBarra(cfg.app || '');
  // api: false desliga as chamadas ao sistema (a página fica só com o config.js).
  var api = cfg.api === false ? '' : semBarra(cfg.api || app);
  var TEMPO_LIMITE = 6000;

  var CICLOS = {
    monthly: { slug: 'mensal', nome: 'Mensal', meses: 1, por: 'mês', primeira: '1º mês' },
    quarterly: { slug: 'trimestral', nome: 'Trimestral', meses: 3, por: 'trimestre', primeira: '1º trimestre' },
    semiannual: { slug: 'semestral', nome: 'Semestral', meses: 6, por: 'semestre', primeira: '1º semestre' },
    yearly: { slug: 'anual', nome: 'Anual', meses: 12, por: 'ano', primeira: '1º ano' }
  };
  var ORDEM = ['monthly', 'quarterly', 'semiannual', 'yearly'];
  var reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  var estado = { planos: [], ciclo: null, origem: 'reserva' };

  function semBarra(url) { return String(url).trim().replace(/\/+$/, ''); }
  function todos(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }
  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }
  function dinheiro(centavos) { return reais.format(centavos / 100); }

  /* ---------- Textos, contatos e links do config.js ---------- */

  function preencherTextos() {
    if (cfg.marca) todos('[data-marca]').forEach(function (n) { n.textContent = cfg.marca; });
    if (cfg.assistente) todos('[data-assistente]').forEach(function (n) { n.textContent = cfg.assistente; });
    if (cfg.marca) todos('img[data-logo]').forEach(function (n) { n.alt = cfg.marca; });

    todos('[data-app]').forEach(function (n) { n.href = app + n.getAttribute('data-app'); });

    todos('[data-email]').forEach(function (n) {
      if (!cfg.emailSuporte) return;
      n.href = 'mailto:' + cfg.emailSuporte;
      if (n.textContent.indexOf('@') !== -1) n.textContent = cfg.emailSuporte;
    });
    todos('[data-whatsapp]').forEach(function (n) {
      var numero = String(cfg.whatsappSuporte || '').replace(/\D/g, '');
      if (numero) n.href = 'https://wa.me/' + numero; else if (n.closest('nav')) n.hidden = true;
    });
    todos('[data-cnpj]').forEach(function (n) {
      if (cfg.cnpj) n.textContent = 'CNPJ ' + cfg.cnpj; else n.hidden = true;
    });
    todos('[data-empresa]').forEach(function (n) {
      if (cfg.empresa) { n.textContent = cfg.empresa; n.hidden = false; }
    });
    todos('[data-instagram]').forEach(function (n) {
      var perfil = String(cfg.instagram || '').replace(/^@/, '');
      if (perfil) { n.href = 'https://instagram.com/' + encodeURIComponent(perfil); n.hidden = false; }
    });

    var f = cfg.fundador || {};
    todos('[data-fundador]').forEach(function (n) { if (f.mostrar === false) n.remove(); });
    if (f.nome) todos('[data-fundador-nome]').forEach(function (n) { n.textContent = f.nome; });
    if (f.foto) todos('[data-fundador-foto]').forEach(function (n) { n.src = f.foto; n.alt = f.nome || ''; });

    if (cfg.printsProntos) {
      todos('[data-print]').forEach(function (fig) {
        var marcador = fig.querySelector('.print__marcador');
        if (!marcador) return;
        var legenda = fig.querySelector('figcaption');
        var img = el('img');
        img.src = 'assets/prints/' + fig.getAttribute('data-print') + '.webp';
        img.alt = legenda ? legenda.textContent : marcador.textContent.replace(/^Print:\s*/, '');
        img.loading = 'lazy';
        img.decoding = 'async';
        fig.replaceChild(img, marcador);
      });
    }
  }

  /* ---------- Links de assinatura com os utm_* ---------- */

  function utms() {
    var lidos = [];
    new URLSearchParams(window.location.search).forEach(function (valor, chave) {
      if (/^utm_/i.test(chave) && valor) lidos.push([chave, valor]);
    });
    return lidos;
  }
  var UTMS = utms();

  function linkAssinar(codigo, intervalo) {
    var url = new URL(app + '/assinar/' + encodeURIComponent(codigo));
    if (intervalo && CICLOS[intervalo]) url.searchParams.set('ciclo', CICLOS[intervalo].slug);
    UTMS.forEach(function (par) { url.searchParams.set(par[0], par[1]); });
    return url.toString();
  }

  function ligarBotoes() {
    todos('a[data-assinar]').forEach(function (a) { a.href = linkAssinar(cfg.planoBotao); });
  }

  /* ---------- Planos ---------- */

  function planosDaReserva() {
    var porCodigo = {};
    var lista = [];
    (cfg.precosReserva || []).forEach(function (r) {
      var intervalo = ORDEM.filter(function (k) { return CICLOS[k].slug === r.ciclo; })[0] || 'monthly';
      var p = porCodigo[r.plano];
      if (!p) {
        p = porCodigo[r.plano] = {
          code: r.plano,
          name: r.nome || r.plano,
          description: r.descricao || null,
          highlight: !!r.destaque,
          included: r.inclui || [],
          people: r.pessoas == null ? null : r.pessoas,
          prices: [],
          trialDays: Number(r.diasGratis) || 0
        };
        lista.push(p);
      }
      p.prices.push({
        interval: intervalo,
        cents: Math.round(Number(r.valor) * 100),
        introCents: r.valorPrimeira ? Math.round(Number(r.valorPrimeira) * 100) : null
      });
    });
    return lista;
  }

  function planosDaApi(dados) {
    if (!Array.isArray(dados)) return [];
    return dados.map(function (p) {
      return {
        code: p.code,
        name: p.name,
        description: p.description,
        highlight: !!p.highlight,
        included: Array.isArray(p.included) ? p.included : [],
        people: p.people == null ? null : p.people,
        trialDays: Number(p.trialDays) || 0,
        prices: (p.prices || []).filter(function (x) { return CICLOS[x.interval]; }).map(function (x) {
          return {
            interval: x.interval,
            cents: Number(x.priceCents),
            introCents: x.introPriceCents == null ? null : Number(x.introPriceCents)
          };
        })
      };
    }).filter(function (p) { return p.code && p.prices.length; });
  }

  function ordenarPrecos(planos) {
    planos.forEach(function (p) {
      p.prices.sort(function (a, b) { return ORDEM.indexOf(a.interval) - ORDEM.indexOf(b.interval); });
    });
  }

  function precoNoCiclo(plano, intervalo) {
    return plano.prices.filter(function (x) { return x.interval === intervalo; })[0] || plano.prices[0];
  }

  function cartaoDoPlano(plano) {
    var preco = precoNoCiclo(plano, estado.ciclo);
    var ciclo = CICLOS[preco.interval];
    // O selo só faz sentido quando há mais de um plano para comparar.
    var destaque = plano.highlight && estado.planos.length > 1;
    var card = el('article', 'plano' + (destaque ? ' plano--destaque' : ''));
    if (destaque) card.appendChild(el('span', 'plano__selo', 'Mais escolhido'));
    card.appendChild(el('h3', null, plano.name));
    if (plano.description) card.appendChild(el('p', 'plano__desc', plano.description));

    var linha = el('p', 'plano__preco');
    if (ciclo.meses > 1) {
      linha.appendChild(el('span', 'plano__valor', dinheiro(Math.round(preco.cents / ciclo.meses))));
      linha.appendChild(el('span', 'plano__ciclo', 'por mês'));
      card.appendChild(linha);
      card.appendChild(el('p', 'plano__extra', dinheiro(preco.cents) + ' cobrados a cada ' + (ciclo.meses === 12 ? 'ano' : ciclo.meses + ' meses') + '.'));
      var mensal = plano.prices.filter(function (x) { return x.interval === 'monthly'; })[0];
      var economia = mensal ? mensal.cents * ciclo.meses - preco.cents : 0;
      if (economia > 0) {
        var pct = Math.round((economia / (mensal.cents * ciclo.meses)) * 100);
        card.appendChild(el('span', 'plano__economia', 'Economize ' + dinheiro(economia) + ' (' + pct + '%)'));
      }
    } else {
      linha.appendChild(el('span', 'plano__valor', dinheiro(preco.cents)));
      linha.appendChild(el('span', 'plano__ciclo', 'por mês'));
      card.appendChild(linha);
    }

    // O sistema só tem preço promocional em plano sem teste grátis.
    if (preco.introCents != null && plano.trialDays === 0) {
      card.appendChild(el('p', 'plano__gratis', ciclo.primeira + ' por ' + dinheiro(preco.introCents) + '.'));
      card.appendChild(el('p', 'plano__extra', 'Depois, ' + dinheiro(preco.cents) + ' por ' + ciclo.por + '.'));
    }
    if (plano.trialDays > 0) {
      card.appendChild(el('p', 'plano__gratis', plano.trialDays + (plano.trialDays === 1 ? ' dia grátis' : ' dias grátis') + ', sem cartão.'));
    }

    var itens = plano.included.slice();
    itens.unshift(plano.people == null ? 'Pessoas sem limite na conta' : 'Até ' + plano.people + (plano.people === 1 ? ' pessoa' : ' pessoas') + ' na conta');
    var ul = el('ul', 'lista-check');
    itens.forEach(function (t) {
      var li = el('li');
      li.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-check"/></svg>';
      li.appendChild(document.createTextNode(t));
      ul.appendChild(li);
    });
    card.appendChild(ul);

    var botao = el('a', 'btn ' + (destaque || estado.planos.length === 1 ? 'btn--primario' : 'btn--destaque'),
      plano.trialDays > 0 ? 'Começar teste grátis' : 'Assinar o ' + plano.name);
    botao.href = linkAssinar(plano.code, plano.prices.length > 1 ? preco.interval : null);
    card.appendChild(botao);
    return card;
  }

  function desenharCiclos() {
    var caixa = document.querySelector('.ciclos');
    var existentes = ORDEM.filter(function (k) {
      return estado.planos.some(function (p) { return p.prices.some(function (x) { return x.interval === k; }); });
    });
    if (existentes.indexOf(estado.ciclo) === -1) estado.ciclo = existentes[0];
    caixa.innerHTML = '';
    caixa.hidden = existentes.length < 2;
    existentes.forEach(function (k) {
      var b = el('button', null, CICLOS[k].nome);
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(k === estado.ciclo));
      b.addEventListener('click', function () { estado.ciclo = k; desenharPlanos(); });
      caixa.appendChild(b);
    });
  }

  function desenharPlanos() {
    ordenarPrecos(estado.planos);
    desenharCiclos();
    var area = document.querySelector('.planos');
    area.innerHTML = '';
    estado.planos.forEach(function (p) { area.appendChild(cartaoDoPlano(p)); });
    area.setAttribute('data-origem', estado.origem);
    ajustarChamadas();
  }

  // Os botões gerais e a frase de ancoragem seguem o plano do botão.
  function ajustarChamadas() {
    var plano = estado.planos.filter(function (p) { return p.code === cfg.planoBotao; })[0];
    if (!plano) {
      if (estado.origem === 'api') console.warn('O plano "' + cfg.planoBotao + '" (planoBotao, no config.js) não está à venda no sistema.');
      plano = estado.planos[0];
    }
    if (!plano) return;

    var semTeste = plano.trialDays === 0;
    todos('[data-cta-texto]').forEach(function (n) { n.textContent = semTeste ? 'Quero assinar' : 'Começar teste grátis'; });
    todos('[data-cta-nota]').forEach(function (n) { n.textContent = semTeste ? 'Pix ou cartão. Pronto em 2 minutos.' : 'Sem cartão. Pronto em 2 minutos.'; });
    todos('[data-so-teste]').forEach(function (n) { n.hidden = semTeste; });
    var nota = document.querySelector('.planos__nota');
    if (nota) nota.textContent = semTeste
      ? 'Pix ou cartão. Seus dados ficam guardados mesmo se parar.'
      : 'Sem cartão no teste. Pix ou cartão depois. Seus dados ficam guardados mesmo se parar.';

    var ancora = document.querySelector('.ancora');
    var preco = precoNoCiclo(plano, 'monthly');
    var porSemana = preco.cents / CICLOS[preco.interval].meses / 100 / 4.33;
    var lanche = Number(cfg.lancheReais) || 0;
    ancora.hidden = !(lanche && porSemana < lanche);
    ancora.textContent = 'Menos que um lanche por semana para nunca mais perder uma conta.';
  }

  /* ---------- Sistema: planos e marca ---------- */

  function buscar(caminho) {
    if (!api || !window.fetch) return Promise.reject(new Error('sem API'));
    var controle = window.AbortController ? new AbortController() : null;
    var relogio = setTimeout(function () { if (controle) controle.abort(); }, TEMPO_LIMITE);
    return fetch(api + caminho, { credentials: 'omit', signal: controle ? controle.signal : undefined })
      .then(function (r) {
        clearTimeout(relogio);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }, function (erro) { clearTimeout(relogio); throw erro; });
  }

  function carregarPlanos() {
    buscar('/v1/public/plans').then(function (dados) {
      var planos = planosDaApi(dados);
      if (!planos.length) return; // lista vazia: fica a reserva
      estado.planos = planos;
      estado.origem = 'api';
      desenharPlanos();
    }).catch(function () { /* sistema fora do ar: fica a reserva */ });
  }

  function corValida(c) { return typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c); }
  function escura(hex) {
    var n = parseInt(hex.slice(1), 16);
    var canal = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    var l = 0.2126 * canal(n >> 16 & 255) + 0.7152 * canal(n >> 8 & 255) + 0.0722 * canal(n & 255);
    return l < 0.4;
  }

  function carregarMarca() {
    if (!cfg.coresDaApi && !cfg.logoDaApi) return;
    buscar('/v1/brand/public').then(function (marca) {
      var raiz = document.documentElement.style;
      if (cfg.coresDaApi) {
        if (corValida(marca.colorPrimary)) {
          raiz.setProperty('--cor-primaria', marca.colorPrimary);
          raiz.setProperty('--sobre-primaria', escura(marca.colorPrimary) ? '#ffffff' : '#0a1f5c');
          var tema = document.querySelector('meta[name="theme-color"]');
          if (tema) tema.content = marca.colorPrimary;
        }
        if (corValida(marca.colorSecondary)) raiz.setProperty('--cor-secundaria', marca.colorSecondary);
        if (corValida(marca.colorAccent)) {
          raiz.setProperty('--cor-destaque', marca.colorAccent);
          raiz.setProperty('--sobre-destaque', escura(marca.colorAccent) ? '#ffffff' : '#0a1f5c');
        }
      }
      if (cfg.logoDaApi && marca.assets) {
        var tipos = { claro: 'logo_light', escuro: 'logo_dark' };
        todos('img[data-logo]').forEach(function (img) {
          var caminho = marca.assets[tipos[img.getAttribute('data-logo')]];
          if (!caminho) return;
          img.removeAttribute('width');
          img.removeAttribute('height');
          img.src = api + caminho; // /v1/brand/assets/<tipo>?v=<versão>
        });
      }
    }).catch(function () { /* sem resposta: ficam as cores do CSS */ });
  }

  /* ---------- Medição (Pixel da Meta e Google Analytics) ---------- */

  function carregarScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function ligarMedicao() {
    var pixel = String(cfg.pixelMeta || '').replace(/\D/g, '');
    var ga = String(cfg.googleAnalytics || '').trim();

    if (pixel) {
      /* eslint-disable */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; }(window, document);
      /* eslint-enable */
      carregarScript('https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', pixel);
      window.fbq('track', 'PageView');
    }
    if (ga) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ga);
      carregarScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga));
    }

    // Evento Lead no clique de qualquer botão de assinatura.
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="/assinar/"]');
      if (!a) return;
      var codigo = (a.pathname.split('/assinar/')[1] || '').split('/')[0];
      if (window.fbq && pixel) window.fbq('track', 'Lead', { content_name: decodeURIComponent(codigo) });
      if (window.gtag && ga) window.gtag('event', 'generate_lead', { plano: decodeURIComponent(codigo) });
    });

    if (pixel || ga) avisoDeCookies();
  }

  function avisoDeCookies() {
    var aviso = document.querySelector('.cookies');
    if (!aviso) return;
    var CHAVE = 'pagina-cookies-ok';
    var visto = false;
    try { visto = window.localStorage.getItem(CHAVE) === '1'; } catch (e) { /* navegador sem armazenamento */ }
    if (visto) return;
    aviso.hidden = false;
    aviso.querySelector('[data-cookies-ok]').addEventListener('click', function () {
      aviso.hidden = true;
      try { window.localStorage.setItem(CHAVE, '1'); } catch (e) { /* tudo bem */ }
    });
  }

  /* ---------- Botão fixo no celular ---------- */

  function ligarBarraFixa() {
    var barra = document.querySelector('.barra-fixa');
    var topo = document.querySelector('.hero .cta');
    var fim = document.querySelector('#final');
    if (!barra || !topo || !('IntersectionObserver' in window)) return;
    var vistos = { topo: true, fim: false };
    var botao = barra.querySelector('a');
    var atualizar = function () {
      var mostrar = !vistos.topo && !vistos.fim;
      barra.classList.toggle('visivel', mostrar);
      barra.setAttribute('aria-hidden', String(!mostrar));
      botao.tabIndex = mostrar ? 0 : -1;
    };
    new IntersectionObserver(function (es) {
      es.forEach(function (x) { vistos[x.target === topo ? 'topo' : 'fim'] = x.isIntersecting; });
      atualizar();
    }).observe(topo);
    if (fim) new IntersectionObserver(function (es) {
      es.forEach(function (x) { vistos.fim = x.isIntersecting; });
      atualizar();
    }).observe(fim);
  }

  /* ---------- Início ---------- */

  preencherTextos();
  ligarBotoes();
  estado.planos = planosDaReserva();
  estado.ciclo = 'monthly';
  desenharPlanos();
  ligarBarraFixa();
  ligarMedicao();
  carregarMarca();
  carregarPlanos();
})();
