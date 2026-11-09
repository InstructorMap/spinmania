/* Café Zodíaco — módulo comercial inicial. */
(() => {
  if (window.__cafeBusinessLoaded) return;
  window.__cafeBusinessLoaded = true;
  const KEY = 'cz_business_cart_v1';
  const catalog = [
    {id:'cafe',name:'Cafecito de las estrellas',category:'Cafetería',detail:'Un clásico para acompañar tu momento',icon:'☕'},
    {id:'medialuna',name:'Medialuna lunar',category:'Panadería',detail:'Dorada, suave y recién hecha',icon:'🥐'},
    {id:'dulce',name:'Dulce constelación',category:'Pastelería',detail:'Una propuesta dulce para compartir',icon:'🍰'},
    {id:'frappe',name:'Frappé galáctico',category:'Bebidas frías',detail:'Fresco y cremoso',icon:'🧋'}
  ];
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) {}
  const style = document.createElement('style');
  style.textContent = [
    '#business .biz-intro{color:#c8c5dc;font-size:12px;line-height:1.6;margin:0 0 14px}',
    '#business .biz-tabs{display:flex;gap:7px;overflow:auto;padding:2px 0 10px}',
    '#business .biz-chip{border:1px solid #71668f;border-radius:20px;padding:8px 12px;background:#1a1c3b;color:#d9d4e9;font-size:10px;white-space:nowrap}',
    '#business .biz-chip.active{background:#f3d28b;color:#302348;border-color:#f3d28b;font-weight:700}',
    '#business .biz-products{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '#business .biz-product{border:1px solid #6c629355;border-radius:17px;background:#1a1d3b;overflow:hidden}',
    '#business .biz-product-art{height:95px;display:grid;place-items:center;font-size:43px;background:radial-gradient(circle at 50% 30%,#594875,#202044 72%)}',
    '#business .biz-product-body{padding:10px}',
    '#business .biz-product-body b{display:block;color:#f3d28b;font:500 15px Georgia,serif;line-height:1.2}',
    '#business .biz-product-body p{min-height:30px;margin:6px 0;color:#bcbad4;font-size:10px;line-height:1.4}',
    '#business .biz-price{display:block;color:#9be3d2;font-size:9px;margin:7px 0}',
    '#business .biz-add{width:100%;border:1px solid #8b7da8;border-radius:10px;padding:9px;background:#29264d;color:#fff0d2;font-size:10px;font-weight:700}',
    '#business .biz-cart-line{display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid #ffffff17}',
    '#business .biz-cart-name{flex:1;min-width:0;color:#f6e9d2;font-size:11px}',
    '#business .biz-qty{display:flex;align-items:center;gap:8px}',
    '#business .biz-qty button{width:27px;height:27px;border:1px solid #8879a5;border-radius:50%;background:#29264d;color:#f3d28b;font-size:16px}',
    '#business .biz-qty span{min-width:12px;text-align:center;font-size:11px}',
    '#business .biz-field{display:block;margin:11px 0;color:#c9c5db;font-size:10px}',
    '#business .biz-field input,#business .biz-field textarea{display:block;width:100%;margin-top:6px;border:1px solid #71668f;border-radius:11px;background:#11142f;color:#fff4df;padding:12px;font:12px system-ui}',
    '#business .biz-field textarea{min-height:68px;resize:vertical}',
    '#business .biz-radio{display:flex;gap:8px;margin:8px 0}',
    '#business .biz-radio button{flex:1;border:1px solid #71668f;border-radius:11px;background:#1b1e3c;color:#d8d3e8;padding:11px 6px;font-size:10px}',
    '#business .biz-radio button.active{border-color:#f3d28b;background:#3b315d;color:#f3d28b}',
    '#business .biz-note{border:1px solid #7d729755;background:#141832;border-radius:13px;padding:11px;color:#bdbbd4;font-size:10px;line-height:1.5}',
    '#business .biz-hidden{display:none!important}',
    '#business .biz-empty{text-align:center;padding:20px 8px;color:#bdbbd4;font-size:11px}',
    '#business .biz-total{display:flex;justify-content:space-between;align-items:center;margin-top:12px;color:#f3d28b;font-size:12px;font-weight:700}',
    '#business .biz-error{color:#ffb8b8;font-size:10px;min-height:14px;margin-top:8px}'
  ].join('');
  document.head.appendChild(style);
  const nav = document.querySelector('.bottom-nav');
  if (nav && !nav.querySelector('[data-view="business"]')) {
    const button = document.createElement('button');
    button.dataset.view = 'business'; button.innerHTML = '<span>🛍️</span>PEDIDOS';
    button.addEventListener('click', () => window.go('business')); nav.appendChild(button);
  }
  const section = document.createElement('section');
  section.className = 'view'; section.id = 'business';
  section.innerHTML = '<div class="section"><div class="section-head"><h2>Pedí tu momento</h2><small>LA CARTA</small></div><p class="biz-intro">Elegí lo que te gustaría disfrutar. Esta primera etapa permite armar el pedido y compartirlo para confirmar disponibilidad, precio y entrega.</p><div class="biz-tabs" id="bizTabs"></div><div class="biz-products" id="bizProducts"></div></div><div class="section"><div class="section-head"><h2>Tu pedido</h2><small id="bizCartCount">0 PRODUCTOS</small></div><div class="card"><div id="bizCart"></div><div class="biz-total"><span>Importe</span><span>A confirmar</span></div></div></div><div class="section"><div class="section-head"><h2>¿Cómo lo recibís?</h2><small>DATOS DEL PEDIDO</small></div><div class="card"><label class="biz-field">Tu nombre<input id="bizName" autocomplete="name" maxlength="70" placeholder="¿Cómo te llamás?"></label><label class="biz-field">Teléfono de contacto<input id="bizPhone" autocomplete="tel" inputmode="tel" maxlength="30" placeholder="Tu teléfono"></label><div class="biz-radio"><button type="button" class="active" data-mode="pickup">Retiro / al paso</button><button type="button" data-mode="delivery">Delivery</button></div><label class="biz-field biz-hidden" id="bizAddressWrap">Dirección de entrega<input id="bizAddress" autocomplete="street-address" maxlength="140" placeholder="Calle, número, barrio"></label><label class="biz-field">Indicaciones (opcional)<textarea id="bizNotes" maxlength="300" placeholder="Aclaraciones, preferencias o referencias..."></textarea></label><div class="biz-note">Todavía no se cobran pedidos desde la aplicación. Al compartirlo, el café deberá confirmar disponibilidad, precio final, costo de envío y horario antes de aceptar la compra.</div><div class="biz-error" id="bizError"></div><button class="primary" id="bizSend">COMPARTIR MI PEDIDO ↗</button></div></div><div class="legal">PEDIDO SUJETO A CONFIRMACIÓN DEL CAFÉ · SIN PAGOS INTEGRADOS EN ESTA ETAPA</div>';
  document.querySelector('main.app').insertBefore(section, document.querySelector('.bottom-nav'));
  let category = 'Todos', mode = 'pickup';
  const $ = id => document.getElementById(id);
  const categories = ['Todos'].concat([...new Set(catalog.map(p => p.category))]);
  function persist(){localStorage.setItem(KEY,JSON.stringify(cart))}
  function count(){return Object.values(cart).reduce((n,q)=>n+Number(q||0),0)}
  function renderTabs(){
    $('bizTabs').innerHTML='';
    categories.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='biz-chip'+(category===c?' active':'');b.textContent=c;b.addEventListener('click',()=>{category=c;renderTabs();renderProducts()});$('bizTabs').appendChild(b)});
  }
  function renderProducts(){
    $('bizProducts').innerHTML='';
    catalog.filter(p=>category==='Todos'||p.category===category).forEach(p=>{
      const card=document.createElement('article');card.className='biz-product';
      card.innerHTML='<div class="biz-product-art">'+p.icon+'</div><div class="biz-product-body"><b>'+p.name+'</b><p>'+p.detail+'</p><span class="biz-price">Precio y disponibilidad a confirmar</span><button class="biz-add" type="button">AGREGAR +</button></div>';
      card.querySelector('button').addEventListener('click',()=>{cart[p.id]=(cart[p.id]||0)+1;persist();renderCart()});$('bizProducts').appendChild(card);
    });
  }
  function renderCart(){
    const n=count();$('bizCartCount').textContent=n+' PRODUCTO'+(n===1?'':'S');$('bizCart').innerHTML='';
    const entries=catalog.filter(p=>cart[p.id]);
    if(!entries.length){$('bizCart').innerHTML='<div class="biz-empty">Tu pedido está vacío.<br>Elegí algo rico de la carta para empezar.</div>';return}
    entries.forEach(p=>{
      const row=document.createElement('div');row.className='biz-cart-line';
      row.innerHTML='<div class="biz-cart-name">'+p.icon+' '+p.name+'</div><div class="biz-qty"><button type="button" aria-label="Quitar uno">−</button><span>'+cart[p.id]+'</span><button type="button" aria-label="Agregar uno">+</button></div>';
      const buttons=row.querySelectorAll('button');
      buttons[0].addEventListener('click',()=>{cart[p.id]--;if(cart[p.id]<=0)delete cart[p.id];persist();renderCart()});
      buttons[1].addEventListener('click',()=>{cart[p.id]++;persist();renderCart()});$('bizCart').appendChild(row);
    });
  }
  document.querySelectorAll('#business [data-mode]').forEach(b=>b.addEventListener('click',()=>{
    mode=b.dataset.mode;document.querySelectorAll('#business [data-mode]').forEach(x=>x.classList.toggle('active',x===b));$('bizAddressWrap').classList.toggle('biz-hidden',mode!=='delivery');
  }));
  $('bizSend').addEventListener('click',()=>{
    const name=$('bizName').value.trim(),phone=$('bizPhone').value.trim(),address=$('bizAddress').value.trim(),notes=$('bizNotes').value.trim();
    const items=catalog.filter(p=>cart[p.id]).map(p=>'• '+cart[p.id]+' x '+p.name).join('\n');$('bizError').textContent='';
    if(!count()){$('bizError').textContent='Agregá al menos un producto.';return}
    if(!name){$('bizError').textContent='Completá tu nombre para identificar el pedido.';$('bizName').focus();return}
    if(mode==='delivery'&&!address){$('bizError').textContent='Indicá la dirección para el delivery.';$('bizAddress').focus();return}
    const message=['☕ PEDIDO — CAFÉ ZODÍACO','Nombre: '+name,phone?'Teléfono: '+phone:'','Modalidad: '+(mode==='delivery'?'Delivery':'Retiro / al paso'),mode==='delivery'?'Dirección: '+address:'','','Detalle:',items,notes?'\nIndicaciones: '+notes:'','','Solicito confirmar disponibilidad, precios, costo de envío (si corresponde) y tiempo estimado. Este mensaje es una solicitud, no una compra confirmada.'].filter(Boolean).join('\n');
    if(window.AndroidBridge&&typeof window.AndroidBridge.shareText==='function')window.AndroidBridge.shareText(message);
    else if(navigator.share)navigator.share({title:'Pedido Café Zodíaco',text:message}).catch(()=>{});
    else window.open('https://wa.me/?text='+encodeURIComponent(message),'_blank');
  });
  renderTabs();renderProducts();renderCart();
})();