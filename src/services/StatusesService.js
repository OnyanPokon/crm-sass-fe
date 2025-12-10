/* eslint-disable no-unused-vars */
import { Statuses } from '@/models';
import api from '@/utils/api';

export default class StatusesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Statuses[];
   * }>}
   * */
  static async getAll({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/status', { params });
    if (!response.data) return response;
    return { ...response, data: Statuses.fromApiData(response.data) };
  }

  /**
   * @param {Statuses} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeText(data) {
    return await api.post('/status/text', { body: Statuses.toApiData(data) });
  }

  /**
   * @param {Statuses} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeImage(data, file) {
    return await api.post('/status/image', { body: Statuses.toApiData(data), file: { file: file } });
  }

  /**
   * @param {Statuses} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeVoice(data, file) {
    return await api.post('/status/voice', { body: Statuses.toApiData(data), file: { file: file } });
  }

  /**
   * @param {Statuses} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeVideo(data, file) {
    return await api.post('/status/video', { body: Statuses.toApiData(data), file: { file: file } });
  }

  /**
   * @param {number} id
   * @param {Statuses} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/status/${id}`, { body: Statuses.toApiData(data), token });
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
    return await api.delete(`/status/${id}`, { token });
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
    return await api.delete(`/status/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
