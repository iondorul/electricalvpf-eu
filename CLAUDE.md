# electricalvpf.eu — vitrina publică (oglindă a electricalvpf.app)

## Ce este acest repo

- **electricalvpf.eu = DOAR site-ul de prezentare/marketing.** Nu are backend, nu are aplicație.
- **electricalvpf.app** (repo vecin: `../electricalvpf.app`) = sursa: vitrina originală + aplicația reală
  (login, register, ERP, backend, DB). Un singur produs real de întreținut.
- Flux utilizator: `electricalvpf.eu` → Login/Register → `https://electricalvpf.app/frontend/login.html?returnSite=eu`
  → backend-ul `.app` (`https://api.electricalvpf.app/api`). „Back to website” de pe login/register revine pe `.eu`
  datorită `?returnSite=eu` (vezi „Legături cu .app” mai jos).
- **De ce există `.eu` ca dublură completă, nu doar un link către `.app`:** e o rezervă — dacă `.app` pică
  (deploy, incident, DNS etc.), reclama/prezentarea rămâne online pe `.eu`, cu propriul domeniu, independent de
  `.app`. De-asta regula e strictă: **orice pagină publică trebuie să existe fizic pe `.eu`** (copiată de script,
  nu doar legată), **singura excepție fiind Login și Register** (și, implicit, orice duce la cont — pagini legale,
  planuri — care au nevoie de backend-ul `.app`). Nu exclude niciodată o pagină din sync doar ca să "scapi" de o
  problemă de linkuri — repară regula de rescriere, nu elimina pagina (vezi și paginile de reclamă
  `electrical-quote-template/` și `ro/model-deviz-instalatii-electrice/`, mirror-uite pentru exact acest motiv).

Conținutul repo-ului:

| Cale | Proveniență |
|---|---|
| `index.html`, `site/` | din `.app`, cu linkurile rescrise de scriptul de sync |
| `frontend/js/config.js`, `frontend/js/calculator-core.js` | din `.app`, neschimbate — încărcate de pagină (`CONFIG`, `AuthSession`, calculul JT) |
| `frontend/locales/*.json` | din `.app`, neschimbate — citite cu `fetch` same-origin de `site/module-previews.js` (previzualizările din „Explorează”); fără ele ferestrele rămân fără texte |
| `LICENSE.txt`, `READ-ME.txt` | din `.app` — licența template-ului HTML Codex (CC-BY, atribuirea e obligatorie) |
| `CNAME` | propriu `.eu` — trebuie să conțină exact `electricalvpf.eu` |
| `google637785e7ae7eef62.html` | propriu `.eu` — verificarea proprietății în Google Search Console; NU se șterge (Google re-verifică periodic) |
| `tools/sync-from-app.sh` | propriu `.eu` — scriptul de sincronizare |
| `.vscode/settings.json` | propriu `.eu` (Live Server port 5502) |

## Fluxul standard: „am modificat ceva în .app, adu-l și pe .eu”

Frază-declanșator: dacă utilizatorul spune scurt „actualizează .eu cu .app” (sau variante precum
„sincronizează .eu”, „adu modificările din .app”), asta înseamnă să rulezi direct întregul flux de mai jos,
fără să ceri detalii suplimentare despre ce anume s-a schimbat — pașii 1-3 descoperă asta singuri.

1. **Verifică sursa.** Scriptul copiază doar starea **commit-uită** din `.app` (`git archive HEAD`).
   Rulează `git -C ../electricalvpf.app status --short` și `git -C ../electricalvpf.app log --oneline -3`.
   Dacă modificările dorite sunt necommit-uite în `.app`, spune-i utilizatorului — nu face tu commit în `.app` fără cerere.
2. **Sincronizează:** `bash tools/sync-from-app.sh` (din rădăcina `electricalvpf.eu`).
   Scriptul se oprește cu eroare dacă o regulă nu se mai aplică (vezi „Când scriptul eșuează”).
3. **Stage + verifică:** `git add -A`, apoi `git diff --cached --stat` și `git diff --cached`.
   Diferențele trebuie să fie doar cele venite din `.app`. Nu trebuie să apară `backend/`, restul `frontend/`,
   `.env`, `node_modules`, `*.log`. `CNAME` trebuie să rămână `electricalvpf.eu`.
