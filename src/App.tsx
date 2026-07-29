import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ExternalLink, ArrowUp, Sun, Moon } from "lucide-react";

const NAV_ITEMS = [
  { id: 1, title: "Спорт", anchor: "profile" },
  { id: 2, title: "Достижения и рекорды", anchor: "achievements" },
  { id: 3, title: "Результаты", anchor: "results" },
  { id: 4, title: "Обучение", anchor: "education" },
];

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")) };
}

function CalInlineEmbed() {
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

    Cal("init", "meet", { origin: "https://app.cal.com" });
    Cal.ns.meet("inline", {
      elementOrSelector: "#my-cal-inline-meet",
      config: {
        disableMobileScroll: true,
        hideBranding: true,
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
        theme: "auto",
      },
      calLink: "borozdov/meet",
    });

    Cal.ns.meet("ui", {
      theme: "auto",
      styles: {
        body: {
          background: "transparent",
        },
        eventTypeListItem: {
          background: "transparent",
        },
      },
      cssVarsPerTheme: {
        light: {
          "cal-bg": "transparent",
          "cal-bg-emphasis": "#F0F0F0",
          "cal-bg-muted": "#FAFAFA",
          "cal-bg-subtle": "#FFFFFF",
          "cal-border": "rgba(13, 13, 13, 0.12)",
          "cal-brand": "#0D0D0D",
          "cal-text": "#0D0D0D",
          "cal-text-emphasis": "#0D0D0D",
          "cal-text-muted": "#6B6B6B",
          "cal-text-subtle": "#8A8A8A",
        },
        dark: {
          "cal-bg": "transparent",
          "cal-bg-emphasis": "#171717",
          "cal-bg-muted": "#111111",
          "cal-bg-subtle": "#0b0b0b",
          "cal-border": "rgba(255, 255, 255, 0.12)",
          "cal-brand": "#fafafa",
          "cal-text": "#ffffff",
          "cal-text-emphasis": "#ffffff",
          "cal-text-muted": "#a3a3a3",
          "cal-text-subtle": "#737373",
        },
      },
      hideEventTypeDetails: false,
      hideBranding: true,
      layout: "month_view",
    });
  }, []);

  return (
    <div className="calendar-clip mx-auto h-[820px] w-full max-w-[1494px] overflow-hidden bg-transparent md:h-[660px] lg:h-[430px] xl:h-[620px]">
      <div id="my-cal-inline-meet" className="h-[calc(100%+120px)] w-full bg-transparent" />
    </div>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const { scrollY } = useScroll();
  const subtitleOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const backToTopOpacity = useTransform(scrollY, [0, 160], [0, 1]);
  const backToTopPointerEvents = useTransform(scrollY, (value) =>
    value > 80 ? "auto" : "none"
  );

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)] relative">
      <motion.button
        style={{
          opacity: backToTopOpacity,
          pointerEvents: backToTopPointerEvents,
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Наверх"
        className="btn-invert fixed bottom-8 right-8 z-50 p-4 border bg-[var(--color-surface)]/80 backdrop-blur-md rounded-full"
      >
        <ArrowUp className="w-6 h-6" strokeWidth={1.5} />
      </motion.button>

      <header className="sticky top-0 left-0 w-full z-50 border-b border-[var(--color-border)] bg-[var(--color-canvas)]/85 backdrop-blur-md">
        <div className="p-6 md:px-12 md:py-6 flex justify-between items-center">
          <div className="text-2xl md:text-3xl font-serif tracking-[0.01em]">
            Borozdov Nikita
          </div>
          <div className="flex items-center gap-6">
            <motion.div
              style={{ opacity: subtitleOpacity }}
              className="hidden md:block text-[13px] font-medium tracking-[-0.02em] text-[var(--color-text-secondary)]"
            >
              Elite Athlete Profile
            </motion.div>
            <button
              onClick={toggle}
              aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
              className="theme-toggle"
            >
              {theme === "light" ? <Moon className="w-4 h-4" strokeWidth={1.5} /> : <Sun className="w-4 h-4" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
        <nav className="hidden md:flex gap-8 px-12 pb-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.anchor)}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-heading)] transition-colors"
            >
              {item.title}
            </button>
          ))}
        </nav>
      </header>

      <main className="relative z-10 p-6 md:p-12">
        <section id="profile" className="min-h-screen pt-16 md:pt-24 pb-24">
          <div className="py-4 mb-12 border-b border-[var(--color-border)]">
            <h2 className="text-display">Спорт</h2>
          </div>
          <div className="space-y-12 md:space-y-24">
            {[
              { label: "Звание", value: "Мастер спорта" },
              { label: "Специализация", value: "Стайер (основные дистанции: 400, 800, 1500 м)" },
              { label: "Команда", value: "Член сборной Новосибирской области" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-[var(--color-border)] pb-8 md:pb-12"
              >
                <span className="text-eyebrow block mb-4">{item.label}</span>
                <p className="text-heading-sm">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="achievements" className="min-h-screen py-24">
          <div className="py-4 mb-12 border-b border-[var(--color-border)]">
            <h2 className="text-display">Достижения и рекорды</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
            <div className="space-y-8">
              <h3 className="text-eyebrow mb-6">Титулы</h3>
              <div className="space-y-4">
                <p className="text-subheading">Чемпион Сибирского федерального округа по плаванию</p>
                <p className="text-subheading">Чемпион Новосибирской области</p>
              </div>
            </div>

            <div className="card-inverted p-6 md:p-12 flex flex-col justify-between">
              <h3 className="text-eyebrow mb-12">Лучший результат по очкам FINA</h3>
              <div className="space-y-8">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] mb-1">Результат</span>
                  <div className="tabular-nums text-stat leading-none">4:00.79</div>
                  <span className="text-body-sm">762 очка</span>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-12 border-t border-[var(--color-border)]">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] mb-1">Дистанция</span>
                    <span className="text-body-xs">400 м, вольный стиль</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] mb-1">Дата</span>
                    <span className="text-body-xs">19.04.2026</span>
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] mb-1">Соревнование</span>
                  <p className="text-body-xs leading-relaxed">
                    Кубок России по плаванию. Финал, Санкт-Петербург
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="results" className="min-h-screen py-24">
          <div className="py-4 mb-12 border-b border-[var(--color-border)]">
            <h2 className="text-display">Результаты</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <div>
              <h3 className="text-eyebrow mb-8">Лучшие результаты (бассейн 25 м)</h3>
              <div className="space-y-6">
                {[
                  { event: "400 м, в/ст", time: "3:53.15", points: "754 очка" },
                  { event: "800 м, в/ст", time: "8:10.36", points: "724 очка" },
                  { event: "1500 м, в/ст", time: "15:41.12", points: "728 очков" },
                ].map((item) => (
                  <div key={item.event} className="result-row flex justify-between items-baseline pb-4">
                    <span className="text-body-xs">{item.event}</span>
                    <div className="text-right">
                      <span className="result-time block tabular-nums text-xl md:text-2xl font-medium">{item.time}</span>
                      <span className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-widest">{item.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-eyebrow mb-8">Лучшие результаты (бассейн 50 м)</h3>
              <div className="space-y-6">
                {[
                  { event: "400 м, в/ст", time: "4:00.79", points: "762 очка", record: true },
                  { event: "800 м, в/ст", time: "8:19.10", points: "743 очка" },
                  { event: "1500 м, в/ст", time: "15:58.02", points: "750 очков" },
                ].map((item) => (
                  <div
                    key={item.event}
                    className={`result-row flex justify-between items-baseline pb-4 ${item.record ? "is-record px-3 py-2" : ""}`}
                  >
                    <span className="text-body-xs">{item.event}</span>
                    <div className="text-right">
                      <span className="result-time block tabular-nums text-xl md:text-2xl font-medium">{item.time}</span>
                      <span className={`text-[10px] uppercase tracking-widest ${item.record ? "text-[var(--color-accent-copper)]" : "text-[var(--color-text-tertiary)]"}`}>{item.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24 space-y-4">
            <h3 className="text-eyebrow mb-8">Профили</h3>
            <div className="flex flex-col gap-4">
              {[
                { name: "SPORTCUBES", url: "https://sportcubes.ru/idswim51548" },
                { name: "SWIMCLOUD", url: "https://www.swimcloud.com/swimmer/3440515/" },
              ].map((db) => (
                <a
                  key={db.name}
                  href={db.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-invert group flex items-center justify-between p-5 md:p-8 border rounded-full transition-colors duration-300"
                >
                  <span className="text-xl md:text-2xl font-medium leading-none">{db.name}</span>
                  <ExternalLink
                    className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-accent-copper)] opacity-70 group-hover:opacity-100 transition-opacity"
                    strokeWidth={1.5}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="min-h-screen py-24">
          <div className="py-4 mb-12 border-b border-[var(--color-border)]">
            <h2 className="text-display">Обучение</h2>
          </div>
          <div className="space-y-24">
            <div>
              <h3 className="text-eyebrow mb-12">Обучение</h3>
              <div className="space-y-12">
                {[
                  { title: "Учился до 7 класса: Новосибирский городской педагогический лицей имени А.С. Пушкина (Далее: Семейное обучение)", link: "https://ngpl.schoolsite.ru/" },
                  { title: "2 курс Новосибирское училище (колледж) олимпийского резерва", link: "https://uor-nsk.ru/" },
                  { title: "2 курс Сибирский государственный университет телекоммуникаций и информатики", link: "https://www.sibsutis.ru/" },
                ].map((item, index) => (
                  <div key={index} className="max-w-4xl">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg md:text-2xl font-medium leading-tight text-[var(--color-text-heading)] hover:text-[var(--color-accent-copper)] transition-colors block">
                      {item.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-24 border-t border-[var(--color-border)]">
              <h3 className="text-eyebrow mb-12">Проекты</h3>
              <div className="max-w-4xl">
                <a href="https://pokolenie.info/" target="_blank" rel="noopener noreferrer" className="text-heading-sm hover:text-[var(--color-accent-copper)] transition-colors block mb-6">
                  В поколение
                </a>
                <div className="space-y-4">
                  <p className="text-body-sm leading-relaxed">
                    Всероссийский благотворительный проект по наставничеству для подростков 15-19 лет
                  </p>
                  <p className="text-body-xs border-l-2 border-[var(--color-accent-copper)] pl-4">
                    В наставничестве у Алексея Марея
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="calendar" className="overflow-x-hidden pt-24 pb-8">
          <div className="py-4 mb-12 border-b border-[var(--color-border)]">
            <h2 className="text-display">Календарь</h2>
          </div>
          <p className="mb-10 max-w-4xl text-subheading">
            Запишись на встречу / знакомство со мной
          </p>
          <CalInlineEmbed />
        </section>

        <footer className="mt-24 pt-12 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between gap-6 text-[12px] tracking-[-0.02em] text-[var(--color-text-tertiary)]">
          <div>© 2026 Elite Athlete Profile</div>
          <div className="flex gap-8">
            <span>Master of Sport</span>
            <span>Novosibirsk Region</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
