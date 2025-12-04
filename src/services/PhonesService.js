import { staticPayloadCreatePhone } from '@/data/dummyData';
import api from '@/utils/api';

export default class PhonesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Phones[];
   * }>}
   * */
  static async getAll() {
    const response = await api.get('/phone');
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Phones[];
   * }>}
   * */
  static async getDetailPhone(id) {
    const response = await api.get(`/phone/${id}`);
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Phones[];
   * }>}
   * */
  static async getDetailProfile(id) {
    const response = await api.get(`/phone/${id}/profile`);
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Phones[];
   * }>}
   * */
  static async generateQr(id) {
    const ts = Date.now();
    const response = await api.getFile(`/phone/${id}/login/image?ts=${ts}`);
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {Phones} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data) {
    return await api.post('/phone', { body: { ...data, config: { ...staticPayloadCreatePhone } } });
  }

  /**
   * @param {Phones} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeDisplayName(data, id) {
    return await api.post(`/phone/${id}/profile/name`, { body: data });
  }

  /**
   * @param {Phones} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeDisplayStatus(data, id) {
    return await api.post(`/phone/${id}/profile/status`, { body: data });
  }

  /**
   * @param {Phones} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeDisplayPicture(data, id, file) {
    return await api.post(`/phone/${id}/profile/picture`, { body: data, file: { file: file } });
  }

  /**
   * @param {Phones} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async startSession(id) {
    return await api.post(`/phone/${id}/start`);
  }

  /**
   * @param {Phones} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async stopSession(id) {
    return await api.post(`/phone/${id}/stop`);
  }

  /**
   * @param {Phones} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async logoutSession(id) {
    return await api.post(`/phone/${id}/logout`);
  }

  /**
   * @param {number} id
   * @param {Phones} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/phone/edit/${id}`, { body: data, token });
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
    return await api.delete(`/phone/delete/${id}`, { token });
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
    return await api.delete(`/phone/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
