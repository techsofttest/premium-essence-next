export default function OrderNote() {
    return (
        <div className="bg-white p-6 border border-dark/10 flex flex-col gap-3">
            <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark">Add Order Note</h3>
            <textarea 
                placeholder="Special instructions..."
                className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-xs text-dark placeholder:text-dark/60 outline-none focus:border-dark transition-colors min-h-[80px] resize-none"
            />
        </div>
    );
}
