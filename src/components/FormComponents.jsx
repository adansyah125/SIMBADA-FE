// FormComponents — komponen form gaya shadcn

import { Loader2 } from "lucide-react";

// Input — text / number / date
export function Input({ label, name, type = "text", value, onChange, required, error, readOnly }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label.replace(/_/g, " ")}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        className={`flex h-9 w-full rounded-md border bg-white px-3 py-1.5 text-sm shadow-sm
                   placeholder:text-gray-400
                   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500
                   transition-colors
                   ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
                   ${error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Select — dropdown
export function Select({ label, name, value, onChange, options, placeholder, required, error }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`flex h-9 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm
                   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500
                   transition-colors
                   ${error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200"}`}
      >
        <option value="">{placeholder || "-- pilih --"}</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// TextArea
export function TextArea({ label, name, value, onChange }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label.replace(/_/g, " ")}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        rows={3}
        className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm
                   placeholder:text-gray-400
                   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500
                   transition-colors resize-y"
      />
    </div>
  );
}

// FormCard — wrapper putih untuk grup field
export function FormCard({ title, children, className = "" }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}>
      {title && <h3 className="mb-4 text-base font-semibold text-gray-900">{title}</h3>}
      {children}
    </div>
  );
}

// LoadingSpinner
export function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center gap-2">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
    </div>
  );
}
