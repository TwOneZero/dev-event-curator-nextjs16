"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import TextInput from "./form/TextInput";
import TextAreaInput from "./form/TextAreaInput";
import SelectInput from "./form/SelectInput";
import ImageUploadField from "./form/ImageUploadField";
import DynamicArrayInput from "./form/DynamicArrayInput";

interface FormData {
  title: string;
  description: string;
  overview: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  organizer: string;
  tags: string[];
  agenda: string[];
}

interface FormErrors {
  title?: string;
  description?: string;
  overview?: string;
  venue?: string;
  location?: string;
  date?: string;
  time?: string;
  mode?: string;
  audience?: string;
  organizer?: string;
  tags?: string;
  agenda?: string;
  image?: string;
}

const modeOptions = [
  { value: "online", label: "Online" },
  { value: "offline", label: "In Person" },
  { value: "hybrid", label: "Hybrid" },
];

const initialState: FormData = {
  title: "",
  description: "",
  overview: "",
  venue: "",
  location: "",
  date: "",
  time: "",
  mode: "online",
  audience: "",
  organizer: "",
  tags: [],
  agenda: [],
};

export default function CreateEventForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialState);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.overview.trim()) {
      newErrors.overview = "Overview is required";
    }
    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date must be in the future";
      }
    }
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    if (!formData.audience.trim()) {
      newErrors.audience = "Audience is required";
    }
    if (!formData.organizer.trim()) {
      newErrors.organizer = "Organizer is required";
    }
    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }
    if (formData.agenda.length === 0) {
      newErrors.agenda = "At least one agenda item is required";
    }
    if (!image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("overview", formData.overview);
      formDataToSend.append("venue", formData.venue);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("time", formData.time);
      formDataToSend.append("mode", formData.mode);
      formDataToSend.append("audience", formData.audience);
      formDataToSend.append("organizer", formData.organizer);
      formDataToSend.append("tags", JSON.stringify(formData.tags));
      formDataToSend.append("agenda", JSON.stringify(formData.agenda));
      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await fetch("/api/events", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      setSuccess(true);
      setCreatedSlug(data.event.slug);

      setTimeout(() => {
        router.push(`/events/${data.event.slug}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating event:", error);
      alert(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setImage(null);
    setImagePreview("");
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (success) {
    return (
      <div className="bg-dark-100 border border-dark-200 card-shadow rounded-[10px] p-8 text-center">
        <div className="flex flex-col items-center justify-center py-8">
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
          <h3 className="text-2xl font-bold mb-3">Event Created Successfully!</h3>
          <p className="text-light-200 leading-relaxed">
            Your event <span className="font-semibold text-primary">{formData.title}</span> has been created.
          </p>
          <p className="text-sm text-light-200 mt-2">Redirecting to event page...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Section 1: Basic Information */}
      <div className="bg-dark-100 border border-dark-200 card-shadow rounded-[10px] p-6">
        <h3 className="text-xl font-bold mb-6 pb-3 border-b border-dark-200">
          Basic Information
        </h3>
        <div className="flex flex-col gap-5">
          <TextInput
            id="title"
            name="title"
            label="Event Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., React Conference 2024"
            error={errors.title}
            required
          />

          <TextAreaInput
            id="description"
            name="description"
            label="Short Description"
            value={formData.description}
            onChange={handleChange}
            placeholder="A brief one-line description of your event"
            error={errors.description}
            required
            className="min-h-[80px]"
          />

          <TextAreaInput
            id="overview"
            name="overview"
            label="Detailed Overview"
            value={formData.overview}
            onChange={handleChange}
            placeholder="Provide a detailed overview of the event, including topics, goals, and what attendees will learn..."
            error={errors.overview}
            required
            className="min-h-[150px]"
          />

          <ImageUploadField
            label="Event Image"
            value={image}
            onChange={setImage}
            onPreviewChange={setImagePreview}
            preview={imagePreview}
            error={errors.image}
          />
        </div>
      </div>

      {/* Section 2: Event Details */}
      <div className="bg-dark-100 border border-dark-200 card-shadow rounded-[10px] p-6">
        <h3 className="text-xl font-bold mb-6 pb-3 border-b border-dark-200">
          Event Details
        </h3>
        <div className="grid md:grid-cols-2 gap-5">
          <TextInput
            id="venue"
            name="venue"
            label="Venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="e.g., Tech Hub Center"
            error={errors.venue}
            required
          />

          <TextInput
            id="location"
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA"
            error={errors.location}
            required
          />

          <TextInput
            id="date"
            name="date"
            label="Date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
          />

          <TextInput
            id="time"
            name="time"
            label="Time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            error={errors.time}
            required
          />

          <SelectInput
            id="mode"
            name="mode"
            label="Event Mode"
            value={formData.mode}
            onChange={handleChange}
            options={modeOptions}
            error={errors.mode}
            required
          />

          <TextInput
            id="audience"
            name="audience"
            label="Target Audience"
            value={formData.audience}
            onChange={handleChange}
            placeholder="e.g., Developers, Designers, Students"
            error={errors.audience}
            required
          />
        </div>
      </div>

      {/* Section 3: Organizer Info */}
      <div className="bg-dark-100 border border-dark-200 card-shadow rounded-[10px] p-6">
        <h3 className="text-xl font-bold mb-6 pb-3 border-b border-dark-200">
          Organizer Information
        </h3>
        <div className="flex flex-col gap-5">
          <TextInput
            id="organizer"
            name="organizer"
            label="Organizer Name"
            value={formData.organizer}
            onChange={handleChange}
            placeholder="e.g., React Community"
            error={errors.organizer}
            required
          />
        </div>
      </div>

      {/* Section 4: Categories & Tags */}
      <div className="bg-dark-100 border border-dark-200 card-shadow rounded-[10px] p-6">
        <h3 className="text-xl font-bold mb-6 pb-3 border-b border-dark-200">
          Categories & Tags
        </h3>
        <div className="flex flex-col gap-5">
          <DynamicArrayInput
            label="Tags"
            value={formData.tags}
            onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
            placeholder="e.g., react, javascript"
            type="tags"
            error={errors.tags}
          />

          <DynamicArrayInput
            label="Agenda"
            value={formData.agenda}
            onChange={(agenda) => setFormData((prev) => ({ ...prev, agenda }))}
            placeholder="e.g., Opening keynote at 9:00 AM"
            type="agenda"
            error={errors.agenda}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-3.5 border border-dark-200 rounded-xl font-semibold text-light-100 hover:bg-dark-200/30 transition-all"
        >
          Reset Form
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-dark-100 font-bold py-3.5 px-8 rounded-xl transition-all hover:scale-105 transform shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}
