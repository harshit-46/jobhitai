const STEPS = [
    "Create Profile",
    "Build Resume",
    "Find Jobs",
    "Apply",
];

export default function HowItWorks() {
    return (
        <section className="text-center py-24">
            <h2 className="text-5xl font-serif mb-10">
                Get hired in <em>4 steps</em>
            </h2>

            <div className="grid md:grid-cols-4 gap-10">
                {STEPS.map((s, i) => (
                    <div key={i}>
                        <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center mb-4">
                            {i + 1}
                        </div>
                        <p>{s}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}