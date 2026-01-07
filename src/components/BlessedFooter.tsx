import React from 'react';

const BlessedFooter: React.FC<{ className?: string, textClassName?: string }> = ({ className = "py-3 bg-white/5 border-white/5", textClassName = "text-[10px] tracking-[0.3em]" }) => {
    return (
        <div className={`w-full text-center backdrop-blur-sm border-t select-none pointer-events-none ${className}`}>
            <p className={`uppercase text-slate-500/50 font-medium font-sans ${textClassName}`}>
                Blessed by God
            </p>
        </div>
    );
};

export default BlessedFooter;
