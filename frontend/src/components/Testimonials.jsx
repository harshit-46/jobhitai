export default function Testimonials() {
    const items = ["Amazing tool!", "Got hired fast!", "Game changer"];

    return (
        <section className="py-24 overflow-hidden">
            <h2 className="text-center text-5xl font-serif mb-10">
                Loved by users
            </h2>

            <div className="flex gap-5 animate-[scrollX_30s_linear_infinite]">
                {items.map((t, i) => (
                    <div key={i} className="w-75 p-6 bg-[#111118] border border-white/10 rounded-2xl">
                        {t}
                    </div>
                ))}
            </div>
        </section>
    );
}