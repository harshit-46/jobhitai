import SectionLabel from "./SectionLabel";
import FeatureCard from "./FeatureCard";

const FEATURES = [
    { icon: "🧠", title: "AI Resume Builder", desc: "Create ATS-optimized resumes in minutes." },
    { icon: "📊", title: "Resume Score Engine", desc: "Get real-time match score." },
    { icon: "🎯", title: "Smart Job Matching", desc: "AI curated job listings." },
    { icon: "⚡", title: "One-Click Apply", desc: "Apply instantly to jobs." },
    { icon: "💬", title: "Interview Prep AI", desc: "Practice with AI interviews." },
    { icon: "📈", title: "Career Analytics", desc: "Track your job progress." },
];

export default function Features() {
    return (
        <section className="max-w-6xl mx-auto px-12 py-24">
            <SectionLabel>Features</SectionLabel>

            <h2 className="text-5xl font-serif mt-4 mb-10">
                Everything you need to <em>get hired faster</em>
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
                {FEATURES.map((f) => (
                    <FeatureCard key={f.title} {...f} />
                ))}
            </div>
        </section>
    );
}