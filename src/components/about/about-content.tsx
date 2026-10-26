"use client";
import { siteConfig } from "@/config/site";
import aboutData from "@/config/about.json";
import Image from "next/image";
import { useState } from "react";
import AnimatedPageHeader from "@/components/animated-page-header";
import { motion, useMotionValue, useTransform } from "framer-motion";

// ─── Card data — tambah card baru di sini ───────────────────────────────────
const CARDS = [
  { image: "/me.webp", name: "Peter Shaan" },
  { image: "/me2.webp", name: "Graduation" },
  { image: "/me3.webp", name: "Traveling" },
  { image: "/me4.webp", name: "Operator" },
  { image: "/me5.webp", name: "LLDIKTI 2022" },
  { image: "/me6.webp", name: "Nusa Penida 2019" },
];
// ────────────────────────────────────────────────────────────────────────────

const drawPath = (delay: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.4, ease: "easeInOut" as const, delay },
      opacity: { duration: 0.01, delay },
    },
  },
});

function SignaturePS() {
  return (
    <motion.svg
      viewBox="0 0 90 54"
      width="56"
      height="34"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.path
        d="M 7,36 C 5,28 5,10 8,5 C 14,0 26,2 25,13 C 25,23 10,25 8,22"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={drawPath(0.1)}
      />
      <motion.path
        d="M 54,8 C 47,2 33,3 35,13 C 37,22 53,20 53,30 C 53,40 40,44 33,39"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={drawPath(0.9)}
      />
      <motion.path
        d="M 3,47 C 30,52 58,45 84,49"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        variants={drawPath(1.7)}
      />
    </motion.svg>
  );
}

