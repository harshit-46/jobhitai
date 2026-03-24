export default function Background() {
    return (
        <>
            {/* Noise */}
            <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-9999" />

            {/* Orbs */}
            <div className="fixed w-150 h-150 rounded-full bg-[radial-gradient(circle,rgba(124,106,247,0.14)_0%,transparent_70%)] -top-50 -left-37.5 blur-[80px]" />

            <div className="fixed w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(240,192,96,0.08)_0%,transparent_70%)] top-[40%] -right-50 blur-[80px]" />

            <div className="fixed w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(63,216,152,0.07)_0%,transparent_70%)] bottom-[10%] left-[20%] blur-[80px]" />
        </>
    );
}