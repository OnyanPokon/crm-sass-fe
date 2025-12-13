import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  content: string[] | null;
}

export interface OutgoingApiData {
  name: string;
  content: string[];
}

interface FormValue {
  nama: string;
  konten: string[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class TemplateMessages extends Model {
  constructor(
    public id: string,
    public nama: string,
    public konten: string[] | null
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, TemplateMessages> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, TemplateMessages>;
    return new TemplateMessages(apiData.id, apiData.name, apiData.content) as ReturnType<T, IncomingApiData, TemplateMessages>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(templateMessages: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(templateMessages)) return templateMessages.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: templateMessages.nama,
      content: templateMessages.konten
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
