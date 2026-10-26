interface PaperBackgroundProps {
  label: string;
  title: string;
  date: string;
  className?: string;
}

const desktopLines = [
  { top: "134px", opacity: 0.82, height: "1px", type: "solid" },
  { top: "143px", opacity: 0.82, height: "1px", type: "solid" },
  { top: "153px", opacity: 0.78, height: "2px", type: "dots", gap: "62px", dot: "1.5px" },
  { top: "218px", opacity: 0.46, height: "2px", type: "dots", gap: "6px", dot: "1px" },
  { top: "255px", opacity: 0.24, height: "1px", type: "solid" },
  { top: "285px", opacity: 0.34, height: "2px", type: "dots", gap: "6px", dot: "1px" },
  { top: "320px", opacity: 0.1, height: "1px", type: "solid" },
  { top: "354px", opacity: 0.18, height: "2px", type: "dots", gap: "6px", dot: "1px" },
  { top: "388px", opacity: 0.06, height: "1px", type: "solid" },
];

const mobileLines = [
  { top: "63px", opacity: 0.8, height: "1px", type: "solid" },
  { top: "72px", opacity: 0.8, height: "1px", type: "solid" },
  { top: "82px", opacity: 0.75, height: "2px", type: "dots", gap: "48px", dot: "1.5px" },
  { top: "132px", opacity: 0.45, height: "2px", type: "dots", gap: "6px", dot: "1px" },
  { top: "166px", opacity: 0.22, height: "1px", type: "solid" },
  { top: "194px", opacity: 0.32, height: "2px", type: "dots", gap: "6px", dot: "1px" },
  { top: "228px", opacity: 0.1, height: "1px", type: "solid" },
  { top: "262px", opacity: 0.16, height: "2px", type: "dots", gap: "6px", dot: "1px" },
  { top: "296px", opacity: 0.05, height: "1px", type: "solid" },
];

function PaperLines({
  lines,
  className,
}: {
  lines: typeof desktopLines;
  className: string;
}) {
  return (
    <div className={className}>
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0)_18%,#0A0A0A_88%)]" />
      {lines.map((line, index) => (
        <div
          key={index}
          className="absolute left-[0.95%] right-[0.95%] z-10"
          style={{
            top: line.top,
            opacity: line.opacity,
            height: line.height,
            backgroundImage: line.type === "dots"
              ? `radial-gradient(circle, #fff 0 ${line.dot}, transparent ${line.dot})`
              : undefined,
            backgroundSize: line.type === "dots" ? `${line.gap} ${line.height}` : undefined,
            backgroundRepeat: line.type === "dots" ? "repeat-x" : undefined,
            backgroundPosition: line.type === "dots" ? "left center" : undefined,
            backgroundColor: line.type === "solid" ? "#fff" : undefined,
          }}
        />
      ))}
    </div>
  );
}

export default function PaperBackground({
  label,
  title,
  date,
  className = "",
}: PaperBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 -z-40 pointer-events-none select-none animate-fade-in overflow-hidden ${className}`}
    >
      <div className="hidden md:block absolute top-15 left-12 z-10">
        <div className="flex gap-2 mb-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-[#DADADA]/70 rounded-sm"
              style={{ boxShadow: "0 2px 8px #0002" }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 border border-[#DADADA]/60 rounded-sm"
            />
          ))}
        </div>
      </div>

      <PaperLines
        lines={desktopLines}
        className="hidden md:block absolute inset-x-0 top-0 h-[548px]"
      />
      <PaperLines
        lines={mobileLines}
        className="block md:hidden absolute inset-x-0 top-0 h-[387px] bg-[#0A0A0A]"
      />

      <div
        className="hidden md:flex flex-col absolute top-12 right-12 z-10 pointer-events-none text-[#DADADA] h-fit w-fit"
        style={{ pointerEvents: "none" }}
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-light">{label}</span>
          <span className="font-bradhtic text-xl">{title}</span>
        </div>
        <hr className="border-t border-[#DADADA]/50 mt-1 ml-7 text-right" />
        <div className="flex items-center gap-4 mt-2">
          <span className="text-xs font-light">Date</span>
          <span className="font-bradhtic text-xl">{date}</span>
        </div>
      </div>
    </div>
  );
}
