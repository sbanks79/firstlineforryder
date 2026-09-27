// Password popup for internal FirstLine pages (not the UPS / Ryder portals).
// Load it first thing in <head>: <script src="/gate.js"></script>
// One correct entry unlocks every internal page on this device.
// Note: this keeps casual visitors out; it is not real security (the site files are public).
(function(){
  var KEY = 'fl_gate_ok';
  // SHA-256 of the password, lower-cased with single spaces ("total domination")
  var HASH = '4ea8057516119c00ebcaf02f9ef982c608797f9a76bd83edfda38ab1bbd83763';
  try{ if(localStorage.getItem(KEY) === HASH) return; }catch(e){}

  var css = document.createElement('style');
  css.id = 'flGateCss';
  css.textContent =
    'html.fl-locked,html.fl-locked body{overflow:hidden!important}' +
    'html.fl-locked body>*:not(#flGate){visibility:hidden!important}' +
    '#flGate{position:fixed;inset:0;z-index:2147483647;background:#13233A;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Barlow,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
    '#flGate form{background:#fff;color:#13233A;border-radius:12px;padding:28px 24px;width:100%;max-width:360px;box-shadow:0 12px 40px rgba(0,0,0,.35);text-align:center}' +
    '#flGate h2{margin:0 0 6px;font-size:22px}' +
    '#flGate p{margin:0 0 18px;color:#4A5A70;font-size:14px}' +
    '#flGate input{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:11px 12px;border:1.5px solid #9DBBE0;border-radius:8px;margin-bottom:12px}' +
    '#flGate input:focus{outline:none;border-color:#1F5C99;box-shadow:0 0 0 3px rgba(31,92,153,.2)}' +
    '#flGate button{width:100%;font:inherit;font-size:16px;font-weight:600;padding:11px;border:0;border-radius:8px;background:#1F5C99;color:#fff;cursor:pointer}' +
    '#flGate .err{color:#B3261E;font-size:14px;min-height:20px;margin:10px 0 0}';
  document.head.appendChild(css);
  document.documentElement.classList.add('fl-locked');

  function norm(s){ return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase(); }
  function sha256(s){
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function(b){
      return Array.prototype.map.call(new Uint8Array(b), function(x){ return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }

  function show(){
    var g = document.createElement('div');
    g.id = 'flGate';
    g.innerHTML =
      '<form autocomplete="off">' +
        '<h2>FirstLine Road West</h2>' +
        '<p>Enter the password to continue.</p>' +
        '<input type="password" id="flGatePw" placeholder="Password" aria-label="Password" autofocus>' +
        '<button type="submit">Enter</button>' +
        '<div class="err" id="flGateErr"></div>' +
      '</form>';
    document.body.appendChild(g);
    var pw = document.getElementById('flGatePw');
    pw.focus();
    g.querySelector('form').addEventListener('submit', function(ev){
      ev.preventDefault();
      sha256(norm(pw.value)).then(function(h){
        if(h === HASH){
          try{ localStorage.setItem(KEY, HASH); }catch(e){}
          g.remove(); css.remove();
          document.documentElement.classList.remove('fl-locked');
        } else {
          document.getElementById('flGateErr').textContent = 'Incorrect password. Try again.';
          pw.value = ''; pw.focus();
        }
      });
    });
  }
  if(document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
