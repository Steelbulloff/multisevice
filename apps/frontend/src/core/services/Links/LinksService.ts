import type { Link } from "../../models";
import { api } from "../../configs";

const controller = "/links";
class LinkApiService {
  async createLink(name: string, origin: string): Promise<Link> {
    const response = await api.post(controller, {
      name,
      origin,
    });
    return response.data;
  }

  async getLinks(): Promise<any> {
    // async getLinks(): Promise<Link[]> {
    const response = await api.get(controller);
    return response.data;
  }

  async getLinkInfo(linkId: number, dateList?: string[]): Promise<Link> {
    const params = dateList && dateList.length > 0 ? { dateList } : {};
    const response = await api.get(`${controller}/${linkId}`, {
      params,
    });
    return response.data;
  }

  async removeLinks(ids: number[]): Promise<any> {
    const response = await api.delete(controller, {
      data: { ids },
    });
    return response.data;
  }
}

export const linksApiService = new LinkApiService();
