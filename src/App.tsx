import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ExternalLink, ArrowUp } from "lucide-react";

const NAV_ITEMS = [
  { id: 1, title: "Спорт", anchor: "profile" },
  { id: 2, title: "Достижения и рекорды", anchor: "achievements" },
  { id: 3, title: "Результаты", anchor: "results" },
  { id: 4, title: "Обучение", anchor: "education" },
];

export default function App() {
  const { scrollY } = useScroll();
  const subtitleOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-titanium selection:bg-titanium selection:text-obsidian relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]"></div>
      </div>

      <button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Наверх"
        className="fixed bottom-8 right-8 z-50 p-4 border border-slate/20 bg-obsidian/50 backdrop-blur-md hover:bg-titanium hover:text-obsidian transition-all duration-300 group"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      <header 
        className="fixed top-0 left-0 w-full p-6 md:p-12 z-50 flex justify-between items-center mix-blend-difference pointer-events-none"
      >
        <div className="text-2xl md:text-4xl font-display tracking-tighter uppercase">
          Borozdov Nikita
        </div>
        <div 
          style={{ opacity: subtitleOpacity }}
          className="hidden md:block text-[10px] uppercase tracking-[0.5em] text-slate font-medium"
        >
          Elite Athlete Profile
        </div>
      </header>

      <main className="relative z-10 p-6 md:p-12">
        <section id="profile" className="min-h-screen pt-32 md:pt-48 pb-24">
          <div className="py-4 mb-12 border-b border-slate/20">
            <h2 className="text-2xl sm:text-3xl md:text-8xl lg:text-9xl leading-tight md:leading-none uppercase">Спорт</h2>
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
                className="border-b border-slate/10 pb-8 md:pb-12"
              >
                <span className="block text-xs md:text-sm uppercase tracking-[0.4em] text-slate mb-4">{item.label}</span>
                <p className="text-2xl md:text-6xl lg:text-7xl font-sans font-black uppercase leading-tight">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="achievements" className="min-h-screen py-24">
          <div className="py-4 mb-12 border-b border-slate/20">
            <h2 className="text-2xl sm:text-3xl md:text-8xl lg:text-9xl leading-tight md:leading-none uppercase">Достижения и рекорды</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
            <div className="space-y-8">
              <h3 className="text-slate text-xs tracking-[0.4em] mb-6 uppercase">Титулы</h3>
              <div className="space-y-4">
                <p className="text-xl md:text-4xl font-display uppercase">Чемпион Сибирского федерального округа по плаванию</p>
                <p className="text-xl md:text-4xl font-display uppercase">Чемпион Новосибирской области</p>
              </div>
            </div>

            <div className="border border-slate/20 p-6 md:p-12 flex flex-col justify-between">
              <h3 className="text-xs tracking-[0.4em] mb-12 text-slate uppercase">Лучший результат по очкам FINA</h3>
              <div className="space-y-8">
                <div>
                  <span className="block text-[10px] uppercase text-slate">Результат</span>
                  <div className="text-5xl md:text-8xl font-display leading-none">3:53.15</div>
                  <span className="text-lg md:text-xl font-display uppercase text-titanium">754 ОЧКА</span>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-12 border-t border-slate/10">
                  <div>
                    <span className="block text-[10px] uppercase text-slate">Дистанция</span>
                    <span className="text-xs md:text-sm font-bold uppercase">400 м, вольный стиль</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate">Дата</span>
                    <span className="text-xs md:text-sm font-bold uppercase">21.11.2024</span>
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate">Соревнование</span>
                  <p className="text-xs md:text-sm font-bold uppercase leading-relaxed">
                    Чемпионат России по плаванию (г. Санкт-Петербург, бассейн 25 м)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="results" className="min-h-screen py-24">
          <div className="py-4 mb-12 border-b border-slate/20">
            <h2 className="text-2xl sm:text-3xl md:text-8xl lg:text-9xl leading-tight md:leading-none uppercase">Результаты</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <div>
              <h3 className="text-slate text-xs tracking-[0.4em] mb-8 uppercase">Лучшие результаты (бассейн 25 м)</h3>
              <div className="space-y-6">
                {[
                  { event: "400 м, в/ст", time: "3:53.15", points: "754 очка" },
                  { event: "800 м, в/ст", time: "8:10.36", points: "724 очка" },
                  { event: "1500 м, в/ст", time: "15:41.12", points: "728 очков" },
                ].map((item) => (
                  <div key={item.event} className="flex justify-between items-baseline border-b border-slate/10 pb-4">
                    <span className="text-xs md:text-lg font-bold uppercase">{item.event}</span>
                    <div className="text-right">
                      <span className="block text-xl md:text-3xl font-display">{item.time}</span>
                      <span className="text-[10px] text-slate uppercase tracking-widest">{item.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-slate text-xs tracking-[0.4em] mb-8 uppercase">Лучшие результаты (бассейн 50 м)</h3>
              <div className="space-y-6">
                {[
                  { event: "400 м, в/ст", time: "4:02.30", points: "749 очков" },
                  { event: "800 м, в/ст", time: "8:19.10", points: "743 очка" },
                  { event: "1500 м, в/ст", time: "16:02.64", points: "739 очков" },
                ].map((item) => (
                  <div key={item.event} className="flex justify-between items-baseline border-b border-slate/10 pb-4">
                    <span className="text-xs md:text-lg font-bold uppercase">{item.event}</span>
                    <div className="text-right">
                      <span className="block text-xl md:text-3xl font-display">{item.time}</span>
                      <span className="text-[10px] text-slate uppercase tracking-widest">{item.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24 space-y-4">
            <h3 className="text-slate text-xs tracking-[0.4em] mb-8">профили</h3>
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
                  className="group flex items-center justify-between p-4 md:p-10 border border-slate/20 hover:bg-titanium hover:text-obsidian transition-all duration-500"
                >
                  <span className="text-xl md:text-6xl font-display leading-none">{db.name}</span>
                  <ExternalLink className="w-5 h-5 md:w-10 md:h-10 opacity-30 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="min-h-screen py-24">
          <div className="py-4 mb-12 border-b border-slate/20">
            <h2 className="text-2xl sm:text-3xl md:text-8xl lg:text-9xl leading-tight md:leading-none uppercase">Обучение</h2>
          </div>
          <div className="space-y-24">
            <div>
              <h3 className="text-slate text-xs tracking-[0.4em] mb-12 uppercase">Обучение</h3>
              <div className="space-y-12">
                {[
                  { title: "Учился до 7 класса: Новосибирский городской педагогический лицей имени А.С. Пушкина (Далее: Семейное обучение)", link: "https://ngpl.schoolsite.ru/" },
                  { title: "2 курс Новосибирское училище (колледж) олимпийского резерва", link: "https://uor-nsk.ru/" },
                  { title: "2 курс Сибирский государственный университет телекоммуникаций и информатики", link: "https://www.sibsutis.ru/" },
                ].map((item, index) => (
                  <div key={index} className="max-w-4xl">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xl md:text-4xl font-sans font-black uppercase leading-tight hover:text-slate transition-colors block">
                      {item.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-24 border-t border-slate/10">
              <h3 className="text-slate text-xs tracking-[0.4em] mb-12 uppercase">Проекты</h3>
              <div className="max-w-4xl">
                <a href="https://pokolenie.info/" target="_blank" rel="noopener noreferrer" className="text-3xl md:text-7xl font-display leading-none hover:text-slate transition-colors block mb-6 uppercase">
                  В поколение
                </a>
                <div className="space-y-4">
                  <p className="text-lg md:text-2xl font-sans font-medium uppercase text-slate leading-relaxed">
                    Всероссийский благотворительный проект по наставничеству для подростков 15-19 лет
                  </p>
                  <p className="text-md md:text-xl font-sans font-bold uppercase text-titanium border-l-2 border-titanium pl-4">
                    В наставничестве у Алексея Марея
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section id="blog" className="min-h-screen py-24 border-t border-slate/10">
          <div className="py-4 mb-12 border-b border-slate/20">
            <h2 className="text-2xl sm:text-3xl md:text-8xl lg:text-9xl leading-tight md:leading-none uppercase">Блог</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                date: "15.03.2026",
                title: "Психология стайера: как сохранять фокус на длинных дистанциях",
                excerpt: "Разбор ментальных техник, которые помогают преодолевать 'стену' на 1500 метрах."
              },
              {
                date: "02.02.2026",
                title: "Подготовка к Чемпионату: мой тренировочный цикл",
                excerpt: "Детальный взгляд на объемы, интенсивность и восстановление в предсоревновательный период."
              },
              {
                date: "20.12.2025",
                title: "Наставничество как путь к росту",
                excerpt: "Почему передача опыта подросткам в проекте 'В поколение' делает меня сильнее как атлета."
              }
            ].map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="border border-slate/20 p-8 h-full flex flex-col justify-between hover:bg-titanium hover:text-obsidian transition-all duration-500">
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.3em] text-slate group-hover:text-obsidian/50 mb-6 transition-colors">
                      {post.date}
                    </span>
                    <h3 className="text-xl md:text-2xl font-display uppercase leading-tight mb-6">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate group-hover:text-obsidian/70 leading-relaxed uppercase font-medium">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
                    <span>Читать полностью</span>
                    <div className="h-px w-8 bg-current" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section> */}

        <footer className="mt-24 pt-12 border-t border-slate/20 flex flex-col md:flex-row justify-between gap-6 text-[10px] uppercase tracking-[0.3em] text-slate font-medium">
          <div>© 2026 ELITE ATHLETE PROFILE</div>
          <div className="flex gap-8">
            <span>Master of Sport</span>
            <span>Novosibirsk Region</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