// Top card — remounts setiap swipe sehingga drag position reset
function TopCard({
  card,
  onSwipe,
}: {
  card: (typeof CARDS)[0];
  onSwipe: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);

  return (
    <motion.div
      className="absolute left-0 top-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 20 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 80) onSwipe();
      }}
      whileDrag={{ scale: 1.03 }}
    >
      <div className="bg-[#0A0A0A] rounded-xl p-6 pb-20 border border-[#4B4B4B] relative select-none shadow-2xl">
        <Image
          src={card.image}
          alt={card.name}
          className="rounded-lg shadow-lg w-56 h-56 max-w-xs object-cover pointer-events-none"
          width={224}
          height={224}
          priority
          draggable={false}
        />
        <div className="absolute right-6 bottom-6">
          {card.name === "Peter Shaan" ? (
            <SignaturePS />
          ) : (
            <p
              className="font-bradhtic text-2xl text-white/80 rotate-6"
              style={{ filter: "drop-shadow(0 0 1px rgba(255,255,255,0.5))" }}
            >
              {card.name}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SwipeableCardStack() {
  const [topIdx, setTopIdx] = useState(0);
  const handleSwipe = () => setTopIdx((i) => (i + 1) % CARDS.length);

  const ROTATIONS = [0, 4, -4, 8, -8];
  const SCALES = [1, 0.97, 0.97, 0.94, 0.94];
  const Y_OFFSETS = [0, 6, 6, 12, 12];
  const visibleCount = Math.min(5, CARDS.length);

  // stackPos 0 = top, 1 = second, 2 = third
  const stackItems = Array.from({ length: visibleCount }, (_, stackPos) => ({
    card: CARDS[(topIdx + stackPos) % CARDS.length],
    stackPos,
  }));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-96 w-72">
        {[...stackItems].reverse().map(({ card, stackPos }) =>
          stackPos === 0 ? (
            <TopCard key={topIdx} card={card} onSwipe={handleSwipe} />
          ) : (
            <div
              key={`${card.image}-${stackPos}`}
              className="absolute left-0 top-0"
              style={{
                zIndex: 20 - stackPos,
                transform: `rotate(${ROTATIONS[stackPos]}deg) translateY(${Y_OFFSETS[stackPos]}px) scale(${SCALES[stackPos]})`,
                transition: "transform 0.3s ease",
              }}
            >
              <div className="bg-[#0A0A0A] rounded-xl p-6 pb-20 border border-[#4B4B4B] relative select-none shadow-md">
                <Image
                  src={card.image}
                  alt={card.name}
                  className="rounded-lg shadow-lg w-56 h-56 max-w-xs object-cover"
                  width={224}
                  height={224}
                />
                <div className="absolute right-6 bottom-6">
                  <p
                    className="font-bradhtic text-2xl text-white/80"
                    style={{ filter: "drop-shadow(0 0 1px rgba(255,255,255,0.5))" }}
                  >
                    {card.name}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const sectionVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const transition = { duration: 0.58, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
const viewport = { once: true, amount: 0.2 };

export default function AboutContent() {
  return (
    <>
      <section className="mt-16 md:mt-40 mb-10 md:mb-16 container">
        <AnimatedPageHeader icon="🤘" title="About">
          Knowing me
        </AnimatedPageHeader>
      </section>
      <motion.section
        className="mt-20 container"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div className="order-1 md:order-0" variants={fadeUp} transition={transition}>
            <h2 className="md:text-3xl text-lg font-rethink font-bold">
              {siteConfig.name}
            </h2>
            <p className="mt-4 text-gray-400">
              <span className="">
                24 years old from Indonesia, a Software Engineer and also
              </span>
              <a
                href="https://youtube.com/petershaan_"
                target="_blank"
                className="ml-1 inline-flex items-center rounded border text-sm border-neutral-200 bg-neutral-50 p-1 leading-4 text-neutral-900 no-underline dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <Image
                  src="/icon/yt.png"
                  className="inline-flex m-0 mr-1"
                  alt="image kecil"
                  width={14}
                  height={14}
                />
                Content Creator
              </a>{" "}
              <span className="">
                and Video Editor, Lovely using
              </span>
              <a
                href="https://nextjs.org"
                target="_blank"
                className="ml-2 inline-flex items-center rounded border text-sm border-neutral-200 bg-neutral-50 p-1 leading-4 text-neutral-900 no-underline dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <Image
                  src="/icon/next_dark.png"
                  className="inline-flex m-0 mr-1"
                  alt="image kecil"
                  width={14}
                  height={14}
                />
                Next.js
              </a>{" "}
              and
              <a
                href="https://nextjs.org"
                target="_blank"
                className="ml-2 inline-flex items-center rounded border text-sm border-neutral-200 bg-neutral-50 p-1 leading-4 text-neutral-900 no-underline dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <Image
                  src="/icon/react.webp"
                  className="inline-flex m-0 mr-1"
                  alt="image kecil"
                  width={14}
                  height={14}
                />
                React
              </a>
              <span className="">
                <br /> <br />
                Back in high school, I joined some online course that got me
                obsessed with programming. Huge thanks to Kak Justify for
                kickstarting my journey. That&apos;s when I began my path to
                becoming a programmer. I started out as a local editor, which
                made me fall in love with design and coding. Now, I&apos;m all
                about both.
                <br /> <br />
                I&apos;m truly believe that sharing programming knowledge can
                help a lot of people out there become creators, not just users
                or consumers of apps.
              </span>
            </p>
          </motion.div>
          <motion.div
            className="flex items-center justify-center md:justify-center relative w-full md:w-auto order-0 md:order-1"
            variants={fadeUp}
            transition={{ ...transition, delay: 0.08 }}
          >
            <div
              className="
                          absolute
                          right-10
                          hidden
                          md:block
                          z-52 select-none
                          md:top-24 md:right-10
                          top-[150px] left-[230px] w-[130px] overflow-hidden
                          md:left-auto md:w-56
                      "
            >
              <Image
                src="/icon/itsme.svg"
                alt="arrow"
                className="md:w-56 w-32 h-auto"
                width={96}
                height={32}
              />
            </div>

            <div className="absolute h-96 w-72 md:w-72 left-1/2 transform -translate-x-1/2 -inset-5 z-0 bg-primary rounded-[100%] blur-2xl opacity-20"></div>

            <SwipeableCardStack />
          </motion.div>
        </div>
      </motion.section>
      <motion.section
        className="mt-20 md:mt-32 container"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.div className="mt-6 md:ml-24" variants={fadeUp} transition={transition}>
          <h2 className="text-base md:text-4xl" data-text="About">
            <span className="judul">I work hard? yeah</span>💼
          </h2>
          <p className="mt-2 text-xs sm:text-sm">
            here all my work experience
          </p>
        </motion.div>
        {aboutData.map((item, idx) => {
          const expNumber = (aboutData.length - idx)
            .toString()
            .padStart(2, "0");
          return (
            <motion.div
              id="experience"
              data-id={idx}
              key={item.company + idx}
              variants={fadeUp}
              transition={transition}
              className="mt-20 relative max-w-3xl mx-auto mb-8 experience-card"
            >
              <span className="exp-number absolute top-2 right-4 z-0 text-xs sm:text-base md:text-lg font-bold text-gray-400">
                {expNumber}
              </span>
              <div className="relative z-10 bg-[#111111] border border-[#3A3A3A] rounded-3xl p-4 sm:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-[#1A1A1A] rounded-xl flex items-center justify-center">
                    <Image
                      src={item.logo}
                      alt={item.company}
                      width={100}
                      height={100}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-rethink">
                        {item.company}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {item.position}
                      </p>
                    </div>
                    <h3 className="text-white text-xs sm:text-base text-right sm:text-left font-rethink">
                      {item.date}
                    </h3>
                  </div>
                </div>
                <div className="mt-4 sm:mt-5 bg-[#0A0A0A] border border-[#3A3A3A] p-3 sm:p-4 rounded-lg">
                  <ul className="list-disc ml-5 sm:ml-6 space-y-2 text-sm sm:text-base text-gray-400">
                    {item.description.map((desc, i) => {
                      const renderLinks = (text: string) => {
                        const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
                        return parts.map((part, idx) => {
                          const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                          return match ? (
                            <a
                              key={idx}
                              href={match[2]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-white hover:text-primary"
                            >
                              {match[1]}
                            </a>
                          ) : (
                            part
                          );
                        });
                      };

                      return desc.startsWith("-") ? (
                        <ul
                          key={i}
                          className="list-disc ml-5 sm:ml-6 mt-1 space-y-1"
                        >
                          <li>{renderLinks(desc.slice(2))}</li>
                        </ul>
                      ) : (
                        <li key={i}>{renderLinks(desc)}</li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.section>
    </>
  );
}
