"use client";

import { X, Check } from "lucide-react";
import GlowingButton from "@/components/ui/GlowingButton";

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    config: {
        filters: Array<{
            id: string;
            label: string;
            options: string[];
        }>;
    };
    selectedFilters: Record<string, string[]>;
    setSelectedFilters: (filters: Record<string, string[]>) => void;
    priceRange: number;
    setPriceRange: (price: number) => void;
}

export default function FilterDrawer({
    isOpen,
    onClose,
    config,
    selectedFilters,
    setSelectedFilters,
    priceRange,
    setPriceRange
}: FilterDrawerProps) {
    const toggleFilter = (filterId: string, option: string) => {
        const current = selectedFilters[filterId] || [];
        if (current.includes(option)) {
            setSelectedFilters({
                ...selectedFilters,
                [filterId]: current.filter(o => o !== option)
            });
        } else {
            setSelectedFilters({
                ...selectedFilters,
                [filterId]: [...current, option]
            });
        }
    };

    const resetAll = () => {
        setSelectedFilters({});
        setPriceRange(5000);
    };

    return (
        <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className={`absolute top-0 bottom-0 left-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

                {/* Drawer Header */}
                <div className="p-6 border-b border-dark/10 flex justify-between items-center bg-white z-10">
                    <span className="font-serif text-2xl tracking-tight text-dark">Filter Selection</span>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-dark/10 transition-colors rounded-none text-dark"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Drawer Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-8 filter-drawer-scroll bg-white">
                    {/* Price Slider Section */}
                    <div className="mb-12">
                        <h3 className="text-xs tracking-[0.3em] uppercase font-bold mb-8 text-dark border-b border-dark/10 pb-3">
                            Price Range
                        </h3>
                        <div className="px-2">
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-[2px] bg-dark/20 appearance-none cursor-pointer accent-dark"
                            />
                            <div className="flex justify-between mt-6 text-[11px] tracking-widest text-dark font-bold uppercase">
                                <span className="opacity-40">0 AED</span>
                                <span className="text-dark bg-[#F7F3F4] px-3 py-1.5">
                                    Up to {priceRange} AED
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Category Filters */}
                    {config.filters.map((filter) => (
                        <div key={filter.id} className="mb-12">
                            <h3 className="text-xs tracking-[0.3em] uppercase font-bold mb-6 text-dark border-b border-dark/10 pb-3">
                                {filter.label}
                            </h3>
                            <div className="flex flex-wrap gap-2.5">
                                {filter.options.map((option) => {
                                    const isSelected = selectedFilters[filter.id]?.includes(option);
                                    return (
                                        <button
                                            key={option}
                                            onClick={() => toggleFilter(filter.id, option)}
                                            className={`px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase border transition-all duration-300 flex items-center gap-2.5 font-medium ${isSelected
                                                ? "bg-dark text-[#E9D7C3] border-dark shadow-lg scale-[1.02]"
                                                : "bg-transparent text-dark/70 border-dark/20 hover:border-dark hover:text-dark"
                                                }`}
                                        >
                                            {isSelected && <Check size={10} strokeWidth={3} />}
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-8 border-t border-dark/10 grid grid-cols-2 gap-6 bg-[#F7F3F4]">
                    <button
                        onClick={resetAll}
                        className="text-[11px] tracking-[0.2em] uppercase font-bold text-dark/40 hover:text-dark transition-colors border-b-2 border-transparent hover:border-dark/20 pb-1 w-fit"
                    >
                        Reset All
                    </button>
                    <GlowingButton onClick={onClose} fullWidth>
                        Apply Filters
                    </GlowingButton>
                </div>
            </div>
        </div>
    );
}
