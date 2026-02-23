'use client'

import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { IconType } from "react-icons";

export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: IconType;
}

interface DropdownProps {
  buttonText?: string;
  placeholder?: string;
  value?: string | number;
  options: DropdownOption[];
  onChange?: (value: any) => void;
  className?: string;
  icon?: IconType;
}

const Dropdown = ({ 
  buttonText, 
  placeholder = "Pilih...", 
  value, 
  options, 
  onChange, 
  className = "",
  icon: ButtonIcon = FiChevronDown
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : (buttonText || placeholder);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((pv) => !pv)}
        className="flex items-center justify-between w-full px-4 py-4 rounded-2xl text-gray-900 dark:text-white bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 focus:border-primary focus:outline-none transition-all font-bold text-sm text-left shadow-sm hover:bg-white dark:hover:bg-slate-800"
      >
        <span className="truncate mr-2">{displayLabel}</span>
        <motion.span 
          animate={open ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 group-focus-within:text-primary"
        >
          <FiChevronDown />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial="closed"
            animate="open"
            exit="closed"
            variants={wrapperVariants}
            style={{ originY: "top" }}
            className="flex flex-col gap-1 p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-gray-100 dark:border-slate-700 absolute top-[120%] left-0 w-full min-w-[200px] overflow-hidden z-[100]"
          >
            {options.map((option, idx) => (
              <Option 
                key={idx}
                setOpen={setOpen} 
                Icon={option.icon} 
                text={option.label} 
                onClick={() => onChange?.(option.value)}
                active={value === option.value}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const Option = ({
  text,
  Icon,
  setOpen,
  onClick,
  active = false
}: {
  text: string;
  Icon?: IconType;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClick: () => void;
  active?: boolean;
}) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => {
        onClick();
        setOpen(false);
      }}
      className={`flex items-center gap-3 w-full p-3 text-sm font-bold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
        active 
          ? 'bg-primary text-white shadow-md' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-700'
      }`}
    >
      {Icon && (
        <motion.span variants={actionIconVariants} className="text-lg">
          <Icon />
        </motion.span>
      )}
      <span>{text}</span>
    </motion.li>
  );
};

export default Dropdown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  closed: {
    scaleY: 0,
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.2
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
