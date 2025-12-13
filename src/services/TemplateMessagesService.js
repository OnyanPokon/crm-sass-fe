/* eslint-disable no-unused-vars */
import { TemplateMessages } from '@/models';
import api from '@/utils/api';

export default class TemplateMessagesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: TemplateMessages[];
   * }>}
   * */
  static async getAll({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/template-message', { params });
    if (!response.data) return response;
    return { ...response, data: TemplateMessages.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: TemplateMessages[];
   * }>}
   * */
  static async getDetailTemplateMessage(id) {
    const response = await api.get(`/template-message/${id}`);
    if (!response.data) return response;
    return { ...response, data: TemplateMessages.fromApiData(response.data) };
  }

  /**
   * @param {TemplateMessages} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/template-message', { body: TemplateMessages.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {TemplateMessages} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data) {
    return await api.patch(`/template-message/${id}`, { body: TemplateMessages.toApiData(data) });
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
    return await api.delete(`/template-message/${id}`, { token });
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
    return await api.delete(`/template-message/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
