/* eslint-disable no-unused-vars */
import { SubTemplates } from '@/models';
import api from '@/utils/api';

export default class SubTemplatesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: SubTemplates[];
   * }>}
   * */
  static async getAll({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/content-template-message', { params });
    if (!response.data) return response;
    return { ...response, data: SubTemplates.fromApiData(response.data) };
  }

  /**
   * @param {SubTemplates} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, file) {
    if (file) {
      return api.post('/content-template-message', {
        body: SubTemplates.toApiData(data),
        file: { file: file }
      });
    }

    return api.post('/content-template-message', {
      body: SubTemplates.toApiData(data)
    });
  }

  /**
   * @param {SubTemplates} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeText(data) {
    return await api.post('/content-template-message/text', { body: data });
  }

  /**
   * @param {SubTemplates} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeImage(data, file) {
    return await api.post('/content-template-message/image', { body: data, file: { file: file } });
  }

  /**
   * @param {SubTemplates} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeFile(data, file) {
    return await api.post('/content-template-message/file', { body: data, file: { file: file } });
  }

  /**
   * @param {SubTemplates} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeVideo(data, file) {
    return await api.post('/content-template-message/video', { body: data, file: { file: file } });
  }

  /**
   * @param {number} id
   * @param {SubTemplates} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/content-template-message/${id}`, { body: SubTemplates.toApiData(data), token });
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
    return await api.delete(`/content-template-message/${id}`);
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
    return await api.delete(`/content-template-message/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
