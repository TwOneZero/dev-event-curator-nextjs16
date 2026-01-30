"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

type TextAreaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={props.id}
            className="text-xs text-light-200 uppercase tracking-wider font-semibold"
          >
            {label}
            {props.required && <span className="text-primary ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`bg-dark-200/30 border border-dark-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-primary/50 focus:bg-dark-200/50 transition-all placeholder:text-light-200/40 resize-y min-h-[100px] ${
            error ? "border-red-500/50" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

TextAreaInput.displayName = "TextAreaInput";

export default TextAreaInput;
