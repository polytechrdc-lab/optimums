"use client";

type AfricaMapProps = {
  installed?: string[];
  partners?: string[];
};

/*
  Placeholder Africa map component.
  Replace the <path d="..."/> with a real Africa SVG path and map country ISO codes to regions.
*/
export default function AfricaMap({ installed = [], partners = [] }: AfricaMapProps) {
  return (
    // Decorative placeholder map; hidden from assistive tech
    <div className="africa-wrap" aria-hidden="true">
      <svg className="africa-svg" viewBox="0 0 800 800">
        <defs>
          <linearGradient id="africaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        {/* Simplified silhouette placeholder (replace with accurate path) */}
        <g className="africa-base">
          <path d="M300,80 C250,120 240,200 220,240 C200,280 140,340 160,400 C180,460 260,480 280,520 C300,560 280,600 320,640 C360,680 460,700 520,660 C580,620 600,560 620,520 C640,480 700,460 700,400 C700,340 660,320 620,280 C580,240 560,180 520,140 C480,100 350,40 300,80 Z" fill="url(#africaGrad)" stroke="#ffffff22" strokeWidth="2" />
        </g>
        {/* Example region blobs to demonstrate tiers (replace with country paths) */}
        <g className="africa-regions">
          <circle cx="420" cy="380" r="60" className="tier-n1" />
          <circle cx="520" cy="460" r="42" className="tier-n2" />
          <circle cx="340" cy="500" r="36" className="tier-n3" />
        </g>
      </svg>
      <div className="africa-legend" aria-hidden="true">
        <span className="lg lg-n1" /> <span>Implantations</span>
        <span className="lg lg-n2" /> <span>Partenaires</span>
        <span className="lg lg-n3" /> <span>Hors périmètre</span>
      </div>
    </div>
  );
}
