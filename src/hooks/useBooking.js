import { useState } from 'react';
import toast from 'react-hot-toast';
import { bookAppointment } from '../api/appointments';
import { formatDayAndTime } from '../utils/dates';
import { getErrorMessage } from '../utils/errors';

/**
 * Books a slot and handles the race outcome.
 * 201 -> success toast; 409 with alternatives -> `conflict` state for the "just taken" dialog;
 * any other error -> an error toast with the server's message.
 */
export function useBooking({ onBooked }) {
  const [pendingSlotId, setPendingSlotId] = useState(null);
  const [conflict, setConflict] = useState(null); // { message, alternatives, treatmentTypeId }

  async function book(slot, treatmentTypeId) {
    setPendingSlotId(slot.id);
    try {
      const appointment = await bookAppointment({ slotId: slot.id, treatmentTypeId });
      setConflict(null);
      toast.success(`התור נקבע ל${formatDayAndTime(appointment.startUtc)}`);
      onBooked?.(appointment);
      return true;
    } catch (error) {
      const alternatives = error.response?.data?.alternatives;
      if (error.response?.status === 409 && alternatives) {
        setConflict({ message: getErrorMessage(error), alternatives, treatmentTypeId });
      } else {
        toast.error(getErrorMessage(error));
      }
      return false;
    } finally {
      setPendingSlotId(null);
    }
  }

  return { book, pendingSlotId, conflict, clearConflict: () => setConflict(null) };
}
