// Previzualizări ale modulelor din „Explorează" (#features): replica ecranului REAL al fiecărui
// modul, randată din HTML/CSS (fără imagini, fără API, fără date reale), în LIMBA SITE-ULUI.
//
//   REGULĂ: UI real + date false + limba selectată pe site.
//   - Structura fiecărei pagini (sidebar, bară de sus, titlu, tab-uri, filtre, butoane, coloane,
//     badge-uri, acțiuni, paginare) e copiată din paginile aplicației: components/sidebar.html +
//     topbar.html, customers/clients.html, jobs/work.html, electric-calculator.html,
//     materials.html, offers/quotes.html, contracts.html, invoices.html, reports.html și din
//     randarea rândurilor din frontend/js/<modul>.js. Nu adăuga KPI-uri, filtre, tab-uri,
//     butoane sau coloane care nu există acolo.
//   - TEXTELE interfeței vin din dicționarele APLICAȚIEI (frontend/locales/<limbă>.json, aceleași
//     chei ca paginile reale) — nicio copie paralelă. Datele (lucrări, materiale, titluri de
//     contract) și eticheta „Demo data" sunt în DEMO_TEXT de mai jos; numele de persoane/firme
//     rămân aceleași în toate limbile. Sumele și datele: Intl în limba curentă, exact ca
//     Utils.formatCurrency / Utils.formatDate din aplicație.
//   - Calculatorul: rezultatele sunt exact cele date de calculatorul real pentru 3.5 kW / 15 m.
//   - Sidebar-ul nu include Ghid Practic (modul intern, neterminat).
//   - Singurul lucru „inventat" e rama de browser (bară + URL + „Demo data").
//
//   Click / tap pe card → ecranul, mare, în modal (fără previzualizare la hover — suprapunea
//   pagina și încurca). Tastatură: Enter / Space → modal; Esc închide.
(function () {
  "use strict";

  var grid = document.querySelector("#features .features-grid");
  if (!grid) return;

  var LOCALES = ["en", "ro", "uk", "tr", "pl", "ru", "it", "nl", "no", "sv"];
  // Aceleași nume și steaguri ca selectorul de limbă din aplicație (frontend/js/i18n.js).
  var LOCALE_META = {
    en: ["English", "gb"], ro: ["Română", "ro"], uk: ["Українська", "ua"], tr: ["Türkçe", "tr"],
    pl: ["Polski", "pl"], ru: ["Русский", "ru"], it: ["Italiano", "it"], nl: ["Nederlands", "nl"],
    no: ["Norsk", "no"], sv: ["Svenska", "se"],
  };

  // Datele demo care depind de limbă (nume de lucrări, materiale, titluri) + textele ferestrei
  // care nu există în aplicație. Limbile lipsă cad pe engleză.
  var DEMO_TEXT = {
    en: {
      demoData: "Demo data",
      saveToQuote: "Save to quote",
      jobs: {
        officeLighting: "Office Lighting Upgrade", evCharger: "EV Charger Installation",
        dbReplacement: "Distribution Board Replacement", warehousePower: "Warehouse Power Upgrade",
        emergencyLighting: "Emergency Lighting Inspection", rewire: "Residential Rewire", fireAlarm: "Fire Alarm Installation",
      },
      materials: {
        cable: "Cable 3G2.5 mm² (NYM-J)", mcb: "Circuit breaker B16, 1P", rcd: "RCD 40 A, 30 mA, Type A",
        led: "LED panel 60×60, 40 W", board: "Distribution board, 12 ways",
      },
      units: { m: "m", pcs: "pcs" },
      contracts: {
        lighting: "Lighting upgrade — 3 floors", db: "DB replacement & testing", warehouse: "Warehouse power works",
        ev: "Home EV charging point", emergency: "Emergency lighting service",
      },
    },
    ro: {
      demoData: "Date demo",
      saveToQuote: "Salvează în ofertă",
      jobs: {
        officeLighting: "Modernizare iluminat birouri", evCharger: "Instalare stație de încărcare EV",
        dbReplacement: "Înlocuire tablou electric", warehousePower: "Modernizare alimentare depozit",
        emergencyLighting: "Verificare iluminat de siguranță", rewire: "Refacere instalație electrică locuință", fireAlarm: "Instalare detecție incendiu",
      },
      materials: {
        cable: "Cablu 3G2,5 mm² (NYM-J)", mcb: "Disjunctor B16, 1P", rcd: "Diferențial 40 A, 30 mA, tip A",
        led: "Panou LED 60×60, 40 W", board: "Tablou de distribuție, 12 module",
      },
      units: { m: "m", pcs: "buc" },
      contracts: {
        lighting: "Modernizare iluminat — 3 etaje", db: "Înlocuire tablou și verificări", warehouse: "Lucrări alimentare depozit",
        ev: "Punct de încărcare EV la domiciliu", emergency: "Service iluminat de siguranță",
      },
    },
    uk: {
      demoData: "Демо-дані",
      saveToQuote: "Зберегти в пропозицію",
      jobs: { officeLighting: "Модернізація освітлення офісу", evCharger: "Встановлення зарядної станції EV", dbReplacement: "Заміна електрощита", warehousePower: "Модернізація електроживлення складу", emergencyLighting: "Перевірка аварійного освітлення", rewire: "Заміна електропроводки в будинку", fireAlarm: "Монтаж пожежної сигналізації" },
      materials: { cable: "Кабель 3G2,5 мм² (NYM-J)", mcb: "Автоматичний вимикач B16, 1P", rcd: "ПЗВ 40 А, 30 мА, тип A", led: "LED-панель 60×60, 40 Вт", board: "Розподільний щит, 12 модулів" },
      units: { m: "м", pcs: "шт" },
      contracts: { lighting: "Модернізація освітлення — 3 поверхи", db: "Заміна щита та випробування", warehouse: "Роботи з електроживлення складу", ev: "Домашня зарядна станція EV", emergency: "Обслуговування аварійного освітлення" },
    },
    tr: {
      demoData: "Örnek veriler",
      saveToQuote: "Teklife kaydet",
      jobs: { officeLighting: "Ofis aydınlatmasının yenilenmesi", evCharger: "Elektrikli araç şarj istasyonu kurulumu", dbReplacement: "Dağıtım panosu değişimi", warehousePower: "Depo enerji altyapısı yenileme", emergencyLighting: "Acil aydınlatma kontrolü", rewire: "Konut elektrik tesisatı yenileme", fireAlarm: "Yangın alarm sistemi kurulumu" },
      materials: { cable: "Kablo 3G2,5 mm² (NYM-J)", mcb: "Otomatik sigorta B16, 1P", rcd: "RCD 40 A, 30 mA, Tip A", led: "LED panel 60×60, 40 W", board: "Dağıtım panosu, 12 modül" },
      units: { m: "m", pcs: "adet" },
      contracts: { lighting: "Aydınlatma yenileme — 3 kat", db: "Pano değişimi ve testler", warehouse: "Depo elektrik besleme işleri", ev: "Ev tipi elektrikli araç şarj noktası", emergency: "Acil aydınlatma bakımı" },
    },
    pl: {
      demoData: "Dane demo",
      saveToQuote: "Zapisz w ofercie",
      jobs: { officeLighting: "Modernizacja oświetlenia biura", evCharger: "Montaż ładowarki EV", dbReplacement: "Wymiana rozdzielnicy", warehousePower: "Modernizacja zasilania magazynu", emergencyLighting: "Przegląd oświetlenia awaryjnego", rewire: "Wymiana instalacji elektrycznej w domu", fireAlarm: "Montaż systemu sygnalizacji pożaru" },
      materials: { cable: "Przewód 3G2,5 mm² (NYM-J)", mcb: "Wyłącznik nadprądowy B16, 1P", rcd: "Wyłącznik różnicowoprądowy 40 A, 30 mA, typ A", led: "Panel LED 60×60, 40 W", board: "Rozdzielnica, 12 modułów" },
      units: { m: "m", pcs: "szt." },
      contracts: { lighting: "Modernizacja oświetlenia — 3 piętra", db: "Wymiana rozdzielnicy i pomiary", warehouse: "Prace przy zasilaniu magazynu", ev: "Domowy punkt ładowania EV", emergency: "Serwis oświetlenia awaryjnego" },
    },
    ru: {
      demoData: "Демо-данные",
      saveToQuote: "Сохранить в предложение",
      jobs: { officeLighting: "Модернизация освещения офиса", evCharger: "Установка зарядной станции EV", dbReplacement: "Замена электрощита", warehousePower: "Модернизация электроснабжения склада", emergencyLighting: "Проверка аварийного освещения", rewire: "Замена электропроводки в доме", fireAlarm: "Монтаж пожарной сигнализации" },
      materials: { cable: "Кабель 3G2,5 мм² (NYM-J)", mcb: "Автоматический выключатель B16, 1P", rcd: "УЗО 40 А, 30 мА, тип A", led: "LED-панель 60×60, 40 Вт", board: "Распределительный щит, 12 модулей" },
      units: { m: "м", pcs: "шт" },
      contracts: { lighting: "Модернизация освещения — 3 этажа", db: "Замена щита и испытания", warehouse: "Работы по электроснабжению склада", ev: "Домашняя зарядная станция EV", emergency: "Обслуживание аварийного освещения" },
    },
    it: {
      demoData: "Dati demo",
      saveToQuote: "Salva nel preventivo",
      jobs: { officeLighting: "Rinnovo illuminazione uffici", evCharger: "Installazione wallbox EV", dbReplacement: "Sostituzione quadro elettrico", warehousePower: "Potenziamento impianto magazzino", emergencyLighting: "Verifica illuminazione di emergenza", rewire: "Rifacimento impianto elettrico abitazione", fireAlarm: "Installazione impianto antincendio" },
      materials: { cable: "Cavo 3G2,5 mm² (NYM-J)", mcb: "Interruttore magnetotermico B16, 1P", rcd: "Differenziale 40 A, 30 mA, tipo A", led: "Pannello LED 60×60, 40 W", board: "Quadro di distribuzione, 12 moduli" },
      units: { m: "m", pcs: "pz" },
      contracts: { lighting: "Rinnovo illuminazione — 3 piani", db: "Sostituzione quadro e collaudo", warehouse: "Lavori impianto magazzino", ev: "Punto di ricarica EV domestico", emergency: "Manutenzione illuminazione di emergenza" },
    },
    nl: {
      demoData: "Demogegevens",
      saveToQuote: "Opslaan in offerte",
      jobs: { officeLighting: "Vernieuwing kantoorverlichting", evCharger: "Installatie EV-laadpaal", dbReplacement: "Vervanging groepenkast", warehousePower: "Uitbreiding stroomvoorziening magazijn", emergencyLighting: "Keuring noodverlichting", rewire: "Vernieuwing elektrische installatie woning", fireAlarm: "Installatie brandmeldsysteem" },
      materials: { cable: "Kabel 3G2,5 mm² (NYM-J)", mcb: "Installatieautomaat B16, 1P", rcd: "Aardlekschakelaar 40 A, 30 mA, type A", led: "LED-paneel 60×60, 40 W", board: "Groepenkast, 12 modules" },
      units: { m: "m", pcs: "st." },
      contracts: { lighting: "Vernieuwing verlichting — 3 verdiepingen", db: "Vervanging groepenkast en metingen", warehouse: "Stroomwerkzaamheden magazijn", ev: "EV-laadpunt thuis", emergency: "Onderhoud noodverlichting" },
    },
    no: {
      demoData: "Demodata",
      saveToQuote: "Lagre i tilbud",
      jobs: { officeLighting: "Oppgradering av kontorbelysning", evCharger: "Installasjon av elbillader", dbReplacement: "Utskifting av sikringsskap", warehousePower: "Oppgradering av strømforsyning til lager", emergencyLighting: "Kontroll av nødlys", rewire: "Omlegging av elektrisk anlegg i bolig", fireAlarm: "Installasjon av brannalarm" },
      materials: { cable: "Kabel 3G2,5 mm² (NYM-J)", mcb: "Automatsikring B16, 1P", rcd: "Jordfeilbryter 40 A, 30 mA, type A", led: "LED-panel 60×60, 40 W", board: "Sikringsskap, 12 moduler" },
      units: { m: "m", pcs: "stk" },
      contracts: { lighting: "Oppgradering av belysning — 3 etasjer", db: "Utskifting av sikringsskap og kontrollmålinger", warehouse: "Elektroarbeid i lagerbygg", ev: "Elbillader hjemme", emergency: "Service på nødlys" },
    },
    sv: {
      demoData: "Demodata",
      saveToQuote: "Spara i offert",
      jobs: { officeLighting: "Uppgradering av kontorsbelysning", evCharger: "Installation av elbilsladdare", dbReplacement: "Byte av elcentral", warehousePower: "Uppgradering av elförsörjning i lager", emergencyLighting: "Kontroll av nödbelysning", rewire: "Omdragning av elinstallation i bostad", fireAlarm: "Installation av brandlarm" },
      materials: { cable: "Kabel 3G2,5 mm² (NYM-J)", mcb: "Dvärgbrytare B16, 1P", rcd: "Jordfelsbrytare 40 A, 30 mA, typ A", led: "LED-panel 60×60, 40 W", board: "Elcentral, 12 moduler" },
      units: { m: "m", pcs: "st" },
      contracts: { lighting: "Uppgradering av belysning — 3 våningar", db: "Byte av central och mätningar", warehouse: "Elarbeten i lager", ev: "Laddpunkt för elbil hemma", emergency: "Service av nödbelysning" },
    },
  };

  // Butoanele de acțiune din rânduri, exact ca în aplicație: [culoare bootstrap outline, iconiță]
  var ACT = {
    edit: ["primary", "fa-edit"], view: ["info", "fa-eye"], del: ["danger", "fa-trash-can"],
    pen: ["primary", "fa-pen"], trash: ["danger", "fa-trash"], send: ["success", "fa-paper-plane"],
    status: ["primary", "fa-tasks"], invoice: ["success", "fa-file-invoice-dollar"],
    pdf: ["secondary", "fa-file-pdf"], pay: ["warning", "fa-money-bill-wave"],
  };

  // ---------- Limba și dicționarele aplicației ----------

  var dictCache = {};
  function currentLocale() {
    var lc = (document.documentElement.lang || "").toLowerCase().slice(0, 2);
    if (LOCALES.indexOf(lc) < 0) {
      try { lc = localStorage.getItem("locale") || "en"; } catch (e) { lc = "en"; }
    }
    return LOCALES.indexOf(lc) >= 0 ? lc : "en";
  }
  function loadDict(lc) {
    if (!dictCache[lc]) {
      dictCache[lc] = fetch("/frontend/locales/" + lc + ".json", { credentials: "same-origin" })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .catch(function () { return {}; });
    }
    return dictCache[lc];
  }
  // Dicționarul limbii curente + engleza ca rezervă (aceeași regulă ca t() din aplicație).
  function loadStrings(lc) {
    return Promise.all([loadDict(lc), lc === "en" ? null : loadDict("en")]).then(function (d) {
      return { lc: lc, main: d[0] || {}, fallback: d[1] || {} };
    });
  }

  function makeT(s) {
    var get = function (o, k) { return k.split(".").reduce(function (a, p) { return a == null ? a : a[p]; }, o); };
    var fill = function (str, vars) {
      return String(str).replace(/\{\{(\w+)\}\}/g, function (_, k) { return vars && vars[k] != null ? vars[k] : ""; });
    };
    var t = function (key, fb, vars) {
      var v = get(s.main, key);
      if (typeof v !== "string") v = get(s.fallback, key);
      if (typeof v !== "string") v = fb || key;
      return fill(v, vars);
    };
    t.plural = function (key, count, vars) {
      var pick = function (o) {
        if (!o || typeof o !== "object") return null;
        var cat = new Intl.PluralRules(s.lc).select(count);
        return o[cat] || o.other || null;
      };
      var v = pick(get(s.main, key)) || pick(get(s.fallback, key)) || key;
      return fill(v, vars);
    };
    return t;
  }

  // ---------- Paginile (structura = aplicația; datele = demo) ----------

  function build(lc, t) {
    var D = DEMO_TEXT[lc] || DEMO_TEXT.en;
    var J = D.jobs, M = D.materials, C = D.contracts, U = D.units;
    var up = function (s) { return s.toLocaleUpperCase(lc); };
    var money = function (n) { return new Intl.NumberFormat(lc, { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n); };
    var workValue = function (n) { return n.toLocaleString(lc, { minimumFractionDigits: 2 }) + " EUR"; };
    var date = function (iso) { return new Intl.DateTimeFormat(lc, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso + "T12:00:00")); };
    var num = function (n) { return n.toLocaleString(lc); };
    var sidebar = [
      ["dashboard", "fa-house", t("nav.dashboard")], ["clients", "fa-users", t("nav.clients")], ["work", "fa-folder-open", t("nav.work")],
      ["electricCalculator", "fa-calculator", t("nav.electricCalculator")], ["materials", "fa-boxes-stacked", t("nav.materials")],
      ["offers", "fa-file-signature", t("nav.offers")], ["contracts", "fa-file-contract", t("nav.contracts")],
      ["invoices", "fa-file-invoice-dollar", t("nav.invoices")], ["reports", "fa-chart-line", t("nav.reports")], ["jobStatus", "fa-route", t("nav.jobStatus")],
    ];
    var active = { t: "pill", v: t("clients.active") };
    var ws = function (k) { return t("work.status." + k); };
    var wp = function (k) { return { t: "prio", v: t("work.priority." + k) }; };
    var qs = function (k) { return up(k === "draft" ? t("estimating.status.draft") : t("quotes.status." + k)); };
    var is = function (k) { return up(t("invoices.status." + k)); };
    var cs = function (k) { return up(t("contracts.status." + k)); };

    return {
      shell: {
        sidebar: sidebar, proPlan: t("nav.proPlan"), logout: t("nav.logout"), demo: D.demoData, close: t("common.close"),
        lang: LOCALE_META[lc][0] + " (" + lc.toUpperCase() + ")", flag: LOCALE_META[lc][1],
        back: t("common.back"), next: t("common.next"),
      },
      modules: {
        clients: {
          url: "customers", title: t("nav.clients"),
          tabs: [["fa-users", t("nav.clients")], ["fa-user-plus", t("nav.leads")]],
          search: t("clients.searchPlaceholder"),
          button: ["fa-circle-plus", t("clients.addClient")],
          cols: [t("clients.table.nameCompany"), t("clients.table.contact"), t("clients.table.cityAddress"), t("common.status"), t("common.actions")],
          rows: [
            [{ t: "stack", a: "James Walker", b: "Walker Homes" }, { t: "contact", a: "james@walkerhomes.co.uk", b: "+44 7700 900312" }, { t: "muted", v: "Leeds" }, active, ["edit", "view", "del"]],
            [{ t: "stack", a: "Emma Collins", b: "Northbridge Property Ltd" }, { t: "contact", a: "emma.collins@northbridge.co.uk", b: "+44 7700 900518" }, { t: "muted", v: "Manchester" }, active, ["edit", "view", "del"]],
            [{ t: "stack", a: "Oliver Bennett", b: "Greenfield Construction" }, { t: "contact", a: "o.bennett@greenfield.com", b: "+44 7700 900247" }, { t: "muted", v: "Bristol" }, active, ["edit", "view", "del"]],
            [{ t: "stack", a: "Sophie Turner", b: "Apex Facilities" }, { t: "contact", a: "sophie@apexfacilities.com", b: "+44 7700 900731" }, { t: "muted", v: "Birmingham" }, active, ["edit", "view", "del"]],
            [{ t: "stack", a: "Daniel Hughes", b: "Harbourside Hotels" }, { t: "contact", a: "d.hughes@harbourside.com", b: "+44 7700 900604" }, { t: "muted", v: "Cardiff" }, active, ["edit", "view", "del"]],
          ],
          footer: t.plural("clients.paginationInfo", 48, { start: 1, end: 5, total: 48 }),
        },
        work: {
          url: "jobs", title: t("nav.work"),
          tabs: [["fa-folder-open", t("nav.work")], ["fa-clipboard-check", t("nav.workRequests")]],
          search: t("work.searchPlaceholder"),
          button: ["fa-circle-plus", t("work.addWork")],
          cols: [t("work.table.codeWork"), t("dashboard.table.client"), t("common.status"), t("work.table.priority"), t("work.table.estimatedValue"), t("common.actions")],
          rows: [
            [{ t: "stack", a: J.officeLighting, b: "WRK-2026-041" }, "Northbridge Property Ltd", { t: "badge", v: ws("in_progress"), c: "warning" }, wp("high"), { t: "strong", v: workValue(8450) }, ["edit", "view", "del"]],
            [{ t: "stack", a: J.evCharger, b: "WRK-2026-040" }, "James Walker", { t: "badge", v: ws("planned"), c: "info" }, wp("medium"), { t: "strong", v: workValue(2180) }, ["edit", "view", "del"]],
            [{ t: "stack", a: J.dbReplacement, b: "WRK-2026-038" }, "Apex Facilities", { t: "badge", v: ws("in_progress"), c: "warning" }, wp("urgent"), { t: "strong", v: workValue(3960) }, ["edit", "view", "del"]],
            [{ t: "stack", a: J.warehousePower, b: "WRK-2026-035" }, "Greenfield Construction", { t: "badge", v: ws("on_hold"), c: "dark" }, wp("medium"), { t: "strong", v: workValue(14700) }, ["edit", "view", "del"]],
            [{ t: "stack", a: J.emergencyLighting, b: "WRK-2026-031" }, "Harbourside Hotels", { t: "badge", v: ws("completed"), c: "success" }, wp("low"), { t: "strong", v: workValue(1250) }, ["edit", "view", "del"]],
          ],
          footer: t.plural("work.paginationInfo", 23, { start: 1, end: 5, total: 23 }),
        },
        materials: {
          url: "materials", title: t("nav.materials"),
          search: t("materials.searchPlaceholder"),
          select: t("materials.allCategories"),
          button: ["fa-plus", t("materials.addMaterial")],
          cols: [t("materials.table.code"), t("materials.table.name"), t("materials.table.category"), t("estimating.itemTable.unit"), t("materials.table.unitPrice"), t("materials.table.stock"), t("common.actions")],
          rows: [
            [{ t: "muted", v: "CAB-3G25" }, { t: "strong", v: M.cable }, { t: "badge", v: t("materials.category.cabluri"), c: "secondary" }, U.m, money(1.18), { t: "strong", v: num(420) }, ["pen", "view", "trash"]],
            [{ t: "muted", v: "MCB-B16" }, { t: "strong", v: M.mcb }, { t: "badge", v: t("materials.category.siguranțe"), c: "secondary" }, U.pcs, money(6.4), { t: "strong", v: num(38) }, ["pen", "view", "trash"]],
            [{ t: "muted", v: "RCD-40A" }, { t: "strong", v: M.rcd }, { t: "badge", v: t("materials.category.siguranțe"), c: "secondary" }, U.pcs, money(42.9), { t: "strong", v: num(6) }, ["pen", "view", "trash"]],
            [{ t: "muted", v: "LED-P60" }, { t: "strong", v: M.led }, { t: "badge", v: t("materials.category.iluminat"), c: "secondary" }, U.pcs, money(27.5), { t: "strong", v: num(24) }, ["pen", "view", "trash"]],
            [{ t: "muted", v: "DB-12W" }, { t: "strong", v: M.board }, { t: "badge", v: t("materials.category.tablouri"), c: "secondary" }, U.pcs, money(58), { t: "danger", v: num(0) }, ["pen", "view", "trash"]],
          ],
          pager: true,
        },
        offers: {
          url: "offers", title: t("nav.offers"), breadcrumb: true,
          tabs: [["fa-file-signature", t("nav.offers")], ["fa-ruler-combined", t("nav.estimating")]],
          search: t("quotes.searchPlaceholder"),
          select: t("quotes.allStatuses"),
          button: ["fa-file-invoice", t("quotes.generateFromEstimate")],
          quickLabel: t("quotes.quickFilterLabel"),
          quickFilters: [["fa-list", t("quotes.quickFilterAll")], ["fa-paper-plane", t("nav.sentQuotes")], ["fa-file-circle-check", t("nav.acceptedQuotes")]],
          cols: [t("quotes.table.quoteNumber"), t("estimating.table.clientWork"), t("quotes.table.issueDate"), t("quotes.table.validUntil"), t("quotes.table.totalNet"), t("quotes.table.totalGross"), t("common.status"), t("common.actions")],
          rows: [
            [{ t: "link", v: "QUO-2026-018" }, { t: "stack2", a: "Northbridge Property Ltd", b: J.officeLighting }, date("2026-09-12"), date("2026-10-12"), money(8450), { t: "strong", v: money(10055.5) }, { t: "badge", v: qs("approved"), c: "success" }, ["invoice", "view", "send", "status", "trash"]],
            [{ t: "link", v: "QUO-2026-017" }, { t: "stack2", a: "James Walker", b: J.evCharger }, date("2026-09-10"), date("2026-10-10"), money(2180), { t: "strong", v: money(2594.2) }, { t: "badge", v: qs("sent"), c: "info" }, ["view", "send", "status", "trash"]],
            [{ t: "link", v: "QUO-2026-016" }, { t: "stack2", a: "Apex Facilities", b: J.dbReplacement }, date("2026-09-05"), date("2026-10-05"), money(3960), { t: "strong", v: money(4712.4) }, { t: "badge", v: qs("approved"), c: "success" }, ["invoice", "view", "send", "status", "trash"]],
            [{ t: "link", v: "QUO-2026-015" }, { t: "stack2", a: "Oliver Bennett", b: J.rewire }, date("2026-08-28"), date("2026-09-27"), money(5200), { t: "strong", v: money(6188) }, { t: "badge", v: qs("draft"), c: "secondary" }, ["view", "send", "status", "trash"]],
            [{ t: "link", v: "QUO-2026-012" }, { t: "stack2", a: "Harbourside Hotels", b: J.fireAlarm }, date("2026-08-14"), date("2026-09-13"), money(7500), { t: "strong", v: money(8925) }, { t: "badge", v: qs("rejected"), c: "danger" }, ["view", "send", "status", "trash"]],
          ],
          pager: true,
        },
        contracts: {
          url: "contracts", title: t("nav.contracts"), breadcrumb: true,
          tabs: [["fa-file-signature", t("nav.contracts")], ["fa-file-lines", t("settings.contracts.title")]],
          search: t("contracts.searchPlaceholder"),
          select: t("contracts.allStatuses"),
          button: ["fa-file-contract", t("contracts.addContract")],
          cols: [t("contracts.table.contractNumber"), t("contracts.table.title"), t("contracts.table.client"), t("contracts.table.work"), t("contracts.table.totalValue"), t("common.status"), t("contracts.table.created"), t("common.actions")],
          rows: [
            [{ t: "link", v: "CTR-2026-009" }, C.lighting, "Northbridge Property Ltd", J.officeLighting, { t: "strong", v: money(10055.5) }, { t: "ctr", v: "signed", l: cs("signed") }, date("2026-09-14"), ["view", "trash"]],
            [{ t: "link", v: "CTR-2026-008" }, C.db, "Apex Facilities", J.dbReplacement, { t: "strong", v: money(4712.4) }, { t: "ctr", v: "sent", l: cs("sent") }, date("2026-09-08"), ["view", "trash"]],
            [{ t: "link", v: "CTR-2026-007" }, C.warehouse, "Greenfield Construction", J.warehousePower, { t: "strong", v: money(17493) }, { t: "ctr", v: "signed", l: cs("signed") }, date("2026-08-21"), ["view", "trash"]],
            [{ t: "link", v: "CTR-2026-006" }, C.ev, "James Walker", J.evCharger, { t: "strong", v: money(2594.2) }, { t: "ctr", v: "draft", l: cs("draft") }, date("2026-08-19"), ["view", "trash"]],
            [{ t: "link", v: "CTR-2026-004" }, C.emergency, "Harbourside Hotels", J.emergencyLighting, { t: "strong", v: money(1487.5) }, { t: "ctr", v: "completed", l: cs("completed") }, date("2026-07-02"), ["view", "trash"]],
          ],
          pager: true,
        },
        invoices: {
          url: "invoices", title: t("nav.invoices"),
          search: t("invoices.searchPlaceholder"),
          // pagina reală nu are opțiunea „toate": selectul pornește pe prima opțiune (Schiță)
          select: t("estimating.status.draft"),
          cols: [t("invoices.table.invoiceNumber"), t("estimating.table.clientWork"), t("quotes.table.issueDate"), t("invoices.table.dueDate"), t("quotes.table.totalNet"), t("quotes.table.totalGross"), t("common.status"), t("common.actions")],
          rows: [
            [{ t: "link", v: "INV-2026-027" }, { t: "stack2", a: "Northbridge Property Ltd", b: J.officeLighting }, date("2026-09-18"), date("2026-10-02"), money(4225), { t: "strong", v: money(5027.75) }, { t: "badge", v: is("issued"), c: "info" }, ["view", "pen", "pdf", "send", "pay"]],
            [{ t: "link", v: "INV-2026-026" }, { t: "stack2", a: "Harbourside Hotels", b: J.emergencyLighting }, date("2026-09-11"), date("2026-09-25"), money(1250), { t: "strong", v: money(1487.5) }, { t: "badge", v: is("paid"), c: "success" }, ["view", "pen", "pdf", "send", "pay"]],
            [{ t: "link", v: "INV-2026-025" }, { t: "stack2", a: "Greenfield Construction", b: J.warehousePower }, date("2026-09-01"), date("2026-09-15"), money(7350), { t: "strong", v: money(8746.5) }, { t: "badge", v: is("partially_paid"), c: "warning" }, ["view", "pen", "pdf", "send", "pay"]],
            [{ t: "link", v: "INV-2026-023" }, { t: "stack2", a: "Oliver Bennett", b: J.rewire }, date("2026-08-22"), date("2026-09-05"), money(497.69), { t: "strong", v: money(592.25) }, { t: "badge", v: is("overdue"), c: "danger" }, ["view", "pen", "pdf", "send", "pay"]],
            [{ t: "link", v: "INV-2026-021" }, { t: "stack2", a: "Apex Facilities", b: J.dbReplacement }, date("2026-08-15"), date("2026-08-29"), money(3960), { t: "strong", v: money(4712.4) }, { t: "badge", v: is("paid"), c: "success" }, ["view", "pen", "pdf", "send", "pay"]],
          ],
          pager: true,
        },
        reports: {
          url: "reports", title: t("nav.reports"), custom: "reports",
          filters: [[t("reports.period"), t("reports.periodOptions.month")], [t("dashboard.table.client"), t("reports.allClients")], [t("nav.work"), t("reports.allWork")]],
          generate: t("reports.generateReport"),
          tabs: [["fa-sack-dollar", t("reports.tabs.financial")], ["fa-folder-open", t("nav.work")], ["fa-boxes-stacked", t("nav.materials")], ["fa-users", t("nav.clients")], ["fa-folder", t("reports.tabs.archive")]],
          stats: [[t("reports.invoiced"), money(24560), ""], [t("settings.billing.paid"), money(18940), "rp-green"], [t("reports.outstanding"), money(5028), "rp-amber"], [t("invoices.status.overdue"), money(592), "rp-red"]],
          chartTitle: t("reports.invoicedVsCollected"),
          legend: [t("reports.invoiced"), t("reports.collected")],
          months: [3, 4, 5, 6, 7, 8].map(function (m, i) {
            var v = [[18.2, 15.9], [21.4, 19.8], [19.6, 18.1], [26.3, 22.7], [23.8, 21.2], [24.6, 18.9]][i];
            return [new Intl.DateTimeFormat(lc, { month: "short" }).format(new Date(2026, m, 1)), v[0], v[1]];
          }),
          axis: [30000, 20000, 10000, 0].map(function (n) { return new Intl.NumberFormat(lc, { style: "currency", currency: "EUR", notation: "compact", maximumFractionDigits: 0 }).format(n); }),
        },
        electricCalculator: {
          url: "electric-calculator", title: t("nav.electricCalculator"), custom: "calculator",
          seg: [["fa-plug", t("electricCalculator.categoryPrize")], ["fa-lightbulb", t("electricCalculator.categoryIluminat")], ["fa-bolt", t("electricCalculator.categoryTrifazat")]],
          power: t("electricCalculator.powerLabel"), length: t("electricCalculator.lengthLabel"),
          method: t("electricCalculator.installMethodLabel"), methodValue: t("electricCalculator.installMethodB2"),
          section: t("electricCalculator.sectionLabel"), sectionValue: t("electricCalculator.sectionAuto"),
          calculate: t("electricCalculator.calculateBtn"), trust: t("electricCalculator.trustNote"),
          okTitle: t("electricCalculator.okTitle"), okSubtitle: t("electricCalculator.okSubtitle"),
          summary: t("electricCalculator.categoryPrize") + " · " + num(3.5) + " kW · 15 m · " + t("electricCalculator.installMethodSummaryB2") + " · 230 V",
          rows: [
            ["blue", t("electricCalculator.resultIb"), num(15.2) + " A"],
            ["green", t("electricCalculator.resultCable"), "3×" + num(1.5) + " mm² Cu (L+N+PE)"],
            ["green", t("electricCalculator.resultMcbNominal", t("electricCalculator.resultMcb")), "B16"],
            ["green", t("electricCalculator.resultVoltageDrop"), [(3).toLocaleString(lc, { minimumFractionDigits: 1 }) + "%", "(" + t("electricCalculator.resultVoltageDropLimit", "", { limit: 5 }) + ")"]],
            ["green", t("electricCalculator.resultCableCapacity"), num(16.5) + " A"],
            ["blue", t("electricCalculator.resultRcd"), t("electricCalculator.rcdPrize").split(" (")[0]],
          ],
          save: D.saveToQuote,
          legendTitle: t("electricCalculator.legendTitle"),
          legend: [
            ["green", t("electricCalculator.legendOkTitle"), t("electricCalculator.legendOkDesc")],
            ["amber", t("electricCalculator.legendAttentionTitle"), t("electricCalculator.legendAttentionDesc")],
            ["red", t("electricCalculator.legendDangerTitle"), t("electricCalculator.legendDangerDesc")],
            ["blue", t("electricCalculator.legendInfoTitle"), t("electricCalculator.legendInfoDesc")],
          ],
          values: [num(3.5), "15"],
        },
      },
    };
  }

  // ---------- Randare ----------

  var esc = function (v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var icon = function (cls) { return '<i class="fas ' + cls + '" aria-hidden="true"></i>'; };

  function cell(v) {
    if (Array.isArray(v)) {
      return '<span class="rp-actions">' + v.map(function (k) {
        return '<span class="rp-act rp-act-' + ACT[k][0] + '">' + icon(ACT[k][1]) + "</span>";
      }).join("") + "</span>";
    }
    if (typeof v === "string") return esc(v);
    switch (v.t) {
      case "stack":
      case "stack2": return '<span class="rp-b rp-block">' + esc(v.a) + '</span><small class="rp-m">' + esc(v.b) + "</small>";
      case "contact": return '<span class="rp-block">' + icon("fa-envelope rp-ic") + esc(v.a) + '</span><small class="rp-m">' + icon("fa-phone rp-ic") + esc(v.b) + "</small>";
      case "muted": return '<span class="rp-m2">' + esc(v.v) + "</span>";
      case "strong": return '<span class="rp-b">' + esc(v.v) + "</span>";
      case "danger": return '<span class="rp-b rp-red">' + esc(v.v) + "</span>";
      case "link": return '<span class="rp-b rp-link">' + esc(v.v) + "</span>";
      case "prio": return '<span class="rp-prio">' + esc(v.v) + "</span>";
      case "pill": return '<span class="rp-pill">' + esc(v.v) + "</span>";
      case "badge": return '<span class="rp-badge rp-bg-' + v.c + '">' + esc(v.v) + "</span>";
      case "ctr": return '<span class="rp-ctr rp-ctr-' + v.v + '">' + esc(v.l) + "</span>";
    }
    return "";
  }

  function sidebar(shell, active) {
    return '<aside class="rp-side"><div class="rp-side-top"><div class="rp-brand"><span class="rp-logo">' + icon("fa-bolt") +
      '</span><span class="rp-brand-name">ElectricalVPF</span><span class="rp-collapse">' + icon("fa-angles-left") + "</span></div>" +
      '<span class="rp-plan">' + icon("fa-crown") + "<span>" + esc(shell.proPlan) + "</span></span></div><nav>" +
      shell.sidebar.map(function (s) {
        return '<span class="rp-nav' + (s[0] === active ? " is-active" : "") + '">' + icon(s[1]) + "<span>" + esc(s[2]) + "</span></span>";
      }).join("") + '</nav><div class="rp-side-bottom"><span class="rp-logout">' + icon("fa-right-from-bracket") + "<span>" + esc(shell.logout) + "</span></span></div></aside>";
  }

  function topbar(shell, m) {
    return '<div class="rp-topbar"><span class="rp-home">' + icon("fa-house") + "</span>" +
      (m.breadcrumb ? '<span class="rp-crumb">' + esc(m.title) + "</span>" : "") +
      '<span class="rp-top-right"><span class="rp-sq">' + icon("fa-circle-question") + '</span><span class="rp-sq">' + icon("fa-moon") +
      '</span><span class="rp-lang"><img class="rp-flag" src="https://flagcdn.com/20x15/' + shell.flag + '.png" alt="">' + esc(shell.lang) + icon("fa-chevron-down") +
      '</span><span class="rp-out">' + icon("fa-right-from-bracket") + esc(shell.logout) + '</span><span class="rp-avatar">' + icon("fa-user-shield") + "</span></span></div>";
  }

  function tabs(list) {
    return '<div class="rp-tabs">' + list.map(function (t, i) {
      return '<span class="rp-tab' + (i ? "" : " is-active") + '">' + icon(t[0]) + esc(t[1]) + "</span>";
    }).join("") + "</div>";
  }

  function listPage(m, shell) {
    var cls = function (i, last) { return last ? ' class="rp-end"' : ""; };
    var h = m.tabs ? tabs(m.tabs) : "";
    h += '<div class="rp-card rp-filters"><span class="rp-search">' + icon("fa-magnifying-glass") + esc(m.search) + "</span>" +
      (m.select ? '<span class="rp-select">' + esc(m.select) + icon("fa-chevron-down") + "</span>" : "") +
      (m.button ? '<span class="rp-btn-primary">' + icon(m.button[0]) + esc(m.button[1]) + "</span>" : "") + "</div>";
    if (m.quickFilters) {
      h += '<div class="rp-quick"><span>' + esc(m.quickLabel) + '</span><span class="rp-group">' + m.quickFilters.map(function (q, i) {
        return '<span class="' + (i ? "" : "is-active") + '">' + icon(q[0]) + esc(q[1]) + "</span>";
      }).join("") + "</span></div>";
    }
    var last = m.cols.length - 1;
    h += '<div class="rp-card rp-table-card"><div class="rp-table-wrap"><table class="rp-table"><thead><tr>' +
      m.cols.map(function (c, i) { return "<th" + cls(i, i === last) + ">" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      m.rows.map(function (r) {
        return "<tr>" + r.map(function (v, i) { return "<td" + cls(i, i === last) + ">" + cell(v) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>" +
      (m.footer ? '<div class="rp-foot">' + esc(m.footer) + "</div>" : "") +
      (m.pager ? '<div class="rp-foot"><span class="rp-pager"><span>' + esc(shell.back) + "</span><span>" + esc(shell.next) + "</span></span></div>" : "") + "</div>";
    return h;
  }

  function reportsPage(m) {
    var max = 30;
    var h = '<div class="rp-card rp-rfilters">' + m.filters.map(function (f, i) {
      return '<label class="rp-rf rp-rf-' + i + '"><span>' + esc(f[0]) + '</span><span class="rp-select">' + esc(f[1]) + icon("fa-chevron-down") + "</span></label>";
    }).join("") + '<span class="rp-sq rp-refresh">' + icon("fa-rotate") + '</span><span class="rp-btn-primary rp-btn-sm">' + icon("fa-file-pdf") + esc(m.generate) + "</span></div>";
    h += tabs(m.tabs);
    h += '<div class="rp-stats">' + m.stats.map(function (s) {
      return '<div class="rp-card rp-stat"><span>' + esc(s[0]) + '</span><strong class="' + s[2] + '">' + esc(s[1]) + "</strong></div>";
    }).join("") + "</div>";
    h += '<div class="rp-card rp-chart-card"><strong class="rp-chart-title">' + esc(m.chartTitle) + "</strong>" +
      '<div class="rp-legend"><span><i class="rp-sw rp-sw-blue"></i>' + esc(m.legend[0]) + '</span><span><i class="rp-sw rp-sw-green"></i>' + esc(m.legend[1]) + "</span></div>" +
      '<div class="rp-chart"><div class="rp-yaxis">' + m.axis.map(function (a) { return "<span>" + esc(a) + "</span>"; }).join("") + '</div><div class="rp-bars">' +
      m.months.map(function (mm) {
        return '<div class="rp-month"><div class="rp-pair"><i class="rp-col rp-col-blue" style="height:' + (mm[1] / max * 100).toFixed(1) + '%"></i>' +
          '<i class="rp-col rp-col-green" style="height:' + (mm[2] / max * 100).toFixed(1) + '%"></i></div><span>' + esc(mm[0]) + "</span></div>";
      }).join("") + "</div></div></div>";
    return h;
  }

  function calculatorPage(m) {
    var info = icon("fa-circle-info rp-info");
    var h = '<div class="rp-calc"><div class="rp-card rp-calc-form"><div class="rp-seg">' + m.seg.map(function (s, i) {
      return '<span class="' + (i ? "" : "is-active") + '">' + icon(s[0]) + esc(s[1]) + "</span>";
    }).join("") + "</div>" +
      '<div class="rp-2col"><label><span>' + esc(m.power) + '</span><span class="rp-input">' + esc(m.values[0]) + '</span></label><label><span>' + esc(m.length) + '</span><span class="rp-input">' + esc(m.values[1]) + "</span></label></div>" +
      "<label><span>" + esc(m.method) + " " + info + '</span><span class="rp-input rp-dd">' + esc(m.methodValue) + icon("fa-chevron-down") + "</span></label>" +
      "<label><span>" + esc(m.section) + " " + info + '</span><span class="rp-input rp-dd">' + esc(m.sectionValue) + icon("fa-chevron-down") + "</span></label>" +
      '<span class="rp-calc-btn">' + icon("fa-calculator") + esc(m.calculate) + '</span><small class="rp-calc-note">' + esc(m.trust) + "</small></div>" +
      '<div class="rp-card rp-calc-result"><div class="rp-verdict"><strong><i class="rp-dot rp-dot-green"></i>' + esc(m.okTitle) + "</strong><span>" + esc(m.okSubtitle) + "</span></div>" +
      '<div class="rp-summary">' + icon("fa-circle-info") + esc(m.summary) + "</div>" +
      m.rows.map(function (r, i) {
        var val = Array.isArray(r[2]) ? esc(r[2][0]) + " <small>" + esc(r[2][1]) + "</small>" : esc(r[2]) + (i === 5 ? " " + info : "");
        return '<div class="rp-rrow"><span><i class="rp-dot rp-dot-' + r[0] + '"></i>' + esc(r[1]) + "</span><strong>" + val + "</strong></div>";
      }).join("") + '<span class="rp-save">' + icon("fa-file-circle-plus") + esc(m.save) + "</span></div></div>" +
      '<div class="rp-card rp-legend-card"><span class="rp-legend-title">' + icon("fa-circle-info") + esc(m.legendTitle) + '</span><div class="rp-legend-grid">' +
      m.legend.map(function (l) {
        return '<div class="rp-lg rp-lg-' + l[0] + '"><i class="rp-dot rp-dot-' + l[0] + '"></i><div><strong>' + esc(l[1]) + "</strong><span>" + esc(l[2]) + "</span></div></div>";
      }).join("") + "</div></div>";
    return h;
  }

  function windowHtml(pages, key) {
    var m = pages.modules[key], shell = pages.shell;
    var content = m.custom === "reports" ? reportsPage(m) : m.custom === "calculator" ? calculatorPage(m) : listPage(m, shell);
    return '<div class="rp-window" data-module="' + key + '" lang="' + pages.lc + '"><div class="rp-bar"><span class="rp-dots"><i></i><i></i><i></i></span>' +
      '<span class="rp-url">' + icon("fa-lock") + "electricalvpf.app/" + esc(m.url) + '</span><span class="rp-demo">' + esc(shell.demo) + "</span></div>" +
      '<div class="rp-app">' + sidebar(shell, key) + '<div class="rp-main">' + topbar(shell, m) + '<div class="rp-content"><h4 class="rp-title">' + esc(m.title) + "</h4>" +
      content + "</div></div></div></div>";
  }

  // Paginile pentru limba curentă (construite o dată pe limbă).
  var pagesCache = {};
  function pagesFor(lc) {
    if (!pagesCache[lc]) {
      pagesCache[lc] = loadStrings(lc).then(function (s) {
        var p = build(lc, makeT(s));
        p.lc = lc;
        return p;
      });
    }
    return pagesCache[lc];
  }
  // Preîncarcă dicționarul când secțiunea se apropie de ecran — modalul se deschide instant.
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { pagesFor(currentLocale()); io.disconnect(); }
    }, { rootMargin: "400px" });
    io.observe(grid);
  } else {
    pagesFor(currentLocale());
  }
  document.addEventListener("site:lang-applied", function () {
    if (grid.getBoundingClientRect().top < window.innerHeight + 400) pagesFor(currentLocale());
  });

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".feature-card[data-preview]"));

  // ---------- Click (modal) ----------

  var modalOpen = false, lastFocus = null, modalToken = 0;
  var backdrop = document.createElement("div");
  backdrop.className = "rp-modal-backdrop";
  backdrop.hidden = true;
  backdrop.innerHTML = '<div class="rp-modal" role="dialog" aria-modal="true">' +
    '<button type="button" class="rp-close" aria-label="Close"><svg viewBox="0 0 28 28" aria-hidden="true">' +
    '<circle cx="14" cy="14" r="13.375"/><path d="M10 10 18 18M18 10 10 18"/></svg></button>' +
    '<div class="rp-modal-body"></div></div>';
  document.body.appendChild(backdrop);
  var dialog = backdrop.querySelector(".rp-modal");
  var closeBtn = backdrop.querySelector(".rp-close");
  var body = backdrop.querySelector(".rp-modal-body");

  function openModal(card) {
    var key = card.getAttribute("data-preview");
    var token = ++modalToken;
    lastFocus = card;
    pagesFor(currentLocale()).then(function (pages) {
      if (token !== modalToken) return;
      body.innerHTML = windowHtml(pages, key);
      dialog.setAttribute("aria-label", pages.modules[key].title);
      closeBtn.setAttribute("aria-label", pages.shell.close);
      backdrop.hidden = false;
      void backdrop.offsetWidth; // pornește animația de intrare
      backdrop.classList.add("is-open");
      document.documentElement.classList.add("rp-lock");
      modalOpen = true;
      dialog.scrollTop = 0;
      closeBtn.focus({ preventScroll: true });
      setTimeout(snapToPixels, 220); // după animația de intrare (180 ms)
    });
  }
  // Centrarea poate lăsa fereastra la fracțiuni de pixel (ex. top 150,88) — conturul butonului X
  // ar ieși estompat. O mutăm la pixeli întregi.
  function snapToPixels() {
    if (!modalOpen) return;
    dialog.style.translate = "";
    var r = dialog.getBoundingClientRect();
    var dx = Math.round(r.left) - r.left, dy = Math.round(r.top) - r.top;
    if (dx || dy) dialog.style.translate = dx.toFixed(3) + "px " + dy.toFixed(3) + "px";
  }
  window.addEventListener("resize", snapToPixels);

  function closeModal() {
    modalToken++;
    if (!modalOpen) return;
    modalOpen = false;
    backdrop.classList.remove("is-open");
    document.documentElement.classList.remove("rp-lock");
    setTimeout(function () { if (!modalOpen) { backdrop.hidden = true; body.innerHTML = ""; } }, 200);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("mousedown", function (e) { if (e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (!modalOpen) return;
    if (e.key === "Escape") { e.preventDefault(); closeModal(); }
    if (e.key === "Tab") { e.preventDefault(); closeBtn.focus(); } // singurul element interactiv
  });

  cards.forEach(function (card) {
    card.addEventListener("click", function (e) { e.preventDefault(); openModal(card); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card); }
    });
  });

})();
