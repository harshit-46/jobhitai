export default function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-9 bg-[#111118] hover:bg-[#16161f] transition border border-white/5">
            <div className="text-xl mb-5">{icon}</div>
            <h3 className="text-base font-medium mb-2">{title}</h3>
            <p className="text-sm text-[#7b7a92]">{desc}</p>
        </div>
    );
}