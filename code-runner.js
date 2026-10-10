'use strict';
(() => {
const ORIGIN='https://onecompiler.com';
const LANGUAGES={c:'c',cpp:'cpp',python:'python',java:'java',javascript:'javascript',csharp:'csharp'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let dialog,frame,payload,opener,connected=false,sent=false,fallbackTimer,loadTimer;
function dispose(){clearTimeout(fallbackTimer);clearTimeout(loadTimer);dialog?.remove();dialog=null;frame=null;payload=null;opener?.focus();}
function send(){if(frame?.contentWindow&&payload){sent=true;frame.contentWindow.postMessage(payload,ORIGIN);}}
window.addEventListener('message',event=>{
 if(event.origin!==ORIGIN||event.source!==frame?.contentWindow||!payload)return;
 const data=event.data;if(!data||typeof data!=='object')return;
 if(data.language&&Array.isArray(data.files)){
  if(!sent)send();
  if(data.files.some(f=>f&&f.name===payload.files[0].name&&f.content===payload.files[0].content)){
   connected=true;clearTimeout(fallbackTimer);
   const status=dialog?.querySelector('[data-runner-status]');if(status)status.textContent=dialog.dataset.ready;
  }
 }
});
window.CodeRunner={open({language,codeLanguage,filename,code,stdin='',label}){
 if(!Object.hasOwn(LANGUAGES,codeLanguage))return;
 if(dialog)dispose();opener=document.activeElement;connected=false;sent=false;
 const u=k=>window.ModuleOne.ui(language,k);
 payload={eventType:'populateCode',language:LANGUAGES[codeLanguage],files:[{name:filename,content:code}],stdin};
 dialog=document.createElement('dialog');dialog.className='runner-dialog';dialog.id='code-runner';dialog.setAttribute('aria-labelledby','runner-title');dialog.dataset.ready=u('ready');
 dialog.innerHTML=`<div class="runner-heading"><div><span class="eyebrow">CodeViz × OneCompiler</span><h2 id="runner-title">${esc(u('runner'))} · ${esc(label)}</h2></div><button type="button" data-runner-close autofocus>${esc(u('close'))} ×</button></div><p>${esc(u('runnerHint'))}</p><p class="small">${esc(u('external'))}</p><div class="controls"><button type="button" data-runner-load>${esc(u('send'))}</button><button type="button" data-runner-copy>${esc(u('copy'))}</button><a class="button" href="${ORIGIN}/${LANGUAGES[codeLanguage]}" target="_blank" rel="noopener">${esc(u('newTab'))} ↗</a><span class="small" data-runner-status role="status">${esc(u('load'))}…</span></div>${stdin?`<details class="runner-stdin"><summary>${esc(u('inputHint'))}</summary><pre dir="ltr">${esc(stdin)}</pre></details>`:''}<div class="runner-frame"></div><p class="small runner-fallback">${esc(u('loadError'))}</p>`;
 document.body.append(dialog);
 dialog.querySelector('[data-runner-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',dispose);
 dialog.querySelector('[data-runner-load]').addEventListener('click',send);
 dialog.querySelector('[data-runner-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code);dialog.querySelector('[data-runner-status]').textContent=window.COURSE_DATA.translations[language].ui.copied;}catch{dialog.querySelector('[data-runner-status]').textContent=window.COURSE_DATA.translations[language].ui.copyFailed;}});
 frame=document.createElement('iframe');frame.title=u('runner')+' · '+label;frame.setAttribute('allow','clipboard-write');frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
 frame.src=ORIGIN+'/embed/'+LANGUAGES[codeLanguage]+'?listenToEvents=true&codeChangeEvent=true&hideLanguageSelection=true&hideNew=true&hideTitle=true&hideNewFileOption=true';
 frame.addEventListener('load',()=>{loadTimer=setTimeout(()=>{if(!sent)send();},1000);});
 dialog.querySelector('.runner-frame').append(frame);
 fallbackTimer=setTimeout(()=>{if(dialog&&!connected)dialog.querySelector('[data-runner-status]').textContent=u('loadError');},15000);
 dialog.showModal();
}};
})();
