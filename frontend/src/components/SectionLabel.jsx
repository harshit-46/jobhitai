export default function SectionLabel({ children }) {
    return (
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#a599ff]">
            <span className="w-5 h-px bg-[#7c6af7]" />
            {children}
        </div>
    );
}