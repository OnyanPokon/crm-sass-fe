/* eslint-disable no-unused-vars */
import { Recipients } from '@/models';
import api from '@/utils/api';

export default class RecipientsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Recipients[];
   * }>}
   * */
  static async getAll({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/recipient', { params });
    if (!response.data) return response;
    return { ...response, data: Recipients.fromApiData(response.data) };
  }

  /**
   * @param {Recipients} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data) {
    return await api.post('/recipient', { body: Recipients.toApiData(data) });
  }

  /**
   * @param {number} id
   * @param {Recipients} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data) {
    return await api.patch(`/recipient/${id}`, { body: Recipients.toApiData(data) });
  }

  /**
   * @param {number} id
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async delete(id, token) {
    return await api.delete(`/recipient/${id}`, { token });
  }

  /**
   * @param {number[]} ids
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async deleteBatch(ids, token) {
    return await api.delete(`/recipient/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
