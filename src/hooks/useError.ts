import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

type ErrorState = {
  errors: StringDictionary;
};

const errorsStore = new Store<ErrorState>({
  errors: {},
});

const setError = (key: string, value?: string) => {
  errorsStore.setState((prev) => {
    const updatedErrors = { ...prev.errors };

    if (value) {
      updatedErrors[key] = value;
    } else {
      delete updatedErrors[key]; // Remove the error if no value is provided
    }

    return { errors: updatedErrors };
  });
};

/**
 * Custom hook to manage error states using a store.
 * @returns An object containing:
 * - `isError`: A boolean indicating if there are any errors.
 * - `setError`: A function to set or remove an error by key.
 * - `errors`: An object containing the current errors.
 */
export function useError() {
  const { errors } = useStore(errorsStore, () => errorsStore.state);

  return { isError: Object.values(errors).some((v) => v), setError, errors };
}
