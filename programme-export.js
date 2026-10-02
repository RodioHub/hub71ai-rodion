(function () {
  'use strict';
  // Authored with @oai/artifact-tool. Kept inline for offline / file:// use.
  const template = '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';
  const ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const xmlns = 'http://www.w3.org/XML/1998/namespace';
  const keys = ['employees','price','years','allowance','lti','down','rate','maintenance','purchase','transfer'];
  const parse = text => {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error('Invalid workbook XML.');
    return doc;
  };
  const stringify = doc => new XMLSerializer().serializeToString(doc);
  const nodes = (doc, name) => Array.from(doc.getElementsByTagNameNS(ns, name));
  const create = (doc, name) => doc.createElementNS(ns, (doc.documentElement.prefix ? doc.documentElement.prefix + ':' : '') + name);
  function fill(doc, values, caches = {}) {
    const cells = new Map(nodes(doc, 'c').map(cell => [cell.getAttribute('r'), cell]));
    for (const [address, value] of Object.entries(values)) {
      const cell = cells.get(address);
      if (!cell) throw new Error('Missing workbook input: ' + address);
      cell.replaceChildren();
      cell.removeAttribute('t');
      if (value === null || value === undefined || value === '') continue;
      if (typeof value === 'number') {
        if (!Number.isFinite(value)) throw new Error('Invalid numeric input.');
        const v = create(doc, 'v'); v.textContent = String(value); cell.append(v);
      } else {
        // Literal inline strings prevent formula injection from names or notes.
        cell.setAttribute('t', 'inlineStr');
        const is = create(doc, 'is'), t = create(doc, 't');
        t.setAttributeNS(xmlns, 'xml:space', 'preserve');
        t.textContent = String(value).slice(0, 32767); is.append(t); cell.append(is);
      }
    }
    for (const [address, value] of Object.entries(caches)) {
      const cell = cells.get(address);
      if (!cell || !Array.from(cell.children).some(child => child.localName === 'f')) throw new Error('Missing workbook formula: ' + address);
      Array.from(cell.children).filter(child => child.localName === 'v' || child.localName === 'is').forEach(child => child.remove());
      if (value === '') cell.setAttribute('t', 'str'); else cell.removeAttribute('t');
      const v = create(doc, 'v'); v.textContent = value === '' ? '' : String(value); cell.append(v);
    }
  }
  function pageLayout(doc) {
    const root = doc.documentElement;
    const before = ['headerFooter','rowBreaks','colBreaks','customProperties','cellWatches','ignoredErrors','smartTags','drawing','legacyDrawing','legacyDrawingHF','picture','oleObjects','controls','webPublishItems','tableParts','extLst'];
    const insert = (name, attributes) => {
      nodes(doc, name).forEach(node => node.remove());
      const node = create(doc, name);
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
      root.insertBefore(node, Array.from(root.children).find(child => before.includes(child.localName)) || null);
    };
    insert('printOptions', { horizontalCentered: 1, gridLines: 0, headings: 0 });
    insert('pageMargins', { left:0.63,right:0.63,top:0.63,bottom:0.63,header:0.2,footer:0.2 });
    insert('pageSetup', { paperSize:9,orientation:'portrait',fitToWidth:1,fitToHeight:0 });
    let properties = nodes(doc, 'sheetPr')[0];
    if (!properties) { properties = create(doc, 'sheetPr'); root.insertBefore(properties, root.firstChild); }
    let setup = nodes(properties, 'pageSetUpPr')[0];
    if (!setup) { setup=create(doc,'pageSetUpPr'); properties.append(setup); }
    setup.setAttribute('fitToPage','1');
  }
  function dateSerial(text) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text || ''));
    return match ? Date.UTC(Number(match[1]), Number(match[2])-1, Number(match[3])) / 86400000 + 25569 : null;
  }
  async function workbook(request) {
    if (!request || !globalThis.JSZip || !globalThis.RootsMath) throw new Error('Workbook export is unavailable.');
    const zip = await globalThis.JSZip.loadAsync(template, { base64:true });
    const approval = parse(await zip.file('xl/worksheets/sheet1.xml').async('string'));
    const budget = parse(await zip.file('xl/worksheets/sheet2.xml').async('string'));
    const s = request.programme ? globalThis.RootsMath.validateScenario(request.programme.scenario) : null;
    const r = s ? globalThis.RootsMath.calculate(s) : null;
    const inputs = {}, budgetResults = {}, approvalResults = {};
    for (const [index, key] of keys.entries()) inputs['C' + (7+index)] = s ? (key==='down'||key==='rate' ? s[key]/100 : s[key]) : null;
    const calculationRows = [20,21,22,23,24,25,26,27,28,29,30,31,34,35,36,37,38,39,40];
    for (const row of calculationRows) budgetResults['C'+row] = '';
    if (s) {
      const down=s.price*s.down/100, loan=s.price-down, monthly=r.monthlyPaymentPerHome;
      const values = [down,loan,s.years*12,s.rate/1200,monthly,monthly*12,s.maintenance,monthly*12+s.maintenance,down+s.purchase,s.transfer,r.total/s.employees,r.perEmployeeAnnual,r.upfront,r.ongoingAnnual,r.transfer,r.total,r.averageAnnual,r.existingAnnual,r.annualGap];
      calculationRows.forEach((row,index) => { budgetResults['C'+row]=values[index]; });
    }
    for (const [row,value] of [[17,s?.years],[18,s?.price],[21,r?.upfront],[22,r?.ongoingAnnual],[23,r?.transfer],[24,r?.total],[25,r?.averageAnnual],[26,r?.annualGap]]) approvalResults['D'+row] = value ?? '';
    const inputDetails = {
      D6: s ? 'Draft — pending approval' : 'Draft — financial scenario not attached',
      D7: request.company || '', D8:request.contact || '',D9:request.email || '',
      D10: request.employees, D11:dateSerial(request.targetLaunch),D12:request.reference || '',
      B45: request.notes || 'No additional notes.'
    };
    if (!s) inputDetails.B28='No financial scenario was attached to this saved request. Add a calculator scenario to generate a budget, or fill the blue Budget inputs before review. Financial outputs are intentionally blank.';
    fill(approval,inputDetails,approvalResults); fill(budget,inputs,budgetResults);
    // Size the merged notes area to retain long, multiline request notes.
    const notes = String(inputDetails.B45);
    const lines = notes.split('\n').reduce((count,line) => count+Math.max(1,Math.ceil(line.length/110)),0);
    const rowHeight = Math.max(21, Math.ceil((lines*15+14)/3));
    for (const row of nodes(approval,'row')) if ([45,46,47].includes(Number(row.getAttribute('r')))) { row.setAttribute('ht',String(rowHeight));row.setAttribute('customHeight','1'); }
    pageLayout(approval); pageLayout(budget);
    zip.file('xl/worksheets/sheet1.xml',stringify(approval));
    zip.file('xl/worksheets/sheet2.xml',stringify(budget));
    const book=parse(await zip.file('xl/workbook.xml').async('string'));
    let calc=nodes(book,'calcPr')[0];
    if(!calc){calc=create(book,'calcPr');book.documentElement.append(calc);}
    calc.setAttribute('calcMode','auto');calc.setAttribute('fullCalcOnLoad','1');calc.setAttribute('forceFullCalc','1');
    let names=nodes(book,'definedNames')[0];
    if(!names){names=create(book,'definedNames');book.documentElement.insertBefore(names,calc);}
    nodes(names,'definedName').filter(node=>node.getAttribute('name')==='_xlnm.Print_Area').forEach(node=>node.remove());
    for(const [id,name,area] of [[0,'Programme approval','$B$2:$G$49'],[1,'Budget','$B$2:$E$48']]){
      const node=create(book,'definedName');node.setAttribute('name','_xlnm.Print_Area');node.setAttribute('localSheetId',String(id));node.textContent="'"+name+"'!"+area;names.append(node);
    }
    zip.file('xl/workbook.xml',stringify(book));
    // Remove a stale calculation chain if the template contains one.
    if(zip.file('xl/calcChain.xml')){
      zip.remove('xl/calcChain.xml');
      for(const path of ['[Content_Types].xml','xl/_rels/workbook.xml.rels']){
        const doc=parse(await zip.file(path).async('string'));
        Array.from(doc.documentElement.children).filter(node=>(node.getAttribute('PartName')||'').endsWith('/calcChain.xml')||(node.getAttribute('Type')||'').endsWith('/calcChain')).forEach(node=>node.remove());
        zip.file(path,stringify(doc));
      }
    }
    return zip.generateAsync({type:'blob',compression:'DEFLATE',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  async function download(request) {
    const blob = await workbook(request);
    const url = URL.createObjectURL(blob), link=document.createElement('a');
    link.href=url;
    const reference=String(request.reference||'proposal').replace(/[^A-Za-z0-9_-]/g,'');
    link.download='roots-housing-lti-'+reference+'.xlsx';
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  globalThis.RootsExport=Object.freeze({workbook,download});
})();
