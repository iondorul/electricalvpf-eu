#!/usr/bin/env bash
# Sincronizează vitrina publică din ../electricalvpf.app (sursa) în acest repo.
#
# electricalvpf.eu = doar site-ul de prezentare. Aplicația (login, register,
# pagini legale, planuri, oferte) și backend-ul rămân exclusiv pe
# electricalvpf.app, deci toate linkurile relative spre frontend/ devin absolute
# spre https://electricalvpf.app/frontend/.
#
# Se copiază doar starea COMMIT-uită din .app (git archive HEAD) — modificările
# necommit-uite din .app nu ajung aici. Sursa este doar citită, niciodată scrisă.
#
# Utilizare (din rădăcina electricalvpf.eu):  bash tools/sync-from-app.sh
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="${SRC:-../electricalvpf.app}"
APP_URL="https://electricalvpf.app"

# Ce intră în vitrină. .eu e o dublură curată a front-end-ului .app — toate
# paginile publice trebuie să existe fizic aici, nu doar ca linkuri spre .app.
# Singura excepție (impusă de arhitectură, nu de alegere): Login și Register,
# care duc mereu spre .app, fiindcă acolo e backend-ul/contul.
# Singurele fișiere din aplicație încărcate efectiv de pagină:
#   frontend/js/config.js        — CONFIG.API_BASE_URL, AuthSession
#   frontend/js/calculator-core.js — import ES module din calculator-jt-widget.js
#   frontend/locales/*.json      — site/module-previews.js (previzualizările din
#                                   „Explorează”) le citește cu fetch same-origin
#   ro/index.html                 — pagina omoloagă lui index.html, generată tot
#                                    de site/tools/build-home-pages.js pe .app;
#                                    paritate completă: window.SITE_PAGE_URLS
#                                    (vezi mai jos) navighează spre ea, deci
#                                    trebuie să existe și pe .eu, nu doar pe .app.
#   electrical-quote-template/index.html,
#   ro/model-deviz-instalatii-electrice/index.html
#                                — paginile de reclamă (model ofertă UK / deviz RO)
#                                  legate din nav/help-menu prin updateResourceLinks();
#                                  pagini reale pe .eu, vizitatorul rămâne pe .eu.
PATHS=(
  index.html
  site
  frontend/js/config.js
  frontend/js/calculator-core.js
  frontend/locales
  ro
  electrical-quote-template
  no
  nl
  it
  pl
  LICENSE.txt
  READ-ME.txt
)
# Unelte de build ale .app (citesc frontend/locales/*.json) — nu au sens aici.
EXCLUDE=(site/tools)

git -C "$SRC" rev-parse --verify HEAD >/dev/null
echo "Sursă: $SRC @ $(git -C "$SRC" log -1 --format='%h %s')"

rm -rf index.html site frontend ro electrical-quote-template no nl it pl
git -C "$SRC" archive --format=tar HEAD "${PATHS[@]}" | tar -x -f -
for p in "${EXCLUDE[@]}"; do rm -rf "$p"; done

printf 'electricalvpf.eu\n' > CNAME

# Paginile "home" ale vitrinei (root + variantele de limbă cu pagină proprie,
# ex. ro/index.html — vezi window.SITE_PAGE_URLS mai jos). Orice sed/verificare
# care se aplică lui index.html trebuie să se aplice identic și acestora.
HOME_PAGES=(index.html)
[ -f ro/index.html ] && HOME_PAGES+=(ro/index.html)

# Paginile de reclamă (model ofertă UK / deviz RO): pagini reale pe .eu, cu
# aceleași tipare de linkuri (frontend/login, frontend/register, frontend/legal,
# frontend/js/return-site.js) ca paginile home — intră în același tratament.
RESOURCE_PAGES=()
[ -f electrical-quote-template/index.html ] && RESOURCE_PAGES+=(electrical-quote-template/index.html)
[ -f ro/model-deviz-instalatii-electrice/index.html ] && RESOURCE_PAGES+=(ro/model-deviz-instalatii-electrice/index.html)
# Modelele de ofertă NO / NL / IT / PL (pe .app din 2026-10): pagini reale și pe .eu, aceeași rescriere.
for page in no/*/index.html nl/*/index.html it/*/index.html pl/*/index.html; do
  [ -f "$page" ] && RESOURCE_PAGES+=("$page")
