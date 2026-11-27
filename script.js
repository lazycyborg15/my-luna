(function(){
var CFG=JSON.parse(document.getElementById('cfg').textContent);
var NS='http://www.w3.org/2000/svg';
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function $(i){return document.getElementById(i)}

/* whole daisy, defined once */
var hid=el('svg',{width:0,height:0,style:'position:absolute','aria-hidden':'true'},document.body);
var sym=el('symbol',{id:'daisy',viewBox:'-50 -50 100 100'},el('defs',{},hid));
var pg=el('g',{fill:'#fff',stroke:'#b9d3c8','stroke-width':1.2},sym);
for(var i=0;i<12;i++)el('ellipse',{cx:0,cy:-27,rx:8,ry:20,transform:'rotate('+i*30+')'},pg);
el('circle',{r:13,fill:'#ffc928',stroke:'#e5a800','stroke-width':2},sym);
function daisy(p,x,y,s,d,cls){
  var g=el('g',{transform:'translate('+x+' '+y+') scale('+s/100+')'},p);
  var k=el('g',{class:cls||'grow',style:'--d:'+d+'s'},g);
  var r=Math.round(x+y);
  var u=el('g',{class:'sp',style:'--sp:'+(14+r%6*3)+'s;animation-direction:'+(r%2?'reverse':'normal')},k);
  el('use',{href:'#daisy',x:-50,y:-50,width:100,height:100},u);
}

/* growing wreath: one branch built, then mirrored */
var wr=$('wr');
function build(){
wr.innerHTML='';var L=el('g',{},wr);
var stem=el('path',{d:'M200 478 C150 478 84 436 74 345 C64 255 100 190 152 84','class':'draw stem',pathLength:1},L);
var len=stem.getTotalLength(),T=3.4;
[.1,.18,.27,.33,.42,.5,.55,.64,.7,.78,.84,.9].forEach(function(f,i){
  var p=stem.getPointAtLength(f*len),q=stem.getPointAtLength(Math.min(len,f*len+3));
  var a=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI+(i%2?48:-48);
  var g=el('g',{transform:'translate('+p.x+' '+p.y+') rotate('+a+') scale('+(.8+(i%3)*.12)+')'},L);
  el('path',{d:'M0 0C6 -9 20 -9 32 0C20 9 6 9 0 0Z','class':'leaf grow',style:'--d:'+(f*T+.3)+'s'},g);
});
[[.36,56],[.58,52],[.8,48],[.97,42]].forEach(function(a){
  var p=stem.getPointAtLength(a[0]*len);daisy(L,p.x,p.y,a[1],a[0]*T+.5);
});
var R=L.cloneNode(true);R.setAttribute('transform','translate(400 0) scale(-1 1)');wr.appendChild(R);
}
build();

/* memory branch */
var NODES=[{x:320,y:610},{x:80,y:470},{x:320,y:330},{x:80,y:200},{x:290,y:70}];
var names=CFG.names,photos=CFG.photos||{};
var cur=-1,tg=$('nodes');
var dlg=$('dlg'),ph=$('ph');
function label(i){return names[i]}
function render(){
  var src=photos[cur];
  ph.innerHTML=src?'<img alt="Our memory">':'<span>No photo yet</span>';
  if(src)ph.firstChild.src=src;
}
function openM(i){cur=i;render();if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','')}
NODES.forEach(function(n,i){
  var e=el('g',{class:'node',tabindex:0,role:'button','aria-label':'Open memory '+(i+1),style:'--dd:'+(1.4+i*.35)+'s'},tg);
  el('circle',{cx:n.x,cy:n.y,r:50,fill:'transparent'},e);
  daisy(el('g',{class:'fl'},e),n.x,n.y,84,0,'x');
  var t=el('text',{x:n.x,y:n.y+64,'text-anchor':'middle'},e);t.textContent=label(i);
  e.addEventListener('click',function(){openM(i)});
  e.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();openM(i)}});
});
$('close').addEventListener('click',function(){dlg.close()});
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});

/* scene: background full of whole daisies */
function buildField(){
  var W=innerWidth,H=innerHeight,cols=Math.max(2,Math.round(W/170)),rows=Math.max(4,Math.round(H/170)),cw,ch,s,h='',n=0;
  if(cols%2)cols++;
  cw=W/cols;ch=H/rows;s=Math.min(cw,ch)*.8;
  for(var y=0;y<rows;y++)for(var x=0;x<cols;x++){
    h+='<svg viewBox="-50 -50 100 100" style="--s:'+s.toFixed(0)+'px;--x:'+((x+.5)*cw).toFixed(0)+'px;--y:'+((y+.5)*ch).toFixed(0)+'px;--r:'+((n*37)%60)+'deg;--t:'+(30+(n%5)*5)+'s;animation-direction:'+(n++%2?'reverse':'normal')+'"><use href="#daisy" x="-50" y="-50" width="100" height="100"/></svg>';
  }
  $('field').innerHTML=h;
  var hh='';
  for(var k=0;k<8;k++)hh+='<i style="--s:'+(14+k%4*6)+'px;--x:'+((k*11+5)%94)+'%;--t:'+(9+k%5*2)+'s;--dl:-'+(k*1.6).toFixed(1)+'s;--d:'+((k%2?1:-1)*(20+k%3*15))+'px">♥</i>';
  $('hearts').innerHTML=hh;
}
$('open').addEventListener('click',function(){
  var s=$('scene');buildField();s.hidden=false;s.scrollTop=0;document.body.style.overflow='hidden';document.body.classList.add('in-scene');$('back').focus();
});
$('back').addEventListener('click',function(){
  $('scene').hidden=true;document.body.style.overflow='';document.body.classList.remove('in-scene');
  build();
  ['.greet','#open','#lopen'].forEach(function(q){var e=document.querySelector(q);e.style.animation='none';void e.offsetWidth;e.style.animation='';});
});

})();
