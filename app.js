const sectorNav=document.querySelector('#sectorNav'),content=document.querySelector('#content');
const sectors=[...new Set(honorees.map(x=>x.sector))];
document.querySelector('#peopleCount').textContent=honorees.length;
document.querySelector('#sectorCount').textContent=sectors.length;
let active=sectors[0];

function initials(name){return name.replace(/[·\s]/g,'').slice(-2)}

/* ---------- 原图大图灯箱 ---------- */
const lightbox=document.querySelector('#lightbox');
const lightboxImg=document.querySelector('#lightboxImg');

function openLightbox(src,alt){
  lightboxImg.src=src;
  lightboxImg.alt=alt||'劳模肖像';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  lightboxImg.src='';
}
lightbox.addEventListener('click',e=>{
  if(e.target===lightbox||e.target.closest('.lightbox-close'))closeLightbox();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();});

/* 事件委托：头像、详情大图均可点击放大查看原图 */
content.addEventListener('click',e=>{
  const zoom=e.target.closest('[data-src]');
  if(zoom)openLightbox(zoom.dataset.src,zoom.alt);
});

/* ---------- 列表渲染 ---------- */
function render(){
  sectorNav.innerHTML=sectors.map(s=>`<button class="${s===active?'active':''}" data-sector="${s}">${s}（${honorees.filter(x=>x.sector===s).length}）</button>`).join('');
  const list=honorees.filter(x=>x.sector===active);
  content.innerHTML=`<div class="section-title"><h2>${active}</h2><span>${list.length} 位劳动模范</span></div><div class="cards">${list.map(x=>`
    <article class="card">
      <div class="card-top">
        ${x.photo
          ?`<img class="portrait" src="${x.photo}" alt="${x.name}照片" data-src="${x.photo}" role="button" aria-label="查看${x.name}原图">`
          :`<div class="portrait" aria-label="${x.name}肖像待授权">${initials(x.name)}</div>`}
        <div>
          <h3 class="person-name">${x.name}</h3>
          <p class="person-title">${x.org}</p>
        </div>
      </div>
      <details>
        <summary>查看基本信息与简介</summary>
        <div class="details-body">
          ${x.photo?`<figure class="detail-photo"><img src="${x.photo}" alt="${x.name}肖像" data-src="${x.photo}" role="button" aria-label="查看${x.name}原图"><figcaption>点击查看原图大图</figcaption></figure>`:''}
          <p><b>岗位：</b>${x.role}</p>
          <p><b>事迹简介：</b>${x.brief}</p>
          ${x.photo?'':`<span class="tag">官方肖像待授权补充</span>`}
        </div>
      </details>
    </article>`).join('')}</div>`;
  sectorNav.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    active=b.dataset.sector;render();
    window.scrollTo({top:document.querySelector('.sector-nav').offsetTop-5,behavior:'smooth'});
  });
}
render();
