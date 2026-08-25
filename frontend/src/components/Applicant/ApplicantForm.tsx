import { useState, type FormEvent } from 'react';
import type {
  CreateApplicantRequest,
  VehicleType,
} from '../../types/applicant';

type ApplicantFormProps = {
  onSubmit: (data: CreateApplicantRequest) => Promise<void>;
  loading: boolean;
};

const vehicleOptions: {
  value: VehicleType;
  label: string;
}[] = [
  {
    value: 'MCWG',
    label: 'Motorcycle with Gear',
  },
  {
    value: 'LMV',
    label: 'Light Motor Vehicle',
  },
];

export function ApplicantForm({
  onSubmit,
  loading,
}: ApplicantFormProps) {
  const [age, setAge] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [isFirstLicence, setIsFirstLicence] = useState(true);
  const [vehicleType, setVehicleType] =
    useState<VehicleType>('MCWG');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await onSubmit({
      age: Number(age),
      state: state.trim(),
      city: city.trim(),
      isFirstLicence,
      vehicleTypes: [vehicleType],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
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
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Enter your age"
        />
      </div>

      <div>
        <label
          htmlFor="state"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          State
        </label>

        <input
          id="state"
          type="text"
          value={state}
          onChange={(event) => setState(event.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. Karnataka"
        />
      </div>

      <div>
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
          onChange={(event) => setCity(event.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. Bengaluru"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-700">
          Licence type
        </p>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isFirstLicence}
            onChange={(event) =>
              setIsFirstLicence(event.target.checked)
            }
            className="h-4 w-4 rounded border-slate-300"
          />

          <span className="text-sm text-slate-600">
            This is my first driving licence
          </span>
        </label>
      </div>

      <div>
        <label
          htmlFor="vehicleType"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Vehicle type
        </label>

        <select
          id="vehicleType"
          value={vehicleType}
          onChange={(event) =>
            setVehicleType(
              event.target.value as VehicleType,
            )
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {vehicleOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? 'Checking eligibility...'
          : 'Check Eligibility'}
      </button>
    </form>
  );
}