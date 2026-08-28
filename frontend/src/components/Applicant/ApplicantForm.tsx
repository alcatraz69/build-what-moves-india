import { useState, type FormEvent } from "react";
import type {
  CreateApplicantRequest,
  VehicleType,
} from "../../types/applicant";
import { VehicleTypeCard } from "./VehicleTypeCard";

type ApplicantFormProps = {
  onSubmit: (data: CreateApplicantRequest) => Promise<void>;
  loading: boolean;
};

const vehicleOptions: {
  value: VehicleType;
  label: string;
}[] = [
  {
    value: "MCWG",
    label: "Motorcycle with Gear",
  },
  {
    value: "LMV",
    label: "Light Motor Vehicle",
  },
];

const stateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export function ApplicantForm({ onSubmit, loading }: ApplicantFormProps) {
  const [age, setAge] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [isFirstLicence, setIsFirstLicence] = useState(true);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  const [errors, setErrors] = useState<{
    age?: string;
    state?: string;
    city?: string;
    vehicleTypes?: string;
  }>({});

  const handleVehicleTypeChange = (vehicleType: VehicleType) => {
    setVehicleTypes((currentTypes) =>
      currentTypes.includes(vehicleType)
        ? currentTypes.filter((type) => type !== vehicleType)
        : [...currentTypes, vehicleType],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: {
      age?: string;
      state?: string;
      city?: string;
      vehicleTypes?: string;
    } = {};

    const numericAge = Number(age);

    if (!age.trim()) {
      nextErrors.age = "Please enter your age.";
    } else if (numericAge < 1 || numericAge > 120) {
      nextErrors.age = "Please enter a valid age.";
    }

    if (!state) {
      nextErrors.state = "Please select your state.";
    }

    if (!city.trim()) {
      nextErrors.city = "Please enter your city.";
    }

    if (vehicleTypes.length === 0) {
      nextErrors.vehicleTypes = "Please select at least one vehicle type.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      age: numericAge,
      state: state.trim(),
      city: city.trim(),
      isFirstLicence,
      vehicleTypes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
   

        <div className="space-y-1.5">
          <label
            htmlFor="age"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Age
          </label>

          <input
            id="age"
            type="number"
            min="1"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter your age"
          />
          {errors.age && (
            <p className="text-sm text-red-600" role="alert">
              {errors.age}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            State
          </label>

          <select
            id="state"
            value={state}
            onChange={(event) => {
              setState(event.target.value);

              if (errors.state) {
                setErrors((current) => ({
                  ...current,
                  state: undefined,
                }));
              }
            }}
            className={[
              "w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              state ? "text-slate-700" : "text-neutral-500",
            ].join(" ")}
          >
            <option value="" disabled>
              Select your state
            </option>

            {stateOptions.map((stateOption) => (
              <option key={stateOption} value={stateOption}>
                {stateOption}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-sm text-red-600" role="alert">
              {errors.state}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);

              if (errors.city) {
                setErrors((current) => ({
                  ...current,
                  city: undefined,
                }));
              }
            }}
            autoComplete="address-level2"
            placeholder="e.g. Bengaluru"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {errors.city && (
            <p className="text-sm text-red-600" role="alert">
              {errors.city}
            </p>
          )}
        </div>
     

      {/* existing first licence checkbox */}

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-700">Licence type</p>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isFirstLicence}
            onChange={(event) => setIsFirstLicence(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />

          <span className="text-sm text-slate-600">
            This is my first driving licence
          </span>
        </label>
      </div>

      {/* existing vehicle selection */}

      <div className="space-y-1.5">
        <p className="mb-3 text-sm font-medium text-slate-700">Vehicle type</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {vehicleOptions.map((option) => {
            const isSelected = vehicleTypes.includes(option.value);

            const description =
              option.value === "MCWG"
                ? "Two-wheelers with manual gears"
                : "Cars and other light motor vehicles";

            const icon = option.value === "MCWG" ? "🏍️" : "🚗";

            return (
              <VehicleTypeCard
                key={option.value}
                label={option.label}
                description={description}
                icon={icon}
                checked={isSelected}
                onChange={() => {
                  handleVehicleTypeChange(option.value);

                  if (errors.vehicleTypes) {
                    setErrors((current) => ({
                      ...current,
                      vehicleTypes: undefined,
                    }));
                  }
                }}
              />
            );
          })}
        </div>
        {errors.vehicleTypes && (
          <p className="text-sm text-red-600" role="alert">
            {errors.vehicleTypes}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Checking eligibility..." : "Check Eligibility"}
      </button>
    </form>
  );
}
