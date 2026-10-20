// «Пікір 11 Ә» — учитель выбирает предмет и по одной карточке оценивает учеников.
// Ссылка: …/?k=<ключ доступа>[&s=<предмет>]. Ключ проверяет база (функции pikir_load / pikir_save,
// ent_platform/supabase/007_teacher_reviews.sql); без него сайт ничего не читает и не пишет.
(function () {
  "use strict";
  const D = window.PIKIR;
  const CFG = window.PIKIR_CONFIG || {};
  const app = document.getElementById("app");
  const dock = document.getElementById("dock");

  const T = {
    kk: {
      title: `${D.className} сыныбы — оқушылар туралы пікір`,
      appealHead: "Құрметті әріптестер!",
      appeal: "Әр оқушы туралы өз сөзіңізбен бір-екі сөйлем болса да тірі пікір жазып беріңізші. Оқушының қазір өзін қалай ұстайтынын, немен жақсы екенін және нені жақсарту керегін дәл сіздің аузыңыздан естігіміз келеді. Бұл оның қалай дамып келе жатқанын көріп, уақытында қолдау көрсетуге көмектеседі.",
      howto: "Баға мен дайын сөйлемдер — бір басумен, өз ойыңызды төменге қосасыз. Бәрі өзі сақталады.",
      time: "Бір оқушыға ≈ 30 секунд.",
      pick: "Пәніңізді таңдаңыз",
      students: "оқушы",
      rating: "Жалпы баға", ratingHint: "— білімі мен сабақтағы жұмысы",
      trend: "Соңғы айдағы динамика",
      phrases: "Дайын сөйлемдер — басып таңдаңыз",
      plus: "Жақсы жағы", minus: "Назар аудару керек",
      own: "Өз сөзіңізбен", ownWhy: "Тірі пікір бізге ең қажеті — 1–2 сөйлем жеткілікті",
      placeholder: "Мысалы: «Соңғы екі аптада белсенділігі артты, бірақ үй тапсырмасын асығыс орындайды»",
      mic: "Телефонда пернетақтадағы микрофонды басып, айтып жазуға болады",
      prev: "Алдыңғы", next: "Келесі", finish: "Аяқтау",
      saving: "Сақталуда…", saved: "✓ Сақталды", error: "Сақталмады — басып, қайталаңыз",
      done: "толтырылды", change: "Пәнді ауыстыру",
      thanks: "Рақмет! Пікірлеріңіз сақталды.",
      thanksSub: "Осы сілтеме арқылы кез келген уақытта қайта кіріп, түзете аласыз.",
      left: "Әлі толтырылмағандар", allDone: "✓ Барлық оқушы толтырылды", back: "Тізімге оралу",
      loadErr: "Жүктелмеді. Интернетті тексеріп, бетті жаңартыңыз.",
      noKey: "Сілтеме толық емес. Сынып жетекшісі жіберген сілтемені толық ашыңыз.",
      badKey: "Сілтеме ескірген. Сынып жетекшісінен жаңа сілтеме сұраңыз.",
      notReady: "Баға + кемінде бір сөйлем керек",
    },
    ru: {
      title: `${D.className} — отзывы об учениках`,
      appealHead: "Уважаемые коллеги!",
      appeal: "Пожалуйста, напишите о каждом ученике живой отзыв своими словами — хотя бы одну-две фразы. Нам очень важно услышать именно от вас, как ученик ведёт себя сейчас, что у него получается и что стоит улучшить. Так мы видим, как ученик развивается, и можем вовремя его поддержать.",
      howto: "Оценка и готовые фразы — одним нажатием, своё дописываете ниже. Всё сохраняется само.",
      time: "≈ 30 секунд на ученика.",
      pick: "Выберите свой предмет",
      students: "уч.",
      rating: "Общая оценка", ratingHint: "— знания и работа на уроке",
      trend: "Динамика за последний месяц",
      phrases: "Готовые фразы — нажмите, чтобы выбрать",
      plus: "Сильные стороны", minus: "Над чем поработать",
      own: "Своими словами", ownWhy: "Живой отзыв нам нужнее всего — достаточно 1–2 предложений",
      placeholder: "Например: «Последние две недели стал активнее, но домашние задания делает наспех»",
      mic: "На телефоне можно нажать микрофон на клавиатуре и надиктовать",
      prev: "Назад", next: "Дальше", finish: "Завершить",
      saving: "Сохраняется…", saved: "✓ Сохранено", error: "Не сохранилось — нажмите, чтобы повторить",
      done: "заполнено", change: "Сменить предмет",
      thanks: "Спасибо! Ваши отзывы сохранены.",
      thanksSub: "По этой же ссылке можно вернуться и поправить в любое время.",
      left: "Ещё не заполнены", allDone: "✓ Все ученики заполнены", back: "Вернуться к списку",
      loadErr: "Не загрузилось. Проверьте интернет и обновите страницу.",
      noKey: "Ссылка неполная. Откройте ссылку от классного руководителя целиком.",
      badKey: "Ссылка устарела. Попросите у классного руководителя новую.",
      notReady: "Нужна оценка + хотя бы одна фраза",
    },
  };

  // ---------- хранилище в браузере (только удобства: язык и ключ) ----------
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
  };

  const url = new URL(location.href);
  const keyFromUrl = url.searchParams.get("k");
  if (keyFromUrl) ls.set("pikir_key", keyFromUrl);
  const KEY = keyFromUrl || ls.get("pikir_key");

  let lang = ls.get("pikir_lang") === "ru" ? "ru" : "kk";
  let t = T[lang];

  // ---------- состояние ----------
  const S = {
    subject: null, // объект предмета
    students: [],
    reviews: {}, // имя → {rating, trend, tags, comment}
    idx: 0,
    finished: false,
    loaded: "idle", // idle | loading | ok | error | badkey
    save: {}, // имя → saving | saved | error
  };
  const timers = {};

  // ---------- база ----------
  async function rpc(fn, body) {
    const res = await fetch(`${CFG.url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: CFG.anonKey, Authorization: `Bearer ${CFG.anonKey}` },
      body: JSON.stringify({ p_key: KEY, ...body }),
      keepalive: fn === "pikir_save",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(text || String(res.status));
      err.badKey = text.includes("bad key");
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  const base = () => ({ p_round: D.round.id, p_class: D.className, p_subject: S.subject.id });

  async function load() {
    S.loaded = "loading";
    render();
    try {
      const rows = (await rpc("pikir_load", base())) || [];
      S.reviews = {};
      for (const r of rows) S.reviews[r.student] = { rating: r.rating, trend: r.trend, tags: r.tags || [], comment: r.comment || "" };
      // Начинаем с первого незаполненного — вернувшийся учитель продолжает с места.
      const first = S.students.findIndex((s) => !complete(S.reviews[s.name]));
      S.idx = first === -1 ? 0 : first;
      S.finished = first === -1 && rows.length > 0;
      S.loaded = "ok";
    } catch (e) {
      S.loaded = e.badKey ? "badkey" : "error";
    }
    render();
  }

  async function send(name) {
    const r = S.reviews[name];
    if (!r) return;
    setSave(name, "saving");
    try {
      await rpc("pikir_save", {
        ...base(), p_teacher: S.subject.teacher, p_student: name,
        p_rating: r.rating, p_trend: r.trend, p_tags: r.tags, p_comment: r.comment,
      });
      // Пока шёл запрос, учитель мог дописать — тогда новый таймер уже стоит и обновит статус сам.
      if (S.reviews[name] === r && !timers[name]) setSave(name, "saved");
    } catch {
      setSave(name, "error");
    }
  }

  function update(name, patch, delay) {
    S.reviews[name] = { ...(S.reviews[name] || empty()), ...patch };
    S.save[name] = "saving";
    clearTimeout(timers[name]);
    timers[name] = setTimeout(() => { delete timers[name]; send(name); }, delay);
  }

  function flush() {
    for (const name of Object.keys(timers)) {
      clearTimeout(timers[name]);
      delete timers[name];
      send(name);
    }
  }
  addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());

  // ---------- помощники ----------
  const empty = () => ({ rating: null, trend: null, tags: [], comment: "" });
  const complete = (r) => !!r && r.rating != null && (r.tags.length > 0 || r.comment.trim().length > 0);
  const started = (r) => !!r && (r.rating != null || r.trend != null || r.tags.length > 0 || r.comment.trim().length > 0);
  const studentsOf = (s) => D.students.filter((x) => !s.group || x.group === s.group);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const short = (full) => { const [a, b] = full.split(" "); return b ? `${b} ${a[0]}.` : full; };
  const roundName = () => D.round[lang];

  function setSave(name, state) {
    S.save[name] = state;
    if (S.students[S.idx] && S.students[S.idx].name === name) renderStatus();
    renderStrip();
  }

  function go(i) {
    flush();
    S.finished = false;
    S.idx = Math.max(0, Math.min(S.students.length - 1, i));
    render();
    scrollTo(0, 0);
  }

  function openSubject(id, push = true) {
    const s = D.subjects.find((x) => x.id === id);
    if (!s) return;
    S.subject = s;
    S.students = studentsOf(s);
    S.save = {};
    if (push) {
      const u = new URL(location.href);
      u.searchParams.set("s", id);
      history.pushState({ s: id }, "", u);
    }
    scrollTo(0, 0);
    load();
  }

  function closeSubject(push = true) {
    flush();
    S.subject = null;
    S.loaded = "idle";
    if (push) {
      const u = new URL(location.href);
      u.searchParams.delete("s");
      history.pushState({}, "", u);
    }
    render();
    scrollTo(0, 0);
  }

  addEventListener("popstate", () => {
    const s = new URL(location.href).searchParams.get("s");
    if (s) openSubject(s, false); else closeSubject(false);
  });

  // ---------- отрисовка ----------
  function topBar() {
    return `<div class="top">
      <div class="brand"><i aria-hidden="true"></i>Пікір · ${esc(D.className)}</div>
      <div class="lang" role="group" aria-label="Тіл / Язык">
        <button type="button" data-lang="kk" aria-pressed="${lang === "kk"}">ҚАЗ</button>
        <button type="button" data-lang="ru" aria-pressed="${lang === "ru"}">РУС</button>
      </div>
    </div>`;
  }

  function render() {
    document.documentElement.lang = lang === "kk" ? "kk" : "ru";
    if (!CFG.url || !KEY) {
      app.innerHTML = topBar() + `<p class="note">${esc(t.noKey)}</p>`;
      dock.hidden = true;
      return;
    }
    if (!S.subject) return renderPicker();
    renderDeck();
  }

  function renderPicker() {
    dock.hidden = true;
    app.innerHTML = `${topBar()}
      <div><p class="eyebrow">${esc(roundName())}</p><h1>${esc(t.title)}</h1></div>
      <section class="appeal"><b>${esc(t.appealHead)}</b><p>${esc(t.appeal)}</p>
        <small>${esc(t.howto)} <b style="display:inline;color:var(--ink)">${esc(t.time)}</b></small></section>
      <section class="sec"><h2 style="font-size:20px">${esc(t.pick)}</h2>
        <div class="subjects">${D.subjects.map((s) => `
          <button type="button" class="subj" data-subject="${s.id}">
            <span><b>${esc(s[lang])}</b><small>${esc(s.teacher)}</small></span>
            <em>${studentsOf(s).length} ${esc(t.students)}</em>
          </button>`).join("")}
        </div></section>`;
  }

  function renderDeck() {
    const s = S.subject;
    const doneCount = S.students.filter((x) => complete(S.reviews[x.name])).length;
    let body = "";
    if (S.loaded === "loading") body = `<div class="skeleton"></div>`;
    else if (S.loaded === "error") body = `<p class="note">${esc(t.loadErr)}</p>`;
    else if (S.loaded === "badkey") body = `<p class="note">${esc(t.badKey)}</p>`;
    else if (S.finished) body = finishHtml();
    else body = cardHtml();

    app.innerHTML = `${topBar()}
      <div class="head">
        <div><p class="eyebrow">${esc(D.className)} · ${esc(roundName())}</p>
          <h1>${esc(s[lang])} <small>· ${esc(s.teacher)}</small></h1></div>
        <button type="button" class="link" data-act="change">${esc(t.change)}</button>
      </div>
      <div class="progress"><div class="bar"><i style="width:${(doneCount / S.students.length) * 100}%"></i></div>
        <span><b>${doneCount}</b> / ${S.students.length} ${esc(t.done)}</span></div>
      <nav class="strip" aria-label="Оқушылар / Ученики"><ol id="strip"></ol></nav>
      ${body}`;
    renderStrip();

    const showDock = S.loaded === "ok" && !S.finished;
    dock.hidden = !showDock;
    if (showDock) {
      const last = S.idx === S.students.length - 1;
      dock.innerHTML = `<div>
        <button type="button" class="btn" data-act="prev" ${S.idx === 0 ? "disabled" : ""} aria-label="${esc(t.prev)}">←</button>
        <div class="status" id="status"></div>
        <button type="button" class="btn go" data-act="${last ? "finish" : "next"}">${esc(last ? t.finish : t.next)} →</button>
      </div>`;
      renderStatus();
    }
  }

  function renderStrip() {
    const ol = document.getElementById("strip");
    if (!ol) return;
    ol.innerHTML = S.students.map((x, i) => {
      const r = S.reviews[x.name];
      const cls = complete(r) ? "ok" : started(r) ? "half" : "";
      const cur = i === S.idx && !S.finished && S.loaded === "ok";
      return `<li><button type="button" class="num ${cls}" data-go="${i}" title="${esc(x.name)}" ${cur ? 'aria-current="true"' : ""}>${i + 1}</button></li>`;
    }).join("");
    // прогресс-бар тоже обновляем без перерисовки карточки (не сбиваем фокус в поле)
    const doneCount = S.students.filter((x) => complete(S.reviews[x.name])).length;
    const bar = app.querySelector(".bar i");
    if (bar) bar.style.width = `${(doneCount / S.students.length) * 100}%`;
    const num = app.querySelector(".progress b");
    if (num) num.textContent = doneCount;
  }

  function renderStatus() {
    const el = document.getElementById("status");
    if (!el) return;
    const name = S.students[S.idx].name;
    const st = S.save[name];
    if (st === "error") {
      el.outerHTML = `<button type="button" class="status error" id="status" data-act="retry">${esc(t.error)}</button>`;
      return;
    }
    if (el.tagName === "BUTTON") el.outerHTML = `<div class="status" id="status"></div>`;
    const box = document.getElementById("status");
    box.className = "status" + (st === "saved" ? " saved" : "");
    box.textContent = st === "saving" ? t.saving : st === "saved" ? t.saved : complete(S.reviews[name]) ? "" : t.notReady;
  }

  function cardHtml() {
    const st = S.students[S.idx];
    const r = S.reviews[st.name] || empty();
    const rates = [1, 2, 3, 4, 5].map((n) => `
      <button type="button" class="rate r${n}" role="radio" aria-checked="${r.rating === n}" data-rate="${n}">
        <b>${n}</b><small>${esc(D.rating[lang][n])}</small></button>`).join("");
    const trends = [[1, "↗"], [0, "→"], [-1, "↘"]].map(([v, a]) => `
      <button type="button" class="trend" aria-pressed="${r.trend === v}" data-trend="${v}"><span aria-hidden="true">${a}</span>${esc(D.trend[lang][v])}</button>`).join("");
    const chips = (tone) => D.phrases.filter((p) => p.tone === tone).map((p) => `
      <button type="button" class="chip ${tone}" aria-pressed="${r.tags.includes(p.id)}" data-tag="${p.id}">${esc(p[lang])}</button>`).join("");

    return `<article class="card">
      <header><div><p>${S.idx + 1} / ${S.students.length}</p><h2>${esc(st.name)}</h2></div>
        <span class="tag">${esc(D.groups[st.group][lang])}</span></header>
      <section class="sec"><h3>${esc(t.rating)} <small>${esc(t.ratingHint)}</small></h3>
        <div class="rates" role="radiogroup" aria-label="${esc(t.rating)}">${rates}</div></section>
      <section class="sec"><h3>${esc(t.trend)}</h3><div class="trends">${trends}</div></section>
      <section class="sec"><h3>${esc(t.phrases)}</h3>
        <p class="tone plus">${esc(t.plus)}</p><div class="chips">${chips("plus")}</div>
        <p class="tone minus">${esc(t.minus)}</p><div class="chips">${chips("minus")}</div></section>
      <section class="sec own">
        <label for="own"><b>${esc(t.own)}</b><span>${esc(t.ownWhy)}</span></label>
        <textarea id="own" maxlength="1500" rows="3" placeholder="${esc(t.placeholder)}">${esc(r.comment)}</textarea>
        <p class="mic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/></svg>${esc(t.mic)}</p>
      </section>
    </article>`;
  }

  function finishHtml() {
    const left = S.students.map((x, i) => ({ ...x, i })).filter((x) => !complete(S.reviews[x.name]));
    const head = left.length < S.students.length ? `<div><h2>${esc(t.thanks)}</h2><p>${esc(t.thanksSub)}</p></div>` : "";
    const rest = left.length === 0
      ? `<p class="alldone">${esc(t.allDone)}</p>`
      : `<div class="left"><h3>${esc(t.left)}: ${left.length}</h3><div class="chips">${left.map((x) =>
          `<button type="button" class="chip" data-go="${x.i}">${x.i + 1}. ${esc(short(x.name))}</button>`).join("")}</div></div>`;
    return `<section class="finish">${head}${rest}<button type="button" class="link" style="align-self:flex-start" data-go="0">${esc(t.back)}</button></section>`;
  }

  // Точечное обновление карточки: кнопки меняют aria-атрибуты без перерисовки (поле ввода не теряет фокус).
  function refreshCard() {
    const r = S.reviews[S.students[S.idx].name] || empty();
    app.querySelectorAll("[data-rate]").forEach((b) => b.setAttribute("aria-checked", String(r.rating === +b.dataset.rate)));
    app.querySelectorAll("[data-trend]").forEach((b) => b.setAttribute("aria-pressed", String(r.trend === +b.dataset.trend)));
    app.querySelectorAll("[data-tag]").forEach((b) => b.setAttribute("aria-pressed", String(r.tags.includes(b.dataset.tag))));
    renderStrip();
    renderStatus();
  }

  // ---------- события ----------
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const d = b.dataset;
    if (d.lang) { lang = d.lang; t = T[lang]; ls.set("pikir_lang", lang); render(); return; }
    if (d.subject) return openSubject(d.subject);
    if (d.go != null) return go(+d.go);
    if (d.act === "change") return closeSubject();
    if (d.act === "prev") return go(S.idx - 1);
    if (d.act === "next") return go(S.idx + 1);
    if (d.act === "finish") { flush(); S.finished = true; render(); scrollTo(0, 0); return; }
    if (d.act === "retry") return send(S.students[S.idx].name);

    const name = S.students[S.idx] && S.students[S.idx].name;
    if (!name) return;
    const r = S.reviews[name] || empty();
    if (d.rate) update(name, { rating: r.rating === +d.rate ? null : +d.rate }, 300);
    else if (d.trend != null) update(name, { trend: r.trend === +d.trend ? null : +d.trend }, 300);
    else if (d.tag) update(name, { tags: r.tags.includes(d.tag) ? r.tags.filter((x) => x !== d.tag) : [...r.tags, d.tag] }, 400);
    else return;
    refreshCard();
  });

  document.addEventListener("input", (e) => {
    if (e.target.id !== "own") return;
    update(S.students[S.idx].name, { comment: e.target.value }, 900);
    renderStrip();
    renderStatus();
  });
  document.addEventListener("focusout", (e) => e.target.id === "own" && flush());

  // Компьютер: ←/→ — ученики, 1–5 — оценка (когда курсор не в поле ввода).
  document.addEventListener("keydown", (e) => {
    if (!S.subject || S.loaded !== "ok" || S.finished) return;
    if (e.target.tagName === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowRight") go(S.idx + 1);
    else if (e.key === "ArrowLeft") go(S.idx - 1);
    else if (/^[1-5]$/.test(e.key)) { update(S.students[S.idx].name, { rating: +e.key }, 300); refreshCard(); }
  });

  // ---------- старт ----------
  const startSubject = url.searchParams.get("s");
  if (KEY && CFG.url && startSubject && D.subjects.some((s) => s.id === startSubject)) openSubject(startSubject, false);
  else render();
})();
