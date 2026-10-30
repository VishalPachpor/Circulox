"""Rendered Next.js regression with installed gstack browse. Run after npm run build/start."""
import subprocess,json
from pathlib import Path
import os
browser=os.environ.get('GSTACK_BROWSE',str(Path.home()/'.codex/skills/gstack/browse/dist/browse'))
base='http://127.0.0.1:3000'
def run(*args):
 r=subprocess.run(['rtk','proxy',browser,*args],capture_output=True,text=True)
 if r.returncode:raise RuntimeError(str(args)+r.stdout+r.stderr)
 return r.stdout
def check(expression):
 assert 'PASS' in run('js','(()=>{if(!('+expression+'))throw new Error("Failed: "+'+json.dumps(expression)+');return "PASS"})()')
root=Path(__file__).resolve().parents[1]
services=json.loads((root/'src/data/services.json').read_text())
countries=json.loads((root/'src/data/directory.json').read_text())
pages=['/','/insights','/firm','/contact','/studio']+['/services/'+k for k in services]+['/jurisdictions/'+x['slug'] for x in countries]
results=[]
for width,height in [(320,720),(390,844),(1440,900)]:
 run('viewport',f'{width}x{height}')
 for page in pages:
  run('goto',base+page)
  check(f'innerWidth==={width} && document.documentElement.scrollWidth<=innerWidth && document.querySelectorAll("h1").length===1')
  if page.startswith(('/services/','/jurisdictions/')):
   check('document.querySelectorAll(".scope-rows article").length===3 && document.querySelectorAll(".faq-item").length===2')
   check('document.querySelector(".preparation-details").open==='+str(width>560).lower())
   check('[...document.querySelectorAll(".faq-item")].every(e=>e.open==='+str(width>560).lower()+')')
   check('[...document.links].filter(a=>a.href==="https://t.me/iptisha").length===1')
  if width==1440 and page!='/studio' and page!='/':check('getComputedStyle(document.querySelector(".desktop-navigation")).display==="flex"')
  results.append({'page':page,'width':width,'passed':True})
 print(f'PASS: {len(pages)} pages at {width}px',flush=True)
run('viewport','390x844');run('goto',base+'/services/formation');run('click','.site-menu')
check('document.querySelector(".site-menu").getAttribute("aria-expanded")==="true"')
run('press','Escape');check('document.querySelector(".site-menu").getAttribute("aria-expanded")==="false"')
run('click','.preparation-details summary');check('document.querySelector(".preparation-details").open')
run('goto',base+'/insights');run('click','#article-category-trigger')
check('document.querySelector("#article-category-trigger").getAttribute("aria-expanded")==="true"')
run('press','Escape');check('document.activeElement.id==="article-category-trigger"')
run('goto',base+'/');run('click','#jurisdiction-tab-uae')
check('document.querySelector("#jurisdiction-title").textContent==="United Arab Emirates" && document.querySelector("#jurisdiction-tab-uae").getAttribute("aria-selected")==="true"')
run('press','End');check('document.querySelector("#jurisdiction-title").textContent==="India"')
run('goto',base+'/admin');check('location.pathname==="/studio" && document.body.textContent.includes("Connect your publishing workspace")')
run('goto',base+'/insights/not-a-published-post');check('document.querySelector("h1").textContent==="Page not found."')
(root/'.gstack/qa-reports').mkdir(parents=True,exist_ok=True)
(root/'.gstack/qa-reports/nextjs-matrix.json').write_text(json.dumps(results,indent=2))
print('PASS: mobile navigation, disclosures, filter keyboard, jurisdiction state, admin setup and article 404',flush=True)
