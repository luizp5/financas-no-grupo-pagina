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

  /* ---------- Contagem progressiva da faixa de números ---------- */

  function ligarContagem() {
    var numeros = todos('[data-contar]');
    var reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!numeros.length || reduzMovimento || !('IntersectionObserver' in window)) return;

    var DURACAO = 1600;
    function contar(n) {
      var alvo = Number(n.getAttribute('data-contar'));
      var inicio = null;
      function quadro(agora) {
        if (inicio === null) inicio = agora;
        var t = Math.min(1, (agora - inicio) / DURACAO);
        n.textContent = Math.round(alvo * (1 - Math.pow(1 - t, 3)));
        if (t < 1) window.requestAnimationFrame(quadro);
      }
      window.requestAnimationFrame(quadro);
    }

    // O número final fica no HTML: sem JavaScript, a faixa já aparece certa.
    numeros.forEach(function (n) { n.textContent = '0'; });
    var observador = new IntersectionObserver(function (entradas) {
      if (!entradas.some(function (e) { return e.isIntersecting; })) return;
      observador.disconnect();
      numeros.forEach(contar);
    }, { threshold: 0.4 });
    observador.observe(document.querySelector('.wl-numeros'));
  }

  /* ---------- Janelas com as conversas ---------- */

  function datas() {
    var agora = new Date();
    var dois = function (n) { return String(n).padStart(2, '0'); };
    var ddmm = function (x) { return dois(x.getDate()) + '/' + dois(x.getMonth() + 1); };
    var mes = agora.toLocaleDateString('pt-BR', { month: 'long' });
    var terca = new Date(agora);
    terca.setDate(agora.getDate() + ((9 - agora.getDay()) % 7 || 7));
    var fatura = new Date(agora.getFullYear(), agora.getMonth() + 1, 10);
    var dia15 = new Date(agora.getFullYear(), agora.getMonth() + (agora.getDate() >= 15 ? 1 : 0), 15);
    return {
      hoje: ddmm(agora) + '/' + agora.getFullYear(),
      mes: mes,
      mesAno: mes + ' de ' + agora.getFullYear(),
      fatura: ddmm(fatura) + '/' + fatura.getFullYear(),
      faturaCurta: ddmm(fatura),
      meses: [1, 2, 3, 4, 5, 6].map(function (n) {
        return new Date(agora.getFullYear(), agora.getMonth() + n, 1).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      }),
      dia15: ddmm(dia15) + '/' + dia15.getFullYear(),
      proximaTerca: 'Ter, ' + ddmm(terca)
    };
  }

  function horaAgora() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // Monta o corpo de uma resposta: '' pula linha, '*' abre negrito e o endereço
  // do app sai como link, igual ao WhatsApp.
  function linhaDaMensagem(texto) {
    var p = el('p', 'wl-linha-msg');
    if (!texto) { p.className = 'wl-linha-msg wl-linha-msg--vazia'; return p; }
    var marca = texto.indexOf('*');
    if (marca !== -1) {
      p.appendChild(document.createTextNode(texto.slice(0, marca)));
      p.appendChild(el('strong', null, texto.slice(marca + 1)));
      return p;
    }
    var link = texto.indexOf('app.suamarca');
    if (link !== -1) {
      p.appendChild(document.createTextNode(texto.slice(0, link)));
      p.appendChild(el('span', 'wl-link-msg', 'https://' + texto.slice(link)));
      return p;
    }
    p.textContent = texto;
    return p;
  }

  /* Mini gráficos: cada tipo monta o desenho e devolve como aplicar um estado. */

  var SVG = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs) {
    var n = document.createElementNS(SVG, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  // Sobe ou desce o número até o valor novo, em vez de trocar de repente.
  function animarNumero(n, para, formato, reduzMovimento) {
    var de = Number(n.getAttribute('data-valor')) || 0;
    n.setAttribute('data-valor', para);
    if (reduzMovimento || de === para) { n.textContent = formato(para); return; }
    var inicio = null;
    function quadro(agora) {
      if (inicio === null) inicio = agora;
      var t = Math.min(1, (agora - inicio) / 800);
      n.textContent = formato(de + (para - de) * (1 - Math.pow(1 - t, 3)));
      if (t < 1 && Number(n.getAttribute('data-valor')) === para) window.requestAnimationFrame(quadro);
    }
    window.requestAnimationFrame(quadro);
  }

  function dinheiroCurto(v) { return reais.format(v); }
  function inteiro(v) { return String(Math.round(v)); }

  function desenharStats(raiz, reduzMovimento) {
    var caixa = el('div', 'wl-painel__stats');
    raiz.appendChild(caixa);
    var celulas = [];
    return function (stats) {
      (stats || []).forEach(function (s, i) {
        if (!celulas[i]) {
          var c = el('div');
          c.appendChild(el('small'));
          c.appendChild(el('strong'));
          caixa.appendChild(c);
          celulas[i] = c;
        }
        celulas[i].firstChild.textContent = s.rotulo;
        var alvo = celulas[i].lastChild;
        if (s.texto != null) { alvo.removeAttribute('data-valor'); alvo.textContent = s.texto; }
        else if (s.numero != null) animarNumero(alvo, s.numero, inteiro, reduzMovimento);
        else animarNumero(alvo, s.valor, dinheiroCurto, reduzMovimento);
      });
    };
  }

  var GRAFICOS = {
    progresso: function (raiz, def, reduz) {
      var linha = el('p', 'wl-painel__valor');
      var atual = el('strong');
      var total = el('span');
      linha.appendChild(atual);
      linha.appendChild(total);
      raiz.appendChild(linha);
      var barra = el('i', 'wl-painel__barra');
      var cheio = el('em');
      barra.appendChild(cheio);
      raiz.appendChild(barra);
      var stats = desenharStats(raiz, reduz);
      var formato = def.contagem ? inteiro : dinheiroCurto;
      total.textContent = ' de ' + formato(def.total) + (def.contagem ? ' pagas' : '');
      return function (e) {
        animarNumero(atual, e.atual, formato, reduz);
        cheio.style.width = Math.min(100, (e.atual / e.total) * 100) + '%';
        stats(e.stats);
      };
    },

    barras: function (raiz, def, reduz) {
      var linhas = def.itens.map(function (item) {
        var l = el('div', 'wl-painel__linha');
        l.appendChild(el('span', null, item.nome));
        var trilho = el('i', 'wl-painel__barra');
        var cheio = el('em', 'wl-cor-' + item.cor);
        trilho.appendChild(cheio);
        l.appendChild(trilho);
        var valor = el('strong');
        l.appendChild(valor);
        raiz.appendChild(l);
        return { cheio: cheio, valor: valor };
      });
      return function (e) {
        e.itens.forEach(function (item, i) {
          linhas[i].cheio.style.width = Math.min(100, (item.valor / def.maximo) * 100) + '%';
          animarNumero(linhas[i].valor, item.valor, dinheiroCurto, reduz);
        });
      };
    },

    rosca: function (raiz, def, reduz) {
      var corpo = el('div', 'wl-painel__rosca');
      var desenho = svg('svg', { viewBox: '0 0 42 42', 'aria-hidden': 'true' });
      desenho.appendChild(svg('circle', { cx: 21, cy: 21, r: 15.915, class: 'wl-rosca__fundo' }));
      var arcos = def.itens.map(function (item) {
        var c = svg('circle', { cx: 21, cy: 21, r: 15.915, class: 'wl-rosca__arco wl-traco-' + item.cor });
        desenho.appendChild(c);
        return c;
      });
      corpo.appendChild(desenho);
      var legenda = el('ul');
      var valores = def.itens.map(function (item) {
        var li = el('li');
        li.appendChild(el('i', 'wl-cor-' + item.cor));
        li.appendChild(el('span', null, item.nome));
        var v = el('strong');
        li.appendChild(v);
        legenda.appendChild(li);
        return v;
      });
      corpo.appendChild(legenda);
      raiz.appendChild(corpo);
      return function (e) {
        var soma = e.itens.reduce(function (t, i) { return t + i.valor; }, 0);
        var acumulado = 0;
        e.itens.forEach(function (item, i) {
          var fatia = (item.valor / soma) * 100;
          arcos[i].style.strokeDasharray = fatia + ' ' + (100 - fatia);
          arcos[i].style.strokeDashoffset = String(25 - acumulado);
          acumulado += fatia;
          animarNumero(valores[i], item.valor, dinheiroCurto, reduz);
        });
      };
    },

    colunas: function (raiz, def, reduz) {
      var topo = el('p', 'wl-painel__valor');
      var proxima = el('strong');
      topo.appendChild(proxima);
      topo.appendChild(el('span', null, ' na próxima fatura'));
      raiz.appendChild(topo);
      var grade = el('div', 'wl-painel__colunas');
      var colunas = def.meses.map(function (mes) {
        var c = el('div');
        var trilho = el('i');
        var cheio = el('em');
        trilho.appendChild(cheio);
        c.appendChild(trilho);
        c.appendChild(el('small', null, mes));
        grade.appendChild(c);
        return cheio;
      });
      raiz.appendChild(grade);
      return function (e) {
        e.valores.forEach(function (v, i) {
          colunas[i].style.height = Math.min(100, (v / def.maximo) * 100) + '%';
        });
        animarNumero(proxima, e.valores[0], dinheiroCurto, reduz);
      };
    },

    linha: function (raiz, def, reduz) {
      var largura = 300;
      var altura = 70;
      var passo = largura / (def.pontos.length - 1);
      var coords = def.pontos.map(function (y, i) { return (i * passo).toFixed(1) + ',' + (altura - (y / 100) * altura).toFixed(1); });
      var desenho = svg('svg', { viewBox: '0 0 ' + largura + ' ' + altura, preserveAspectRatio: 'none', class: 'wl-painel__linha-svg', 'aria-hidden': 'true' });
      var defs = svg('defs', {});
      var mascara = svg('clipPath', { id: 'wl-corte-linha' });
      var janela = svg('rect', { x: 0, y: 0, width: 0, height: altura, class: 'wl-linha__janela' });
      mascara.appendChild(janela);
      defs.appendChild(mascara);
      desenho.appendChild(defs);
      desenho.appendChild(svg('polygon', { points: '0,' + altura + ' ' + coords.join(' ') + ' ' + largura + ',' + altura, class: 'wl-linha__area', 'clip-path': 'url(#wl-corte-linha)' }));
      desenho.appendChild(svg('polyline', { points: coords.join(' '), class: 'wl-linha__traco', 'clip-path': 'url(#wl-corte-linha)' }));
      raiz.appendChild(desenho);
      var stats = desenharStats(raiz, reduz);
      return function (e) {
        janela.style.width = (e.mostra / 100) * largura + 'px';
        stats(e.stats);
      };
    }
  };

  function criarPainel(def, reduzMovimento) {
    var raiz = el('section', 'wl-painel');
    raiz.setAttribute('aria-hidden', 'true');
    var topo = el('div', 'wl-painel__topo');
    topo.appendChild(el('b', null, def.titulo));
    var selo = el('span', 'wl-chip');
    topo.appendChild(selo);
    raiz.appendChild(topo);
    var aplicarGrafico = GRAFICOS[def.tipo](raiz, def, reduzMovimento);
    var estado = {};

    function aplicar(mudanca) {
      estado = Object.assign({}, estado, mudanca);
      selo.textContent = estado.selo || '';
      selo.className = 'wl-chip' + (estado.seloTipo ? ' wl-chip--' + estado.seloTipo : '');
      aplicarGrafico(estado);
    }
    function reiniciar() { aplicar(def); }
    reiniciar();
    return { el: raiz, aplicar: aplicar, reiniciar: reiniciar };
  }

  function criarFone(caixa, modelo, roteiro, painel, reduzMovimento) {
    var figura = modelo.content.firstElementChild.cloneNode(true);
    var tela = caixa.querySelector('[data-fone-tela]');
    tela.appendChild(figura);
    if (painel) tela.appendChild(painel.el);

    var assistente = site.assistente || 'Dona Conta';
    todos('[data-fone-assistente]', figura).forEach(function (n) { n.textContent = assistente; });
    var feed = figura.querySelector('[data-fone-feed]');
    var digitado = figura.querySelector('[data-fone-digitado]');
    var tempoAudio = figura.querySelector('[data-fone-tempo]');
    var visivel = false;
    var acordar = null;

    function esperar(ms) {
      return new Promise(function (r) { window.setTimeout(r, ms); }).then(function () {
        if (visivel) return null;
        return new Promise(function (r) { acordar = r; });
      });
    }

    function rolar() {
      window.requestAnimationFrame(function () {
        feed.scrollTo({ top: feed.scrollHeight, behavior: reduzMovimento ? 'auto' : 'smooth' });
      });
    }

    function entrar(n) {
      n.classList.add('demo-feed__item');
      feed.appendChild(n);
      rolar();
    }

    function bolhaDaPessoa(nome) {
      var b = el('article', 'bolha bolha--eu');
      b.appendChild(el('b', 'bolha__nome', nome));
      return b;
    }

    function fechar(b, hora, lida) {
      b.appendChild(el('time', null, (hora || horaAgora()) + (lida ? ' ✓✓' : '')));
      return b;
    }

    function mensagemDaPessoa(passo) {
      var b = bolhaDaPessoa(passo.de);
      if (passo.texto) {
        b.classList.add('demo-texto');
        b.appendChild(document.createTextNode(passo.texto));
      } else if (passo.audio) {
        b.classList.add('bolha--audio');
        var audio = el('span', 'audio audio--tocando');
        audio.appendChild(el('span', 'audio__play', '▶'));
        audio.appendChild(el('span', 'audio__onda'));
        audio.appendChild(el('span', null, passo.audio));
        b.appendChild(audio);
      } else if (passo.foto) {
        b.classList.add('wl-bolha-foto');
        var foto = el('span', 'wl-foto wl-foto--' + passo.foto);
        var papel = el('span', 'wl-foto__papel');
        for (var i = 0; i < 7; i += 1) papel.appendChild(el('i'));
        foto.appendChild(papel);
        b.appendChild(foto);
      }
      return fechar(b, null, true);
    }

    function mensagemDela(linhas, hora) {
      var b = el('article', 'bolha bolha--ela demo-resposta');
      var remetente = el('div', 'wl-remetente');
      var foto = el('img');
      foto.src = '/assets/mascote.webp';
      foto.width = 18;
      foto.height = 18;
      foto.alt = '';
      remetente.appendChild(foto);
      remetente.appendChild(el('b', null, assistente));
      remetente.appendChild(el('small', null, 'Assistente'));
      b.appendChild(remetente);
      linhas.forEach(function (l) { b.appendChild(linhaDaMensagem(l)); });
      return fechar(b, hora, false);
    }

    function figurinha() {
      var w = el('div', 'demo-sticker-wrap');
      var img = el('img', 'demo-sticker');
      img.src = '/assets/figurinha-mais-uma-pra-conta.png';
      img.width = 88;
      img.height = 88;
      img.alt = '';
      w.appendChild(img);
      return w;
    }

    async function digitar(texto) {
      figura.classList.add('is-digitando-cliente');
      digitado.textContent = '';
      await esperar(380);
      for (var i = 0; i < texto.length; i += 1) {
        digitado.textContent += texto.charAt(i);
        digitado.scrollLeft = digitado.scrollWidth;
        await esperar(texto.charAt(i) === ' ' ? 30 : 44);
      }
      figura.classList.add('is-pronto-enviar');
      await esperar(380);
    }

    async function gravar(duracao) {
      var total = Number(duracao.split(':')[1]) || 3;
      await esperar(450);
      figura.classList.add('is-gravando');
      for (var s = 0; s <= total; s += 1) {
        tempoAudio.textContent = '0:0' + s;
        await esperar(560);
      }
      figura.classList.remove('is-gravando');
      figura.classList.add('is-audio-pronto', 'is-pronto-enviar');
      await esperar(360);
    }

    async function anexar() {
      await esperar(420);
      figura.classList.add('is-anexando');
      await esperar(700);
      figura.classList.remove('is-anexando');
      figura.classList.add('is-audio-pronto', 'is-pronto-enviar');
      await esperar(320);
    }

    async function enviar(passo) {
      figura.classList.add('is-apertando-enviar');
      await esperar(180);
      entrar(mensagemDaPessoa(passo));
      figura.classList.remove('is-apertando-enviar', 'is-pronto-enviar', 'is-digitando-cliente', 'is-audio-pronto');
      digitado.textContent = '';
      tempoAudio.textContent = '0:00';
    }

    async function responder(passo) {
      await esperar(700);
      figura.classList.add('is-agente-digitando');
      rolar();
      await esperar(1300);
      figura.classList.remove('is-agente-digitando');
      entrar(mensagemDela(passo.ela));
      if (passo.painel && painel) painel.aplicar(passo.painel);
      if (passo.figurinha) {
        await esperar(650);
        entrar(figurinha());
      }
      await esperar(2200);
    }

    async function executar(passo) {
      if (passo.aviso) {
        await esperar(500);
        entrar(mensagemDela(passo.aviso, passo.hora));
        await esperar(2400);
      } else if (passo.ela) {
        await responder(passo);
      } else {
        if (passo.texto) await digitar(passo.texto);
        else if (passo.audio) await gravar(passo.audio);
        else if (passo.foto) await anexar();
        await enviar(passo);
      }
    }

    async function repetir() {
      await esperar(250);
      while (document.body.contains(figura)) {
        for (var i = 0; i < roteiro.length; i += 1) await executar(roteiro[i]);
        await esperar(2600);
        feed.classList.add('is-reiniciando');
        await esperar(420);
        feed.innerHTML = '';
        feed.scrollTop = 0;
        feed.classList.remove('is-reiniciando');
        if (painel) painel.reiniciar();
        await esperar(300);
      }
    }

    if (reduzMovimento || !('IntersectionObserver' in window)) {
      roteiro.forEach(function (p) {
        if (p.aviso) feed.appendChild(mensagemDela(p.aviso, p.hora));
        else if (p.ela) {
          feed.appendChild(mensagemDela(p.ela));
          if (p.figurinha) feed.appendChild(figurinha());
          if (p.painel && painel) painel.aplicar(p.painel);
        } else feed.appendChild(mensagemDaPessoa(p));
      });
      return;
    }

    // Só anda quando está na tela: sete conversas ao mesmo tempo pesariam à toa.
    new IntersectionObserver(function (entradas) {
      visivel = entradas[entradas.length - 1].isIntersecting;
      if (visivel && acordar) { acordar(); acordar = null; }
    }, { threshold: 0.3 }).observe(figura);
    repetir();
  }

  function ligarFones() {
    var modelo = document.getElementById('wl-fone-modelo');
    if (!modelo || !window.WL_CONVERSAS) return;
    var reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var d = datas();
    var roteiros = window.WL_CONVERSAS(d);
    var paineis = window.WL_PAINEIS ? window.WL_PAINEIS(d) : {};
    todos('[data-roteiro]').forEach(function (caixa) {
      var nome = caixa.getAttribute('data-roteiro');
      var painel = paineis[nome] ? criarPainel(paineis[nome], reduzMovimento) : null;
      if (roteiros[nome]) criarFone(caixa, modelo, roteiros[nome], painel, reduzMovimento);
    });
  }

  /* ---------- A Dona Conta avisando ao longo do dia ---------- */

  function ligarDonaConta() {
    var lista = document.querySelector('[data-dia]');
    var dona = document.querySelector('[data-dona]');
    var reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!lista || !dona || reduzMovimento || !('IntersectionObserver' in window)) return;

    var INTERVALO = 2800;
    var itens = todos('li', lista);
    var visivel = false;
    var acordar = null;

    function esperar(ms) {
      return new Promise(function (r) { window.setTimeout(r, ms); }).then(function () {
        if (visivel) return null;
        return new Promise(function (r) { acordar = r; });
      });
    }

    function gesto(nome) {
      dona.className = 'wl-dona';
      // Força o navegador a recomeçar a animação, mesmo com o gesto repetido.
      void dona.offsetWidth;
      dona.classList.add('gesto-' + nome);
    }

    async function repetir() {
      lista.classList.add('wl-dia-animado');
      while (document.body.contains(lista)) {
        await esperar(500);
        for (var i = 0; i < itens.length; i += 1) {
          itens[i].classList.add('is-vista', 'is-falando');
          gesto(itens[i].getAttribute('data-gesto'));
          await esperar(INTERVALO);
          itens[i].classList.remove('is-falando');
        }
        await esperar(3200);
        dona.className = 'wl-dona';
        itens.forEach(function (li) { li.classList.remove('is-vista'); });
        await esperar(700);
      }
    }

    new IntersectionObserver(function (entradas) {
      visivel = entradas[entradas.length - 1].isIntersecting;
      if (visivel && acordar) { acordar(); acordar = null; }
    }, { threshold: 0.3 }).observe(lista);
    repetir();
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
  ligarContagem();
  ligarFones();
  ligarDonaConta();
  ligarAbas();
  ligarMedicao();
})();
