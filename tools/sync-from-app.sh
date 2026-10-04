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

# Ce intră în vitrină. Singurele fișiere din aplicație încărcate efectiv de pagină:
#   frontend/js/config.js        — CONFIG.API_BASE_URL, AuthSession
#   frontend/js/calculator-core.js — import ES module din calculator-jt-widget.js
#   frontend/locales/*.json      — site/module-previews.js (previzualizările din
#                                   „Explorează”) le citește cu fetch same-origin
PATHS=(
  index.html
  site
  frontend/js/config.js
  frontend/js/calculator-core.js
  frontend/locales
  LICENSE.txt
  READ-ME.txt
)
# Unelte de build ale .app (citesc frontend/locales/*.json) — nu au sens aici.
EXCLUDE=(site/tools)

git -C "$SRC" rev-parse --verify HEAD >/dev/null
echo "Sursă: $SRC @ $(git -C "$SRC" log -1 --format='%h %s')"

rm -rf index.html site frontend
git -C "$SRC" archive --format=tar HEAD "${PATHS[@]}" | tar -x -f -
for p in "${EXCLUDE[@]}"; do rm -rf "$p"; done

printf 'electricalvpf.eu\n' > CNAME

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
  index.html
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
  index.html site/*.js

# Resursele gratuite (modelul de ofertă UK, modelul de deviz RO) există doar pe .app — atât în href,
# cât și în scriptul paginii (updateResourceLinks).
sed -i -E "s#([\"'])/(electrical-quote-template|ro/model-deviz-instalatii-electrice)/#\1$APP_URL/\2/#g" index.html
if grep -qE "[\"']/(electrical-quote-template|ro/model-deviz-instalatii-electrice)/" index.html; then
  echo "ATENȚIE: linkuri relative rămase spre resursele gratuite." >&2
  exit 1
fi

# Paginile legale pe .app: același ?returnSite=eu, ca „Back to website” de acolo
# să revină aici (return-site.js îl păstrează și la schimbarea limbii/documentului).
sed -i -E '/frontend\/legal\//s#\.html(["'"'"'`])#.html?returnSite=eu\1#g' index.html site/*.js
if grep -nE "frontend/legal/" index.html site/*.js | grep -v "returnSite=eu" | grep -q .; then
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
leftover=$(grep -nE "[\"'\`]/?frontend/" index.html site/*.js \
  | grep -vE 'frontend/js/(config|calculator-core)\.js|frontend/locales/|includes\("/frontend/"\)|indexOf\("/frontend/' || true)
if [ -n "$leftover" ]; then
  echo "ATENȚIE: linkuri relative rămase spre frontend/:" >&2
  echo "$leftover" >&2
  exit 1
fi
missing=$(grep -nE "$APP_URL/frontend/(login|register)\.html" index.html site/*.js | grep -v 'returnSite=eu' || true)
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
echo "OK — vitrina sincronizată. Verifică: git status && git diff"
