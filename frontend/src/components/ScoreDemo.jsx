export default function ScoreDemo() {
    return (
        <section className="max-w-6xl mx-auto px-12 py-20 grid md:grid-cols-2 gap-16">

            <div>
                <h2 className="text-5xl font-serif mb-6">
                    Know exactly <em>where you stand</em>
                </h2>

                <p className="text-[#7b7a92] mb-6">
                    AI analyzes your resume instantly.
                </p>
            </div>

            <div className="bg-[#111118] p-10 rounded-3xl border border-white/10">
                <div className="text-center text-5xl font-serif">80</div>
                <p className="text-center text-[#7b7a92]">Score</p>
            </div>

        </section>
    );
}