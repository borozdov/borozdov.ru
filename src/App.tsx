import React, { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";

type Lik = "obsidian" | "titan";

const NAV_ITEMS = [
  { title: "Спорт", anchor: "sport" },
  { title: "Рекорды", anchor: "records" },
  { title: "Результаты", anchor: "results" },
  { title: "Обучение", anchor: "education" },
  { title: "Встреча", anchor: "meet" },
];

const RESULTS_SCM = [
  { event: "400 м вольный стиль", time: "3:53.15", points: 754 },
  { event: "800 м вольный стиль", time: "8:10.36", points: 724 },
  { event: "1500 м вольный стиль", time: "15:41.12", points: 728 },
];

const RESULTS_LCM = [
  { event: "400 м вольный стиль", time: "4:00.79", points: 762, record: true },
  { event: "800 м вольный стиль", time: "8:19.10", points: 743 },
  { event: "1500 м вольный стиль", time: "15:58.02", points: 750 },
];

const PROFILES = [
  { name: "SPORTCUBES", note: "База результатов российских стартов", url: "https://sportcubes.ru/idswim51548" },
  { name: "SWIMCLOUD", note: "Международная база пловцов", url: "https://www.swimcloud.com/swimmer/3440515/" },
];

const EDUCATION = [
  {
    label: "Университет",
    status: "2 курс",
    title: "Сибирский государственный университет телекоммуникаций и информатики",
    url: "https://www.sibsutis.ru/",
  },
  {
    label: "Колледж",
    status: "2 курс",
    title: "Новосибирское училище (колледж) олимпийского резерва",
    url: "https://uor-nsk.ru/",
  },
  {
    label: "Школа",
    status: "До 7 класса, далее — семейное обучение",
    title: "Новосибирский городской педагогический лицей имени А. С. Пушкина",
    url: "https://ngpl.schoolsite.ru/",
  },
];

function getInitialLik(): Lik {
  if (typeof document !== "undefined") {
    const current = document.documentElement.dataset.theme;
    if (current === "titan" || current === "obsidian") return current;
  }
  return "obsidian";
}

/* Лик следует за средой (§1.5): только системная тема, без ручного выбора */
function useAutoLik(): Lik {
  const [lik, setLik] = useState<Lik>(getInitialLik);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () => {
      const next: Lik = media.matches ? "titan" : "obsidian";
      document.documentElement.dataset.theme = next;
      setLik(next);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return lik;
}

/* Появление секции: fade + подъём, 0.3s ease (§8) */
function Rise({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ index, title, id }: { index: string; title: string; id?: string }) {
  return (
    <div className="border-t border-hairline pt-5 mb-10 md:mb-14 flex items-baseline justify-between gap-6">
      <h2 className="text-3xl sm:text-5xl md:text-7xl font-semibold uppercase tracking-[-0.02em] leading-none">
        {title}
      </h2>
      <span className="font-mono tabular-nums text-slate text-sm md:text-base" aria-hidden="true">
        {index}
      </span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-slate">{children}</span>
  );
}

function RecordBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-ink text-canvas rounded-[2px] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]">
      {children}
    </span>
  );
}

function pointsWord(n: number) {
  const tail = n % 100;
  if (tail >= 11 && tail <= 14) return "очков";
  switch (n % 10) {
    case 1:
      return "очко";
    case 2:
    case 3:
    case 4:
      return "очка";
    default:
      return "очков";
  }
}

