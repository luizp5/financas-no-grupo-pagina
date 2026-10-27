/*
 * Comportamento da página do white label. Roda depois de js/pagina.js, que já
 * cuida do celular animado, do tour do portal, da barra fixa, das animações e
 * da medição. Aqui fica o que é da venda da licença (whitelabel/config.js).
 */
(function () {
  'use strict';

  var wl = window.WL || {};
  var site = window.SITE || {};
  var reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function todos(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }
  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }
  function numero(v) { var n = Number(v); return isFinite(n) && v !== '' && v != null ? n : null; }

  /* ---------- Destino dos botões de compra ---------- */

  var whatsapp = String(wl.whatsappVendas || site.whatsappSuporte || '').replace(/\D/g, '');

  function linkWhatsapp(mensagem) {
    return whatsapp ? 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(mensagem) : '';
  }

  // Leva os utm_* do endereço para o checkout.
  function comUtms(link) {
    try {
      var url = new URL(link, window.location.href);
      new URLSearchParams(window.location.search).forEach(function (valor, chave) {
        if (/^utm_/i.test(chave) && valor) url.searchParams.set(chave, valor);
      });
      return url.toString();
    } catch (e) { return link; }
  }

  function destino(oferta) {
    var link = (oferta && oferta.linkCompra) || wl.linkCompra;
    if (link) return comUtms(link);
    var mensagem = wl.mensagemWhatsapp || 'Oi! Quero saber mais sobre o white label.';
    if (oferta) mensagem += ' (Opção: ' + oferta.nome + ')';
    return linkWhatsapp(mensagem) || '#oferta';
  }

  function externo(a) {
    if (!/^https?:/.test(a.getAttribute('href'))) return;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('data-externo', '');
  }

  function ligarBotoes() {
    // Os botões do meio da página levam até a oferta; o da chamada final vai direto.
    todos('a[data-comprar="direto"]').forEach(function (a) { a.href = destino(null); externo(a); });
    todos('a[data-whatsapp-vendas]').forEach(function (a) {
      var link = linkWhatsapp(wl.mensagemWhatsapp || 'Oi!');
      if (link) { a.href = link; externo(a); } else a.hidden = true;
    });
    if (wl.linkDemo) {
      todos('a[data-demo]').forEach(function (a) { a.href = wl.linkDemo; externo(a); });
    }
    var nota = document.querySelector('[data-nota-final]');
    if (nota && wl.linkCompra) nota.textContent = 'Compra segura, com a garantia descrita na oferta.';
  }

  /* ---------- Ofertas, bônus, garantia e suporte ---------- */

  function cartaoDaOferta(oferta, total) {
    var destaque = !!oferta.destaque && total > 1;
    var card = el('article', 'plano' + (destaque ? ' plano--destaque' : ''));
    if (destaque) card.appendChild(el('span', 'plano__selo', 'Recomendado'));
    card.appendChild(el('h3', null, oferta.nome));
    if (oferta.descricao) card.appendChild(el('p', 'plano__desc', oferta.descricao));

    var setup = numero(oferta.setup);
    var mensal = numero(oferta.mensal);
    var linha = el('p', 'plano__preco');
    if (mensal != null) {
      linha.appendChild(el('span', 'plano__valor', reais.format(mensal)));
      linha.appendChild(el('span', 'plano__ciclo', 'por mês'));
      card.appendChild(linha);
      if (setup != null) card.appendChild(el('p', 'plano__extra', 'Mais ' + reais.format(setup) + ' de setup, pago uma vez.'));
    } else if (setup != null) {
      linha.appendChild(el('span', 'plano__valor', reais.format(setup)));
      linha.appendChild(el('span', 'plano__ciclo', 'pagamento único'));
      card.appendChild(linha);
      card.appendChild(el('p', 'plano__extra', 'Sem mensalidade.'));
    } else {
      linha.appendChild(el('span', 'plano__valor plano__valor--consulta', 'Sob consulta'));
      card.appendChild(linha);
    }

    if (Array.isArray(oferta.inclui) && oferta.inclui.length) {
      var ul = el('ul', 'lista-check');
      oferta.inclui.forEach(function (t) {
        var li = el('li');
        li.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-check"/></svg>';
        li.appendChild(document.createTextNode(t));
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    var botao = el('a', 'btn ' + (destaque || total === 1 ? 'btn--primario' : 'btn--fantasma'), 'Quero esta opção');
    botao.href = destino(oferta);
    externo(botao);
    card.appendChild(botao);
    return card;
  }

  function desenharOfertas() {
    var area = document.querySelector('[data-ofertas]');
    var ofertas = Array.isArray(wl.ofertas) ? wl.ofertas : [];
    if (area) {
      area.innerHTML = '';
      ofertas.forEach(function (o) { area.appendChild(cartaoDaOferta(o, ofertas.length)); });
    }

    var bonus = Array.isArray(wl.bonus) ? wl.bonus : [];
    var caixa = document.querySelector('[data-bonus]');
    var lista = document.querySelector('[data-bonus-lista]');
    if (caixa && lista && bonus.length) {
      bonus.forEach(function (t) {
        var li = el('li');
        li.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-check"/></svg>';
        li.appendChild(document.createTextNode(t));
        lista.appendChild(li);
      });
      caixa.hidden = false;
    }

    var garantia = document.querySelector('[data-garantia]');
    if (garantia && wl.garantia) garantia.textContent = wl.garantia;
    var suporte = document.querySelector('[data-resposta-suporte]');
    if (suporte && wl.respostaSuporte) suporte.textContent = wl.respostaSuporte;
  }

  /* ---------- Simulador de receita ---------- */

  function ligarSimulador() {
    var caixa = document.querySelector('[data-simulador]');
    if (!caixa) return;
    var campos = {};
    todos('[data-campo]', caixa).forEach(function (c) { campos[c.getAttribute('data-campo')] = c; });
    var inicial = wl.simulador || {};
    Object.keys(campos).forEach(function (k) { if (numero(inicial[k]) != null) campos[k].value = inicial[k]; });

    var saida = caixa.querySelector('[data-saida="clientes"]');
    var res = {};
    todos('[data-resultado]', caixa).forEach(function (r) { res[r.getAttribute('data-resultado')] = r; });

    function valor(k) { return Math.max(0, numero(campos[k] && campos[k].value) || 0); }
    function calcular() {
      var clientes = valor('clientes');
      var receita = clientes * valor('mensalidade');
      var custos = valor('custoFixo');
      var sobra = receita - custos;
      if (saida) saida.textContent = clientes.toLocaleString('pt-BR');
      res.receita.textContent = reais.format(receita);
      res.custos.textContent = reais.format(custos);
      res.sobra.textContent = reais.format(sobra);
      res.ano.textContent = reais.format(sobra * 12);
    }
    caixa.addEventListener('input', calcular);
    calcular();
  }

  /* ---------- Abas do painel Admin ---------- */

  function ligarAbas() {
    todos('[data-wl-abas]').forEach(function (raiz) {
      var abas = todos('[role="tab"]', raiz);
      function selecionar(aba, foco) {
        abas.forEach(function (a) {
          var ativa = a === aba;
          a.classList.toggle('is-active', ativa);
          a.setAttribute('aria-selected', String(ativa));
          a.tabIndex = ativa ? 0 : -1;
          var tela = document.getElementById(a.getAttribute('aria-controls'));
          if (tela) tela.hidden = !ativa;
        });
        if (foco) aba.focus();
        aba.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      abas.forEach(function (aba, i) {
        aba.addEventListener('click', function () { selecionar(aba, false); });
        aba.addEventListener('keydown', function (e) {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          e.preventDefault();
          var passo = e.key === 'ArrowRight' ? 1 : -1;
          selecionar(abas[(i + passo + abas.length) % abas.length], true);
        });
      });
    });
  }

  /* ---------- Medição: clique para comprar ou falar com a equipe ---------- */

  function ligarMedicao() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-externo]');
      if (!a || a.hasAttribute('data-demo')) return;
      if (window.fbq) window.fbq('track', 'Lead', { content_name: 'whitelabel' });
      if (window.gtag) window.gtag('event', 'generate_lead', { produto: 'whitelabel' });
    });
  }

  ligarBotoes();
  desenharOfertas();
  ligarSimulador();
  ligarAbas();
  ligarMedicao();
})();
