/* WinterDex – Generator für das OG-/Social-Bild (1200x630), gleicher Aufbau wie dexware.github.io/tools/gen-og.js.
 * Wortwahl: keine Absolutaussagen („gerichtsfest“, „rechtssicher“) — Abmahnrisiko, siehe Kampagnen-Regeln.
 *
 *   node tools/gen-og.js [ziel.png]      (Standard: og-image.png im Repo)
 *
 * Voraussetzung: Microsoft Edge (Windows). Pfad über $EDGE überschreibbar.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'og-image.png');
const W = 1200, H = 630;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'wd-og-'));

const ICON = ['winterdex-icon.png', 'assets/winterdex-icon.png'].map((f) => path.join(ROOT, f)).find((f) => fs.existsSync(f));
if (!ICON) throw new Error('winterdex-icon.png nicht gefunden');
const icon = 'data:image/png;base64,' + fs.readFileSync(ICON).toString('base64');

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
  html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden}
  .stage{position:relative;width:${W}px;height:${H}px;
    background:radial-gradient(900px 420px at 15% -10%,rgba(14,116,144,.55),transparent 70%),
               radial-gradient(700px 380px at 105% 110%,rgba(8,145,178,.35),transparent 70%),#0a1120;
    font-family:'Segoe UI',system-ui,sans-serif;color:#eef4fb}
  .row{position:absolute;left:110px;top:225px;display:flex;align-items:center;gap:42px}
  .tile{width:180px;height:180px;border-radius:40px;overflow:hidden;box-shadow:0 18px 44px rgba(0,0,0,.45)}
  .tile img{width:100%;height:100%;display:block}
  .word{font-size:96px;font-weight:700;line-height:1;letter-spacing:-.5px}
  .tag{margin-top:26px;font-size:29px;color:#a8b5c6}
  .pill{margin-top:34px;display:inline-flex;align-items:center;height:50px;padding:0 24px;border:1.5px solid rgba(6,182,212,.55);
    border-radius:26px;font-size:24px;font-weight:600;color:#22b8e0}
  .bar{position:absolute;left:0;right:0;bottom:0;height:6px;background:#0aa2c9}
</style></head><body><div class="stage">
  <div class="row">
    <div class="tile"><img src="${icon}" alt=""></div>
    <div><div class="word">WinterDex</div>
      <div class="tag">Winterdienst-Einsätze lückenlos dokumentieren</div>
      <div><span class="pill">winterdex.dexware.app</span></div></div>
  </div>
  <div class="bar"></div>
</div></body></html>`;

const htmlPath = path.join(TMP, 'og.html');
fs.writeFileSync(htmlPath, html);
execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  `--window-size=${W},${H}`, `--screenshot=${path.resolve(OUT)}`, 'file:///' + htmlPath.replace(/\\/g, '/')], { stdio: 'ignore' });
console.log(`wrote ${path.resolve(OUT)} (${W}x${H})`);
