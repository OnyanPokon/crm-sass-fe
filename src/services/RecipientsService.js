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
  static async getAll(token) {
    const response = await api.get('/recipient', { token });
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
  static async store(data, token) {
    return await api.post('/recipient', { body: Recipients.toApiData(data), token });
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
  static async update(id, data, token) {
    return await api.patch(`/recipient/${id}`, { body: Recipients.toApiData(data), token });
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
