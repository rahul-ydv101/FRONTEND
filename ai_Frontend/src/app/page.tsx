import ScrollytellingCanvas from "@/components/ScrollytellingCanvas";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-green-500/30">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black z-0" />
        
        <div className="z-10 text-center px-4 flex flex-col items-center">
          <h1 className="text-5xl md:text-8xl font-epic uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 [-webkit-text-stroke:2px_white] drop-shadow-2xl">
            THE INITIATIVE
          </h1>
          <p className="max-w-xl text-green-500/80 font-mono text-sm md:text-base tracking-widest uppercase mb-16">
            Establishing Neural Handshake with Top Operatives.
          </p>

          <div className="animate-bounce flex flex-col items-center mt-12 opacity-80">
            <span className="text-xs font-mono tracking-widest text-white/50 uppercase mb-4">Scroll to enter the system</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-green-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* Main Scrollytelling Canvas Section */}
      <ScrollytellingCanvas />

      {/* Footer Section */}
      <footer className="h-[50vh] flex flex-col items-center justify-center border-t border-white/5 relative z-10 bg-black">
        <div className="text-center">
          <h3 className="text-2xl font-epic uppercase tracking-tight mb-2 text-white/90 [-webkit-text-stroke:1px_rgba(255,255,255,0.9)]">HANDSHAKE COMPLETE</h3>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
            End of sequence.
          </p>
        </div>
      </footer>
    </main>
  );
}
