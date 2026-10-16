import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/errors';

/**
 * Runs an async loader whenever its dependencies change and tracks { data, loading, error }.
 * `reload()` runs it again (e.g. after a booking). Responses of outdated runs are ignored,
 * so fast filter changes never show an older page.
 */
export function useAsync(loader, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [version, setVersion] = useState(0);

  // The caller lists the values the loader reads (like useEffect deps); a new list = a new request
  const run = useCallback(loader, deps);

  useEffect(() => {
    let current = true;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    run()
      .then((data) => current && setState({ data, loading: false, error: null }))
      .catch((error) => current && setState({ data: null, loading: false, error: getErrorMessage(error) }));

    return () => {
      current = false;
    };
  }, [run, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { ...state, reload };
}