done
PAGES=("${HOME_PAGES[@]}" "${RESOURCE_PAGES[@]}")

# Linkuri spre "frontend/..." (relative) sau "/frontend/..." (absolute pe
# același domeniu) -> absolute pe .app. Nu atinge src="frontend/js/config.js"
# (copie locală), importul "../frontend/js/calculator-core.js", fetch-ul
# same-origin "frontend/locales/..." / "/frontend/locales/..." (module-previews.js,
# merge neschimbat pe .eu fiindcă locale-urile sunt copiate local) și verificările
# gen pathname.includes("/frontend/") sau href.indexOf("/frontend/...") care
# citesc o valoare existentă, nu scriu un link.
sed -i \
  -e "s#href=\"frontend/#href=\"$APP_URL/frontend/#g" \
  -e "s#href=\"/frontend/#href=\"$APP_URL/frontend/#g" \
  -e "s#'frontend/legal/'#'$APP_URL/frontend/legal/'#g" \
  -e "s#'/frontend/legal/'#'$APP_URL/frontend/legal/'#g" \
  "${PAGES[@]}"

# Scripturi încărcate din /frontend/js/ cu <script src="...">, altele decât
# config.js și calculator-core.js (copii locale) — ex. return-site.js, folosit
# pe paginile de reclamă la fel ca pe Login/Register/legal pe .app.
sed -i \
  -e "/frontend\/js\/\(config\|calculator-core\)\.js/!s#src=\"frontend/#src=\"$APP_URL/frontend/#g" \
  -e "/frontend\/js\/\(config\|calculator-core\)\.js/!s#src=\"/frontend/#src=\"$APP_URL/frontend/#g" \
  "${PAGES[@]}"
