(function(){
  // Sestavine: kljukice za odkljukanje
  document.querySelectorAll('.vsebina ul.sestavine > li').forEach(function(li,i){
    var lab=document.createElement('label'); var cb=document.createElement('input'); cb.type='checkbox';
    var sp=document.createElement('span'); while(li.firstChild) sp.appendChild(li.firstChild);
    lab.appendChild(cb); lab.appendChild(sp); li.appendChild(lab);
  });

  // Porcije: preračun količin (samo vrstice, ki se začnejo s številko)
  var v=document.querySelector('.vsebina[data-porcije]');
  if(v){
    var osnova=parseFloat(v.dataset.porcije), n=osnova;
    var vrstice=[];
    v.querySelectorAll('ul.sestavine li span').forEach(function(sp){
      var t=sp.textContent; if(/oseb|porcij/i.test(t)) return;
      var m=t.match(/^\s*(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+))?/); if(!m) return;
      var val=m[2]?parseFloat(m[1])/parseFloat(m[2]):parseFloat(m[1].replace(',','.'));
      vrstice.push({sp:sp,val:val,ostalo:t.slice(m[0].length)});
    });
    if(vrstice.length){
      var prvi=v.querySelector('ul.sestavine');
      var box=document.createElement('div'); box.className='porcije-izbira';
      box.innerHTML='<button type="button" aria-label="Manj porcij">−</button><output aria-live="polite"></output><button type="button" aria-label="Več porcij">+</button>';
      prvi.parentNode.insertBefore(box,prvi);
      var out=box.querySelector('output'), oznaka=document.querySelector('[data-porcije-oznaka]');
      function fmt(x){var r=Math.round(x*100)/100; var w=Math.floor(r), f=r-w;
        if(Math.abs(f-0.5)<0.01) return (w?w:'')+'½'; if(Math.abs(f-0.25)<0.01) return (w?w:'')+'¼'; if(Math.abs(f-0.75)<0.01) return (w?w:'')+'¾';
        return String(r).replace('.',',');}
      function izris(){out.textContent=n+(n===1?' porcija':n===2?' porciji':n<5?' porcije':' porcij'); if(oznaka) oznaka.textContent=n;
        vrstice.forEach(function(r){r.sp.textContent=(n===osnova?(r.sp.dataset.izvirno||r.sp.textContent):fmt(r.val*n/osnova)+r.ostalo);});}
      vrstice.forEach(function(r){r.sp.dataset.izvirno=r.sp.textContent;});
      box.querySelectorAll('button')[0].onclick=function(){if(n>1){n--;izris();}};
      box.querySelectorAll('button')[1].onclick=function(){if(n<30){n++;izris();}};
      izris();
    }
  }

  // Iskanje in filtri na strani Recepti
  var vnos=document.getElementById('iskanje');
  if(vnos){
    var ovoji=[].slice.call(document.querySelectorAll('#rezultati .ovoj'));
    var stevec=document.getElementById('stevec'), kat='';
    var norm=function(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');};
    ovoji.forEach(function(o){o._x=norm(o.dataset.x);o._k=o.dataset.k.split('|');});
    var gumbi=[].slice.call(document.querySelectorAll('.filtri .cip'));
    function filtriraj(){
      var besede=norm(vnos.value).split(/\s+/).filter(Boolean), st=0;
      ovoji.forEach(function(o){var ok=(!kat||o._k.indexOf(kat)>=0)&&besede.every(function(b){return o._x.indexOf(b)>=0;});o.hidden=!ok;if(ok)st++;});
      stevec.textContent=st===ovoji.length?st+' objav':st===0?'Ni zadetkov. Poskusi z drugo besedo ali izberi Vse.':'Najdenih: '+st;
    }
    gumbi.forEach(function(g){g.onclick=function(){kat=g.dataset.kat;gumbi.forEach(function(x){x.setAttribute('aria-pressed',x===g?'true':'false');});filtriraj();};});
    vnos.addEventListener('input',filtriraj);
    var q=new URLSearchParams(location.search).get('q'); if(q) vnos.value=q;
    filtriraj();
  }
})();
