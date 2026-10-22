// Pagina /demo/ (tutorialele video) în limba vizitatorului (11 octombrie 2026). De pe 22 octombrie 2026 fiecare video
// există în fiecare limbă, cu voce în limba ei și fără subtitrări (site/demo-videos.js alege fișierul limbii).
// Limba: alegerea salvată pe site/aplicație (localStorage "locale"), altfel limba browserului, altfel engleză.
// Textele comune cu vitrina (Autentificare, Începe gratuit, subsolul legal) vin din translations.js + plans-i18n.js.
(function () {
  var LANGS = ["en", "ro", "uk", "tr", "pl", "ru", "it", "nl", "no", "sv"];

  var T = {
    en: {
      title: "See ElectricalVPF in action – from first call to paid | ElectricalVPF",
      back: "Back to website", kicker: "For UK electricians", h1: "See ElectricalVPF in action",
      lead: "One job, start to finish: a customer calls, you quote, they accept online, sign the contract on their phone, you invoice and get paid. Short videos of the real app — watch the one you need.",
      videoLang: "",
      featH2: "ElectricalVPF in 90 seconds",
      featP: "One job, from the first call to getting paid: the quote, the customer accepting it, the contract signed online, the invoice and the payment. Then pick any step below to see it in detail.",
      flow1: "Request", flow2: "Quote", flow3: "Accepted online", flow4: "Contract signed", flow5: "Invoice", flow6: "Paid",
      tryFree: "Try it free",
      stepsH2: "Step by step",
      stepsP: "In the order you work: each video is one step, under two minutes.",
      c01t: "Add a client", c01d: "Enter the details once — they appear on every quote, contract and invoice.",
      c02t: "Log a work request", c02d: "A customer rings — save what's needed, where and how urgent, in seconds.",
      c03t: "Turn it into a job", c03d: "Copy the request into a job — name, description, priority and currency filled in.",
      c04t: "Estimate the materials", c04d: "Build the shopping list before the client says yes.",
      c05t: "Materials on the job", c05d: "Move the estimate onto the job, so you know what each job costs.",
      c06t: "Price the job", c06d: "Materials at cost plus your markup, labour, and a total that updates as you type.",
      c07t: "Create the quote", c07d: "Selling prices only — your costs stay private. VAT and total in pounds.",
      c07bt: "Preview the quote PDF", c07bd: "Check exactly what the client will receive, before it goes out.",
      c08t: "Send the quote", c08d: "PDF attached, plus a link the client uses to accept online.",
      c09t: "The client accepts online", c09d: "No account, no app: tick, sign on screen, done.",
      c10t: "Contract, signed by both", c10d: "You sign first; the client signs online and confirms with a code sent to their email.",
      c11t: "Invoice from the quote", c11d: "Same lines, same prices — nothing to retype. Sent with the PDF attached.",
      c12t: "Paid, and the job closed", c12d: "Record the payment and see every stage of the job in one view.",
      c13t: "From enquiry to client", c13d: "Not every call is a client yet: save it as a lead, follow up, convert in one click.",
      c14t: "Archive without losing anything", c14d: "Clean lists, nothing lost: archive, recover, and delete for good only what the client never saw.",
      bridgeH2: "Try it on your next job",
      bridgeP: "Start on the Free plan with your own clients and quotes. Online acceptance works on Free, and Free includes two contracts signed online; unlimited contracts and the rest of the features come with the PRO plan.",
      bridgeSmall: "No card needed.",
      note: "Recorded in the live app on a demo account: the company, clients and the payment are sample data, and the email addresses are hidden. Narration: AI voice.",
    },
    ro: {
      title: "Vezi ElectricalVPF în acțiune – de la primul telefon până la plată | ElectricalVPF",
      back: "Înapoi la site", kicker: "Pentru electricieni", h1: "Vezi ElectricalVPF în acțiune",
      lead: "O lucrare, de la început până la capăt: te sună un client, faci oferta, el o acceptă online, semnează contractul pe telefon, tu emiți factura și încasezi. Video-uri scurte din aplicația reală — uită-te la cel de care ai nevoie.",
      videoLang: "",
      featH2: "ElectricalVPF în 90 de secunde",
      featP: "O lucrare, de la primul telefon până la plată: oferta, acceptarea ei de către client, contractul semnat online, factura și plata. Apoi alege orice pas de mai jos, ca să-l vezi în detaliu.",
      flow1: "Solicitare", flow2: "Ofertă", flow3: "Acceptată online", flow4: "Contract semnat", flow5: "Factură", flow6: "Încasat",
      tryFree: "Încearcă gratuit",
      stepsH2: "Pas cu pas",
      stepsP: "În ordinea în care lucrezi: fiecare video e un pas, sub două minute.",
      c01t: "Adaugi un client", c01d: "Datele lui le scrii o singură dată — apar pe fiecare ofertă, contract și factură.",
      c02t: "Notezi o lucrare solicitată", c02d: "Te sună un client — salvezi ce trebuie făcut, unde și cât de urgent, în câteva secunde.",
      c03t: "O transformi în lucrare", c03d: "Copiezi solicitarea într-o lucrare — numele, descrierea, prioritatea și moneda se completează singure.",
      c04t: "Estimezi materialele", c04d: "Faci lista de cumpărături înainte ca clientul să spună da.",
      c05t: "Materialele pe lucrare", c05d: "Muți estimarea pe lucrare, ca să știi cât te costă fiecare lucrare.",
      c06t: "Calculezi prețul", c06d: "Materialele la cost plus adaosul tău, manopera și un total care se actualizează în timp ce scrii.",
      c07t: "Faci oferta", c07d: "Doar prețurile de vânzare — costurile tale rămân private. TVA-ul și totalul se calculează singure.",
      c07bt: "Previzualizezi PDF-ul ofertei", c07bd: "Vezi exact ce primește clientul, înainte să o trimiți.",
      c08t: "Trimiți oferta", c08d: "PDF-ul atașat, plus un link prin care clientul o acceptă online.",
      c09t: "Clientul acceptă online", c09d: "Fără cont, fără aplicație: bifează, semnează pe ecran, gata.",
      c10t: "Contractul, semnat de amândoi", c10d: "Semnezi tu întâi; clientul semnează online și confirmă cu un cod primit pe email.",
      c11t: "Factura din ofertă", c11d: "Aceleași linii, aceleași prețuri — nimic de rescris. Trimisă cu PDF-ul atașat.",
      c12t: "Încasat și lucrare închisă", c12d: "Înregistrezi plata și vezi toate etapele lucrării într-un singur loc.",
      c13t: "De la cerere la client", c13d: "Nu orice telefon e deja un client: îl salvezi ca client potențial, revii la el și îl transformi în client dintr-un click.",
      c14t: "Arhivezi fără să pierzi nimic", c14d: "Liste curate, nimic pierdut: arhivezi, recuperezi și ștergi definitiv doar ce clientul n-a văzut.",
      bridgeH2: "Încearcă-l la următoarea lucrare",
      bridgeP: "Începe pe planul Free, cu clienții și ofertele tale. Acceptarea online funcționează pe Free, iar Free include două contracte semnate online; contractele nelimitate și restul funcțiilor vin cu planul PRO.",
      bridgeSmall: "Fără card.",
      note: "Filmat în aplicația reală, pe un cont demonstrativ: firma, clienții și plata sunt date de probă, iar adresele de email sunt ascunse. Vocea: generată cu AI.",
    },
    uk: {
      title: "ElectricalVPF у дії – від першого дзвінка до оплати | ElectricalVPF",
      back: "Повернутися на сайт", kicker: "Для електриків", h1: "Подивіться ElectricalVPF у дії",
      lead: "Одна робота від початку до кінця: дзвонить клієнт, ви робите пропозицію, він приймає її онлайн, підписує договір на телефоні, ви виставляєте рахунок і отримуєте оплату. Короткі відео зі справжнього застосунку — дивіться те, що вам потрібно.",
      videoLang: "",
      featH2: "ElectricalVPF за 90 секунд",
      featP: "Одна робота від першого дзвінка до оплати: пропозиція, її прийняття клієнтом, договір, підписаний онлайн, рахунок і оплата. Потім виберіть будь-який крок нижче, щоб побачити його докладно.",
      flow1: "Заявка", flow2: "Пропозиція", flow3: "Прийнято онлайн", flow4: "Договір підписано", flow5: "Рахунок", flow6: "Оплачено",
      tryFree: "Спробувати безкоштовно",
      stepsH2: "Крок за кроком",
      stepsP: "У тому порядку, в якому ви працюєте: кожне відео — один крок, до двох хвилин.",
      c01t: "Додайте клієнта", c01d: "Дані вводяться один раз — вони з’являються в кожній пропозиції, договорі й рахунку.",
      c02t: "Зареєструйте заявку", c02d: "Дзвонить клієнт — за секунди зберігаєте, що потрібно, де і наскільки терміново.",
      c03t: "Перетворіть її на роботу", c03d: "Скопіюйте заявку в роботу — назва, опис, пріоритет і валюта заповнюються самі.",
      c04t: "Оцініть матеріали", c04d: "Складіть список закупівель ще до того, як клієнт скаже «так».",
      c05t: "Матеріали на роботі", c05d: "Перенесіть оцінку на роботу — і знатимете, скільки коштує кожна робота.",
      c06t: "Розрахуйте ціну", c06d: "Матеріали за собівартістю плюс ваша націнка, робота і підсумок, що оновлюється під час введення.",
      c07t: "Створіть пропозицію", c07d: "Лише ціни продажу — ваші витрати залишаються приватними. ПДВ і підсумок рахуються самі.",
      c07bt: "Перегляньте PDF пропозиції", c07bd: "Перевірте, що саме отримає клієнт, перш ніж надіслати.",
      c08t: "Надішліть пропозицію", c08d: "PDF у вкладенні та посилання, за яким клієнт приймає її онлайн.",
      c09t: "Клієнт приймає онлайн", c09d: "Без облікового запису й без застосунку: позначити, підписати на екрані — готово.",
      c10t: "Договір, підписаний обома", c10d: "Спершу підписуєте ви; клієнт підписує онлайн і підтверджує кодом з електронної пошти.",
      c11t: "Рахунок із пропозиції", c11d: "Ті самі рядки, ті самі ціни — нічого не треба передруковувати. Надсилається з PDF у вкладенні.",
      c12t: "Оплачено, роботу закрито", c12d: "Зареєструйте оплату й бачте всі етапи роботи в одному місці.",
      c13t: "Від запиту до клієнта", c13d: "Не кожен дзвінок — уже клієнт: збережіть як лід, поверніться до нього й перетворіть на клієнта одним кліком.",
      c14t: "Архів без втрат", c14d: "Чисті списки, нічого не втрачено: архівуйте, повертайте й остаточно видаляйте лише те, чого клієнт не бачив.",
      bridgeH2: "Спробуйте на наступній роботі",
      bridgeP: "Почніть із плану Free зі своїми клієнтами та пропозиціями. Онлайн-прийняття працює на Free, а Free включає два договори, підписані онлайн; необмежені договори та решта функцій — у плані PRO.",
      bridgeSmall: "Картка не потрібна.",
      note: "Записано в справжньому застосунку на демо-обліковому записі: компанія, клієнти й оплата — тестові дані, адреси електронної пошти приховано. Голос: штучний інтелект.",
    },
    tr: {
      title: "ElectricalVPF iş başında – ilk aramadan ödemeye | ElectricalVPF",
      back: "Siteye dön", kicker: "Elektrikçiler için", h1: "ElectricalVPF'yi iş başında görün",
      lead: "Bir iş, baştan sona: müşteri arar, teklif verirsiniz, teklifi online kabul eder, sözleşmeyi telefonunda imzalar, faturayı kesersiniz ve ödemenizi alırsınız. Gerçek uygulamadan kısa videolar — ihtiyacınız olanı izleyin.",
      videoLang: "",
      featH2: "90 saniyede ElectricalVPF",
      featP: "Bir iş, ilk aramadan ödemeye kadar: teklif, müşterinin kabulü, online imzalanan sözleşme, fatura ve ödeme. Ardından ayrıntılı görmek için aşağıdan istediğiniz adımı seçin.",
      flow1: "Talep", flow2: "Teklif", flow3: "Online kabul", flow4: "Sözleşme imzalandı", flow5: "Fatura", flow6: "Ödendi",
      tryFree: "Ücretsiz deneyin",
      stepsH2: "Adım adım",
      stepsP: "Çalıştığınız sırayla: her video bir adım, iki dakikadan kısa.",
      c01t: "Müşteri ekleyin", c01d: "Bilgileri bir kez girersiniz — her teklifte, sözleşmede ve faturada yer alır.",
      c02t: "İş talebi kaydedin", c02d: "Müşteri arar — ne gerektiğini, nerede ve ne kadar acil olduğunu saniyeler içinde kaydedin.",
      c03t: "Talebi işe dönüştürün", c03d: "Talebi bir işe kopyalayın — ad, açıklama, öncelik ve para birimi otomatik dolar.",
      c04t: "Malzemeleri tahmin edin", c04d: "Müşteri evet demeden alışveriş listesini hazırlayın.",
      c05t: "İşteki malzemeler", c05d: "Tahmini işe taşıyın; her işin size neye mal olduğunu bilin.",
      c06t: "İşi fiyatlandırın", c06d: "Maliyet artı kâr payınızla malzemeler, işçilik ve yazdıkça güncellenen toplam.",
      c07t: "Teklifi oluşturun", c07d: "Yalnızca satış fiyatları — maliyetleriniz gizli kalır. KDV ve toplam otomatik hesaplanır.",
      c07bt: "Teklif PDF'ini önizleyin", c07bd: "Göndermeden önce müşterinin tam olarak ne alacağını kontrol edin.",
      c08t: "Teklifi gönderin", c08d: "PDF ekte, ayrıca müşterinin online kabul ettiği bir bağlantı.",
      c09t: "Müşteri online kabul eder", c09d: "Hesap yok, uygulama yok: işaretle, ekranda imzala, bitti.",
      c10t: "Her iki tarafça imzalanan sözleşme", c10d: "Önce siz imzalarsınız; müşteri online imzalar ve e-postasına gelen kodla onaylar.",
      c11t: "Tekliften fatura", c11d: "Aynı satırlar, aynı fiyatlar — yeniden yazacak bir şey yok. PDF ekiyle gönderilir.",
      c12t: "Ödendi, iş kapandı", c12d: "Ödemeyi kaydedin ve işin tüm aşamalarını tek ekranda görün.",
      c13t: "Talepten müşteriye", c13d: "Her arama hemen müşteri değildir: potansiyel müşteri olarak kaydedin, takip edin, tek tıkla müşteriye dönüştürün.",
      c14t: "Hiçbir şey kaybetmeden arşivleyin", c14d: "Temiz listeler, kayıp yok: arşivleyin, geri alın ve yalnızca müşterinin hiç görmediğini kalıcı olarak silin.",
      bridgeH2: "Bir sonraki işinizde deneyin",
      bridgeP: "Kendi müşterileriniz ve teklifleriniz ile Free planla başlayın. Online kabul Free planda çalışır ve Free, online imzalanan iki sözleşme içerir; sınırsız sözleşme ve diğer özellikler PRO planla gelir.",
      bridgeSmall: "Kart gerekmez.",
      note: "Gerçek uygulamada, demo hesapla kaydedildi: şirket, müşteriler ve ödeme örnek verilerdir; e-posta adresleri gizlenmiştir. Seslendirme: yapay zekâ.",
    },
    pl: {
      title: "ElectricalVPF w akcji – od pierwszego telefonu do zapłaty | ElectricalVPF",
      back: "Wróć na stronę", kicker: "Dla elektryków", h1: "Zobacz ElectricalVPF w akcji",
      lead: "Jedno zlecenie od początku do końca: dzwoni klient, przygotowujesz ofertę, on akceptuje ją online, podpisuje umowę na telefonie, wystawiasz fakturę i dostajesz zapłatę. Krótkie filmy z prawdziwej aplikacji — obejrzyj ten, którego potrzebujesz.",
      videoLang: "",
      featH2: "ElectricalVPF w 90 sekund",
      featP: "Jedno zlecenie od pierwszego telefonu do zapłaty: oferta, jej akceptacja przez klienta, umowa podpisana online, faktura i płatność. Potem wybierz dowolny krok poniżej, aby zobaczyć go dokładnie.",
      flow1: "Zgłoszenie", flow2: "Oferta", flow3: "Akceptacja online", flow4: "Umowa podpisana", flow5: "Faktura", flow6: "Zapłacono",
      tryFree: "Wypróbuj za darmo",
      stepsH2: "Krok po kroku",
      stepsP: "W kolejności, w jakiej pracujesz: każdy film to jeden krok, poniżej dwóch minut.",
      c01t: "Dodaj klienta", c01d: "Dane wpisujesz raz — pojawiają się na każdej ofercie, umowie i fakturze.",
      c02t: "Zapisz zgłoszenie", c02d: "Dzwoni klient — w kilka sekund zapisujesz, co trzeba zrobić, gdzie i jak pilnie.",
      c03t: "Zamień je w zlecenie", c03d: "Skopiuj zgłoszenie do zlecenia — nazwa, opis, priorytet i waluta wypełniają się same.",
      c04t: "Oszacuj materiały", c04d: "Przygotuj listę zakupów, zanim klient powie „tak”.",
      c05t: "Materiały na zleceniu", c05d: "Przenieś szacunek na zlecenie, żeby wiedzieć, ile kosztuje każde zlecenie.",
      c06t: "Wyceń zlecenie", c06d: "Materiały po kosztach plus Twoja marża, robocizna i suma aktualizowana podczas pisania.",
      c07t: "Przygotuj ofertę", c07d: "Tylko ceny sprzedaży — Twoje koszty pozostają prywatne. VAT i suma liczą się same.",
      c07bt: "Podgląd PDF oferty", c07bd: "Sprawdź dokładnie, co otrzyma klient, zanim ją wyślesz.",
      c08t: "Wyślij ofertę", c08d: "PDF w załączniku plus link, przez który klient akceptuje ją online.",
      c09t: "Klient akceptuje online", c09d: "Bez konta, bez aplikacji: zaznacz, podpisz na ekranie, gotowe.",
      c10t: "Umowa podpisana przez obie strony", c10d: "Najpierw podpisujesz Ty; klient podpisuje online i potwierdza kodem z e-maila.",
      c11t: "Faktura z oferty", c11d: "Te same pozycje, te same ceny — nic do przepisywania. Wysłana z PDF w załączniku.",
      c12t: "Zapłacono, zlecenie zamknięte", c12d: "Zarejestruj płatność i zobacz wszystkie etapy zlecenia w jednym miejscu.",
      c13t: "Od zapytania do klienta", c13d: "Nie każdy telefon to od razu klient: zapisz jako potencjalnego klienta, wróć do niego i zamień w klienta jednym kliknięciem.",
      c14t: "Archiwizuj bez utraty danych", c14d: "Czyste listy, nic nie ginie: archiwizuj, odzyskuj i trwale usuwaj tylko to, czego klient nie widział.",
      bridgeH2: "Wypróbuj przy następnym zleceniu",
      bridgeP: "Zacznij od planu Free z własnymi klientami i ofertami. Akceptacja online działa w planie Free, a Free obejmuje dwie umowy podpisane online; nieograniczone umowy i pozostałe funkcje są w planie PRO.",
      bridgeSmall: "Bez karty.",
      note: "Nagrane w prawdziwej aplikacji na koncie demonstracyjnym: firma, klienci i płatność to dane przykładowe, a adresy e-mail są ukryte. Lektor: głos AI.",
    },
    ru: {
      title: "ElectricalVPF в действии – от первого звонка до оплаты | ElectricalVPF",
      back: "Вернуться на сайт", kicker: "Для электриков", h1: "Посмотрите ElectricalVPF в действии",
      lead: "Одна работа от начала до конца: звонит клиент, вы делаете предложение, он принимает его онлайн, подписывает договор на телефоне, вы выставляете счёт и получаете оплату. Короткие видео из настоящего приложения — смотрите нужное.",
      videoLang: "",
      featH2: "ElectricalVPF за 90 секунд",
      featP: "Одна работа от первого звонка до оплаты: предложение, его принятие клиентом, договор, подписанный онлайн, счёт и оплата. Затем выберите любой шаг ниже, чтобы посмотреть его подробно.",
      flow1: "Заявка", flow2: "Предложение", flow3: "Принято онлайн", flow4: "Договор подписан", flow5: "Счёт", flow6: "Оплачено",
      tryFree: "Попробовать бесплатно",
      stepsH2: "Шаг за шагом",
      stepsP: "В том порядке, в котором вы работаете: каждое видео — один шаг, до двух минут.",
      c01t: "Добавьте клиента", c01d: "Данные вводятся один раз — они появляются в каждом предложении, договоре и счёте.",
      c02t: "Зарегистрируйте заявку", c02d: "Звонит клиент — за секунды сохраняете, что нужно, где и насколько срочно.",
      c03t: "Превратите её в работу", c03d: "Скопируйте заявку в работу — название, описание, приоритет и валюта заполняются сами.",
      c04t: "Оцените материалы", c04d: "Составьте список закупок ещё до того, как клиент скажет «да».",
      c05t: "Материалы на работе", c05d: "Перенесите оценку на работу — и будете знать, во что обходится каждая работа.",
      c06t: "Рассчитайте цену", c06d: "Материалы по себестоимости плюс ваша наценка, работа и итог, который обновляется при вводе.",
      c07t: "Создайте предложение", c07d: "Только цены продажи — ваши затраты остаются скрытыми. НДС и итог считаются сами.",
      c07bt: "Просмотрите PDF предложения", c07bd: "Проверьте, что именно получит клиент, прежде чем отправить.",
      c08t: "Отправьте предложение", c08d: "PDF во вложении и ссылка, по которой клиент принимает его онлайн.",
      c09t: "Клиент принимает онлайн", c09d: "Без учётной записи и без приложения: отметить, подписать на экране — готово.",
      c10t: "Договор, подписанный обеими сторонами", c10d: "Сначала подписываете вы; клиент подписывает онлайн и подтверждает кодом из письма.",
      c11t: "Счёт из предложения", c11d: "Те же строки, те же цены — ничего не нужно перепечатывать. Отправляется с PDF во вложении.",
      c12t: "Оплачено, работа закрыта", c12d: "Зарегистрируйте оплату и видите все этапы работы в одном месте.",
      c13t: "От запроса к клиенту", c13d: "Не каждый звонок — уже клиент: сохраните как лид, вернитесь к нему и превратите в клиента одним кликом.",
      c14t: "Архив без потерь", c14d: "Чистые списки, ничего не потеряно: архивируйте, восстанавливайте и окончательно удаляйте только то, чего клиент не видел.",
      bridgeH2: "Попробуйте на следующей работе",
      bridgeP: "Начните с плана Free со своими клиентами и предложениями. Онлайн-принятие работает на Free, а Free включает два договора, подписанных онлайн; неограниченные договоры и остальные функции — в плане PRO.",
      bridgeSmall: "Карта не нужна.",
      note: "Записано в настоящем приложении на демо-аккаунте: компания, клиенты и оплата — тестовые данные, адреса электронной почты скрыты. Голос: искусственный интеллект.",
    },
    it: {
      title: "ElectricalVPF in azione – dalla prima telefonata al pagamento | ElectricalVPF",
      back: "Torna al sito", kicker: "Per elettricisti", h1: "Guarda ElectricalVPF in azione",
      lead: "Un lavoro dall'inizio alla fine: il cliente chiama, prepari il preventivo, lui lo accetta online, firma il contratto sul telefono, emetti la fattura e vieni pagato. Brevi video dell'app reale — guarda quello che ti serve.",
      videoLang: "",
      featH2: "ElectricalVPF in 90 secondi",
      featP: "Un lavoro dalla prima telefonata al pagamento: il preventivo, l'accettazione del cliente, il contratto firmato online, la fattura e il pagamento. Poi scegli un passaggio qui sotto per vederlo nel dettaglio.",
      flow1: "Richiesta", flow2: "Preventivo", flow3: "Accettato online", flow4: "Contratto firmato", flow5: "Fattura", flow6: "Pagato",
      tryFree: "Provalo gratis",
      stepsH2: "Passo dopo passo",
      stepsP: "Nell'ordine in cui lavori: ogni video è un passaggio, sotto i due minuti.",
      c01t: "Aggiungi un cliente", c01d: "Inserisci i dati una volta sola — compaiono su ogni preventivo, contratto e fattura.",
      c02t: "Registra una richiesta di intervento", c02d: "Il cliente chiama — salvi in pochi secondi cosa serve, dove e con quale urgenza.",
      c03t: "Trasformala in un lavoro", c03d: "Copia la richiesta in un lavoro — nome, descrizione, priorità e valuta si compilano da soli.",
      c04t: "Stima i materiali", c04d: "Prepara la lista della spesa prima che il cliente dica sì.",
      c05t: "Materiali sul lavoro", c05d: "Sposta la stima sul lavoro, così sai quanto ti costa ogni lavoro.",
      c06t: "Fai il prezzo", c06d: "Materiali a costo più il tuo ricarico, manodopera e un totale che si aggiorna mentre scrivi.",
      c07t: "Crea il preventivo", c07d: "Solo prezzi di vendita — i tuoi costi restano riservati. IVA e totale si calcolano da soli.",
      c07bt: "Anteprima del PDF del preventivo", c07bd: "Controlla esattamente cosa riceverà il cliente, prima di inviarlo.",
      c08t: "Invia il preventivo", c08d: "PDF allegato, più un link con cui il cliente lo accetta online.",
      c09t: "Il cliente accetta online", c09d: "Senza account, senza app: spunta, firma sullo schermo, fatto.",
      c10t: "Contratto firmato da entrambi", c10d: "Firmi prima tu; il cliente firma online e conferma con un codice ricevuto via email.",
      c11t: "Fattura dal preventivo", c11d: "Stesse righe, stessi prezzi — niente da riscrivere. Inviata con il PDF allegato.",
      c12t: "Pagato, lavoro chiuso", c12d: "Registra il pagamento e vedi tutte le fasi del lavoro in un'unica schermata.",
      c13t: "Dalla richiesta al cliente", c13d: "Non ogni telefonata è già un cliente: salvala come cliente potenziale, ricontattalo e trasformalo in cliente con un clic.",
      c14t: "Archivia senza perdere nulla", c14d: "Elenchi puliti, niente perso: archivia, recupera ed elimina definitivamente solo ciò che il cliente non ha mai visto.",
      bridgeH2: "Provalo sul tuo prossimo lavoro",
      bridgeP: "Inizia con il piano Free, con i tuoi clienti e preventivi. L'accettazione online funziona sul piano Free, che include anche due contratti firmati online; contratti illimitati e tutte le altre funzioni arrivano con il piano PRO.",
      bridgeSmall: "Nessuna carta richiesta.",
      note: "Registrato nell'app reale su un account dimostrativo: azienda, clienti e pagamento sono dati di esempio e gli indirizzi email sono nascosti. Voce: generata con l'IA.",
    },
    nl: {
      title: "ElectricalVPF in actie – van eerste telefoontje tot betaling | ElectricalVPF",
      back: "Terug naar de website", kicker: "Voor elektriciens", h1: "Zie ElectricalVPF in actie",
      lead: "Eén klus van begin tot eind: een klant belt, je maakt een offerte, hij accepteert die online, tekent het contract op zijn telefoon, jij factureert en krijgt betaald. Korte video's van de echte app — bekijk wat je nodig hebt.",
      videoLang: "",
      featH2: "ElectricalVPF in 90 seconden",
      featP: "Eén klus, van het eerste telefoontje tot de betaling: de offerte, de acceptatie door de klant, het online getekende contract, de factuur en de betaling. Kies daarna hieronder een stap om die in detail te zien.",
      flow1: "Verzoek", flow2: "Offerte", flow3: "Online geaccepteerd", flow4: "Contract getekend", flow5: "Factuur", flow6: "Betaald",
      tryFree: "Probeer gratis",
      stepsH2: "Stap voor stap",
      stepsP: "In de volgorde waarin je werkt: elke video is één stap, korter dan twee minuten.",
      c01t: "Een klant toevoegen", c01d: "Gegevens één keer invoeren — ze staan op elke offerte, elk contract en elke factuur.",
      c02t: "Een werkverzoek vastleggen", c02d: "Een klant belt — leg in een paar seconden vast wat er nodig is, waar en hoe dringend.",
      c03t: "Maak er werk van", c03d: "Kopieer het verzoek naar een klus — naam, omschrijving, prioriteit en valuta worden ingevuld.",
      c04t: "Materialen ramen", c04d: "Stel de boodschappenlijst op voordat de klant ja zegt.",
      c05t: "Materialen op de klus", c05d: "Zet de raming op de klus, zodat je weet wat elke klus kost.",
      c06t: "De klus prijzen", c06d: "Materialen tegen kostprijs plus je opslag, arbeid en een totaal dat meeloopt terwijl je typt.",
      c07t: "De offerte maken", c07d: "Alleen verkoopprijzen — je kosten blijven privé. Btw en totaal worden zelf berekend.",
      c07bt: "Voorbeeld van de offerte-pdf", c07bd: "Controleer precies wat de klant krijgt, voordat je hem verstuurt.",
      c08t: "De offerte versturen", c08d: "Pdf als bijlage, plus een link waarmee de klant online accepteert.",
      c09t: "De klant accepteert online", c09d: "Geen account, geen app: aanvinken, op het scherm tekenen, klaar.",
      c10t: "Contract, door beiden getekend", c10d: "Jij tekent eerst; de klant tekent online en bevestigt met een code die per e-mail komt.",
      c11t: "Factuur uit de offerte", c11d: "Dezelfde regels, dezelfde prijzen — niets opnieuw typen. Verzonden met de pdf als bijlage.",
      c12t: "Betaald, klus afgesloten", c12d: "Registreer de betaling en zie alle stappen van de klus op één plek.",
      c13t: "Van aanvraag tot klant", c13d: "Niet elk telefoontje is al een klant: sla het op als potentiële klant, volg het op en zet het met één klik om naar klant.",
      c14t: "Archiveren zonder iets kwijt te raken", c14d: "Schone lijsten, niets kwijt: archiveer, zet terug en verwijder definitief alleen wat de klant nooit zag.",
      bridgeH2: "Probeer het bij je volgende klus",
      bridgeP: "Begin met het Free-abonnement, met je eigen klanten en offertes. Online accepteren werkt op Free, en Free bevat twee online getekende contracten; onbeperkt contracten en alle andere functies krijg je met PRO.",
      bridgeSmall: "Geen creditcard nodig.",
      note: "Opgenomen in de echte app op een demo-account: het bedrijf, de klanten en de betaling zijn voorbeeldgegevens en de e-mailadressen zijn verborgen. Stem: AI.",
    },
    no: {
      title: "ElectricalVPF i bruk – fra første telefon til betaling | ElectricalVPF",
      back: "Tilbake til nettstedet", kicker: "For elektrikere", h1: "Se ElectricalVPF i bruk",
      lead: "Ett oppdrag fra start til slutt: en kunde ringer, du gir tilbud, kunden godtar det på nett, signerer kontrakten på telefonen, du fakturerer og får betalt. Korte videoer fra den ekte appen — se den du trenger.",
      videoLang: "",
      featH2: "ElectricalVPF på 90 sekunder",
      featP: "Ett oppdrag, fra første telefon til betaling: tilbudet, at kunden godtar det, kontrakten signert på nett, fakturaen og betalingen. Velg deretter et steg nedenfor for å se det i detalj.",
      flow1: "Forespørsel", flow2: "Tilbud", flow3: "Godtatt på nett", flow4: "Kontrakt signert", flow5: "Faktura", flow6: "Betalt",
      tryFree: "Prøv gratis",
      stepsH2: "Steg for steg",
      stepsP: "I den rekkefølgen du jobber: hver video er ett steg, under to minutter.",
      c01t: "Legg til en kunde", c01d: "Opplysningene skrives inn én gang — de kommer på hvert tilbud, hver kontrakt og hver faktura.",
      c02t: "Registrer en arbeidsordre", c02d: "En kunde ringer — lagre hva som trengs, hvor og hvor haster det, på sekunder.",
      c03t: "Gjør den om til et oppdrag", c03d: "Kopier forespørselen til et oppdrag — navn, beskrivelse, prioritet og valuta fylles inn.",
      c04t: "Estimer materialene", c04d: "Lag handlelisten før kunden sier ja.",
      c05t: "Materialer på oppdraget", c05d: "Flytt estimatet til oppdraget, så du vet hva hvert oppdrag koster.",
      c06t: "Pris oppdraget", c06d: "Materialer til kost pluss ditt påslag, arbeid og en sum som oppdateres mens du skriver.",
      c07t: "Lag tilbudet", c07d: "Bare salgspriser — kostnadene dine forblir private. MVA og sum regnes ut automatisk.",
      c07bt: "Forhåndsvis tilbuds-PDF-en", c07bd: "Sjekk nøyaktig hva kunden får, før det sendes.",
      c08t: "Send tilbudet", c08d: "PDF vedlagt, pluss en lenke kunden bruker for å godta på nett.",
      c09t: "Kunden godtar på nett", c09d: "Ingen konto, ingen app: kryss av, signer på skjermen, ferdig.",
      c10t: "Kontrakt, signert av begge", c10d: "Du signerer først; kunden signerer på nett og bekrefter med en kode sendt på e-post.",
      c11t: "Faktura fra tilbudet", c11d: "Samme linjer, samme priser — ingenting å skrive inn på nytt. Sendt med PDF vedlagt.",
      c12t: "Betalt, og oppdraget lukket", c12d: "Registrer betalingen og se alle stegene i oppdraget på ett sted.",
      c13t: "Fra henvendelse til kunde", c13d: "Ikke hver telefon er en kunde ennå: lagre den som potensiell kunde, følg opp og gjør den om til kunde med ett klikk.",
      c14t: "Arkiver uten å miste noe", c14d: "Rene lister, ingenting tapt: arkiver, hent tilbake og slett permanent bare det kunden aldri så.",
      bridgeH2: "Prøv det på neste oppdrag",
      bridgeP: "Start på Free-planen med egne kunder og tilbud. Godkjenning på nett fungerer på Free, og Free inkluderer to kontrakter signert på nett; ubegrensede kontrakter og resten av funksjonene følger med PRO-planen.",
      bridgeSmall: "Ingen kort nødvendig.",
      note: "Tatt opp i den ekte appen på en demokonto: firmaet, kundene og betalingen er eksempeldata, og e-postadressene er skjult. Stemme: KI.",
    },
    sv: {
      title: "ElectricalVPF i praktiken – från första samtalet till betalning | ElectricalVPF",
      back: "Tillbaka till webbplatsen", kicker: "För elektriker", h1: "Se ElectricalVPF i praktiken",
      lead: "Ett arbete från start till mål: en kund ringer, du lämnar offert, kunden godkänner den online, signerar avtalet i telefonen, du fakturerar och får betalt. Korta videor från den riktiga appen — titta på den du behöver.",
      videoLang: "",
      featH2: "ElectricalVPF på 90 sekunder",
      featP: "Ett arbete, från första samtalet till betalning: offerten, kundens godkännande, avtalet som signeras online, fakturan och betalningen. Välj sedan ett steg nedan för att se det i detalj.",
      flow1: "Förfrågan", flow2: "Offert", flow3: "Godkänd online", flow4: "Avtal signerat", flow5: "Faktura", flow6: "Betald",
      tryFree: "Prova gratis",
      stepsH2: "Steg för steg",
      stepsP: "I den ordning du arbetar: varje video är ett steg, under två minuter.",
      c01t: "Lägg till en kund", c01d: "Uppgifterna skrivs in en gång — de syns på varje offert, avtal och faktura.",
      c02t: "Registrera en arbetsorder", c02d: "En kund ringer — spara vad som behövs, var och hur bråttom det är, på några sekunder.",
      c03t: "Gör den till ett arbete", c03d: "Kopiera förfrågan till ett arbete — namn, beskrivning, prioritet och valuta fylls i.",
      c04t: "Beräkna materialet", c04d: "Gör inköpslistan innan kunden säger ja.",
      c05t: "Material på arbetet", c05d: "Flytta beräkningen till arbetet, så att du vet vad varje arbete kostar.",
      c06t: "Prissätt arbetet", c06d: "Material till självkostnad plus ditt påslag, arbete och en summa som uppdateras medan du skriver.",
      c07t: "Skapa offerten", c07d: "Bara försäljningspriser — dina kostnader förblir privata. Moms och summa räknas ut automatiskt.",
      c07bt: "Förhandsgranska offertens PDF", c07bd: "Kontrollera exakt vad kunden får, innan den skickas.",
      c08t: "Skicka offerten", c08d: "PDF bifogad, plus en länk som kunden använder för att godkänna online.",
      c09t: "Kunden godkänner online", c09d: "Inget konto, ingen app: kryssa, signera på skärmen, klart.",
      c10t: "Avtal, signerat av båda", c10d: "Du signerar först; kunden signerar online och bekräftar med en kod som skickas till e-posten.",
      c11t: "Faktura från offerten", c11d: "Samma rader, samma priser — inget att skriva om. Skickas med PDF bifogad.",
      c12t: "Betalt, och arbetet stängt", c12d: "Registrera betalningen och se alla steg i arbetet på ett ställe.",
      c13t: "Från förfrågan till kund", c13d: "Inte varje samtal är en kund än: spara det som potentiell kund, följ upp och gör om det till kund med ett klick.",
      c14t: "Arkivera utan att förlora något", c14d: "Rena listor, inget förlorat: arkivera, återställ och ta bort permanent bara det kunden aldrig såg.",
      bridgeH2: "Prova på ditt nästa arbete",
      bridgeP: "Börja med Free-planen med dina egna kunder och offerter. Godkännande online fungerar på Free, och Free innehåller två avtal som signeras online; obegränsade avtal och resten av funktionerna ingår i PRO-planen.",
      bridgeSmall: "Inget kort behövs.",
      note: "Inspelat i den riktiga appen på ett demokonto: företaget, kunderna och betalningen är exempeldata och e-postadresserna är dolda. Röst: AI.",
    },
  };

  function pickLang() {
    try {
      var saved = localStorage.getItem("locale");
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (err) { /* fără stocare */ }
    var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i] || "").toLowerCase().slice(0, 2);
      if (code === "nb" || code === "nn") code = "no";
      if (LANGS.indexOf(code) !== -1) return code;
    }
    return "en";
  }

  function apply() {
    var lang = pickLang();
    var dict = T[lang] || T.en;
    var site = typeof translations !== "undefined" ? translations : {};
    var siteDict = site[lang] || site.en || {};

    document.documentElement.lang = lang;
    if (dict.title) document.title = dict.title;
    document.querySelectorAll("[data-dm]").forEach(function (el) {
      var key = el.getAttribute("data-dm");
      var value = dict[key] != null ? dict[key] : T.en[key];
      if (key === "videoLang") { (el.closest(".dm-lang-note") || el).hidden = !value; }
      if (value != null) el.textContent = value;
    });
    // Textele comune cu vitrina (aceleași ca pe prima pagină).
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = siteDict[key] || (site.en && site.en[key]);
      if (value) el.textContent = value;
    });
    // „Înapoi la site” → vitrina în aceeași limbă (română = /ro/); documentele legale în limba paginii.
    document.querySelectorAll("[data-dm-home]").forEach(function (a) { a.href = lang === "ro" ? "/ro/" : "/"; });
    document.querySelectorAll("[data-legal]").forEach(function (a) {
      var slug = a.getAttribute("data-legal");
      a.href = "https://electricalvpf.app/frontend/legal/" + slug + (lang === "ro" ? "" : "-" + lang) + ".html?returnSite=eu";
    });
    // Videoul în limba paginii (voce + aplicația în acea limbă) și durata lui pe card.
    if (window.DemoVideos) {
      document.querySelectorAll("video[data-demo]").forEach(function (v) { window.DemoVideos.attach(v, lang); });
      document.querySelectorAll("[data-demo-time]").forEach(function (el) {
        var d = window.DemoVideos.duration(lang, el.getAttribute("data-demo-time"));
        if (d) el.textContent = d;
      });
    }
  }

  // Limba aleasă din meniul „?” al antetului comun: pagina se traduce pe loc (și videourile trec pe limba aleasă).
  document.addEventListener("site:lang-applied", apply);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
