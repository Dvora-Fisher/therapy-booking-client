import { getTreatmentTypes } from '../api/treatmentTypes';
import { useAsync } from './useAsync';

/** Active treatment types, for filters and forms. */
export function useTreatmentTypes() {
  const { data, loading } = useAsync(getTreatmentTypes, []);
  return { treatmentTypes: data ?? [], loading };
}
