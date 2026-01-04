import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

export interface StatusOption {
    value: string;
    label: string;
    color: string; // Should include bg and text classes. First class must be bg for the dot.
}

interface StatusBadgeProps {
    status: string;
    options: StatusOption[];
    onUpdate: (newStatus: string) => void;
    className?: string;
    readOnly?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, options, onUpdate, className = '', readOnly = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        function handleScroll() {
            if (isOpen) setIsOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen]);

    const toggleOpen = (e: React.MouseEvent) => {
        if (readOnly) return;
        e.stopPropagation();

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 250; // Approx max height

            let top = rect.bottom + 8;
            // If not enough space below, position above
            if (spaceBelow < dropdownHeight) {
                top = rect.top - dropdownHeight - 8;
            }

            setDropdownPos({
                top: top,
                left: rect.left
            });
        }
        setIsOpen(!isOpen);
    };

    const currentOption = options.find(o => o.value === status) || options[0] || { label: status, color: 'bg-gray-100 text-gray-800' };

    // Resolve color classes safely
    const badgeClasses = currentOption.color;
    // Extract just the background color class for the dot (assumes first class is background color)
    // Example: "bg-green-100 text-green-800" -> "bg-green-100"
    let dotColorClass = badgeClasses.split(' ')[0];

    // Handling dark mode classes if present in the string
    // If the string starts with generic utility like "bg-yellow-100", that's fine.

    return (
        <div className={`relative inline-block ${className}`} ref={wrapperRef} onClick={e => e.stopPropagation()}>
            <button
                ref={buttonRef}
                onClick={toggleOpen}
                disabled={readOnly}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${badgeClasses} ${readOnly ? 'cursor-default opacity-100' : 'hover:opacity-80 cursor-pointer'}`}
            >
                {currentOption.label}
                {!readOnly && <span className="material-symbols-outlined text-[14px]">expand_more</span>}
            </button>

            {isOpen && ReactDOM.createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed min-w-[180px] bg-white dark:bg-[#1e1e2e] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        top: dropdownPos.top,
                        left: dropdownPos.left
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdate(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-3 ${status === option.value
                                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`}></span>
                                {option.label}
                                {status === option.value && (
                                    <span className="material-symbols-outlined text-sm ml-auto">check</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
