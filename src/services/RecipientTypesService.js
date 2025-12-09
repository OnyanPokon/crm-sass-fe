/* eslint-disable no-unused-vars */
import { RecipientTypes } from '@/models';
import api from '@/utils/api';

export default class RecipientTypesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: RecipientTypes[];
   * }>}
   * */
  static async getAll({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/recipient-type', { params });
    if (!response.data) return response;
    return { ...response, data: RecipientTypes.fromApiData(response.data) };
  }

  /**
   * @param {RecipientTypes} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data) {
    return await api.post('/recipient-type', { body: RecipientTypes.toApiData(data) });
  }

  /**
   * @param {number} id
   * @param {RecipientTypes} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data) {
    return await api.patch(`/recipient-type/${id}`, { body: RecipientTypes.toApiData(data) });
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
  static async delete(id) {
    return await api.delete(`/recipient-type/${id}`);
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
    return await api.delete(`/recipient-type/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