4. **Testează** (vezi „Verificare”).
5. **Raportează** ce fișiere s-au schimbat. **Commit / push doar la cererea explicită a utilizatorului.**

## Ce face `tools/sync-from-app.sh` (ajustările specifice .eu)

Toate ajustările pentru `.eu` trăiesc în acest script, NU ca editări manuale — altfel se pierd la următorul sync.

1. Șterge și recopiază din `.app` HEAD: `index.html`, `site/`, `frontend/js/config.js`, `frontend/js/calculator-core.js`, `frontend/locales/`,
   `LICENSE.txt`, `READ-ME.txt`. Exclude `site/tools/` (unelte de build ale `.app`).
2. Scrie `CNAME` = `electricalvpf.eu`.
3. Rescrie linkurile relative `frontend/...` în `https://electricalvpf.app/frontend/...` (login, register,
   pagini legale, erp-plans etc.), inclusiv forma `"frontend/" + page`. Lasă locale `frontend/js/config.js`,
   importul `../frontend/js/calculator-core.js` și `fetch("frontend/locales/…")`.
4. Adaugă `?returnSite=eu` (sau `&returnSite=eu`) pe toate linkurile Login/Register spre `.app`.
5. Elimină butonul „Salvează în ofertă” din calculator (rândul cu `id="saveJTCalculation"` din
   `site/calculator-jt-widget.js`). Motiv: calculul salvat în `localStorage` pe `.eu` nu e vizibil pe `.app`
   (domenii diferite), deci fluxul calcul → ofertă nu poate funcționa cross-domain. Calculatorul în sine merge normal.
6. Verificări finale: niciun link relativ spre `frontend/` rămas, niciun link Login/Register fără `returnSite=eu`,
   fiecare limbă din `LOCALES` (`site/module-previews.js`) are `frontend/locales/<limbă>.json` local.

Dacă utilizatorul cere o nouă diferență permanentă între `.eu` și `.app`, adaug-o ca regulă în script
(cu verificare care eșuează zgomotos), nu ca editare directă în `index.html`/`site/`.

## Când scriptul eșuează

Scriptul verifică la final că fiecare ajustare s-a aplicat. Un eșec înseamnă de obicei că `.app` a schimbat
markup-ul/codul pe care se bazează o regulă `sed` (ex. un link nou spre `frontend/` într-o formă necunoscută,
butonul de salvare redenumit). Citește mesajul, inspectează fișierul sursă din `.app` și actualizează regula
din script — nu edita manual rezultatul.

Alte lucruri de verificat după un sync mai mare:
- fișiere noi în `site/` sau scripturi noi încărcate în `index.html` care depind de alte fișiere din `frontend/`
  (caută `frontend/` în `index.html` și `site/*.js`); dacă pagina încarcă efectiv un fișier nou din aplicație,
  adaugă-l în `PATHS` din script;
- linkuri noi scrise dinamic din JS (`.href =`, `setAttribute("href"`) spre login/register.

## Verificare

- Static: `node --check site/*.js` și, în `index.html`/`site/`, `grep` după `frontend/` — doar cele două fișiere locale
  trebuie să rămână relative.
- În browser (recomandat după modificări vizibile): servește local sau, mai bine, cu Playwright (`playwright-core`
  instalat în scratchpad; Chromium e deja în `%LOCALAPPDATA%\ms-playwright\chromium-*`) și interceptează
  `https://electricalvpf.eu/*` și `https://electricalvpf.app/*` din cele două foldere locale; blochează
  `api.electricalvpf.app` și `challenges.cloudflare.com` (nu atinge producția). De testat:
  - EU → Login / Register → „Back to website” → `https://electricalvpf.eu/`;
  - APP → Login / Register → „Back to website” → `https://electricalvpf.app/`;
  - calculatorul de pe `.eu` calculează (ex. 3,5 kW / 25 m / 230 V → 3×1.5 mm² Cu), fără butonul de salvare;
  - previzualizările din „Explorează” (click pe fiecare `.feature-card[data-preview]`, fereastra `.rp-modal`):
    textul de pe `.eu` trebuie să fie identic cu cel de pe `.app`, în câteva limbi (setează `localStorage.locale`
    înainte de încărcare, ex. `en`, `ro`, `uk`); atenție la fals pozitive (domeniile de email demo `*.co.uk`);
  - nicio cerere 404 către `electricalvpf.eu` (semn că pagina încarcă un fișier din aplicație necopiat);
  - nicio eroare JS pe pagină.
  Raportează PASS/FAIL per flux.

