import axios from 'axios';
import { getApiBaseUrl } from '@/shared/utils/getApiBaseUrl';
import { Notification } from '@shared/types/notification.types';

export const getNotifications = async (email: string): Promise<Notification[]> => {
  try {
    const { data } = await axios.get(`${getApiBaseUrl()}api/notifications/${email}`);
    return data.data;
  } catch (error: unknown) {
    throw new Error(`Error al obtener las notificaciones`);
  }
};

type UpdateNotificationsBody = {
  email: string;
  body: Omit<Notification, 'timestamp'>;
};
export const updateNotifications = async ({
  email,
  body,
}: UpdateNotificationsBody): Promise<Notification[]> => {
  try {
    const { data } = await axios.put(`${getApiBaseUrl()}api/notifications/${email}`, body);
    return data.data;
  } catch (error: unknown) {
    throw new Error(`Error al actualizar las notificaciones`);
  }
};
