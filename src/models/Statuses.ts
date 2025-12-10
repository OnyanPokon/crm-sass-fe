import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  content: string;
  file: string | null;
  data: string[];
  startDateTime: string;
  endDateTime: string | null;
  type: 'text' | 'image' | 'voice' | 'video';
}

export interface OutgoingApiData {
  name: string;
  content: string;
  data: string[];
  startDateTime?: string;
  endDateTime?: string;
  phoneIds: string[];
  isSendNow: boolean;
  file?: string;
  type: 'text' | 'image' | 'voice' | 'video';
}

interface FormValue {
  nama: string;
  konten: string;
  data: string[];
  tanggal_mulai?: string;
  tanggal_berakhir?: string;
  id_phone: string[];
  kirim_sekarang: boolean;
  file?: string;
  tipe: 'text' | 'image' | 'voice' | 'video';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Statuses extends Model {
  constructor(
    public id: string,
    public nama: string,
    public konten: string,
    public file: string | null,
    public data: string[],
    public tanggal_mulai: string,
    public tanggal_berakhir: string | null,
    public tipe: 'text' | 'image' | 'voice' | 'video'
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Statuses> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Statuses>;
    return new Statuses(apiData.id, apiData.name, apiData.content, apiData.file, apiData.data, apiData.startDateTime, apiData.endDateTime, apiData.type) as ReturnType<T, IncomingApiData, Statuses>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(statuses: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(statuses)) return statuses.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: statuses.nama,
      content: statuses.konten,
      data: statuses.data,
      ...(statuses.tanggal_mulai ? { startDateTime: statuses.tanggal_mulai } : {}),
      ...(statuses.tanggal_berakhir ? { endDateTime: statuses.tanggal_berakhir } : {}),
      phoneIds: statuses.id_phone,
      isSendNow: statuses.kirim_sekarang,
      file: statuses.file,
      type: statuses.tipe
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
