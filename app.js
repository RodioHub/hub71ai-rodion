(function () {
  'use strict';

  const defaults = Object.freeze({ employees: 5, price: 1200000, years: 8, allowance: 60000, lti: 40000, down: 20, rate: 6, maintenance: 12000, purchase: 30000, transfer: 24000 });
  const bounds = { employees: [1, 100, true], price: [100000, 10000000], years: [1, 15, true], allowance: [0, 2000000], lti: [0, 2000000], down: [0, 100], rate: [0, 25], maintenance: [0, 500000], purchase: [0, 1000000], transfer: [0, 1000000] };

  function validateScenario(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('A programme scenario is required.');
    const result = {};
    for (const [key, [min, max, integer]] of Object.entries(bounds)) {
      const value = input[key];
      if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) throw new RangeError('Invalid value for ' + key + '.');
      result[key] = value;
    }
    return result;
  }

  function calculate(input) {
    const s = validateScenario(input);
    const loan = s.price * (1 - s.down / 100);
    const months = s.years * 12;
    const monthlyRate = s.rate / 1200;
    const monthlyPayment = loan === 0 ? 0 : monthlyRate === 0 ? loan / months : loan * monthlyRate / (-Math.expm1(-months * Math.log1p(monthlyRate)));
    const upfrontPerHome = s.price * s.down / 100 + s.purchase;
    const ongoingPerHome = monthlyPayment * 12 + s.maintenance;
    const totalPerHome = upfrontPerHome + ongoingPerHome * s.years + s.transfer;
    const total = totalPerHome * s.employees;
    const averageAnnual = total / s.years;
    const existingAnnual = (s.allowance + s.lti) * s.employees;
    return { upfront: upfrontPerHome * s.employees, ongoingAnnual: ongoingPerHome * s.employees, transfer: s.transfer * s.employees, total, averageAnnual, perEmployeeAnnual: totalPerHome / s.years, existingAnnual, annualGap: averageAnnual - existingAnnual, coverage: averageAnnual > 0 ? Math.min(100, existingAnnual / averageAnnual * 100) : 100, monthlyPaymentPerHome: monthlyPayment };
  }

  globalThis.RootsMath = Object.freeze({ defaults, validateScenario, calculate });
  if (typeof document === 'undefined') return;

  const $ = id => document.getElementById(id);
  const formatter = new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 });
  const number = value => formatter.format(value);
  const money = value => 'AED ' + number(value);
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const storageKey = 'roots.pilot-request.v1';
  let scenario = { ...defaults };
  let results = calculate(scenario);
  let attached = false;
  let savedRequest = null;
  let toastTimer;

  const documents = {
    policy: { title: 'Programme policy', purpose: 'Define who can participate, how the programme is funded, and how decisions are approved.', terms: ['Employee eligibility and whether participation is optional.', 'Property budget, programme duration, and permitted locations.', 'Which housing allowances or long-term rewards fund the programme.', 'Approval authority, exceptions, and ongoing programme administration.', 'Treatment of changes to employment, family needs, and the programme itself.'], parties: 'Employer, HR, finance, and legal advisers.' },
    participation: { title: 'Employee participation agreement', purpose: 'Record the promised reward and the conditions under which the employee can earn it.', terms: ['Employment term and any milestones or vesting provisions.', 'The distinction between contractual rights and registered property ownership.', 'Employer and employee payment obligations, if any.', 'Employee choice, disclosures, and acknowledgement of programme conditions.', 'Treatment of early exit, disputes, and changes to the agreed offer.'], parties: 'Employer, employee, and legal advisers.' },
    occupancy: { title: 'Occupancy & improvements agreement', purpose: 'Make living in the home workable from the first day, before ownership transfers.', terms: ['Occupancy rights and responsibilities of the resident.', 'Maintenance, service charges, utilities, and insurance responsibilities.', 'Rules for alterations and approval of renovations.', 'Treatment of employee-funded improvements on transfer or early exit.', 'Move-out arrangements, inspection, and any transition period.'], parties: 'Titleholder, employee, property manager, and legal advisers.' },
    exit: { title: 'Early exit framework', purpose: 'Set predictable rules for departure without treating every reason for leaving as the same event.', terms: ['Separate rules for resignation, redundancy, and employer closure.', 'Any earned economic rights and how their value is calculated.', 'Buyout or continuation options, where agreed.', 'Occupancy transition and treatment of personal improvements.', 'Outstanding financing, obligations to the employee, and reuse of the property.'], parties: 'Employer, employee, lender where relevant, and legal advisers.' },
    transfer: { title: 'Ownership transfer framework', purpose: 'Define the steps and conditions for delivering the property at successful completion.', terms: ['Confirmation that employment and programme conditions are satisfied.', 'Debt repayment, release of security, and lender consent where necessary.', 'Applicable title registration and eligibility requirements.', 'Allocation of transfer costs and final service-charge adjustments.', 'Transfer documents, timing, handover, and dispute resolution.'], parties: 'Titleholder, employee, lender, relevant registration authority, and legal advisers.' }
  };

  function toast(message) {
    $('toast').textContent = message;
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4500);
  }

  function applyScenario(next) {
    scenario = validateScenario(next);
    results = calculate(scenario);
    for (const key of Object.keys(defaults)) {
      $(key).value = scenario[key];
      $(key).removeAttribute('aria-invalid');
      if ($(key + '-range')) $(key + '-range').value = scenario[key];
    }
    $('calculator-error').hidden = true;
    $('preview-programme').disabled = false;
    renderResults();
    return { scenario: { ...scenario }, estimate: { ...results } };
  }

  function renderResults() {
    $('scenario-label').textContent = scenario.employees + (scenario.employees === 1 ? ' person' : ' people') + ' · ' + scenario.years + (scenario.years === 1 ? ' year' : ' years');
    $('annual-cost').textContent = number(results.averageAnnual);
    $('calculator-results').classList.toggle('large-value', number(results.averageAnnual).length > 10);
    $('per-person').textContent = money(results.perEmployeeAnnual) + ' per employee / year';
    $('upfront-cost').textContent = money(results.upfront);
    const extraNeeded = results.annualGap >= 0;
    $('gap-label').textContent = extraNeeded ? 'Additional annual budget required' : 'Annual budget below current package';
    $('budget-gap').textContent = money(Math.abs(results.annualGap));
    $('existing-budget').textContent = money(results.existingAnnual);
    $('legend-gap').textContent = money(Math.abs(results.annualGap));
    $('funding-gap-text').textContent = extraNeeded ? 'Additional budget' : 'Budget remaining';
    const currentWidth = extraNeeded ? results.coverage : results.averageAnnual / results.existingAnnual * 100;
    $('funding-current').style.width = currentWidth + '%';
    $('funding-extra').style.width = (100 - currentWidth) + '%';
    $('coverage-label').textContent = extraNeeded ? Math.round(results.coverage) + '% covered' : 'Covered by current package';
    $('funding-bar').setAttribute('aria-label', extraNeeded ? 'Current package covers ' + Math.round(results.coverage) + ' percent of the estimated average annual cash cost.' : 'The estimated average annual cash cost is below the current package by ' + money(-results.annualGap) + '.');
    $('breakdown-upfront').textContent = money(results.upfront);
    $('breakdown-ongoing').textContent = money(results.ongoingAnnual);
    $('breakdown-transfer').textContent = money(results.transfer);
    $('breakdown-total').textContent = money(results.total);
    if (!extraNeeded) $('existing-budget').parentElement.firstChild.nextSibling.textContent = ' Programme cost ';
    else $('existing-budget').parentElement.firstChild.nextSibling.textContent = ' Current package ';
    if (!extraNeeded) $('existing-budget').textContent = money(results.averageAnnual);
    if (attached) updateAttachment();
  }

  function readInputs() {
    const candidate = {};
    let valid = true;
    for (const key of Object.keys(defaults)) {
      const field = $(key);
      const value = field.valueAsNumber;
      const [min, max, integer] = bounds[key];
      const fieldValid = Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value));
      field.setAttribute('aria-invalid', String(!fieldValid));
      valid = valid && fieldValid;
      candidate[key] = value;
      const range = $(key + '-range');
      if (range && fieldValid) range.value = value;
    }
    $('calculator-error').hidden = valid;
    $('preview-programme').disabled = !valid;
    if (!valid) return;
    scenario = validateScenario(candidate);
    results = calculate(scenario);
    renderResults();
  }

  function openDialog(id) {
    const dialog = $(id);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
  }

  function closeDialog(id) {
    $(id).close();
    document.body.classList.remove('modal-open');
  }

  function programmeHTML(s, r) {
    const metric = (label, value) => '<div><p>' + label + '</p><strong>' + escape(value) + '</strong></div>';
    return '<div class="programme-title-row"><h2 id="programme-title">Your Housing LTI<br>programme</h2><span class="draft-status">Draft for discussion</span></div>' +
      '<p class="programme-offer">Employees move into programme housing at the start. Ownership is intended to transfer after the agreed term, subject to the programme conditions.</p>' +
      '<div class="programme-summary-grid">' + metric('Employees', number(s.employees)) + metric('Home budget / employee', money(s.price)) + metric('Programme term', s.years + (s.years === 1 ? ' year' : ' years')) + metric('Upfront funding', money(r.upfront)) + metric('Average annual cash cost', money(r.averageAnnual)) + metric('Total programme cash cost', money(r.total)) + '</div>' +
      '<div class="programme-term-line"><span>Move in at the start</span><span>' + escape(s.years) + '-year programme</span><span>Transfer on completion</span></div>' +
      '<h3>Programme decisions to agree</h3><ul class="programme-terms"><li>Early departure terms <span>To be agreed</span></li><li>Redundancy protection <span>To be agreed</span></li><li>Employer closure protections <span>To be agreed</span></li><li>Titleholder and financing structure <span>To be agreed</span></li></ul>' +
      '<h3>Planning assumptions</h3><p class="programme-fine-print">' + escape(s.down) + '% initial contribution · ' + escape(s.rate) + '% illustrative annual interest · ' + money(s.maintenance) + ' running costs per home / year · ' + money(s.purchase) + ' purchase costs per home · ' + money(s.transfer) + ' transfer costs per home.</p>' +
      '<p class="programme-fine-print">Loan term equals programme term. Monthly repayments use a fixed illustrative rate. Average annual cash cost includes upfront, ongoing, and transfer costs; it is not a payment schedule. The current package is ' + money(r.existingAnnual) + ' per year, with ' + money(Math.abs(r.annualGap)) + (r.annualGap >= 0 ? ' additional annual funding required.' : ' annual budget remaining.') + '</p>' +
      '<p class="programme-fine-print">Planning estimate, not a financing offer or executable agreement. No employer residual property value is included after successful transfer. Final arrangements are subject to partner assessment and agreement.</p>';
  }

  function preview(s = scenario, r = results) {
    $('programme-content').innerHTML = programmeHTML(s, r);
    $('programme-dialog').dataset.saved = s === scenario ? 'false' : 'true';
    openDialog('programme-dialog');
  }

  function updateAttachment() {
    $('attached-programme').hidden = !attached;
    $('pilot-employees').readOnly = attached;
    if (attached) {
      $('attached-summary').textContent = scenario.employees + ' employees · ' + scenario.years + ' years · ' + money(scenario.price) + ' per home';
      $('pilot-employees').value = scenario.employees;
    }
  }

  async function download(request) {
    const button = $('download-request');
    button.disabled = true;
    button.textContent = 'Preparing workbook…';
    try {
      await globalThis.RootsExport.download(request);
      toast('Programme workbook downloaded. Ready for management review.');
    } catch (error) {
      toast('The workbook could not be created. Please try downloading again.');
      console.error('Workbook export failed:', error);
    } finally {
      button.disabled = false;
      button.textContent = 'Download programme (.xlsx)';
    }
  }

  function showRequest(request) {
    savedRequest = request;
    $('pilot-form').hidden = true;
    $('pilot-success').hidden = false;
    const rows = [['Company', request.company], ['Employees', request.employees], ['Target launch', request.targetLaunch], ['Reference', request.reference]];
    $('saved-request-summary').innerHTML = rows.map(([label, value]) => '<div><dt>' + escape(label) + '</dt><dd>' + escape(value) + '</dd></div>').join('');
    $('view-saved-programme').hidden = !request.programme;
  }

  function parseSaved(raw) {
    const request = JSON.parse(raw);
    if (!request || request.version !== 1 || typeof request.company !== 'string' || typeof request.reference !== 'string' || typeof request.employees !== 'number' || typeof request.targetLaunch !== 'string') return null;
    if (request.programme) { validateScenario(request.programme.scenario); request.programme.estimate = calculate(request.programme.scenario); }
    return request;
  }

  function localDate(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  $('calculator-form').addEventListener('submit', event => event.preventDefault());
  $('calculator-form').addEventListener('input', event => {
    const id = event.target.id;
    if (id.endsWith('-range')) $(id.slice(0, -6)).value = event.target.value;
    readInputs();
  });
  $('reset-calculator').addEventListener('click', () => { applyScenario({ ...defaults }); toast('Planning assumptions reset.'); });
  $('preview-programme').addEventListener('click', () => { attached = true; updateAttachment(); preview(); });
  function preparePrint() {
    const root = $('programme-print');
    document.body.classList.add('programme-printing');
    const content = $('programme-content').cloneNode(true);
    content.removeAttribute('id');
    content.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    root.replaceChildren();
    const header = document.createElement('div');
    header.className = 'sheet-head';
    header.innerHTML = '<span class="eyebrow">ROOTS / HOUSING LTI PROGRAMME</span><span class="print-label">Proposal for discussion</span>';
    root.append(header, content);
  }
  $('print-programme').addEventListener('click', () => {
    preparePrint();
    window.print();
  });
  window.addEventListener('beforeprint', () => {
    if ($('programme-dialog').open) preparePrint();
    else document.body.classList.remove('programme-printing');
  });
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('programme-printing');
    $('programme-print').replaceChildren();
  });
  $('contact-us').addEventListener('click', () => openDialog('contact-dialog'));
  $('edit-programme').addEventListener('click', () => { closeDialog('programme-dialog'); $('calculator').scrollIntoView(); $('employees').focus({ preventScroll: true }); });
  $('request-this-programme').addEventListener('click', () => {
    if ($('programme-dialog').dataset.saved === 'true' && savedRequest?.programme) applyScenario(savedRequest.programme.scenario);
    attached = true; updateAttachment();
    closeDialog('programme-dialog');
    $('pilot-form').hidden = false; $('pilot-success').hidden = true;
    $('pilot').scrollIntoView(); $('company').focus({ preventScroll: true });
  });
  $('edit-attached').addEventListener('click', () => { $('calculator').scrollIntoView(); $('employees').focus({ preventScroll: true }); });

  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeDialog(button.dataset.close)));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  document.querySelectorAll('[data-document]').forEach(button => button.addEventListener('click', () => {
    const doc = documents[button.dataset.document];
    $('document-content').innerHTML = '<h2 id="document-title">' + escape(doc.title) + '</h2><h3>Purpose</h3><p>' + escape(doc.purpose) + '</p><h3>Key terms to define</h3><ul>' + doc.terms.map(term => '<li>' + escape(term) + '</li>').join('') + '</ul><h3>Parties involved</h3><p>' + escape(doc.parties) + '</p>';
    openDialog('document-dialog');
  }));

  $('privacy-notice').addEventListener('click', () => {
    $('document-content').innerHTML = '<h2 id="document-title">Data & privacy</h2><h3>Saved on your device</h3><p>This static prototype saves only your latest pilot request in browser local storage when you choose Save pilot request. This may include your company, name, email, target date, notes, and programme assumptions.</p><h3>No remote submission</h3><p>The site does not send your request to Roots, a bank, a developer, or another partner. Downloading a request creates a file on your device. Printing uses your browser.</p><h3>Your controls</h3><p>You can view, download, or delete the saved request from the pilot section. Your browser may also remove it when you clear site data. It is not synced between devices. All fonts and imagery are served with this site; there are no analytics or tracking scripts.</p>';
    openDialog('document-dialog');
  });

  const today = new Date();
  const target = new Date(today); target.setDate(target.getDate() + 90);
  $('launch').min = localDate(today); $('launch').value = localDate(target);
  $('pilot-form').addEventListener('submit', event => {
    event.preventDefault();
    $('form-error').hidden = true;
    if (!$('pilot-form').reportValidity()) return;
    const company = $('company').value.trim(), contact = $('contact').value.trim();
    if (!company || !contact) { $('form-error').textContent = 'Enter a company name and your name.'; $('form-error').hidden = false; return; }
    const request = { version: 1, reference: 'R-' + Date.now().toString(36).toUpperCase(), createdAt: new Date().toISOString(), company, contact, email: $('email').value.trim(), employees: $('pilot-employees').valueAsNumber, targetLaunch: $('launch').value, notes: $('notes').value.trim(), programme: attached ? { scenario: { ...scenario }, estimate: { ...results } } : null, storage: 'Browser-local only. Not submitted to an external service.' };
    try { localStorage.setItem(storageKey, JSON.stringify(request)); showRequest(request); toast('Your request is saved on this device.'); }
    catch { $('form-error').textContent = 'Your browser blocked local storage. Allow site storage or try a different browser to save your request. Your inputs are still here.'; $('form-error').hidden = false; }
  });
  $('download-request').addEventListener('click', () => { if (savedRequest) download(savedRequest); });
  $('view-saved-programme').addEventListener('click', () => { if (savedRequest?.programme) preview(savedRequest.programme.scenario, savedRequest.programme.estimate); });
  $('new-request').addEventListener('click', () => { $('pilot-success').hidden = true; $('pilot-form').hidden = false; $('pilot-form').reset(); $('launch').value = localDate(target); updateAttachment(); $('request-recovery').hidden = !savedRequest; $('company').focus(); });
  $('view-saved-request').addEventListener('click', () => { if (savedRequest) showRequest(savedRequest); });
  $('delete-request').addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); savedRequest = null; $('pilot-success').hidden = true; $('pilot-form').hidden = false; $('request-recovery').hidden = true; $('pilot-form').reset(); $('launch').value = localDate(target); updateAttachment(); toast('Saved request deleted from this device.'); }
    catch { toast('Your browser could not delete the saved request.'); }
  });
  try { const raw = localStorage.getItem(storageKey); if (raw) { savedRequest = parseSaved(raw); $('request-recovery').hidden = !savedRequest; } } catch { /* The form remains usable; a blocked write is reported at save time. */ }

  const menu = document.querySelector('.menu-toggle');
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    $('mobile-nav').hidden = !expanded;
  });
  $('mobile-nav').querySelectorAll('a').forEach(link => link.addEventListener('click', () => { $('mobile-nav').hidden = true; menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { $('mobile-nav').hidden = true; menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); } });

  const registry = document.modelContext;
  if (registry?.registerTool) {
    const lifecycle = new AbortController();
    const properties = Object.fromEntries(Object.entries(bounds).map(([key, [min, max, integer]]) => [key, { type: integer ? 'integer' : 'number', minimum: min, maximum: max }]));
    const definitions = [
      { name: 'read_housing_estimate', title: 'Read the current Housing LTI estimate', description: 'Read the current visible planning scenario and its cost estimate. Does not change or save data.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute(input) { if (!input || typeof input !== 'object' || Object.keys(input).length) throw new TypeError('No parameters are accepted.'); return { scenario: { ...scenario }, estimate: { ...results } }; } },
      { name: 'configure_housing_programme', title: 'Configure the Housing LTI calculator', description: 'Update the visible planning calculator with supplied values. Does not save a pilot request or submit anything externally.', inputSchema: { type: 'object', properties, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) { if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !(key in bounds))) throw new TypeError('Supply supported calculator fields only.'); return applyScenario({ ...scenario, ...input }); } }
    ];
    definitions.forEach(tool => { try { Promise.resolve(registry.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Optional browser capability. */ } });
    window.addEventListener('pagehide', event => { if (!event.persisted) lifecycle.abort(); }, { once: true });
  }
  renderResults();
})();
