/**
 * Delibera — Tour Guiado
 * Sistema de tour interativo que guia o visitante pelo fluxo completo do produto.
 * Usa localStorage('delibera-tour-step') para persistir progresso entre paginas.
 */
(function () {
  'use strict';

  // ── Tour Steps ──────────────────────────────────────────────────────────────
  var TOUR_STEPS = [
    {
      page: 'index.html',
      selector: 'a[href="login.html"]',
      text: 'Clique aqui para acessar o sistema',
      position: 'bottom'
    },
    {
      page: 'login.html',
      selector: '.social-buttons a:first-child',
      text: 'Clique em "Continuar com Google" para entrar',
      position: 'bottom'
    },
    {
      page: 'dashboard-coordenacao.html',
      selector: 'a[href="analisar-solicitacao.html"]',
      text: 'Analise uma solicitacao pendente',
      position: 'left'
    },
    {
      page: 'analisar-solicitacao.html',
      selector: '.btn-action--deferir',
      text: 'Defira a solicitacao do aluno',
      position: 'left',
      action: function () {
        localStorage.setItem('delibera-tour-step', '4');
        window.location.href = 'dashboard-coordenacao.html';
      }
    },
    {
      page: 'dashboard-coordenacao.html',
      selector: '.navbar-brand',
      text: 'Agora veja o fluxo do aluno — clique no logo',
      position: 'bottom',
      action: function () {
        localStorage.setItem('delibera-tour-step', '5');
        window.location.href = 'index.html';
      }
    },
    {
      page: 'index.html',
      selector: 'a[href="nova-solicitacao.html"]',
      text: 'Crie uma solicitacao como aluno',
      position: 'bottom'
    },
    {
      page: 'nova-solicitacao.html',
      selector: 'button[type="submit"]',
      text: 'Dados preenchidos! Clique para enviar',
      position: 'top',
      action: function() {
        // Simulate form submission for file:// protocol
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var codigo = '';
        for (var i = 0; i < 8; i++) codigo += chars.charAt(Math.floor(Math.random() * 36));
        var protocolo = 'DEL-2026-' + codigo;
        var now = new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
        var solicitacao = {
          protocolo: protocolo,
          dataEnvio: now,
          instituicao: 'FATEC São Paulo',
          nomeCompleto: 'Mariana Silva Costa',
          email: 'mariana.costa@faculdadeexemplo.edu.br',
          whatsapp: '(65) 99812-3456',
          curso: 'ADS',
          turma: '3º A',
          disciplina: 'Algoritmos',
          tipo: 'Segunda chamada de prova',
          dataRelacionada: '10/04/2026',
          descricao: 'Não pude comparecer à prova de Algoritmos do dia 10/04 por motivo de saúde.'
        };
        localStorage.setItem('ultimaSolicitacao', JSON.stringify(solicitacao));
        localStorage.setItem('delibera-tour-step', '7');
        window.location.href = 'confirmacao-solicitacao.html';
      },
      prefill: function() {
        var fields = {
          'instituicao': 1,
          'nomeCompleto': 'Mariana Silva Costa',
          'email': 'mariana.costa@faculdadeexemplo.edu.br',
          'whatsapp': '(65) 99812-3456',
          'curso': 1,
          'turma': '3º A',
          'disciplina': 1,
          'tipoSolicitacao': 1,
          'dataRelacionada': '2026-04-10',
          'descricao': 'Não pude comparecer à prova de Algoritmos do dia 10/04 por motivo de saúde. Segue atestado médico em anexo.'
        };
        Object.keys(fields).forEach(function(id) {
          var el = document.getElementById(id);
          if (!el) return;
          if (el.tagName === 'SELECT') {
            if (typeof fields[id] === 'number') {
              el.selectedIndex = fields[id];
            } else {
              el.value = fields[id];
            }
          } else {
            el.value = fields[id];
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
    },
    {
      page: 'confirmacao-solicitacao.html',
      selector: 'a[href="acompanhar.html"]',
      text: 'Consulte o protocolo com seu email',
      position: 'top'
    },
    {
      page: 'acompanhar.html',
      selector: 'button[type="submit"]',
      text: 'Informe protocolo + email para consultar',
      position: 'bottom'
    },
    {
      page: 'acompanhar.html',
      selector: null,
      text: null,
      complete: true
    }
  ];

  var TOTAL_STEPS = TOUR_STEPS.length - 1; // last step is the "complete" marker
  var STORAGE_KEY = 'delibera-tour-step';
  var STORAGE_DONE = 'delibera-tour-done';

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function getCurrentPage() {
    var path = window.location.pathname;
    var parts = path.split('/');
    return parts[parts.length - 1] || 'index.html';
  }

  function getStep() {
    var val = localStorage.getItem(STORAGE_KEY);
    return val !== null ? parseInt(val, 10) : -1;
  }

  function setStep(n) {
    localStorage.setItem(STORAGE_KEY, String(n));
  }

  function clearTour() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_DONE, '1');
    removeAll();
  }

  function resetTour() {
    localStorage.removeItem(STORAGE_DONE);
    setStep(0);
    window.location.href = 'index.html';
  }

  function isTourActive() {
    return getStep() >= 0;
  }

  function isTourDone() {
    return localStorage.getItem(STORAGE_DONE) === '1';
  }

  // ── DOM cleanup ─────────────────────────────────────────────────────────────

  function removeAll() {
    var ids = [
      'delibera-tour-overlay',
      'delibera-tour-tooltip',
      'delibera-tour-skip',
      'delibera-tour-complete',
      'delibera-tour-styles'
    ];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
    // restore any highlighted target
    var highlighted = document.querySelector('[data-delibera-tour-target]');
    if (highlighted) {
      highlighted.style.position = '';
      highlighted.style.zIndex = '';
      highlighted.style.boxShadow = '';
      highlighted.removeAttribute('data-delibera-tour-target');
    }
  }

  // ── Inject CSS ──────────────────────────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById('delibera-tour-styles')) return;
    var style = document.createElement('style');
    style.id = 'delibera-tour-styles';
    style.textContent = [
      '@keyframes deliberaPulse {',
      '  0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(249,115,22,0.5); }',
      '  50%  { transform: scale(1.05); box-shadow: 0 0 18px 4px rgba(249,115,22,0.35); }',
      '  100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(249,115,22,0); }',
      '}',
      '#delibera-tour-overlay {',
      '  position: fixed; inset: 0;',
      '  background: rgba(0,0,0,0.25);',
      '  z-index: 9998;',
      '  transition: opacity .3s;',
      '  pointer-events: none;',
      '}',
      '#delibera-tour-tooltip {',
      '  position: absolute;',
      '  z-index: 9999;',
      '  background: #f97316;',
      '  color: #fff;',
      '  font-family: Inter, system-ui, sans-serif;',
      '  font-size: 14px;',
      '  line-height: 1.45;',
      '  padding: 14px 18px;',
      '  border-radius: 12px;',
      '  max-width: 300px;',
      '  min-width: 180px;',
      '  animation: deliberaPulse 2s ease-in-out infinite;',
      '  pointer-events: auto;',
      '  box-sizing: border-box;',
      '}',
      '#delibera-tour-tooltip .tour-text {',
      '  font-weight: 600;',
      '  margin-bottom: 6px;',
      '}',
      '#delibera-tour-tooltip .tour-progress {',
      '  font-size: 11px;',
      '  opacity: 0.8;',
      '}',
      /* Arrow base */
      '#delibera-tour-tooltip .tour-arrow {',
      '  position: absolute;',
      '  width: 0; height: 0;',
      '  border: 8px solid transparent;',
      '}',
      /* Arrow variants */
      '#delibera-tour-tooltip.pos-bottom .tour-arrow {',
      '  top: -16px; left: 50%; transform: translateX(-50%);',
      '  border-bottom-color: #f97316; border-top: none;',
      '}',
      '#delibera-tour-tooltip.pos-top .tour-arrow {',
      '  bottom: -16px; left: 50%; transform: translateX(-50%);',
      '  border-top-color: #f97316; border-bottom: none;',
      '}',
      '#delibera-tour-tooltip.pos-left .tour-arrow {',
      '  right: -16px; top: 50%; transform: translateY(-50%);',
      '  border-left-color: #f97316; border-right: none;',
      '}',
      '#delibera-tour-tooltip.pos-right .tour-arrow {',
      '  left: -16px; top: 50%; transform: translateY(-50%);',
      '  border-right-color: #f97316; border-left: none;',
      '}',
      /* Skip button */
      '#delibera-tour-skip {',
      '  position: fixed; bottom: 24px; right: 24px;',
      '  z-index: 10001;',
      '  background: rgba(0,0,0,0.7);',
      '  color: #fff;',
      '  border: 1px solid rgba(255,255,255,0.2);',
      '  border-radius: 8px;',
      '  padding: 8px 18px;',
      '  font-size: 13px;',
      '  font-family: Inter, system-ui, sans-serif;',
      '  cursor: pointer;',
      '  transition: background .2s;',
      '}',
      '#delibera-tour-skip:hover { background: rgba(0,0,0,0.9); }',
      /* Completion card */
      '#delibera-tour-complete {',
      '  position: fixed; inset: 0;',
      '  z-index: 10002;',
      '  display: flex; align-items: center; justify-content: center;',
      '  background: rgba(0,0,0,0.6);',
      '}',
      '#delibera-tour-complete .card {',
      '  background: #fff;',
      '  border-radius: 20px;',
      '  padding: 48px 40px;',
      '  text-align: center;',
      '  max-width: 440px;',
      '  width: 90%;',
      '  box-shadow: 0 20px 60px rgba(0,0,0,0.3);',
      '  font-family: Inter, system-ui, sans-serif;',
      '}',
      '#delibera-tour-complete .card h2 {',
      '  font-size: 28px; font-weight: 700;',
      '  color: #0f2b5e; margin: 0 0 12px;',
      '}',
      '#delibera-tour-complete .card p {',
      '  font-size: 15px; color: #475569;',
      '  margin: 0 0 28px; line-height: 1.6;',
      '}',
      '#delibera-tour-complete .card .btns {',
      '  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;',
      '}',
      '#delibera-tour-complete .card .btn-tour {',
      '  padding: 12px 28px;',
      '  border-radius: 10px;',
      '  font-size: 14px;',
      '  font-weight: 600;',
      '  cursor: pointer;',
      '  border: none;',
      '  transition: transform .15s, box-shadow .15s;',
      '}',
      '#delibera-tour-complete .card .btn-tour:hover {',
      '  transform: translateY(-2px);',
      '  box-shadow: 0 4px 16px rgba(0,0,0,0.15);',
      '}',
      '#delibera-tour-complete .card .btn-primary-tour {',
      '  background: #1a56db; color: #fff;',
      '}',
      '#delibera-tour-complete .card .btn-ghost-tour {',
      '  background: transparent; color: #475569;',
      '  border: 1px solid #e2e8f0;',
      '}',
      /* Restart button (when tour is done/skipped) */
      '#delibera-tour-restart {',
      '  position: fixed; bottom: 28px; right: 28px;',
      '  z-index: 10001;',
      '  background: #f97316;',
      '  color: #fff;',
      '  border: none;',
      '  border-radius: 50px;',
      '  padding: 16px 32px;',
      '  font-size: 16px;',
      '  font-weight: 700;',
      '  font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif;',
      '  cursor: pointer;',
      '  box-shadow: 0 6px 24px rgba(249,115,22,0.4);',
      '  transition: transform .2s, box-shadow .2s;',
      '  display: flex; align-items: center; gap: 8px;',
      '  animation: deliberaPulse 2.5s ease-in-out infinite;',
      '}',
      '#delibera-tour-restart:hover {',
      '  transform: translateY(-3px) scale(1.03);',
      '  box-shadow: 0 8px 32px rgba(249,115,22,0.5);',
      '}',
      '#delibera-tour-restart svg {',
      '  width: 20px; height: 20px;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  // ── Positioning ─────────────────────────────────────────────────────────────

  function positionTooltip(tooltip, target, preferredPos) {
    var gap = 14;
    var rect = target.getBoundingClientRect();
    var tw = tooltip.offsetWidth;
    var th = tooltip.offsetHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    // Determine best position
    var pos = preferredPos || 'bottom';

    // Check if preferred position fits, otherwise pick alternative
    if (pos === 'bottom' && rect.bottom + gap + th > vh) pos = 'top';
    if (pos === 'top' && rect.top - gap - th < 0) pos = 'bottom';
    if (pos === 'left' && rect.left - gap - tw < 0) pos = 'right';
    if (pos === 'right' && rect.right + gap + tw > vw) pos = 'left';

    // Fallback: if still doesn't fit, use bottom
    var scrollY = window.scrollY || window.pageYOffset;
    var scrollX = window.scrollX || window.pageXOffset;
    var top, left;

    switch (pos) {
      case 'bottom':
        top = rect.bottom + gap + scrollY;
        left = rect.left + rect.width / 2 - tw / 2 + scrollX;
        break;
      case 'top':
        top = rect.top - gap - th + scrollY;
        left = rect.left + rect.width / 2 - tw / 2 + scrollX;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - th / 2 + scrollY;
        left = rect.left - gap - tw + scrollX;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - th / 2 + scrollY;
        left = rect.right + gap + scrollX;
        break;
    }

    // Clamp to viewport
    if (left < 8) left = 8;
    if (left + tw > vw + scrollX - 8) left = vw + scrollX - tw - 8;
    if (top < scrollY + 8) top = scrollY + 8;

    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';

    // Set class for arrow direction
    tooltip.className = 'pos-' + pos;
    tooltip.id = 'delibera-tour-tooltip';
  }

  // ── Show Step ───────────────────────────────────────────────────────────────

  function showStep(stepIndex) {
    removeAll();
    injectStyles();

    var step = TOUR_STEPS[stepIndex];
    if (!step) return;

    // Completion screen
    if (step.complete) {
      showComplete();
      return;
    }

    // Prefill form data if step has prefill function
    if (step.prefill) {
      step.prefill();
    }

    // Find target element (try multiple comma-separated selectors)
    var target = null;
    var selectors = step.selector.split(',');
    for (var i = 0; i < selectors.length; i++) {
      target = document.querySelector(selectors[i].trim());
      if (target) break;
    }

    if (!target) {
      // Target not found on this page — skip
      console.warn('[Delibera Tour] Target not found: ' + step.selector);
      return;
    }

    // Scroll target into view
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Wait for scroll to settle, then position
    setTimeout(function () {
      // Overlay
      var overlay = document.createElement('div');
      overlay.id = 'delibera-tour-overlay';
      document.body.appendChild(overlay);

      // Highlight target above overlay
      var computedPos = window.getComputedStyle(target).position;
      if (computedPos === 'static') {
        target.style.position = 'relative';
      }
      target.style.zIndex = '10000';
      target.style.boxShadow = '0 0 0 4px rgba(249,115,22,0.4), 0 0 24px rgba(249,115,22,0.2)';
      target.setAttribute('data-delibera-tour-target', '1');

      // Tooltip
      var tooltip = document.createElement('div');
      tooltip.id = 'delibera-tour-tooltip';
      tooltip.innerHTML =
        '<div class="tour-arrow"></div>' +
        '<div class="tour-text">' + step.text + '</div>' +
        '<div class="tour-progress">Passo ' + (stepIndex + 1) + ' de ' + TOTAL_STEPS + '</div>';
      document.body.appendChild(tooltip);

      positionTooltip(tooltip, target, step.position);

      // Skip button
      var skip = document.createElement('button');
      skip.id = 'delibera-tour-skip';
      skip.textContent = 'Pular tour';
      skip.addEventListener('click', function (e) {
        e.stopPropagation();
        clearTour();
        showRestartButton();
      });
      document.body.appendChild(skip);

      // Clicking target advances tour
      target.addEventListener('click', function handler(e) {
        target.removeEventListener('click', handler);
        if (step.action) {
          e.preventDefault();
          e.stopPropagation();
          step.action();
        } else {
          // Let the natural link/action work, but advance the step
          setStep(stepIndex + 1);
        }
      }, { once: false });

      // Reposition on scroll/resize
      function reposition() {
        var tt = document.getElementById('delibera-tour-tooltip');
        var tgt = document.querySelector('[data-delibera-tour-target]');
        if (tt && tgt) positionTooltip(tt, tgt, step.position);
      }
      window.addEventListener('scroll', reposition);
      window.addEventListener('resize', reposition);
    }, 400);
  }

  // ── Completion Card ─────────────────────────────────────────────────────────

  function showComplete() {
    injectStyles();

    var wrap = document.createElement('div');
    wrap.id = 'delibera-tour-complete';
    wrap.innerHTML =
      '<div class="card">' +
      '  <h2>Tour completo!</h2>' +
      '  <p>Voce conheceu o fluxo completo do Delibera &mdash; da criacao a analise.</p>' +
      '  <div class="btns">' +
      '    <a href="planos.html" class="btn-tour btn-primary-tour">Ver planos</a>' +
      '    <button class="btn-tour btn-ghost-tour" id="delibera-tour-reset-btn">Recomecar tour</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(wrap);

    document.getElementById('delibera-tour-reset-btn').addEventListener('click', function () {
      resetTour();
    });

    // Mark done
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_DONE, '1');
  }

  // ── Restart Button ──────────────────────────────────────────────────────────

  function showRestartButton() {
    if (document.getElementById('delibera-tour-restart')) return;
    injectStyles();

    var btn = document.createElement('button');
    btn.id = 'delibera-tour-restart';
    btn.innerHTML =
      '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/></svg>' +
      'Reiniciar tour';
    btn.addEventListener('click', function () {
      resetTour();
    });
    document.body.appendChild(btn);
  }

  // ── Init ────────────────────────────────────────────────────────────────────

  function init() {
    var step = getStep();
    var page = getCurrentPage();

    // Tour not active
    if (step < 0) {
      // Show restart button if tour was previously completed/skipped
      if (isTourDone()) {
        showRestartButton();
      }
      return;
    }

    // Tour active — check if we're on the right page
    if (step >= TOUR_STEPS.length) {
      clearTour();
      showRestartButton();
      return;
    }

    var expected = TOUR_STEPS[step];
    if (page !== expected.page) {
      // Not on the expected page — don't interfere
      return;
    }

    // Show the current step
    requestAnimationFrame(function () {
      setTimeout(function () {
        showStep(step);
      }, 300);
    });
  }

  // ── Boot ────────────────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
