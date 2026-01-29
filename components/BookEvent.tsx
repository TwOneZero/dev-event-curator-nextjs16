"use client";

import { useState } from "react";

type BookEventProps = {
  eventTitle: string;
};

export default function BookEvent({ eventTitle }: BookEventProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Show success message briefly before showing full confirmation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="signup-card sticky top-24">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-3">Booking Confirmed!</h3>
          <p className="text-light-200 leading-relaxed mb-6">
            Thank you, <span className="text-primary font-semibold">{formData.name}</span>!
            Your registration for <span className="font-semibold">{eventTitle}</span> has been confirmed.
          </p>
          <p className="text-sm text-light-200">
            A confirmation email has been sent to{" "}
            <span className="text-primary">{formData.email}</span>
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setIsSuccess(false);
              setFormData({ name: "", email: "" });
            }}
            className="mt-8 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Register Another Person
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-card sticky top-24">
      <h3 className="text-xl font-bold mb-6">Book Your Spot</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-xs text-light-200 uppercase tracking-wider font-semibold"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            className="bg-dark-200/30 border border-dark-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-primary/50 focus:bg-dark-200/50 transition-all placeholder:text-light-200/40"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-xs text-light-200 uppercase tracking-wider font-semibold"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            className="bg-dark-200/30 border border-dark-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-primary/50 focus:bg-dark-200/50 transition-all placeholder:text-light-200/40"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="bg-primary hover:bg-primary/90 text-dark-100 font-bold py-4 rounded-xl w-full transition-all hover:scale-105 transform shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
        >
          {isSuccess ? "Thank you for booking!" : isSubmitting ? "Processing..." : "Confirm Booking"}
        </button>

        <p className="text-xs text-light-200/60 text-center mt-2">
          By booking, you agree to receive event updates and reminders
        </p>
      </form>
    </div>
  );
}
