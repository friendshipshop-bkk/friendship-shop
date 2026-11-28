// Offline shell for the customer app. Product and order data always come live from Supabase.
// Pages are always checked with the server first, so a new upload shows up straight away.
const C="fs-v3", SHELL=["./","index.html","manifest.json","icon-192.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET"||u.origin!==location.origin)return;
  const page=r.mode==="navigate"||r.destination==="document"||r.destination==="iframe"||/\.html?$|\/$/.test(u.pathname);
  const go=page?fetch(r.url,{cache:"no-cache",credentials:"same-origin"}):fetch(r);
  e.respondWith(go.then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:page})));});
