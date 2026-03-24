const PLANS = ["Starter", "Pro", "Teams"];

export default function Pricing() {
    return (
        <section className="text-center py-24">
            <h2 className="text-5xl font-serif mb-10">
                Simple pricing
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
                {PLANS.map((p) => (
                    <div key={p} className="p-8 bg-[#111118] border border-white/10 rounded-2xl">
                        <h3 className="text-xl mb-4">{p}</h3>
                        <button className="mt-4 px-6 py-2 bg-[#7c6af7] rounded-full">
                            Choose
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}