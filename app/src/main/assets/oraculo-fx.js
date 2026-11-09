/* El Oráculo FX: original offline 2D combat renderer and soundscape. No external network or dependencies. */
(()=>{"use strict";
const canvas=document.getElementById("battle-scene");if(!canvas)return;
const ctx=canvas.getContext("2d"),W=640,H=310,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let running=false,frame=0,particles=[],state=null,guardian="",result="",last=0,raf=0;
const stars=Array.from({length:90},(_,i)=>({x:(i*137.37)%W,y:(i*83.19)%H,r:.5+(i%4)/3}));
const colors={hamal_aries:"#ff6c45",aldebaran_tauro:"#d8b27a",pollux_geminis:"#ba9dff",acubens_cancer:"#5fc8ff",regulus_leo:"#ffd66c",spica_virgo:"#9cf0bb",zubenelgenubi_libra:"#f5bcf1",antares_escorpio:"#ae6eea",kaus_australis_sagitario:"#90e6ca",deneb_algedi_capricornio:"#b8eaff",sadalsuud_acuario:"#6cbaff",alrescha_piscis:"#b0a3ff"};
const colorset=()=>colors[guardian]||"#ffd37e";
const sprite=new Image();let loaded=false;sprite.onload=()=>loaded=true;
function setGuardian(id){if(guardian!==id){guardian=id;loaded=false;sprite.src="images/"+id+"_03_guardian_estelar.png"}}
function glow(x,y,r,color){let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function draw(t){ctx.clearRect(0,0,W,H);let g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,"#070e2b");g.addColorStop(.6,"#17122e");g.addColorStop(1,"#100b1c");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
for(let i=0;i<stars.length;i++){let s=stars[i];ctx.globalAlpha=.3+.5*Math.abs(Math.sin(t*.0006+i));ellipse(s.x,s.y,s.r,s.r,"#fff4d6")}ctx.globalAlpha=1;
glow(320,190,190,"#6e4ab822");glow(175,155,120,colorset()+"35");glow(475,160,110,"#8e3ca644");
ellipse(170,267,117,18,"#bb9aff22");ellipse(472,267,94,17,"#e97bfa25");
if(loaded){ctx.save();ctx.shadowColor=colorset();ctx.shadowBlur=20;let w=150,h=184;ctx.drawImage(sprite,90,65,w,h);ctx.restore()}else{glow(170,155,70,colorset());ctx.font="76px serif";ctx.textAlign="center";ctx.fillText("✦",170,182)}
ctx.save();ctx.shadowColor="#e54bdf";ctx.shadowBlur=25;ctx.fillStyle="#342044";ctx.beginPath();ctx.moveTo(473,65);ctx.bezierCurveTo(530,108,540,212,472,250);ctx.bezierCurveTo(399,213,416,100,473,65);ctx.fill();ctx.restore();
ctx.font="64px serif";ctx.textAlign="center";ctx.fillStyle="#d9a0f2";ctx.fillText("☾",474,182);
ctx.font="bold 15px Georgia,serif";ctx.fillStyle="#f6dfa6";ctx.fillText("GUARDIÁN",170,290);ctx.fillText("SOMBRA",474,290);
for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life--;ctx.globalAlpha=Math.max(0,p.life/p.max);glow(p.x,p.y,p.size*5,p.color);ellipse(p.x,p.y,p.size,p.size,p.color);if(p.life<=0)particles.splice(i,1)}ctx.globalAlpha=1;
if(result){ctx.fillStyle="#050817cc";ctx.fillRect(0,108,W,80);ctx.font="bold 32px Georgia,serif";ctx.textAlign="center";ctx.fillStyle=result==="victory"?"#f8d589":"#f5a2b3";ctx.fillText(result==="victory"?"✦ VICTORIA ASTRAL ✦":"EL SELLO RESISTE",320,160)}
}
function loop(t){if(!running)return;if(reduce&&t-last<1000){raf=requestAnimationFrame(loop);return}last=t;draw(t);raf=requestAnimationFrame(loop)}
function burst(x,y,color,n=36){if(reduce)return;for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,v=1+Math.random()*5;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:20+Math.random()*30,max:50,size:1+Math.random()*3,color})}}
let ac=null,master=null,musicTimer=null;const audio=()=>{if(!window.soundOn)return null;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();return ac}catch(e){return null}};
function note(freq,dur=.15,type="sine",volume=.06){let a=audio();if(!a)return;let o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(freq,a.currentTime);g.gain.setValueAtTime(volume,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+dur);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+dur)}
function cue(kind){const seq={attack:[[175,.09,"sawtooth"],[110,.15,"triangle"]],skill:[[392,.13,"sine"],[587,.22,"triangle"],[784,.34,"sine"]],defend:[[250,.18,"triangle"],[320,.25,"sine"]],heal:[[440,.17,"sine"],[554,.23,"sine"],[659,.32,"sine"]],victory:[[523,.15,"triangle"],[659,.2,"triangle"],[784,.3,"sine"],[1047,.6,"sine"]],defeat:[[330,.25,"triangle"],[262,.3,"triangle"],[196,.5,"sine"]]};(seq[kind]||[]).forEach((n,i)=>setTimeout(()=>note(...n),i*115))}
function start(id){setGuardian(id);result="";particles=[];if(!running){running=true;raf=requestAnimationFrame(loop)}}
function render(b,id){state=b;setGuardian(id);if(!running)start(id)}
function action(move,id){setGuardian(id);cue(move);burst(move==="heal"||move==="defend"?170:475,150,move==="heal"?"#8dffca":move==="skill"?colorset():"#ffd9a2",move==="skill"?65:35)}
function finish(win){result=win?"victory":"defeat";cue(result);burst(win?170:475,120,win?"#fbd17c":"#ad76d8",90);draw(performance.now())}
function stop(){running=false;cancelAnimationFrame(raf);particles=[];result=""}
document.addEventListener("visibilitychange",()=>{if(document.hidden){stop()}else if(!document.getElementById("combat").hidden&&state)start(guardian)});
window.OraculoFX={start,render,action,finish,stop};
})();