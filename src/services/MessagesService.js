import api from '@/utils/api';

export default class MessagesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Messages[];
   * }>}
   * */
  static async getAll(token) {
    const response = await api.get('/message', { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Messages[];
   * }>}
   * */
  static async getAllMessageInActiveConversation(id, chatId) {
    const response = await api.get(`/message/${id}/chats/${chatId}/messages`);
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {Messages} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async getAllChatOverview({data, id}) {
    return await api.post(`/message/${id}/chats/overview`, { body: data });
  }

  /**
   * @param {Messages} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async sendText(data, id) {
    return await api.post(`/message/${id}/text`, { body: data });
  }

  /**
   * @param {Messages} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/message', { body: data, token });
  }

  /**
   * @param {number} id
   * @param {Messages} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/message/edit/${id}`, { body: data, token });
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
    return await api.delete(`/message/delete/${id}`, { token });
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
    return await api.delete(`/message/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
