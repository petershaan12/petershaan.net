export default function BgPaper() {
  return (
    <div className="absolute inset-0 -z-40 pointer-events-none select-none overflow-hidden">
      {/* Teal glow layer */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 0% 0%, rgba(8,45,52,0.9) 0%, rgba(5,25,32,0.4) 45%, transparent 70%)",
        }}
      />
      {/* Texture layer with gradient mask */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/paper_texture.webp')",
          backgroundSize: "cover",
          backgroundPosition: "left top",
          mixBlendMode: "overlay",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 70% at 0% 0%, black 0%, rgba(0,0,0,0.5) 35%, transparent 56%)",
          maskImage:
            "radial-gradient(ellipse 55% 70% at 0% 0%, black 0%, rgba(0,0,0,0.5) 35%, transparent 56%)",
        }}
      />
    </div>
  );
}
