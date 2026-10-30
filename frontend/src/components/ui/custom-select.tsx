import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CustomSelectOption {
  value: string;
  label: string;
  category?: string;
  disabled?: boolean;
}

export interface CustomSelectChangeEvent {
  target: {
    value: string;
    name?: string;
    id: string;
  };
}

export interface CustomSelectProps {
  id: string;
  name?: string;
  value: string;
  options: readonly (string | CustomSelectOption)[];
  onChange?: (e: CustomSelectChangeEvent) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean | string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  value,
  options,
  onChange,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error = false,
  className,
  buttonClassName,
  menuClassName,
  optionClassName,
  ariaLabel,
  ariaLabelledBy,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropUp, setDropUp] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const searchBufferRef = useRef('');
  const searchTimeoutRef = useRef<number | null>(null);

  // Normalize options array into structured CustomSelectOption objects
  const normalizedOptions: CustomSelectOption[] = useMemo(() => {
    return options.map((opt) =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    );
  }, [options]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  // Keep optionRefs array length aligned
  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, normalizedOptions.length);
  }, [normalizedOptions.length]);

  // Determine whether menu should open upward or downward based on viewport clearance
  const updatePlacement = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    // If fewer than 260px below and more space above, open upward
    setDropUp(spaceBelow < 260 && spaceAbove > spaceBelow);
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    updatePlacement();
    setIsOpen(true);

    // Initial focus on current selected item, or first enabled item
    const selectedIdx = normalizedOptions.findIndex((opt) => opt.value === value);
    if (selectedIdx >= 0 && !normalizedOptions[selectedIdx]?.disabled) {
      setFocusedIndex(selectedIdx);
    } else {
      const firstEnabled = normalizedOptions.findIndex((opt) => !opt.disabled);
      setFocusedIndex(firstEnabled >= 0 ? firstEnabled : 0);
    }
  }, [disabled, updatePlacement, normalizedOptions, value]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen, closeMenu, openMenu]);

  // Handle option selection
  const handleSelectOption = useCallback(
    (opt: CustomSelectOption) => {
      if (opt.disabled) return;

      if (onValueChange) {
        onValueChange(opt.value);
      }
      if (onChange) {
        onChange({
          target: {
            value: opt.value,
            name: name || id,
            id,
          },
        });
      }

      closeMenu();
      triggerRef.current?.focus();
    },
    [closeMenu, id, name, onChange, onValueChange]
  );

  // Close when clicking outside the component
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);

    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, [isOpen, closeMenu]);

  // Recalculate placement on window resize or scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePlacement();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, updatePlacement]);

  // Auto-scroll highlighted option into view
  useEffect(() => {
    if (!isOpen || focusedIndex < 0) return;
    const itemEl = optionRefs.current[focusedIndex];
    if (itemEl && listboxRef.current) {
      const itemTop = itemEl.offsetTop;
      const itemBottom = itemTop + itemEl.offsetHeight;
      const containerTop = listboxRef.current.scrollTop;
      const containerBottom = containerTop + listboxRef.current.clientHeight;

      if (itemTop < containerTop) {
        listboxRef.current.scrollTop = itemTop;
      } else if (itemBottom > containerBottom) {
        listboxRef.current.scrollTop = itemBottom - listboxRef.current.clientHeight;
      }
    }
  }, [isOpen, focusedIndex]);

  // Helper for finding next enabled index in a given direction
  const findNextEnabledIndex = useCallback(
    (startIndex: number, direction: 1 | -1): number => {
      const total = normalizedOptions.length;
      if (total === 0) return -1;

      let idx = startIndex;
      for (let i = 0; i < total; i++) {
        idx = (idx + direction + total) % total;
        if (!normalizedOptions[idx]?.disabled) {
          return idx;
        }
      }
      return startIndex;
    },
    [normalizedOptions]
  );

  // Keyboard navigation handler
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (!isOpen) {
          openMenu();
        } else if (focusedIndex >= 0 && normalizedOptions[focusedIndex]) {
          handleSelectOption(normalizedOptions[focusedIndex]);
        }
        break;
      }

      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          setFocusedIndex((prev) => findNextEnabledIndex(prev, 1));
        }
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          setFocusedIndex((prev) => findNextEnabledIndex(prev, -1));
        }
        break;
      }

      case 'Home': {
        if (isOpen) {
          e.preventDefault();
          const first = normalizedOptions.findIndex((opt) => !opt.disabled);
          if (first >= 0) setFocusedIndex(first);
        }
        break;
      }

      case 'End': {
        if (isOpen) {
          e.preventDefault();
          for (let i = normalizedOptions.length - 1; i >= 0; i--) {
            if (!normalizedOptions[i]?.disabled) {
              setFocusedIndex(i);
              break;
            }
          }
        }
        break;
      }

      case 'Escape': {
        if (isOpen) {
          e.preventDefault();
          closeMenu();
          triggerRef.current?.focus();
        }
        break;
      }

      case 'Tab': {
        if (isOpen) {
          closeMenu();
        }
        break;
      }

      default: {
        // Alphanumeric type-ahead jump
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          if (!isOpen) {
            openMenu();
          }

          if (searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
          }

          searchBufferRef.current += e.key.toLowerCase();
          searchTimeoutRef.current = window.setTimeout(() => {
            searchBufferRef.current = '';
          }, 600);

          const searchStr = searchBufferRef.current;
          const matchIdx = normalizedOptions.findIndex(
            (opt, idx) =>
              !opt.disabled &&
              opt.label.toLowerCase().startsWith(searchStr) &&
              (idx >= focusedIndex || searchStr.length > 1)
          );

          if (matchIdx >= 0) {
            setFocusedIndex(matchIdx);
          } else {
            // Wrap search from beginning
            const wrapIdx = normalizedOptions.findIndex(
              (opt) =>
                !opt.disabled &&
                opt.label.toLowerCase().startsWith(searchStr)
            );
            if (wrapIdx >= 0) setFocusedIndex(wrapIdx);
          }
        }
        break;
      }
    }
  };

  const hasError = Boolean(error);
  const listboxId = `${id}-listbox`;
  const activeDescendantId =
    isOpen && focusedIndex >= 0 ? `${id}-option-${focusedIndex}` : undefined;

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full text-left select-none', className)}
    >
      {/* Hidden Native Select for Browser Form Submission & Autofill */}
      <select
        id={`${id}-native`}
        name={name || id}
        value={value}
        tabIndex={-1}
        aria-hidden="true"
        required={required}
        disabled={disabled}
        onChange={(e) => {
          if (onValueChange) onValueChange(e.target.value);
          if (onChange) onChange(e as unknown as CustomSelectChangeEvent);
        }}
        className="sr-only pointer-events-none"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom Dropdown Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendantId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={hasError}
        aria-required={required}
        disabled={disabled}
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full min-h-[46px] px-4 py-3 rounded-xl border bg-white text-left text-sm text-neutral-900',
          'flex items-center justify-between gap-3',
          'transition-all duration-200 cursor-pointer',
          'hover:border-[#004D86] hover:bg-neutral-50/50',
          'focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-[#004D86]',
          isOpen && 'border-[#004D86] ring-2 ring-[#004D86]/20 shadow-sm',
          hasError
            ? 'border-red-400 ring-1 ring-red-400 focus:border-red-500 focus:ring-red-400'
            : 'border-neutral-300',
          disabled && 'opacity-60 cursor-not-allowed bg-neutral-100 border-neutral-200',
          buttonClassName
        )}
      >
        <span
          className={cn(
            'truncate block text-sm',
            selectedOption ? 'font-medium text-neutral-900' : 'text-neutral-400'
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Custom Chevron Indicator with Smooth Rotation */}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'w-4 h-4 shrink-0 transition-transform duration-200',
            isOpen ? 'rotate-180 text-[#004D86]' : 'text-neutral-500',
            disabled && 'text-neutral-400'
          )}
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={cn(
              'absolute z-[60] left-0 right-0 w-full',
              dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
              'bg-white rounded-xl shadow-[0_12px_36px_rgba(7,26,43,0.18)]',
              'border border-neutral-200/90 overflow-hidden',
              menuClassName
            )}
          >
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={id}
              tabIndex={-1}
              className="max-h-60 sm:max-h-72 overflow-y-auto p-1.5 space-y-0.5 focus:outline-none"
            >
              {normalizedOptions.length === 0 ? (
                <li className="px-3 py-3 text-xs text-neutral-400 text-center italic">
                  No options available
                </li>
              ) : (
                normalizedOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isFocused = idx === focusedIndex;

                  return (
                    <li
                      key={opt.value}
                      ref={(el) => {
                        optionRefs.current[idx] = el;
                      }}
                      id={`${id}-option-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled}
                      onClick={() => handleSelectOption(opt)}
                      onMouseEnter={() => {
                        if (!opt.disabled) setFocusedIndex(idx);
                      }}
                      className={cn(
                        'relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left',
                        'transition-colors duration-150 select-none cursor-pointer',
                        isSelected
                          ? 'bg-[#004D86]/10 text-[#004D86] font-semibold'
                          : 'text-neutral-700 hover:text-neutral-900',
                        isFocused && !isSelected && 'bg-neutral-100 text-neutral-900',
                        isFocused && isSelected && 'bg-[#004D86]/15 text-[#004D86]',
                        opt.disabled && 'opacity-40 cursor-not-allowed bg-transparent text-neutral-400',
                        optionClassName
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {/* Visual Selection Indicator Bar */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'w-1.5 h-1.5 rounded-full shrink-0 transition-opacity',
                            isSelected
                              ? 'bg-[#FFD60A] ring-2 ring-[#FFD60A]/40 opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <span className="truncate">{opt.label}</span>
                      </div>

                      {/* Explicit Checkmark for Selected Option */}
                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="w-4 h-4 text-[#004D86] shrink-0 ml-2"
                        />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
