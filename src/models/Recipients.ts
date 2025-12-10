import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  number: string;
  recipientType: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface OutgoingApiData {
  name: string;
  number: string;
  recipientTypeId: string;
}

interface FormValue {
  nama: string;
  nomor: string;
  id_tipe_recipient: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Recipients extends Model {
  constructor(
    public id: string,
    public nama: string,
    public nomor: string,
    public id_tipe_recipient: {
      id: string;
      nama: string;
      slug: string;
    }
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Recipients> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Recipients>;
    return new Recipients(apiData.id, apiData.name, apiData.number, {
      id: apiData.recipientType.id,
      nama: apiData.recipientType.name,
      slug: apiData.recipientType.slug
    }) as ReturnType<T, IncomingApiData, Recipients>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(recipients: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(recipients)) return recipients.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: recipients.nama,
      number: recipients.nomor,
      recipientTypeId: recipients.id_tipe_recipient
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
