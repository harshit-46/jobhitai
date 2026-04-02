/*

// LWF

import { useResume } from "./ResumeContext";

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Single-column, ATS-friendly",
    preview: (
      <div className="w-full h-full bg-white rounded p-2 flex flex-col gap-1">
        <div className="w-3/4 h-2 bg-gray-800 rounded mx-auto" />
        <div className="w-full h-px bg-gray-300 mt-1" />
        <div className="w-1/3 h-1.5 bg-gray-700 rounded mt-1" />
        <div className="w-full h-px bg-gray-800 mt-0.5 mb-1" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full h-1 bg-gray-200 rounded" />
        ))}
        <div className="w-1/3 h-1.5 bg-gray-700 rounded mt-1" />
        <div className="w-full h-px bg-gray-800 mt-0.5 mb-1" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="w-full h-1 bg-gray-200 rounded" />
        ))}
      </div>
    ),
  },
  {
    id: "modern",
    name: "Modern",
    description: "Dark header, editorial style",
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden flex flex-col">
        <div className="bg-[#1a1a2e] px-2 py-2 flex flex-col gap-1">
          <div className="w-3/5 h-2 bg-white/80 rounded" />
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => <div key={i} className="w-8 h-1 bg-white/30 rounded" />)}
          </div>
        </div>
        <div className="p-2 flex flex-col gap-1">
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1/4 h-1.5 bg-gray-700 rounded" />
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          {[...Array(2)].map((_, i) => <div key={i} className="w-full h-1 bg-gray-200 rounded" />)}
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1/4 h-1.5 bg-gray-700 rounded" />
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          {[...Array(3)].map((_, i) => <div key={i} className="w-full h-1 bg-gray-200 rounded" />)}
        </div>
      </div>
    ),
  },
];

export default function TemplatePicker() {
  const { resume, setTemplate } = useResume();

  return (
    <div className="px-3 py-4 border-t border-white/5 mt-2">
      <p className="text-xs text-white/20 uppercase tracking-widest font-semibold mb-3 px-1">Template</p>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`rounded-xl overflow-hidden border-2 transition-all ${
              resume.template === t.id
                ? "border-[#00e5a0]"
                : "border-white/8 hover:border-white/20"
            }`}
          >
            <div className="h-20 p-1.5 bg-white/5">{t.preview}</div>
            <div className="px-2 py-1.5 text-left">
              <div className={`text-xs font-semibold ${resume.template === t.id ? "text-[#00e5a0]" : "text-white/50"}`}>
                {t.name}
              </div>
              <div className="text-xs text-white/20 leading-tight">{t.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

*/

import { useResume } from "./ResumeContext";

const t = {
    lime: "#E8FF47",
    limeD: "#c8dd00",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    faint: "rgba(240,237,232,0.22)",
    muted: "rgba(240,237,232,0.45)",
    text: "#f0ede8",
    surface: "rgba(255,255,255,0.03)",
};

const TEMPLATES = [
    {
        id: "classic",
        name: "Classic",
        description: "Single-column, ATS-friendly",
        preview: (
            <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 4, padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ width: "75%", height: 7, background: "#1a1a1a", borderRadius: 2, margin: "0 auto" }} />
                <div style={{ width: "100%", height: 1, background: "#ddd", margin: "2px 0" }} />
                <div style={{ width: "33%", height: 5, background: "#444", borderRadius: 2 }} />
                <div style={{ width: "100%", height: 1, background: "#333", margin: "1px 0" }} />
                {[...Array(3)].map((_, i) => <div key={i} style={{ width: "100%", height: 3, background: "#e5e5e5", borderRadius: 1 }} />)}
                <div style={{ width: "33%", height: 5, background: "#444", borderRadius: 2, marginTop: 4 }} />
                <div style={{ width: "100%", height: 1, background: "#333", margin: "1px 0" }} />
                {[...Array(2)].map((_, i) => <div key={i} style={{ width: "100%", height: 3, background: "#e5e5e5", borderRadius: 1 }} />)}
            </div>
        ),
    },
    {
        id: "modern",
        name: "Modern",
        description: "Dark header, editorial style",
        preview: (
            <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 4, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ background: "#1a1a2e", padding: "8px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ width: "60%", height: 7, background: "rgba(255,255,255,0.8)", borderRadius: 2 }} />
                    <div style={{ display: "flex", gap: 4 }}>
                        {[...Array(3)].map((_, i) => <div key={i} style={{ width: 28, height: 3, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} />)}
                    </div>
                </div>
                <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <div style={{ width: "30%", height: 5, background: "#333", borderRadius: 2 }} />
                        <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
                    </div>
                    {[...Array(2)].map((_, i) => <div key={i} style={{ width: "100%", height: 3, background: "#e5e5e5", borderRadius: 1 }} />)}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                        <div style={{ width: "30%", height: 5, background: "#333", borderRadius: 2 }} />
                        <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
                    </div>
                    {[...Array(3)].map((_, i) => <div key={i} style={{ width: "100%", height: 3, background: "#e5e5e5", borderRadius: 1 }} />)}
                </div>
            </div>
        ),
    },
];

export default function TemplatePicker() {
    const { resume, setTemplate } = useResume();

    return (
        <div style={{ padding: "12px 8px 8px", borderTop: `1px solid ${t.border}`, marginTop: 8 }}>
            <p style={{ fontSize: 9, color: t.faint, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10, paddingLeft: 4 }}>Template</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {TEMPLATES.map((tmpl) => {
                    const active = resume.template === tmpl.id;
                    return (
                        <button
                            key={tmpl.id}
                            onClick={() => setTemplate(tmpl.id)}
                            style={{
                                borderRadius: 12, overflow: "hidden",
                                border: active ? `2px solid ${t.lime}` : `2px solid ${t.border}`,
                                background: "transparent", cursor: "pointer", padding: 0,
                                transition: "border-color 0.2s ease",
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = t.border2; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = t.border; }}
                        >
                            <div style={{ height: 72, padding: 6, background: t.surface }}>
                                {tmpl.preview}
                            </div>
                            <div style={{ padding: "6px 10px 8px", textAlign: "left" }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: active ? t.lime : t.muted, marginBottom: 2 }}>
                                    {tmpl.name}
                                </div>
                                <div style={{ fontSize: 10, color: t.faint, lineHeight: 1.4 }}>{tmpl.description}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}