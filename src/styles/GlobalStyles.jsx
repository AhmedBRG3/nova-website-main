// ─────────────────────────────────────────
//  GlobalStyles
//  Every CSS var, class, and keyframe
//  animation the components rely on lives
//  here as one injected <style> block —
//  including the black / red / cream palette
//  and the realistic YBE scene animations (barrier
//  bounce physics, headlight cones, exhaust
//  puffs, product turntable spin, sweeping
//  spotlights, screen shine sweeps, car creep,
//  hover-intensify).
//
//  Render <GlobalStyles /> once, near the
//  top of <App />.
// ─────────────────────────────────────────
export default function GlobalStyles() {
  return (
    <style>{`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --void:#060504;--deep:#0C0907;--card:#16110C;
  --mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  --pulse:#EC2027;--hot:#FF3B41;--ember:#FF6B4A;
  --silver:#B8AC8C;--mist:#E8DCC0;--light:#F3EAD3;
  --cream:#F3EAD3;--gold:#E8C77E;--ink-rgb:243,234,211;
  --e:cubic-bezier(.16,1,.3,1);
  --e2:cubic-bezier(.83,0,.17,1);
}
html{scroll-behavior:auto}
body{font-family:'Inter',sans-serif;background:var(--void);color:var(--light);overflow-x:hidden;cursor:none}
::selection{background:rgba(236,32,39,.35);color:#F3EAD3}

/* ═══ ACCESSIBILITY ═══
   The custom cursor replaces the native pointer, so keyboard users need
   their own clear, on-brand focus indicator — :focus-visible keeps it from
   showing on mouse clicks, matching the site's no-visible-focus-ring feel
   for pointer users while still being fully keyboard-navigable. */
a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{
  outline:2px solid var(--hot);outline-offset:3px;border-radius:4px;
}
.skip-link{position:fixed;top:-100px;left:1rem;z-index:2000;background:var(--pulse);color:#F3EAD3;padding:.75rem 1.25rem;border-radius:8px;text-decoration:none;font-size:.85rem;font-weight:500;transition:top .25s var(--e)}
.skip-link:focus{top:1rem}

/* ═══ LIGHT SECTIONS ═══
   Alternates every other section to a light theme by re-scoping
   the same shared vars/rgba-overlays components already use — the
   red/orange brand accents stay constant across both themes. */
.light-section{
  --void:#0A0806;--deep:#100C09;--card:#1A140E;
  --silver:#B8AC8C;--mist:#E8DCC0;--light:#F3EAD3;
  --ink-rgb:243,234,211;
  background:var(--void);color:var(--light);
}

/* ═══ PRELOADER ═══
   Film-leader countdown. The screen is two black halves behind the
   content; on .done they part vertically like a curtain. */
#preloader{position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;transition:opacity .01s linear 1.25s}
#preloader::before,#preloader::after{content:'';position:absolute;left:0;right:0;height:50.5%;background:#030202;z-index:-1;transition:transform 1.15s var(--e2)}
#preloader::before{top:0;border-bottom:1px solid rgba(236,32,39,.5)}
#preloader::after{bottom:0}
#preloader.done{opacity:0;pointer-events:none}
#preloader.done::before{transform:translateY(-100%)}
#preloader.done::after{transform:translateY(100%)}
#preloader>*{transition:opacity .45s ease,transform .6s var(--e)}
#preloader.done>*{opacity:0!important;transform:scale(.94)}
.pre-top{position:absolute;top:2.2rem;left:0;right:0;text-align:center;font-family:var(--mono);font-size:10px;letter-spacing:.5em;text-transform:uppercase;color:rgba(243,234,211,.35);opacity:0;animation:preIn .8s var(--e) .1s forwards}
.pre-logo{opacity:0;animation:preIn .8s var(--e) .1s forwards}
.pre-reel{position:relative;width:160px;height:160px;display:flex;align-items:center;justify-content:center;opacity:0;animation:preIn .8s var(--e) .25s forwards}
.pre-reel-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.pre-ring-bg{fill:none;stroke:rgba(243,234,211,.12);stroke-width:1}
.pre-ring{fill:none;stroke:var(--pulse);stroke-width:1.6;stroke-linecap:round;transition:stroke-dashoffset .25s ease;filter:drop-shadow(0 0 6px rgba(236,32,39,.6))}
.pre-cross{stroke:rgba(243,234,211,.16);stroke-width:.6}
.pre-count-wrap{display:flex;align-items:baseline;gap:3px;position:relative}
#preCount{font-family:'Playfair Display',serif;font-size:48px;font-weight:400;color:#F3EAD3;line-height:1;font-variant-numeric:tabular-nums}
.pre-pct{font-family:var(--mono);font-size:13px;color:var(--pulse)}
.pre-tag{position:absolute;bottom:2.2rem;left:0;right:0;text-align:center;font-family:var(--mono);font-size:10px;letter-spacing:.5em;text-transform:uppercase;color:rgba(243,234,211,.3);opacity:0;animation:preIn .8s var(--e) .45s forwards}
@keyframes preIn{to{opacity:1}}

/* ═══ GRAIN ═══ */
#grain{position:fixed;inset:-100px;z-index:900;pointer-events:none;opacity:.045;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");animation:grain 7s steps(8) infinite}
@keyframes grain{0%,100%{transform:translate(0,0)}12%{transform:translate(-3%,2%)}25%{transform:translate(2%,-4%)}37%{transform:translate(-4%,-1%)}50%{transform:translate(3%,3%)}62%{transform:translate(-2%,4%)}75%{transform:translate(4%,-2%)}87%{transform:translate(-3%,-3%)}}

/* ═══ CURSOR ═══ */
#cur{position:fixed;width:9px;height:9px;background:#F3EAD3;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:difference;transition:width .35s var(--e),height .35s var(--e),opacity .35s}
#cur-ring{position:fixed;width:42px;height:42px;border:1px solid rgba(243,234,211,.35);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .3s var(--e),height .3s var(--e),border-color .3s,background .3s;mix-blend-mode:difference;display:flex;align-items:center;justify-content:center}
#cur-label{font-size:9px;letter-spacing:.2em;color:#F3EAD3;opacity:0;transition:opacity .3s;text-transform:uppercase;font-weight:500}
body.hov #cur{width:44px;height:44px;opacity:.14}
body.hov #cur-ring{width:56px;height:56px;border-color:rgba(243,234,211,.85)}
body.cur-view #cur{opacity:0}
body.cur-view #cur-ring{width:76px;height:76px;background:rgba(236,32,39,.9);border-color:transparent;mix-blend-mode:normal}
body.cur-view #cur-label{opacity:1}

/* ═══ PROGRESS ═══ */
#pbar{position:fixed;top:0;left:0;right:0;height:2px;z-index:950;background:rgba(243,234,211,.04)}
#pbar-fill{height:100%;width:0;background:linear-gradient(90deg,var(--pulse),var(--hot),var(--ember));transform-origin:left;box-shadow:0 0 12px rgba(236,32,39,.5)}

/* ═══ NAV ═══ */
nav{position:fixed;top:0;left:0;right:0;z-index:800;padding:1.4rem 3rem;display:flex;align-items:center;justify-content:space-between;transition:background .6s,backdrop-filter .6s,padding .6s;opacity:0;transform:translateY(-16px)}
body.loaded nav{opacity:1;transform:none;transition:opacity .9s var(--e) .9s,transform .9s var(--e) .9s,background .6s,padding .6s}
nav.sc{background:rgba(10,8,8,.82);backdrop-filter:blur(24px) saturate(1.4);-webkit-backdrop-filter:blur(24px) saturate(1.4);padding:1rem 3rem;border-bottom:.5px solid rgba(243,234,211,.05)}
.nav-logo{display:flex;align-items:center;text-decoration:none}
.nav-links{display:flex;gap:2.5rem;list-style:none}
.nav-links a{color:var(--silver);text-decoration:none;font-size:.76rem;letter-spacing:.12em;text-transform:uppercase;transition:color .3s;position:relative;padding:4px 0}
.nav-links a::after{content:'';position:absolute;bottom:0;left:0;width:100%;height:1px;background:var(--hot);transform:scaleX(0);transform-origin:right;transition:transform .45s var(--e)}
.nav-links a:hover{color:#F3EAD3}
.nav-links a:hover::after{transform:scaleX(1);transform-origin:left}
.nav-cta{padding:.55rem 1.6rem;border:1px solid rgba(243,234,211,.2);border-radius:50px;color:#F3EAD3;text-decoration:none;font-size:.76rem;letter-spacing:.08em;transition:background .35s,border-color .35s,box-shadow .35s;display:inline-block}
.nav-cta:hover{background:var(--pulse);border-color:var(--pulse);box-shadow:0 0 24px rgba(236,32,39,.4)}
.nav-toggle{display:none;flex-direction:column;justify-content:center;gap:5px;width:36px;height:36px;background:none;border:none;padding:0;cursor:pointer;z-index:820}
.nav-toggle span{display:block;width:100%;height:1.5px;background:#F3EAD3;border-radius:2px;transition:transform .35s var(--e),opacity .35s var(--e)}
.nav-toggle.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
.nav-toggle.open span:nth-child(2){opacity:0}
.nav-toggle.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
.nav-mobile{position:fixed;inset:0;background:rgba(10,8,8,.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);z-index:790;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.75rem;opacity:0;visibility:hidden;transform:translateY(-12px);transition:opacity .4s var(--e),transform .4s var(--e),visibility 0s linear .4s}
.nav-mobile.open{opacity:1;visibility:visible;transform:none;transition:opacity .4s var(--e),transform .4s var(--e)}
.nav-mobile ul{list-style:none;display:flex;flex-direction:column;align-items:center;gap:2rem}
.nav-mobile a{color:#F3EAD3;text-decoration:none;font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:400}
.nav-mobile-cta{padding:.85rem 2.2rem;background:var(--pulse);color:#F3EAD3;border-radius:50px;text-decoration:none;font-size:.85rem;letter-spacing:.06em}
body.nav-open{overflow:hidden}

/* ═══ HERO ═══ */
#hero{position:relative;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
#three-canvas{position:absolute;inset:0;z-index:0;pointer-events:none}
.hero-vignette{position:absolute;inset:0;z-index:1;background:radial-gradient(ellipse 70% 60% at 50% 45%,transparent 40%,rgba(10,8,8,.7) 100%);pointer-events:none}
.hero-content{position:relative;z-index:2;text-align:center;max-width:1100px;padding:0 2rem;will-change:transform,opacity}
.hero-eyebrow{font-size:.66rem;letter-spacing:.45em;text-transform:uppercase;color:var(--hot);margin-bottom:1.6rem;opacity:0;transform:translateY(14px)}
body.loaded .hero-eyebrow{opacity:1;transform:none;transition:opacity 1s var(--e) 1s,transform 1s var(--e) 1s}
.hero-title{font-family:'Playfair Display',serif;font-size:clamp(3rem,7.2vw,7.6rem);font-weight:400;line-height:.98;letter-spacing:-.02em;color:#F3EAD3;perspective:600px;text-shadow:0 4px 30px rgba(0,0,0,.65),0 2px 10px rgba(0,0,0,.5)}
.hero-title .ln{display:block;overflow:hidden;padding-bottom:.06em;margin-bottom:-.06em}
.hero-title .word{display:inline-block;white-space:nowrap}
.hero-title .ch{display:inline-block;opacity:0;transform:translateY(75%) rotate(5deg);transform-origin:bottom left;transition:opacity .9s var(--e),transform .9s var(--e);will-change:transform}
body.loaded .hero-title .ch{opacity:1;transform:none}
.shimmer{font-style:italic;background:linear-gradient(110deg,var(--pulse) 20%,var(--gold) 40%,var(--hot) 55%,var(--pulse) 80%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shim 4.5s ease-in-out infinite}
.iei-big-word.shimmer{font-style:normal;font-family:'Playfair Display',serif;font-weight:400;letter-spacing:-.02em}
/* Elegant accent-word treatment — layers over .shimmer so the gradient is untouched,
   just swaps the typeface for the quoted signature words across each section */
.shimmer.accent-serif{font-family:'Spectral',serif;font-weight:300;letter-spacing:0}
@keyframes shim{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.hero-sub{font-size:.98rem;color:var(--silver);margin-top:1.5rem;font-weight:300;letter-spacing:.04em;line-height:1.75;opacity:0;transform:translateY(16px)}
body.loaded .hero-sub{opacity:1;transform:none;transition:opacity 1s var(--e) 1.9s,transform 1s var(--e) 1.9s}
.hero-btns{display:flex;gap:1rem;justify-content:center;margin-top:2rem;opacity:0;transform:translateY(16px)}
body.loaded .hero-btns{opacity:1;transform:none;transition:opacity 1s var(--e) 2.1s,transform 1s var(--e) 2.1s}
.btn-p{padding:.9rem 2.6rem;background:var(--pulse);color:#F3EAD3;border:none;border-radius:50px;font-size:.84rem;font-weight:500;letter-spacing:.03em;cursor:none;text-decoration:none;display:inline-block;position:relative;overflow:hidden;transition:box-shadow .4s,background .4s;will-change:transform}
.btn-p::before{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(243,234,211,.22) 50%,transparent 70%);transform:translateX(-110%);transition:transform .7s var(--e)}
.btn-p:hover{box-shadow:0 8px 40px rgba(236,32,39,.45);background:var(--hot)}
.btn-p:hover::before{transform:translateX(110%)}
.btn-g{padding:.9rem 2.6rem;background:rgba(243,234,211,.02);color:var(--mist);border:1px solid rgba(243,234,211,.18);border-radius:50px;font-size:.84rem;cursor:none;text-decoration:none;display:inline-block;transition:border-color .35s,color .35s,background .35s;will-change:transform}
.btn-g:hover{border-color:var(--hot);color:#F3EAD3;background:rgba(236,32,39,.08)}
.scroll-ind{position:absolute;bottom:2.2rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:.55rem;z-index:2;opacity:0}
body.loaded .scroll-ind{opacity:1;transition:opacity 1s ease 2.6s}
.scroll-ind span{font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;color:var(--silver)}
.scroll-line{width:1px;height:52px;background:linear-gradient(to bottom,var(--hot),transparent);animation:sp 2.2s var(--e) infinite}
@keyframes sp{0%{transform:scaleY(0);transform-origin:top;opacity:1}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom;opacity:.6}}

/* ═══ REVEALS ═══ */
.rv{opacity:0;transform:translateY(56px);transition:opacity 1.1s var(--e),transform 1.1s var(--e)}
.rv.in{opacity:1;transform:none}
.rv-clip{clip-path:inset(0 0 100% 0);transition:clip-path 1.2s var(--e)}
.rv-clip.in{clip-path:inset(0 0 0% 0)}
.rv-scale{opacity:0;transform:scale(.92) translateY(30px);transition:opacity 1s var(--e),transform 1.2s var(--e)}
.rv-scale.in{opacity:1;transform:none}
.rv-l{opacity:0;transform:translateX(-50px);transition:opacity 1s var(--e),transform 1s var(--e)}
.rv-l.in{opacity:1;transform:none}
.rv-r{opacity:0;transform:translateX(50px);transition:opacity 1s var(--e),transform 1s var(--e)}
.rv-r.in{opacity:1;transform:none}

/* ═══ SHARED 3D BACKDROP ═══ */
.ico-bg-canvas{position:absolute;inset:0;z-index:0;opacity:.55;pointer-events:none}

/* ═══ STORY SHARED ═══ */
.story-deco{position:absolute;font-family:'Playfair Display',serif;font-weight:700;color:transparent;-webkit-text-stroke:1px rgba(var(--ink-rgb),.03);user-select:none;pointer-events:none;line-height:1;top:50%;left:50%;transform:translate(-50%,-50%);will-change:transform}

#story-wrapper{overflow-x:clip}
/* ═══ IEI (block 1) ═══ */
.iei-block{position:relative;min-height:100vh;background:var(--void);display:flex;align-items:center;justify-content:center;overflow:hidden}
.iei-orb{position:absolute;border-radius:50%;filter:blur(95px);pointer-events:none;will-change:transform}
.iei-orb1{width:540px;height:540px;background:radial-gradient(circle,rgba(236,32,39,.2),transparent 70%);top:-90px;left:-110px}
.iei-orb2{width:430px;height:430px;background:radial-gradient(circle,rgba(255,107,74,.12),transparent 70%);bottom:-70px;right:-90px}
.iei-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(var(--ink-rgb),.022) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--ink-rgb),.022) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent);-webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)}
.iei-rule{position:absolute;left:0;right:0;height:.5px;background:linear-gradient(90deg,transparent,rgba(var(--ink-rgb),.06) 20%,rgba(var(--ink-rgb),.06) 80%,transparent)}
.iei-rule-top{top:0}.iei-rule-bot{bottom:0}
.iei-badge{position:absolute;top:36px;right:36px;z-index:3;padding:6px 16px;border:.5px solid rgba(var(--ink-rgb),.1);border-radius:50px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(var(--ink-rgb),.3)}
.iei-content{position:relative;z-index:2;width:100%;max-width:1100px;padding:100px 40px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.iei-eyebrow{font-size:11px;letter-spacing:.35em;text-transform:uppercase;color:var(--pulse);margin-bottom:28px;position:relative;display:inline-block}
.iei-eyebrow::after{content:'';position:absolute;bottom:-8px;left:0;width:100%;height:1px;background:linear-gradient(90deg,var(--pulse),transparent);transform:scaleX(0);transform-origin:left;transition:transform 1s var(--e) .5s}
.rv.in .iei-eyebrow::after{transform:scaleX(1)}
.iei-word-stack{display:flex;flex-direction:column;gap:6px}
.iei-big-word{font-family:'Playfair Display',serif;font-size:clamp(48px,7vw,88px);font-weight:400;line-height:1;letter-spacing:-.02em;color:var(--light);display:flex;align-items:center;gap:14px;opacity:0;transform:translateX(-44px) perspective(600px) rotateY(20deg);transition:opacity 1s var(--e),transform 1s var(--e)}
.rv.in .iei-big-word{opacity:1;transform:none}
.rv.in .iei-w1{transition-delay:.1s}.rv.in .iei-w2{transition-delay:.24s}.rv.in .iei-w3{transition-delay:.38s}
.iei-dot{width:8px;height:8px;border-radius:50%;background:var(--pulse);flex-shrink:0;opacity:.6;animation:dotPulse 2.4s ease-in-out infinite}
.iei-w2 .iei-dot{animation-delay:.4s}.iei-w3 .iei-dot{animation-delay:.8s}
@keyframes dotPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.5);opacity:1}}
.iei-dot-white{background:var(--light)}
.iei-body{font-size:15px;line-height:1.75;color:rgba(var(--ink-rgb),.4);font-weight:300;margin-top:36px;max-width:380px}
.iei-right{display:flex;flex-direction:column;gap:14px}
.iei-card{background:rgba(var(--ink-rgb),.025);border:.5px solid rgba(var(--ink-rgb),.08);border-radius:20px;padding:26px 28px;display:flex;align-items:flex-start;gap:18px;position:relative;overflow:hidden;transition:border-color .4s,background .4s,transform .5s var(--e),box-shadow .5s;will-change:transform}
.iei-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(236,32,39,.5),transparent);opacity:0;transition:opacity .4s}
.iei-card:hover{border-color:rgba(236,32,39,.3);background:rgba(236,32,39,.045);transform:translateX(6px) scale(1.015);box-shadow:0 12px 40px rgba(0,0,0,.35)}
.iei-card:hover::before{opacity:1}
.iei-card-icon{width:44px;height:44px;border-radius:12px;background:rgba(236,32,39,.1);border:.5px solid rgba(236,32,39,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .4s,transform .4s var(--e)}
.iei-card:hover .iei-card-icon{background:rgba(236,32,39,.2);transform:rotate(-6deg) scale(1.08)}
.iei-card-icon svg{width:20px;height:20px;stroke:var(--pulse);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.iei-card-label{font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--hot);opacity:.7;margin-bottom:5px}
.iei-card-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:400;color:var(--light);margin-bottom:7px;line-height:1.2}
.iei-card-desc{font-size:13px;color:rgba(var(--ink-rgb),.38);font-weight:300;line-height:1.6}

/* ═══ SMS (block 2) ═══ */
.sms-block{position:relative;min-height:100vh;background:var(--deep);display:flex;align-items:center;justify-content:center;overflow:hidden}
.sms-orb{position:absolute;border-radius:50%;filter:blur(105px);pointer-events:none;will-change:transform}
.sms-orb1{width:620px;height:620px;background:radial-gradient(circle,rgba(236,32,39,.13),transparent 70%);top:50%;left:-160px;transform:translateY(-50%)}
.sms-orb2{width:360px;height:360px;background:radial-gradient(circle,rgba(255,107,74,.08),transparent 70%);bottom:-90px;right:70px}
.sms-content{position:relative;z-index:2;width:100%;max-width:1100px;padding:100px 40px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.sms-eyebrow{font-size:11px;letter-spacing:.35em;text-transform:uppercase;color:var(--pulse);margin-bottom:32px}
.sms-headline{display:flex;flex-direction:column;gap:4px;margin-bottom:32px}
.sms-h-plain{font-family:'Playfair Display',serif;font-size:clamp(42px,6.5vw,82px);font-weight:400;line-height:1;letter-spacing:-.02em;color:#F3EAD3}
.sms-h-sm{font-size:clamp(28px,4vw,52px);color:rgba(243,234,211,.4);font-style:italic}
.sms-h-italic{font-family:'Playfair Display',serif;font-size:clamp(52px,8vw,100px);font-weight:700;font-style:italic;line-height:.95;letter-spacing:-.03em}
.sms-sub{font-size:15px;line-height:1.75;color:rgba(243,234,211,.42);font-weight:300;max-width:400px;margin-bottom:48px}
.sms-quote{padding-left:22px;position:relative}
.sms-quote-bar{position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--pulse);border-radius:2px;transform:scaleY(0);transform-origin:top;transition:transform 1.1s var(--e) .4s;box-shadow:0 0 12px rgba(236,32,39,.5)}
.rv.in .sms-quote-bar{transform:scaleY(1)}
.sms-quote-text{font-family:'Playfair Display',serif;font-style:italic;font-size:18px;color:rgba(243,234,211,.7);line-height:1.5;margin-bottom:10px}
.sms-quote-attr{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:rgba(243,234,211,.25)}
.sms-right{display:flex;flex-direction:column;padding-top:8px;position:relative}
.sms-track{position:absolute;left:21px;top:20px;bottom:20px;width:1px;background:rgba(243,234,211,.06)}
.sms-track-fill{position:absolute;left:0;top:0;width:100%;height:100%;background:linear-gradient(to bottom,var(--pulse),var(--hot));transform:scaleY(0);transform-origin:top;box-shadow:0 0 10px rgba(236,32,39,.4)}
.sms-step{display:flex;gap:20px;align-items:flex-start;padding:16px 0;position:relative;z-index:1;opacity:.28;transform:translateX(14px);transition:opacity .7s var(--e),transform .7s var(--e)}
.sms-step.on{opacity:1;transform:none}
.sms-step-num{width:42px;height:42px;border-radius:50%;border:1px solid rgba(236,32,39,.3);display:flex;align-items:center;justify-content:center;font-size:11px;letter-spacing:.1em;color:var(--hot);font-weight:500;flex-shrink:0;background:var(--deep);transition:background .5s,border-color .5s,box-shadow .5s,transform .5s var(--e)}
.sms-step.on .sms-step-num{background:rgba(236,32,39,.16);border-color:var(--pulse);box-shadow:0 0 20px rgba(236,32,39,.3);transform:scale(1.08)}
.sms-step-body{padding-top:10px;flex:1}
.sms-step-title{font-family:'Playfair Display',serif;font-size:19px;font-weight:400;color:#F3EAD3;margin-bottom:7px;line-height:1.2}
.sms-step-desc{font-size:13px;color:rgba(243,234,211,.38);line-height:1.65;font-weight:300;max-width:340px}

/* ═══ FFW (block 3) ═══ */
.ffw-block{position:relative;min-height:100vh;background:var(--void);display:flex;align-items:center;justify-content:center;overflow:hidden}
.ffw-orb{position:absolute;border-radius:50%;filter:blur(105px);pointer-events:none;will-change:transform}
.ffw-orb1{width:520px;height:520px;background:radial-gradient(circle,rgba(236,32,39,.12),transparent 70%);top:10%;right:-110px}
.ffw-orb2{width:360px;height:360px;background:radial-gradient(circle,rgba(236,32,39,.08),transparent 70%);bottom:5%;left:5%}
.ffw-content{position:relative;z-index:2;width:100%;max-width:1200px;padding:80px 40px;display:flex;flex-direction:column;gap:56px}
.ffw-headline{text-align:center}
.ffw-eyebrow{font-size:11px;letter-spacing:.35em;text-transform:uppercase;color:var(--pulse);margin-bottom:20px}
.ffw-h{font-family:'Playfair Display',serif;font-size:clamp(36px,5.5vw,72px);font-weight:400;line-height:1.05;color:var(--light);margin-bottom:16px;letter-spacing:-.02em}
.ffw-h em{font-style:italic;color:rgba(var(--ink-rgb),.42)}
.ffw-h-accent{font-style:italic}
.ffw-h-accent.shimmer{font-style:normal;font-family:inherit;font-weight:inherit;letter-spacing:-.02em}
.section-title em.shimmer{font-style:normal;font-family:inherit;font-weight:inherit;letter-spacing:-.02em}
.contact-title em.shimmer{font-style:normal;font-family:inherit;font-weight:inherit;letter-spacing:-.02em}
.ffw-sub{font-size:15px;color:rgba(var(--ink-rgb),.4);font-weight:300;line-height:1.7;max-width:540px;margin:0 auto}
.ffw-illustrations{display:grid;grid-template-columns:1fr auto 1fr;gap:0;align-items:center}
.ffw-ill-wrap{display:flex;flex-direction:column}
.ffw-ill-label{display:flex;align-items:baseline;gap:10px;padding:0 4px 12px;border-bottom:.5px solid rgba(var(--ink-rgb),.07);margin-bottom:12px}
.ffw-ill-num{font-size:11px;letter-spacing:.25em;color:var(--pulse);opacity:.7}
.ffw-ill-title{font-family:'Playfair Display',serif;font-size:17px;color:var(--light);font-weight:400}
.ffw-ill-sub{font-size:11px;color:rgba(var(--ink-rgb),.3);letter-spacing:.05em;margin-left:auto}
.ffw-scene{border:.5px solid rgba(var(--ink-rgb),.07);border-radius:16px;overflow:hidden;background:#0A0808;position:relative;transition:border-color .5s,box-shadow .5s,transform .6s var(--e)}
.ffw-scene:hover{border-color:rgba(236,32,39,.28);box-shadow:0 20px 60px rgba(0,0,0,.45),0 0 40px rgba(236,32,39,.06);transform:translateY(-4px)}
.ffw-scene svg{display:block}
.ffw-arrow-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;padding:0 24px;min-width:80px}
.ffw-dash{width:1px;height:44px;background-image:linear-gradient(to bottom,var(--pulse) 45%,transparent 45%);background-size:1px 9px;animation:dashFlow 1.1s linear infinite}
@keyframes dashFlow{to{background-position:0 9px}}
.ffw-arrow-label,.ffw-arrow-label2{font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:rgba(var(--ink-rgb),.25);white-space:nowrap}
.ffw-arrow-icon{flex-shrink:0;animation:arrowPulse 2s var(--e) infinite}
@keyframes arrowPulse{0%,100%{transform:translateX(0);opacity:.65}50%{transform:translateX(5px);opacity:1}}
@keyframes arrowPulseV{0%,100%{transform:rotate(90deg) translateX(0);opacity:.65}50%{transform:rotate(90deg) translateX(5px);opacity:1}}
.ffw-win-flicker{animation:winFlicker 4s ease-in-out infinite}
.ffw-win-flicker2{animation:winFlicker 4s ease-in-out 1.5s infinite}
.ffw-smoke1{animation:smokeDrift 5.5s ease-in-out infinite}
.ffw-smoke2{animation:smokeDrift 5.5s ease-in-out 2s infinite}
@keyframes winFlicker{0%,100%{opacity:1}45%,55%{opacity:.35}}
@keyframes smokeDrift{0%{transform:translateY(0);opacity:.8}50%{transform:translateY(-9px);opacity:.15}100%{transform:translateY(-16px);opacity:0}}
.ffw-hook{animation:hookSway 4s ease-in-out infinite;transform-box:fill-box;transform-origin:top center}
@keyframes hookSway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
.ffw-spot{animation:spotFlicker 6s ease-in-out infinite}
.ffw-spot2{animation:spotFlicker 6s ease-in-out 2.2s infinite}
@keyframes spotFlicker{0%,100%{opacity:1}48%,52%{opacity:.55}}
.ffw-screen-shine{animation:screenSweep 5s var(--e) infinite}
@keyframes screenSweep{0%,60%{transform:translateX(-300px)}100%{transform:translateX(600px)}}
/* ═══ YBE (block 4) ═══ */
.ybe-block{position:relative;min-height:100vh;background:var(--deep);display:flex;align-items:center;justify-content:center;overflow:hidden}
.ybe-orb{position:absolute;border-radius:50%;filter:blur(115px);pointer-events:none;will-change:transform}
.ybe-orb1{width:620px;height:620px;background:radial-gradient(circle,rgba(236,32,39,.1),transparent 70%);top:-110px;left:50%;transform:translateX(-50%)}
.ybe-orb2{width:420px;height:420px;background:radial-gradient(circle,rgba(236,32,39,.07),transparent 70%);bottom:-90px;right:-90px}
.ybe-content{position:relative;z-index:2;width:100%;max-width:1200px;padding:80px 40px;display:flex;flex-direction:column;gap:52px}
.ybe-headline{text-align:center}
.ybe-eyebrow{font-size:11px;letter-spacing:.35em;text-transform:uppercase;color:var(--pulse);margin-bottom:20px}
.ybe-h{font-family:'Playfair Display',serif;font-size:clamp(36px,5.5vw,70px);font-weight:400;line-height:1.05;color:#F3EAD3;margin-bottom:16px;letter-spacing:-.02em}
.ybe-h-em{font-style:italic}
.ybe-sub{font-size:15px;color:rgba(243,234,211,.4);font-weight:300;line-height:1.7;max-width:540px;margin:0 auto}
.ybe-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;perspective:1400px}
.ybe-card{background:rgba(243,234,211,.02);border:.5px solid rgba(243,234,211,.07);border-radius:18px;overflow:hidden;transition:border-color .4s,box-shadow .5s;will-change:transform;transform-style:preserve-3d}
.ybe-card:hover{border-color:rgba(236,32,39,.28);box-shadow:0 24px 70px rgba(0,0,0,.5),0 0 50px rgba(236,32,39,.05)}
.ybe-card-top{display:flex;align-items:center;gap:10px;padding:16px 20px 0}
.ybe-card-num{font-size:10px;letter-spacing:.25em;color:var(--pulse);opacity:.7}
.ybe-card-tag{font-size:12px;font-weight:500;color:rgba(243,234,211,.6);letter-spacing:.04em}
.ybe-scene-wrap{width:100%;overflow:hidden;margin-top:12px}
.ybe-scene-wrap svg{display:block;transition:transform .8s var(--e)}
.ybe-card:hover .ybe-scene-wrap svg{transform:scale(1.035)}
.ybe-card-info{padding:14px 20px 18px}
.ybe-card-desc{font-size:12px;line-height:1.65;color:rgba(243,234,211,.35);font-weight:300}
.ybe-wheel{animation:wheelSpin 1.4s linear infinite;transform-box:fill-box;transform-origin:center}
@keyframes wheelSpin{to{transform:rotate(360deg)}}
.ybe-truck-bob{animation:truckBob 1.15s ease-in-out infinite}
@keyframes truckBob{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-1.4px) rotate(-.15deg)}50%{transform:translateY(-2.6px) rotate(0deg)}75%{transform:translateY(-1.2px) rotate(.15deg)}}
.ybe-road-dash{animation:roadMove .55s linear infinite}
@keyframes roadMove{to{transform:translateX(-70px)}}
/* Barrier — real gate physics: fast swing-up with overshoot, settle, hold, then swing-down with a small settle bounce */
.ybe-barrier{animation:barrierLift 4.2s cubic-bezier(.34,1.56,.64,1) infinite;transform-box:fill-box;transform-origin:left center}
@keyframes barrierLift{
  0%,44%{transform:rotate(-8deg)}
  54%{transform:rotate(-64deg)}
  59%{transform:rotate(-54deg)}
  63%{transform:rotate(-58deg)}
  82%{transform:rotate(-58deg)}
  92%{transform:rotate(-4deg)}
  97%{transform:rotate(-10deg)}
  100%{transform:rotate(-8deg)}
}
.ybe-barrier2{animation:barrierLift2 4.2s cubic-bezier(.34,1.56,.64,1) .15s infinite;transform-box:fill-box;transform-origin:right center}
@keyframes barrierLift2{
  0%,44%{transform:rotate(8deg)}
  54%{transform:rotate(64deg)}
  59%{transform:rotate(54deg)}
  63%{transform:rotate(58deg)}
  82%{transform:rotate(58deg)}
  92%{transform:rotate(4deg)}
  97%{transform:rotate(10deg)}
  100%{transform:rotate(8deg)}
}
.ybe-headlight{animation:headlightPulse 1.8s ease-in-out infinite}
@keyframes headlightPulse{0%,100%{opacity:.45}50%{opacity:1}}
.ybe-lightcone{animation:coneFlicker 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:left center}
@keyframes coneFlicker{0%,100%{opacity:.12;transform:scaleX(.94)}50%{opacity:.32;transform:scaleX(1.04)}}
/* People — weight-shift sway reads far more organic than a pure vertical bob */
.ybe-person-bob{animation:personSway 2.6s ease-in-out infinite}
.ybe-person-bob2{animation:personSway 2.6s ease-in-out .9s infinite}
@keyframes personSway{0%,100%{transform:translate(0,0) rotate(0deg)}30%{transform:translate(.6px,-1.6px) rotate(.6deg)}60%{transform:translate(-.5px,-2.4px) rotate(-.5deg)}80%{transform:translate(.3px,-1px) rotate(.3deg)}}
.ybe-screen-glow{animation:screenGlow 2.4s ease-in-out infinite}
@keyframes screenGlow{0%,100%{opacity:.55}50%{opacity:1}}
/* Diagonal light-sweep across every brand screen — reuses the same timing as the FFW booth screen for consistency */
.ybe-screen-shine{animation:ybeScreenSweep 4.2s cubic-bezier(.4,0,.2,1) infinite}
@keyframes ybeScreenSweep{0%,55%{transform:translateX(-140px) skewX(-18deg)}100%{transform:translateX(280px) skewX(-18deg)}}
/* Product turntable illusion: scaleX pulse + drifting highlight sells a slow 360° spin on a flat icon */
.ybe-product-spin{animation:productSpin 3.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes productSpin{0%,100%{transform:scaleX(1)}25%{transform:scaleX(.42)}50%{transform:scaleX(1)}75%{transform:scaleX(.42)}}
.ybe-product-shine{animation:productShine 3.4s ease-in-out infinite}
@keyframes productShine{0%,100%{opacity:.15;transform:translateX(-3px)}50%{opacity:.55;transform:translateX(3px)}}
.ybe-product-glow{animation:productGlow 3.4s ease-in-out infinite}
@keyframes productGlow{0%,50%,100%{opacity:.55;transform:scaleX(1)}25%,75%{opacity:.85;transform:scaleX(.7)}}
/* Museum-style spotlight sweep — subtle rotation around the fixture, not the cone tip */
.ybe-spot-sweep{animation:spotSweep 6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}
.ybe-spot-sweep.rev{animation-direction:alternate-reverse;animation-delay:-2s}
@keyframes spotSweep{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
/* Exhaust puffs from the tailpipe — drift back and dissolve */
.ybe-exhaust{animation:exhaustPuff 1.6s ease-out infinite}
@keyframes exhaustPuff{0%{transform:translate(0,0) scale(.4);opacity:.35}70%{opacity:.15}100%{transform:translate(-16px,-5px) scale(1.6);opacity:0}}
/* Queued car creeps forward as the barrier lifts, settles, then eases back in sync as it closes */
.ybe-car-creep{animation:carCreep 4.2s cubic-bezier(.34,1.56,.64,1) infinite}
@keyframes carCreep{0%,44%{transform:translateX(0)}63%,82%{transform:translateX(10px)}97%,100%{transform:translateX(0)}}
/* Scenes "wake up" on hover — wheels spin faster, road rushes by quicker,
   screens brighten and sweep quicker, light cones flare — reads like the
   whole illustration reacts to attention instead of looping passively */
.ybe-card:hover .ybe-wheel{animation-duration:.55s}
.ybe-card:hover .ybe-road-dash{animation-duration:.22s}
.ybe-card:hover .ybe-truck-bob{animation-duration:.7s}
.ybe-card:hover .ybe-screen-glow{animation-play-state:paused;opacity:1}
.ybe-card:hover .ybe-screen-shine{animation-duration:1.7s}
.ybe-card:hover .ybe-lightcone{animation-duration:.9s}
.ybe-card:hover .ybe-product-spin{animation-duration:1.8s}
.ybe-card:hover .ybe-spot-sweep{animation-duration:2.4s}

/* ═══ SERVICES ═══ */
#services{position:relative;background:var(--deep)}
.services-sticky-wrapper{height:840vh;position:relative}
.services-sticky{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;align-items:stretch}
.services-left{width:42%;display:flex;flex-direction:column;justify-content:center;padding:5rem 4rem;position:relative;z-index:2;flex-shrink:0}
.svc-eyebrow{font-size:.68rem;letter-spacing:.35em;text-transform:uppercase;color:var(--hot);margin-bottom:1.5rem}
.svc-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,3.5vw,3.5rem);font-weight:400;line-height:1.1;color:#F3EAD3}
.svc-info-panel{margin-top:3rem;position:relative;min-height:200px}
.svc-info-item{position:absolute;top:0;left:0;right:0;opacity:0;transform:translateY(24px);transition:opacity .25s var(--e),transform .3s var(--e);pointer-events:none}
.svc-info-item.active{opacity:1;transform:none;pointer-events:auto;transition:opacity .5s var(--e) .15s,transform .5s var(--e) .15s}
.svc-info-num{font-size:.62rem;letter-spacing:.3em;text-transform:uppercase;color:var(--hot);margin-bottom:.75rem}
.svc-info-title{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,2.5vw,2.2rem);color:#F3EAD3;font-weight:400;margin-bottom:1rem;line-height:1.2}
.svc-info-desc{font-size:.92rem;line-height:1.8;color:var(--silver);font-weight:300;max-width:360px}
.svc-nav{display:flex;flex-direction:column;gap:14px;margin-top:2.5rem}
.svc-dots{display:flex;gap:.6rem}
.svc-dot{width:6px;height:6px;border-radius:50%;background:rgba(243,234,211,.2);transition:all .5s var(--e)}
.svc-dot.active{background:var(--hot);width:26px;border-radius:3px;box-shadow:0 0 10px rgba(236,32,39,.5)}
.svc-bar{width:200px;height:2px;background:rgba(243,234,211,.06);border-radius:2px;overflow:hidden}
.svc-bar-fill{height:100%;width:0;background:linear-gradient(90deg,var(--pulse),var(--hot));border-radius:2px;box-shadow:0 0 8px rgba(236,32,39,.4)}
.services-right{flex:1;position:relative;display:flex;align-items:center;justify-content:center;perspective:1500px;overflow:hidden}
.svc-orb{position:absolute;border-radius:50%;filter:blur(85px);pointer-events:none}
.svc-orb-1{width:520px;height:520px;background:radial-gradient(circle,rgba(236,32,39,.13),transparent 70%);right:-110px;top:50%;transform:translateY(-50%)}
.svc-card-stage{position:relative;width:340px;height:420px;transform-style:preserve-3d}
.svc-card{position:absolute;inset:0;background:rgba(243,234,211,.03);border:1px solid rgba(243,234,211,.08);border-radius:24px;padding:2.5rem;display:flex;flex-direction:column;justify-content:space-between;will-change:transform,opacity;transform-style:preserve-3d;transition:border-color .5s,box-shadow .5s}
.svc-card.is-active{border-color:rgba(236,32,39,.35);box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 60px rgba(236,32,39,.08)}
.svc-card.is-active::before{content:'';position:absolute;inset:-1px;border-radius:25px;background:linear-gradient(135deg,rgba(236,32,39,.16),rgba(255,107,74,.06),transparent);z-index:-1}
.svc-card-icon{width:44px;height:44px;margin-bottom:1.25rem}
.svc-card-icon svg{width:100%;height:100%;stroke:var(--hot);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.svc-card-label{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:var(--hot);opacity:.7;margin-bottom:.5rem}
.svc-card-name{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:400;color:#F3EAD3;line-height:1.2}

/* ═══ ABOUT ═══ */
#about{background:var(--void);position:relative;overflow:hidden;min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;max-width:1400px;margin:0 auto;padding:8rem 3rem;gap:6rem}
.section-eyebrow{font-size:.68rem;letter-spacing:.35em;text-transform:uppercase;color:var(--hot);margin-bottom:1.5rem}
.section-title{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,5vw,5rem);font-weight:400;line-height:1.1;letter-spacing:-.02em;color:var(--light);margin-bottom:1.5rem}
.section-body{font-size:1.05rem;line-height:1.8;color:var(--silver);max-width:600px;font-weight:300}
/* Links inside CMS-edited copy (<RichText />): inherit the paragraph colour, accent underline */
.rt-link{color:inherit;text-decoration:underline;text-decoration-color:var(--pulse);text-decoration-thickness:1px;text-underline-offset:3px;transition:color .25s,text-decoration-color .25s}
.rt-link:hover{color:var(--hot);text-decoration-color:var(--hot)}
.about-visual{position:relative;height:600px}
.about-orb{position:absolute;border-radius:50%;filter:blur(65px);animation:orbFloat 9s ease-in-out infinite;pointer-events:none}
.orb-1{width:410px;height:410px;background:radial-gradient(circle,rgba(236,32,39,.28),transparent 70%);top:10%;left:5%}
.orb-2{width:310px;height:310px;background:radial-gradient(circle,rgba(255,107,74,.16),transparent 70%);bottom:10%;right:0;animation-delay:-4.5s}
@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(22px,-30px) scale(1.06)}66%{transform:translate(-16px,20px) scale(.95)}}
.about-card-grid{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:2rem}
.about-card{background:rgba(var(--ink-rgb),.04);border:1px solid rgba(var(--ink-rgb),.08);border-radius:16px;padding:1.5rem;transition:border-color .35s;position:relative;overflow:hidden;will-change:transform}
.about-card:hover{border-color:rgba(255,81,87,.28)}
.card-shine{position:absolute;inset:0;border-radius:inherit;opacity:0;transition:opacity .3s;pointer-events:none;z-index:10}
.about-card-label{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--hot);margin-bottom:.5rem}
.about-card-val{font-family:'Playfair Display',serif;font-size:clamp(1.3rem,2.2vw,1.8rem);color:var(--light);overflow-wrap:break-word}
.about-card-desc{font-size:.73rem;color:var(--silver);margin-top:.25rem;font-weight:300;overflow-wrap:break-word}
.about-values{margin-top:3rem;display:flex;flex-wrap:wrap;gap:.75rem}
.value-pill{padding:.5rem 1.2rem;border:1px solid rgba(var(--ink-rgb),.12);border-radius:50px;font-size:.78rem;color:var(--mist);transition:all .35s;cursor:none}
.value-pill:hover{border-color:var(--hot);color:var(--hot);background:rgba(236,32,39,.06);transform:translateY(-2px)}

/* ═══ PORTFOLIO ═══ */
#portfolio{padding:8rem 3rem;background:var(--void);position:relative;overflow:hidden}
.portfolio-header{position:relative;text-align:center;margin-bottom:5rem}
.work-grid{column-count:3;column-gap:1.25rem;max-width:1200px;margin:0 auto}
.work-photo{display:block;position:relative;width:100%;margin:0 0 1.25rem;padding:0;border:1px solid rgba(243,234,211,.06);border-radius:16px;overflow:hidden;background:none;cursor:none;break-inside:avoid;text-decoration:none;transition:border-color .4s,box-shadow .5s,transform .5s var(--e)}
.work-photo:hover{border-color:rgba(236,32,39,.3);box-shadow:0 20px 60px rgba(0,0,0,.5);transform:translateY(-4px)}
.work-photo img{display:block;width:100%;height:auto;transition:transform .6s var(--e)}
.work-photo:hover img{transform:scale(1.045)}
.work-photo-label{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;gap:.3rem;padding:1.25rem;background:linear-gradient(to top,rgba(10,8,8,.92),transparent 60%);opacity:0;transition:opacity .35s var(--e)}
.work-photo:hover .work-photo-label{opacity:1}
.work-photo-client{font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:var(--hot);font-weight:500}
.work-photo-cta{font-size:.82rem;color:#F3EAD3;font-weight:500}

/* ═══ CASE STUDY ═══ */
.case-study{background:var(--void);min-height:100vh;padding:9rem 3rem 6rem;max-width:1000px;margin:0 auto}
.case-study-notfound{background:var(--void);min-height:100vh;padding:9rem 3rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1.5rem}
.case-study-head{margin-bottom:3rem}
.case-study-back{display:inline-block;color:var(--silver);font-size:.82rem;text-decoration:none;margin-bottom:1.5rem;transition:color .3s}
.case-study-back:hover{color:var(--hot)}
.case-study-title{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,4.5vw,3.6rem);font-weight:400;line-height:1.1;color:var(--light);margin:.5rem 0 .75rem}
.case-study-client{font-size:.95rem;color:var(--hot);font-weight:500;margin-bottom:1.25rem}
.case-study-summary{font-size:1.05rem;line-height:1.8;color:var(--silver);max-width:640px;font-weight:300}
.case-study-hero{border-radius:20px;overflow:hidden;margin-bottom:1.25rem;border:1px solid rgba(243,234,211,.08)}
.case-study-hero img{display:block;width:100%;height:auto}
.case-study-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:4rem}
.case-study-grid picture{display:block;border-radius:16px;overflow:hidden;border:1px solid rgba(243,234,211,.08)}
.case-study-grid img{display:block;width:100%;height:auto}
.case-study-nav{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;border-top:1px solid rgba(243,234,211,.08);padding-top:2rem}
.case-study-nav-link{display:flex;flex-direction:column;gap:.4rem;padding:1.25rem;border:1px solid rgba(243,234,211,.08);border-radius:14px;text-decoration:none;transition:border-color .3s,background .3s}
.case-study-nav-link:hover{border-color:rgba(236,32,39,.3);background:rgba(236,32,39,.04)}
.case-study-nav-link span{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--hot)}
.case-study-nav-link strong{font-family:'Playfair Display',serif;font-weight:400;font-size:1.1rem;color:var(--light)}
.case-study-nav-next{text-align:right;align-items:flex-end}
/* ═══ SECTION PAGES (InfoPage) + Read-more buttons ═══ */
.read-more{margin-top:2rem}
.ybe-headline .read-more,.ffw-headline .read-more{margin-top:1.75rem}
.info-page .case-study-title:focus{outline:none}
.info-page .case-study-title:focus-visible{outline:2px solid var(--hot);outline-offset:6px}
.info-body{max-width:720px;margin-bottom:4rem}
.info-h2{font-family:'Playfair Display',serif;font-weight:400;font-size:clamp(1.5rem,2.6vw,2rem);line-height:1.2;color:var(--light);margin:3rem 0 1rem}
.info-h3{font-size:1.1rem;font-weight:500;color:var(--mist);margin:2rem 0 .75rem}
.info-p{font-size:1.05rem;line-height:1.85;color:var(--silver);font-weight:300;margin:0 0 1.25rem}
.info-list{list-style-type:disc;padding-left:1.4rem;margin:0 0 1.5rem;color:var(--silver);font-size:1.02rem;line-height:1.8;font-weight:300}
.info-list li{margin-bottom:.5rem}
.info-list li::marker{color:var(--pulse)}
.info-cta{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;padding:2rem 0;margin-bottom:3rem;border-top:1px solid rgba(243,234,211,.08)}
.info-cta-text{font-family:'Playfair Display',serif;font-size:1.35rem;color:var(--light)}
.info-related{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.footer-pages{opacity:.85}

/* ═══ CLIENTS ═══ */
#clients{padding:5rem 0;border-top:1px solid rgba(var(--ink-rgb),.06);border-bottom:1px solid rgba(var(--ink-rgb),.06);overflow:hidden;background:var(--void)}
.ticker-label{text-align:center;font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;color:var(--silver);opacity:.45;margin-bottom:2.6rem}
.ticker-inner{overflow:hidden;mask-image:linear-gradient(to right,transparent,black 12%,black 88%,transparent);-webkit-mask-image:linear-gradient(to right,transparent,black 12%,black 88%,transparent)}
.ticker-inner+.ticker-inner{margin-top:1.6rem}
.ticker-track{display:flex;gap:5rem;animation:ticker 26s linear infinite;width:max-content}
.ticker-track.rev{animation:tickerRev 30s linear infinite}
.ticker-track:hover{animation-play-state:paused}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes tickerRev{from{transform:translateX(-50%)}to{transform:translateX(0)}}
.client-name{font-size:1.1rem;font-weight:300;letter-spacing:.1em;color:var(--silver);opacity:.42;white-space:nowrap;transition:opacity .3s,color .3s,text-shadow .3s;cursor:none}
.client-name:hover{opacity:1;color:var(--light);text-shadow:0 0 24px rgba(236,32,39,.5)}

/* ═══ CONTACT ═══ */
@keyframes burstPulse{0%,100%{transform:translate(-50%,-50%) scale(.9);opacity:.7}50%{transform:translate(-50%,-50%) scale(1.1);opacity:1}}
#contact{min-height:85vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:8rem 3rem;position:relative;overflow:hidden;background:var(--void)}
.contact-glow{position:absolute;width:720px;height:720px;background:radial-gradient(circle,rgba(236,32,39,.17),transparent 70%);border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);filter:blur(45px);pointer-events:none;animation:burstPulse 7s ease-in-out infinite}
.contact-content{position:relative;z-index:1;max-width:720px;min-width:0;width:100%}
.contact-title{font-family:'Playfair Display',serif;font-size:clamp(3rem,7vw,6rem);line-height:1.05;color:#F3EAD3;margin-bottom:1.5rem;font-weight:400}
.contact-body{font-size:1rem;color:var(--silver);font-weight:300;line-height:1.7;margin-bottom:3rem}
.contact-links{display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;margin-top:2.2rem}
.contact-info{font-size:.83rem;color:var(--silver);font-weight:300}
.contact-info a{color:var(--hot);text-decoration:none;position:relative}
.contact-info a::after{content:'';position:absolute;bottom:-2px;left:0;width:100%;height:1px;background:var(--hot);transform:scaleX(0);transform-origin:right;transition:transform .4s var(--e)}
.contact-info a:hover::after{transform:scaleX(1);transform-origin:left}

/* ═══ CONTACT FORM ═══ */
.contact-form{max-width:480px;margin:0 auto 1.5rem;text-align:left;display:flex;flex-direction:column;gap:1.1rem}
.contact-form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.contact-form-field{display:flex;flex-direction:column;gap:.4rem}
.contact-form-field label{font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--silver)}
.contact-form-optional{text-transform:none;letter-spacing:0;opacity:.65}
.contact-form-field input,.contact-form-field textarea{background:rgba(243,234,211,.04);border:1px solid rgba(243,234,211,.14);border-radius:10px;padding:.75rem 1rem;color:var(--light);font-family:inherit;font-size:.92rem;transition:border-color .3s,background .3s;resize:vertical;cursor:text}
.contact-form-field input:focus,.contact-form-field textarea:focus{outline:none;border-color:var(--hot);background:rgba(243,234,211,.06)}
.contact-form-field input[aria-invalid="true"],.contact-form-field textarea[aria-invalid="true"]{border-color:var(--pulse)}
.contact-form-error{font-size:.76rem;color:var(--hot)}
.contact-form-submit{align-self:center;margin-top:.25rem;cursor:pointer}
.contact-form-sent{max-width:480px;margin:0 auto 1.5rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1rem}
.contact-form-sent-title{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--light)}
.contact-form-sent-body{color:var(--silver);font-size:.92rem}
.contact-form-sent-body a{color:var(--hot)}
.contact-form-sent .btn-g{cursor:pointer}

/* ═══ FOOTER ═══ */
footer{padding:3rem;border-top:1px solid rgba(var(--ink-rgb),.06);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;background:var(--void)}
.footer-links{display:flex;gap:2rem}
.footer-links a{font-size:.73rem;color:var(--silver);text-decoration:none;letter-spacing:.08em;text-transform:uppercase;transition:color .3s}
.footer-links a:hover{color:var(--light)}
.footer-copy{font-size:.73rem;color:var(--silver);opacity:.35}

/* ═══ TYPE & CONTROLS ═══ */
.section-eyebrow,.svc-eyebrow,.iei-eyebrow,.sms-eyebrow,.ffw-eyebrow,.ybe-eyebrow,.hero-eyebrow{font-family:var(--mono);font-weight:500;font-size:10px;letter-spacing:.28em;color:var(--hot)}
.section-title,.contact-title,.ffw-h,.ybe-h,.sms-h-plain,.svc-title{letter-spacing:-.035em}
.section-title{line-height:1.02}
.hero-title{font-size:clamp(3.1rem,8.2vw,8.6rem);line-height:.93;letter-spacing:-.04em}
.hero-eyebrow{color:rgba(243,234,211,.62)}
.hero-sub{max-width:780px;margin-left:auto;margin-right:auto;color:rgba(243,234,211,.6)}
.btn-p,.btn-g{border-radius:2px;font-family:var(--mono);font-size:.72rem;letter-spacing:.2em;text-transform:uppercase}
.nav-cta{border-radius:2px;font-family:var(--mono);font-size:.68rem;letter-spacing:.2em;text-transform:uppercase}
.nav-links a{font-family:var(--mono);font-size:.68rem;letter-spacing:.22em}
.value-pill{border-radius:2px;font-family:var(--mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase}
.nav-mobile .nav-mobile-cta{border-radius:2px;font-family:var(--mono);letter-spacing:.2em;text-transform:uppercase;font-size:.75rem;text-align:center;padding:.95rem 2.4rem;min-width:min(260px,80vw)}
.iei-badge,.ffw-ill-num,.ffw-ill-sub,.ybe-card-num,.sms-step-num,.iei-card-label,.svc-info-num,.svc-card-label,.about-card-label,.ffw-arrow-label,.ffw-arrow-label2,.ticker-label,.sms-quote-attr,.work-photo-client,.contact-form-field label{font-family:var(--mono)}
.ffw-ill-sub{font-size:9.5px;letter-spacing:.08em;text-align:right}
.svc-info-panel{min-height:250px}
.iei-card,.about-card,.ybe-card,.ffw-scene,.work-photo,.contact-form-field input,.contact-form-field textarea{border-radius:4px}
.svc-card{border-radius:6px}
.iei-card-icon{border-radius:4px}
.iei-card:hover{transform:translateX(6px)}
.contact-title{font-size:clamp(3.1rem,7.6vw,6.8rem);line-height:.98}
.contact-info{font-family:var(--mono);font-size:.72rem;letter-spacing:.06em}
.footer-links a,.footer-copy{font-family:var(--mono);letter-spacing:.2em;font-size:.66rem}
footer{background:#030202}

/* Clients: large italic serif roll */
#clients{padding:6rem 0}
.ticker-track{gap:6rem}
.client-name{font-family:'Playfair Display',serif;font-style:italic;font-weight:400;font-size:clamp(1.7rem,3vw,2.7rem);letter-spacing:-.01em;opacity:.5;position:relative}
.client-name::after{content:'';position:absolute;right:-3rem;top:52%;width:5px;height:5px;background:var(--pulse);transform:translate(50%,-50%) rotate(45deg);opacity:.7}
.client-name:hover{opacity:1;text-shadow:0 0 30px rgba(236,32,39,.55)}

/* ═══ WHATSAPP ═══ */
.wa-float{position:fixed;right:1.4rem;bottom:1.4rem;z-index:700;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(37,211,102,.35),0 2px 8px rgba(0,0,0,.5);cursor:pointer;opacity:0;transform:scale(.6);transition:transform .35s var(--e),box-shadow .35s}
body.loaded .wa-float{opacity:1;transform:none;transition:opacity .8s ease 2.4s,transform .6s var(--e) 2.4s,box-shadow .35s}
body.loaded .wa-float:hover{transform:scale(1.08);transition-delay:0s;box-shadow:0 10px 36px rgba(37,211,102,.55),0 2px 8px rgba(0,0,0,.5)}
.contact-form-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:.25rem}
.contact-form-actions .contact-form-submit{margin-top:0}
.contact-form-wa{cursor:pointer}

/* ═══ TRANSITIONS ═══
   1. SceneDirector (JS) dips each scene through black with a slow
      dolly push as it enters and leaves — inline opacity/transform.
   2. Rack focus: reveals sharpen out of a blur as they rise.
   3. Portfolio stills settle from a slow push-in.
   4. RouteWipe: a curtain sweeps across between pages. */
.rv,.rv-l,.rv-r,.rv-scale{filter:blur(10px);transition-property:opacity,transform,filter;transition-duration:1.2s,1.3s,1.4s;transition-timing-function:var(--e)}
.rv.in,.rv-l.in,.rv-r.in,.rv-scale.in{filter:none}
.work-photo.rv img{transform:scale(1.22);transition:transform 1.8s var(--e),filter .6s}
.work-photo.rv.in img{transform:scale(1)}
.work-photo.rv.in:hover img{transform:scale(1.05);transition-duration:.9s}
.route-wipe{position:fixed;inset:0;z-index:960;pointer-events:none;background:#050403;border-right:2px solid var(--pulse);box-shadow:8px 0 60px rgba(236,32,39,.35);animation:routeWipe 1.15s cubic-bezier(.83,0,.17,1) .12s forwards}
@keyframes routeWipe{from{transform:translateX(0)}to{transform:translateX(102%)}}

/* ═══ RESPONSIVE ═══ */
@media(max-width:1000px){
  #about{grid-template-columns:1fr;gap:3rem;padding:6rem 2rem;min-height:0}
  .about-visual{height:auto}
}
@media(max-width:768px){
  nav{padding:1.2rem 1.5rem}.nav-links{display:none}.nav-cta{display:none}.nav-toggle{display:flex}
  #cur,#cur-ring{display:none}body{cursor:auto}
  .services-sticky-wrapper{height:504vh}
  .hero-btns{flex-direction:column;width:100%;max-width:340px;margin-left:auto;margin-right:auto}
  .hero-btns .btn-p,.hero-btns .btn-g{width:100%;padding:.9rem 1.5rem;white-space:nowrap}
  .contact-links{gap:1rem}
  .contact-form-row{grid-template-columns:1fr}
  .iei-content,.sms-content{grid-template-columns:1fr;gap:44px;padding:70px 24px}
  .iei-badge{display:none}
  .ffw-illustrations{grid-template-columns:1fr;gap:32px}
  .ffw-arrow-wrap{min-width:unset;padding:0}
  .ffw-arrow-icon{animation-name:arrowPulseV}
  .ffw-content,.ybe-content{padding:60px 20px}
  .ybe-grid{grid-template-columns:1fr}
  .services-sticky{flex-direction:column}
  .services-left{width:100%;padding:3rem 1.5rem 1rem}
  .svc-card-stage{width:250px;height:280px}
  .svc-card{padding:1.75rem;justify-content:flex-start;gap:2rem}
  .svc-card-icon{margin-bottom:0}
  #about{grid-template-columns:1fr;gap:3rem;padding:5rem 1.5rem}
  .work-grid{column-count:1}
  .work-photo-label{opacity:1;position:static;background:none;padding:.9rem 0 0}
  #portfolio{padding:5rem 1.5rem}
  .case-study-grid{grid-template-columns:1fr}
  .case-study-nav{grid-template-columns:1fr}
  .case-study{padding:7rem 1.5rem 4rem}
  footer{flex-direction:column;text-align:center;padding:2.5rem 1.5rem 4rem}
  .section-eyebrow,.svc-eyebrow,.iei-eyebrow,.sms-eyebrow,.ffw-eyebrow,.ybe-eyebrow{font-size:9px;letter-spacing:.16em}
  .section-eyebrow::before,.section-eyebrow::after,.svc-eyebrow::before,.iei-eyebrow::before,.sms-eyebrow::before,.ffw-eyebrow::before,.ffw-eyebrow::after,.ybe-eyebrow::before,.ybe-eyebrow::after{width:14px!important;margin-left:8px!important;margin-right:8px!important}
  .iei-eyebrow::before,.sms-eyebrow::before,.svc-eyebrow::before,.section-eyebrow::before{margin-left:0!important}
  .hero-eyebrow{font-size:9px;letter-spacing:.2em}
  .scroll-ind{display:none}
  .hero-title{font-size:clamp(2.6rem,12.4vw,4rem)}
  .ticker-track{gap:4rem}.client-name::after{right:-2rem}
  .footer-links{flex-wrap:wrap;justify-content:center;gap:.2rem 1.2rem}
  .footer-links a,.contact-info a{display:inline-flex;align-items:center;min-height:44px}
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}

    `}</style>
  );
}
