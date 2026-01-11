import Model from './Model';

export interface IncomingApiData {
  id: string;
  templateMessageId: string;
  type: 'text' | 'image' | 'video' | 'file';
  file: string | null;
  content: string;
}

export interface OutgoingApiData {
  templateMessageId: string;
  type: 'text' | 'image' | 'video' | 'voice';
  content: string;
  file: string | null;
}

interface FormValue {
  id_template_message: string;
  tipe: 'text' | 'image' | 'video' | 'voice';
  konten: string;
  file: string | null;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class SubTemplates extends Model {
  constructor(
    public id: string,
    public id_template_message: string,
    public tipe: 'text' | 'image' | 'video' | 'file',
    public file: string | null,
    public konten: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, SubTemplates> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, SubTemplates>;
    return new SubTemplates(apiData.id, apiData.templateMessageId, apiData.type, apiData.file, apiData.content) as ReturnType<T, IncomingApiData, SubTemplates>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(subTemplates: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(subTemplates)) return subTemplates.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      templateMessageId: subTemplates.id_template_message,
      type: subTemplates.tipe,
      content: subTemplates.konten,
      file: subTemplates.file
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