function ResultsTable({ caption, rows }: { caption: string; rows: typeof RESULTS_LCM }) {
  return (
    <div className="bg-surface border border-hairline rounded-[8px] overflow-hidden">
      <div className="px-4 md:px-5 pt-5 pb-4">
        <Label>{caption}</Label>
      </div>

      {/* Шапка таблицы — только на широких экранах; сетка идентична строкам, чтобы колонки совпадали */}
      <div
        className="hidden md:grid grid-cols-[1fr_170px_120px] bg-inset text-slate text-[11px] font-medium uppercase tracking-[0.12em]"
        aria-hidden="true"
      >
        <div className="px-5 py-3">Дистанция</div>
        <div className="py-3 text-center">Время</div>
        <div className="py-3 text-center">Очки FINA</div>
      </div>

      {rows.map((row) => (
        <div
          key={row.event}
          className="grid grid-cols-[1fr_auto] gap-x-4 md:grid-cols-[1fr_170px_120px] md:gap-x-0 items-center border-t border-hairline hover:bg-hoverbg transition-colors duration-150 px-4 py-4 md:p-0"
        >
          <div className="md:px-5 md:py-4 text-sm md:text-base font-medium">
            <span className="inline-flex items-center gap-2.5 flex-wrap">
              {row.event}
              {"record" in row && row.record && <RecordBadge>Рекорд</RecordBadge>}
            </span>
            {/* На мобильных очки — под дистанцией, шапки нет */}
            <span className="mt-1 block md:hidden font-mono tabular-nums text-xs text-slate">
              {row.points} {pointsWord(row.points)} FINA
            </span>
          </div>
          <div className="md:py-4 text-right md:text-center font-mono tabular-nums text-xl md:text-2xl font-semibold whitespace-nowrap">
            {row.time}
          </div>
          <div className="hidden md:block py-4 text-center font-mono tabular-nums text-base text-slate">
            {row.points}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalInlineEmbed({ lik }: { lik: Lik }) {
  useEffect(() => {
    (function (C: Window & { Cal?: any }, A: string, L: string) {
      const push = function (api: any, args: IArguments | unknown[]) {
        api.q.push(args);
      };
      const d = C.document;

      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const args = arguments;

          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }

          if (args[0] === L) {
            const api = function () {
              push(api, arguments);
            };
            const namespace = args[1];

            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              push(cal.ns[namespace], args);
              push(cal, ["initNamespace", namespace]);
            } else {
              push(cal, args);
            }
            return;
          }

          push(cal, args);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    const Cal = (window as unknown as Window & { Cal: any }).Cal;
    const theme = lik === "obsidian" ? "dark" : "light";

    Cal("init", "meet", { origin: "https://app.cal.com" });
    Cal.ns.meet("inline", {
      elementOrSelector: "#my-cal-inline-meet",
      config: {
        disableMobileScroll: true,
        hideBranding: true,
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
        theme,
      },
      calLink: "borozdov/meet",
    });

    Cal.ns.meet("ui", {
      theme,
      styles: {
        body: { background: "transparent" },
        eventTypeListItem: { background: "transparent" },
      },
      cssVarsPerTheme: {
        light: {
          "cal-bg": "transparent",
          "cal-bg-emphasis": "#f2f2f2",
          "cal-bg-muted": "#ececec",
          "cal-bg-subtle": "#f6f6f6",
          "cal-border": "#e4e4e4",
          "cal-brand": "#0d0d0d",
          "cal-text": "#0d0d0d",
          "cal-text-emphasis": "#0d0d0d",
          "cal-text-muted": "#6b6b6b",
          "cal-text-subtle": "#8a8a8a",
        },
        dark: {
          "cal-bg": "transparent",
          "cal-bg-emphasis": "#212121",
          "cal-bg-muted": "#121212",
          "cal-bg-subtle": "#161616",
          "cal-border": "#2e2e2e",
          "cal-brand": "#fafafa",
          "cal-text": "#fafafa",
          "cal-text-emphasis": "#fafafa",
          "cal-text-muted": "#8a8a8a",
          "cal-text-subtle": "#6b6b6b",
        },
      },
      hideEventTypeDetails: false,
      hideBranding: true,
      layout: "month_view",
    });
  }, [lik]);

  return (
    <div className="calendar-clip mx-auto h-[820px] w-full overflow-hidden bg-transparent md:h-[660px] lg:h-[430px] xl:h-[620px]">
      <div id="my-cal-inline-meet" className="h-[calc(100%+120px)] w-full bg-transparent" />
    </div>
  );
}

export default function App() {
  const lik = useAutoLik();
  const { scrollY } = useScroll();
  const backToTopOpacity = useTransform(scrollY, [0, 160], [0, 1]);
  const backToTopPointerEvents = useTransform(scrollY, (value) => (value > 80 ? "auto" : "none"));

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <motion.button
        style={{ opacity: backToTopOpacity, pointerEvents: backToTopPointerEvents }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Наверх"
        className="fixed bottom-6 right-6 z-50 p-3 rounded-[4px] border border-strong bg-canvas hover:bg-ink hover:text-canvas transition-colors duration-150"
      >
        <ArrowUp className="w-5 h-5" strokeWidth={2} />
      </motion.button>

      <header className="sticky top-0 z-40 bg-canvas border-b border-hairline">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 h-16 flex items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-lg md:text-xl font-semibold uppercase tracking-[-0.02em] whitespace-nowrap"
          >
            Borozdov
          </a>

          <nav className="hidden md:flex items-center gap-7" aria-label="Разделы">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.anchor}
                onClick={() => scrollToSection(item.anchor)}
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate hover:text-ink transition-colors duration-150"
              >
                {item.title}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollToSection("meet")}
            className="bg-ink text-canvas rounded-[4px] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] hover:brightness-85 transition duration-150 whitespace-nowrap"
          >
            Записаться
          </button>
        </div>

        <nav className="md:hidden border-t border-hairline" aria-label="Разделы">
          <div className="flex items-center justify-between h-11 px-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.anchor}
                onClick={() => scrollToSection(item.anchor)}
                className="text-[10px] font-medium uppercase tracking-[0.04em] text-slate hover:text-ink transition-colors duration-150 whitespace-nowrap"
              >
                {item.title}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* ГЕРОЙ */}
        <section className="pt-16 md:pt-28 pb-16 md:pb-24">
          <Rise>
            <Label>Мастер спорта · Плавание · Стайер</Label>
            <h1 className="mt-5 text-[13vw] leading-[0.95] md:text-8xl lg:text-9xl font-semibold uppercase tracking-[-0.02em]">
              Бороздов
              <br />
              Никита
            </h1>
            <p className="mt-8 max-w-2xl text-lg md:text-2xl text-soft leading-snug">
              Вольный стиль, дистанции 400 / 800 / 1500 метров. Член сборной Новосибирской области.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => scrollToSection("meet")}
                className="w-full sm:w-auto bg-ink text-canvas rounded-[4px] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.02em] hover:brightness-85 transition duration-150"
              >
                Записаться на встречу
              </button>
              <button
                onClick={() => scrollToSection("results")}
                className="w-full sm:w-auto rounded-[4px] border border-hairline px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] hover:border-strong transition-colors duration-150"
              >
                Результаты
              </button>
            </div>
          </Rise>

          <Rise delay={0.1} className="mt-16 md:mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-hairline">
              {[
                { value: "762", unit: "очка FINA", note: "Лучший результат по очкам" },
                { value: "3:53.15", unit: "400 м в/с, 25 м", note: "Лучшее время" },
                { value: "МС", unit: "звание", note: "Мастер спорта России" },
              ].map((stat) => (
                <div
                  key={stat.note}
                  className="py-5 sm:py-8 sm:pr-10 border-b sm:border-b-0 border-hairline last:border-b-0 flex items-center justify-between gap-4 sm:block"
                >
                  <div className="font-mono tabular-nums text-3xl sm:text-4xl md:text-5xl font-bold leading-none">
                    {stat.value}
                  </div>
                  <div className="text-right sm:text-left sm:mt-3">
                    <div className="text-sm text-soft">{stat.note}</div>
                    <Label>{stat.unit}</Label>
                  </div>
                </div>
              ))}
            </div>
          </Rise>
        </section>

        {/* СПОРТ */}
        <section id="sport" className="scroll-mt-28 pb-16 md:pb-24">
          <SectionHeader index="01" title="Спорт" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline rounded-[8px] overflow-hidden">
            {[
              { label: "Звание", value: "Мастер спорта России" },
              { label: "Специализация", value: "Стайер — 400, 800 и 1500 м вольным стилем" },
              { label: "Команда", value: "Сборная Новосибирской области" },
            ].map((item, i) => (
              <Rise key={item.label} delay={i * 0.05}>
                <div className="bg-surface h-full p-6 md:p-8">
                  <Label>{item.label}</Label>
                  <p className="mt-4 text-xl md:text-2xl font-semibold uppercase tracking-[-0.02em] leading-tight">
                    {item.value}
                  </p>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        {/* РЕКОРДЫ */}
        <section id="records" className="scroll-mt-28 pb-16 md:pb-24">
          <SectionHeader index="02" title="Рекорды" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <Rise>
              <Label>Титулы</Label>
              <ul className="mt-6">
                {["Чемпион Сибирского федерального округа по плаванию", "Чемпион Новосибирской области"].map(
                  (title) => (
                    <li
                      key={title}
                      className="border-b border-hairline py-5 text-xl md:text-3xl font-semibold uppercase tracking-[-0.02em] leading-tight"
                    >
                      {title}
                    </li>
                  )
                )}
              </ul>
            </Rise>

            <Rise delay={0.05}>
              <div className="bg-surface border border-hairline rounded-[8px] p-6 md:p-10">
                <div className="flex items-center justify-between gap-4">
                  <Label>Лучший результат по очкам FINA</Label>
                  <RecordBadge>Личный рекорд</RecordBadge>
                </div>
                <div className="mt-8 font-mono tabular-nums text-[clamp(2.75rem,15vw,4.5rem)] md:text-8xl font-bold leading-none">
                  4:00.79
                </div>
                <div className="mt-3 font-mono tabular-nums text-xl md:text-2xl text-soft">762 очка</div>
                <dl className="mt-10 pt-8 border-t border-hairline grid grid-cols-2 gap-6">
                  <div>
                    <dt><Label>Дистанция</Label></dt>
                    <dd className="mt-2 text-sm md:text-base font-medium">400 м, вольный стиль, бассейн 50 м</dd>
                  </div>
                  <div>
                    <dt><Label>Дата</Label></dt>
                    <dd className="mt-2 font-mono tabular-nums text-sm md:text-base font-medium">19.04.2026</dd>
                  </div>
                  <div className="col-span-2">
                    <dt><Label>Соревнование</Label></dt>
                    <dd className="mt-2 text-sm md:text-base font-medium">
                      Кубок России по плаванию, финал — Санкт-Петербург
                    </dd>
                  </div>
                </dl>
              </div>
            </Rise>
          </div>
        </section>

        {/* РЕЗУЛЬТАТЫ */}
        <section id="results" className="scroll-mt-28 pb-16 md:pb-24">
          <SectionHeader index="03" title="Результаты" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <Rise>
              <ResultsTable caption="Бассейн 25 метров" rows={RESULTS_SCM} />
            </Rise>
            <Rise delay={0.05}>
              <ResultsTable caption="Бассейн 50 метров" rows={RESULTS_LCM} />
            </Rise>
          </div>

          <Rise className="mt-12 md:mt-16">
            <Label>Профили в базах результатов</Label>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROFILES.map((profile) => (
                <a
                  key={profile.name}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-6 rounded-[8px] border border-hairline p-6 md:p-8 hover:bg-ink hover:text-canvas hover:border-strong transition-colors duration-150"
                >
                  <span>
                    <span className="block text-2xl md:text-4xl font-semibold uppercase tracking-[-0.02em] leading-none">
                      {profile.name}
                    </span>
                    <span className="mt-2 block text-sm text-slate group-hover:text-canvas/70 transition-colors duration-150">
                      {profile.note}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="w-6 h-6 md:w-8 md:h-8 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-150"
                    strokeWidth={2}
                  />
                </a>
              ))}
            </div>
          </Rise>
        </section>

        {/* ОБУЧЕНИЕ */}
        <section id="education" className="scroll-mt-28 pb-16 md:pb-24">
          <SectionHeader index="04" title="Обучение" />
          <div>
            {EDUCATION.map((item, i) => (
              <Rise key={item.title} delay={i * 0.05}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-2 md:gap-8 items-baseline border-b border-hairline py-6 md:py-8 hover:bg-hoverbg transition-colors duration-150 md:px-4 md:-mx-4"
                >
                  <Label>{item.label}</Label>
                  <span>
                    <span className="block text-lg md:text-2xl font-semibold uppercase tracking-[-0.02em] leading-tight">
                      {item.title}
                    </span>
                    <span className="mt-1.5 block text-sm text-slate">{item.status}</span>
                  </span>
                  <ArrowUpRight
                    className="hidden md:block w-5 h-5 self-center opacity-40 group-hover:opacity-100 transition-opacity duration-150"
                    strokeWidth={2}
                  />
                </a>
              </Rise>
            ))}
          </div>

          <Rise className="mt-14 md:mt-20">
            <Label>Проекты</Label>
            <a
              href="https://pokolenie.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 block rounded-[8px] border border-hairline p-6 md:p-10 hover:bg-ink hover:text-canvas hover:border-strong transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-6">
                <span className="text-3xl md:text-6xl font-semibold uppercase tracking-[-0.02em] leading-none">
                  В поколение
                </span>
                <ArrowUpRight
                  className="w-6 h-6 md:w-8 md:h-8 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-150"
                  strokeWidth={2}
                />
              </div>
              <p className="mt-6 max-w-3xl text-base md:text-xl text-slate group-hover:text-canvas/70 transition-colors duration-150 leading-snug">
                Всероссийский благотворительный проект по наставничеству для подростков 15–19 лет.
              </p>
              <p className="mt-4 text-sm md:text-base font-medium uppercase tracking-[0.08em]">
                В наставничестве у Алексея Марея
              </p>
            </a>
          </Rise>
        </section>

        {/* ВСТРЕЧА */}
        <section id="meet" className="scroll-mt-28 pb-8">
          <SectionHeader index="05" title="Встреча" />
          <Rise>
            <p className="max-w-2xl text-lg md:text-2xl text-soft leading-snug mb-10">
              Выберите время — встреча или знакомство. Онлайн.
            </p>
          </Rise>
          <CalInlineEmbed key={lik} lik={lik} />
        </section>

        <footer className="mt-16 md:mt-24 py-10 border-t border-hairline flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
            © <span className="font-mono tabular-nums">2026</span> Бороздов Никита · Мастер спорта · Новосибирск
          </div>
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate">By Borozdov</div>
        </footer>
      </main>
    </div>
  );
}
