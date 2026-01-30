"use client";

import { useState } from "react";

type DynamicArrayInputProps = {
  label?: string;
  error?: string;
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  type?: "tags" | "agenda";
};

export default function DynamicArrayInput({
  label,
  error,
  value,
  onChange,
  placeholder = "Type and press Enter",
  type = "tags",
}: DynamicArrayInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleAddItem = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs text-light-200 uppercase tracking-wider font-semibold">
          {label}
          <span className="text-primary ml-1">*</span>
        </label>
      )}

      {/* Display items */}
      {value.length > 0 && (
        <div
          className={`flex flex-wrap gap-2 ${
            type === "agenda" ? "flex-col gap-3" : ""
          }`}
        >
          {value.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 ${
                type === "tags"
                  ? "bg-primary/20 border border-primary/30 rounded-lg px-3 py-1.5"
                  : "bg-dark-200/30 border border-dark-200 rounded-lg px-4 py-3 w-full"
              }`}
            >
              {type === "agenda" && (
                <span className="text-primary font-bold text-sm min-w-[24px]">
                  {index + 1}.
                </span>
              )}
              <span className="text-sm text-light-100">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-light-200/60 hover:text-red-400 transition-colors ml-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 bg-dark-200/30 border border-dark-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-primary/50 focus:bg-dark-200/50 transition-all placeholder:text-light-200/40 ${
            error ? "border-red-500/50" : ""
          }`}
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary px-4 py-2 rounded-xl font-semibold transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <p className="text-xs text-light-200/40">
        Press Enter or click the + button to add {type === "tags" ? "a tag" : "an agenda item"}
      </p>
    </div>
  );
}