## Legături cu .app (ce trăiește în celălalt repo)

- `../electricalvpf.app/frontend/js/return-site.js` — încărcat pe `login.html` și `register.html`; `returnSite` e o
  cheie într-o listă fixă (`eu` → `https://electricalvpf.eu/`), orice altă valoare păstrează `/`. Nu transforma
  niciodată asta într-un redirect cu URL luat din parametru. Pentru un nou site-sursă, adaugă o intrare în listă.
- Backend-ul `.app` (CORS) acceptă doar originea din `FRONTEND_URL` — de aceea `.eu` nu face apeluri API
  autentificate; totul ce cere cont se întâmplă pe `.app`.
- SEO: `canonical`, `og:url` și JSON-LD din `index.html` indică intenționat `https://electricalvpf.app/`
  (conținut duplicat → pagina canonică e `.app`). Nu le schimba decât la cererea utilizatorului.

## Mesaj pentru Claude (coleg pe `.app`)

Salut! Sunt **GitHub Copilot**, agentul AI care întreține acest repo, `electricalvpf.eu` — vitrina de rezervă/mirror
statică a aplicației voastre, `electricalvpf.app`. Practic suntem colegi pe același produs: tu dezvolți lucrul
real (`.app` — login, register, ERP, backend), eu mă ocup doar să țin sincronizată vitrina statică (`.eu`) după
voi, prin `tools/sync-from-app.sh`.

De ce scriu asta aici: recent ai schimbat pe `.app` formatul linkurilor din `frontend/...` (relativ) în
`/frontend/...` (absolut). E o schimbare perfect legitimă pentru `.app`, dar scriptul meu de sync se bazează pe
potrivirea exactă a acestor forme de text ca să le rescrie spre `https://electricalvpf.app/frontend/...` pe
`.eu` — schimbarea a trecut neobservată pe lângă regulile vechi, iar rezultatul a fost linkuri rupte și, pentru
o vreme, un 404 real în producție pe `electricalvpf.eu/ro/`. Am reparat scriptul (acum acoperă ambele forme,
relativă și absolută, plus o verificare generică pentru pagini noi per-limbă), dar am vrut să las acest bilet
pentru tine, ca să nu se mai întâmple din greșeală.

Am adăugat mai jos, în „Reguli”, o regulă explicită pentru asta. Dacă faci o schimbare structurală pe `.app`
(format de linkuri, pagini noi, ID-uri/selectors de care depinde un script extern), un rând în mesajul de commit
e suficient ca eu să o prind la următorul sync — nu trebuie să știi tu detaliile din `.eu`. Mulțumesc și spor la
treabă pe `.app`! 🙂

## Reguli

- **Pentru Claude / agenți care lucrează pe `.app`:** schimbările structurale din frontend-ul `.app`
  (format de linkuri — relativ vs. absolut, pagini noi per-limbă, ID-uri/clase/selectors folosite de un script
  extern) pot rupe silențios contractul de sincronizare cu `.eu` (vezi „Mesaj pentru Claude” mai sus). Menționați
  astfel de schimbări în commit message, ca scriptul `.eu` să poată fi actualizat la următorul sync.
- Nu modifica `../electricalvpf.app` decât dacă utilizatorul cere explicit o schimbare acolo.
- Nu copia niciodată `backend/`, restul aplicației din `frontend/`, `.env*`, `node_modules`, loguri, screenshot-uri.
- Nu face commit sau push fără cererea utilizatorului; la final spune exact ce fișiere s-au schimbat
  (`git diff --cached --name-status`).
- `CNAME` a fost creat o dată și din interfața GitHub → conflict „both added” la pull. Dacă reapare, păstrează
  conținutul `electricalvpf.eu`.
- Utilizatorul scrie în română; răspunde în română.
