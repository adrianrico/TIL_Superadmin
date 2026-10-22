// Formateo de fechas para la interfaz.
import dayjs from 'dayjs';

export const formatDate = (iso) => dayjs(iso).format('DD/MM/YYYY HH:mm');