sed -i \
  -e "s#href=\"frontend/#href=\"$APP_URL/frontend/#g" \
  -e "s#href=\"/frontend/#href=\"$APP_URL/frontend/#g" \
  -e "s#\`frontend/\${page}\`#\`$APP_URL/frontend/\${page}\`#g" \
  -e "s#\`/frontend/\${page}\`#\`$APP_URL/frontend/\${page}\`#g" \
  -e "s#= \"frontend/#= \"$APP_URL/frontend/#g" \
  -e "s#= \"/frontend/#= \"$APP_URL/frontend/#g" \
  -e "s#return \"frontend/#return \"$APP_URL/frontend/#g" \
  -e "s#return \"/frontend/#return \"$APP_URL/frontend/#g" \
  -e "s#\"frontend/\" +#\"$APP_URL/frontend/\" +#g" \
  -e "s#\"/frontend/\" +#\"$APP_URL/frontend/\" +#g" \
  site/*.js

# Login/Register pe .app: ?returnSite=eu face ca „Back to website” să revină
# aici (frontend/js/return-site.js din .app, listă fixă de destinații).
sed -i -E \
  -e "s#($APP_URL/frontend/(login|register)\.html)\?#\1?returnSite=eu\&#g" \
  -e "s#($APP_URL/frontend/(login|register)\.html)([\"'\`])#\1?returnSite=eu\3#g" \
  "${PAGES[@]}" site/*.js

# Resursele gratuite (modelul de ofertă UK, modelul de deviz RO): de la 2026-10
# sunt pagini reale pe .eu (vezi PATHS mai sus), NU mai sunt linkuri spre .app —
# href-urile root-relative ("/electrical-quote-template/",
# "/ro/model-deviz-instalatii-electrice/") rămân neschimbate, fiindcă paginile
# există local la aceeași cale. Verificare: updateResourceLinks() din index.html
# trebuie să trimită la căi care au un index.html local, altfel vizitatorul ar
# ajunge pe un 404 (ex. dacă .app adaugă o resursă nouă și uităm să o copiem).
while IFS= read -r url_path; do
  local_file="${url_path#/}index.html"
  if [ ! -s "$local_file" ]; then
    echo "ATENȚIE: updateResourceLinks() trimite la '$url_path' dar '$local_file' nu există local — adaugă resursa în PATHS." >&2
    exit 1
  fi
done < <({ grep -oE "setAttribute\('href', ro \? '[^']*' : '[^']*'\)" index.html || true;
            grep -oE "const urls = \{[^}]*\}" index.html ro/index.html || true;
            grep -oE 'RESOURCE_URLS[^;]*' index.html || true; } \
          | grep -oE "['\"]/[a-z-]+(/[a-z-]+)?/['\"]" | tr -d "'\"" | sort -u)

if ! grep -qE "const urls = \{[^}]*pl: '/pl/" index.html; then
  echo "ATENȚIE: nu găsesc harta resurselor (const urls = {…}) în index.html — verifică updateResourceLinks() din .app." >&2
  exit 1
fi

# window.SITE_PAGE_URLS: pe .app, fiecare intrare (ex. ro: "/ro/") e o pagină
# statică separată generată de site/tools/build-home-pages.js. .eu ține
# paritate completă — copiem și acele pagini (vezi PATHS/HOME_PAGES mai sus) —
# deci harta rămâne neschimbată. Verificare: fiecare URL din
# SITE_PAGE_URLS trebuie să aibă un index.html local, altfel alegerea limbii
# din dropdown ar duce la 404 (ex. dacă .app adaugă o limbă nouă cu pagină
# proprie și uităm să o adăugăm în PATHS).
while IFS= read -r url_path; do
  local_file="${url_path#/}index.html"
  if [ ! -s "$local_file" ]; then
    echo "ATENȚIE: window.SITE_PAGE_URLS trimite la '$url_path' dar '$local_file' nu există local — adaugă pagina în PATHS (și, dacă e cazul, exclude resursele ei de download)." >&2
    exit 1
  fi
done < <(grep -oE 'window\.SITE_PAGE_URLS = \{[^}]*\}' index.html | grep -oE '"[^"]*"' | tr -d '"')

# Paginile legale pe .app: același ?returnSite=eu, ca „Back to website” de acolo
# să revină aici (return-site.js îl păstrează și la schimbarea limbii/documentului).
sed -i -E '/frontend\/legal\//s#\.html(["'"'"'`])#.html?returnSite=eu\1#g' "${PAGES[@]}" site/*.js
if grep -nE "frontend/legal/" "${PAGES[@]}" site/*.js | grep -v "returnSite=eu" | grep -q .; then
  echo "ATENȚIE: linkuri legale fără returnSite=eu." >&2
  exit 1
fi

# Fără butonul „Salvează în ofertă” pe .eu: calculul nu poate trece din .eu în
# .app (localStorage nu se partajează între domenii). Listener-ul lui folosește
# ?. , deci fără buton calculatorul funcționează neschimbat.
sed -i -e '/id="saveJTCalculation"/d' site/calculator-jt-widget.js
if grep -q 'id="saveJTCalculation"' site/calculator-jt-widget.js; then
  echo "ATENȚIE: butonul „Salvează în ofertă” nu a putut fi eliminat." >&2
  exit 1
fi

# Verificare: nu trebuie să mai rămână nicio legătură relativă spre frontend/
# în afară de fișierele copiate local.
leftover=$(grep -nE "[\"'\`]/?frontend/" "${PAGES[@]}" site/*.js \
  | grep -vE 'frontend/js/(config|calculator-core)\.js|frontend/locales/|includes\("/frontend/"\)|indexOf\("/frontend/' || true)
if [ -n "$leftover" ]; then
  echo "ATENȚIE: linkuri relative rămase spre frontend/:" >&2
  echo "$leftover" >&2
  exit 1
fi
missing=$(grep -nE "$APP_URL/frontend/(login|register)\.html" "${PAGES[@]}" site/*.js | grep -v 'returnSite=eu' || true)
if [ -n "$missing" ]; then
  echo "ATENȚIE: linkuri Login/Register fără returnSite=eu:" >&2
  echo "$missing" >&2
  exit 1
fi
# Fiecare limbă din LOCALES (site/module-previews.js) trebuie să aibă dicționarul
# local, altfel previzualizările din „Explorează” rămân fără texte.
for lc in $(grep -oE 'var LOCALES = \[[^]]*\]' site/module-previews.js | grep -oE '"[a-z]{2}"' | tr -d '"'); do
  if [ ! -s "frontend/locales/$lc.json" ]; then
    echo "ATENȚIE: lipsește frontend/locales/$lc.json (necesar pentru site/module-previews.js)." >&2
    exit 1
  fi
done
# ---------------------------------------------------------------------------
# SEO: .eu e INDEXABIL (decizie PO, 5 octombrie 2026) — ambele domenii sunt intrări în Google.
# Fiecare pagină .eu e originalul ei: canonical, og:url, og:image, hreflang și JSON-LD trimit la .eu.
# Rămân pe .app DOAR adresele /frontend/ (Login, Register, paginile legale, return-site.js) — vezi regulile de mai sus.
EU_URL="https://electricalvpf.eu"
perl -pi -e 's#https://electricalvpf\.app/(?!frontend/)#https://electricalvpf.eu/#g' "${PAGES[@]}"

# sitemap.xml pentru .eu: din sitemap-ul .app (HEAD), doar paginile publice care există și pe .eu
# (fără /frontend/ — paginile legale trăiesc doar pe .app), cu domeniul .eu.
git -C "$SRC" show HEAD:sitemap.xml \
  | perl -ne 'next if m#<loc>https://electricalvpf\.app/frontend/#; s#https://electricalvpf\.app/#https://electricalvpf.eu/#g; print' \
  | perl -0pe 's#<!--.*?-->#<!-- electricalvpf.eu — generat de tools/sync-from-app.sh din sitemap-ul .app: doar paginile publice care există pe .eu. -->#s' \
  > sitemap.xml
cat > robots.txt <<'ROBOTS'
# electricalvpf.eu — vitrina publică, indexabilă (generat de tools/sync-from-app.sh).
User-agent: *
Allow: /

Sitemap: https://electricalvpf.eu/sitemap.xml
ROBOTS

# Verificări SEO — orice abatere oprește sincronizarea.
grep -q '</urlset>' sitemap.xml || { echo "ATENȚIE: sitemap.xml lipsește sau e incomplet." >&2; exit 1; }
if grep -q 'electricalvpf\.app\|localhost\|/frontend/' sitemap.xml; then
  echo "ATENȚIE: sitemap.xml conține adrese .app / localhost / frontend." >&2; exit 1
fi
locs=$(grep -oE '<loc>[^<]*</loc>' sitemap.xml | sed -E 's#</?loc>##g')
[ -n "$locs" ] || { echo "ATENȚIE: sitemap.xml fără nicio adresă." >&2; exit 1; }
while IFS= read -r loc; do
  local_file="${loc#$EU_URL/}index.html"
  [ -s "$local_file" ] || { echo "ATENȚIE: sitemap.xml listează '$loc', dar '$local_file' nu există pe .eu." >&2; exit 1; }
done <<< "$locs"
grep -qx 'Sitemap: https://electricalvpf.eu/sitemap.xml' robots.txt || { echo "ATENȚIE: robots.txt nu indică sitemap-ul .eu." >&2; exit 1; }
for page in "${PAGES[@]}"; do
  url="$EU_URL/${page%index.html}"
  grep -q "<link rel=\"canonical\" href=\"$url\">" "$page" || { echo "ATENȚIE: $page nu are canonical către $url." >&2; exit 1; }
  if grep -qiE '<meta[^>]+name="robots"[^>]+noindex' "$page"; then echo "ATENȚIE: $page are noindex." >&2; exit 1; fi
  if grep -nE 'https://electricalvpf\.app/' "$page" | grep -v 'electricalvpf\.app/frontend/' | grep -q .; then
    echo "ATENȚIE: $page mai are adrese .app în afara /frontend/." >&2; exit 1
  fi
  # fiecare pagină din sitemap e și o pagină copiată (și invers)
  grep -q "<loc>$url</loc>" sitemap.xml || { echo "ATENȚIE: $url lipsește din sitemap.xml." >&2; exit 1; }
done

echo "OK — vitrina sincronizată. Verifică: git status && git diff"
