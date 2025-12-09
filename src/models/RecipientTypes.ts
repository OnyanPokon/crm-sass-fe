import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  slug: string;
  desc: string;
}

export interface OutgoingApiData {
  name: string;
  slug: string;
  desc: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class RecipientTypes extends Model {
  constructor(
    public id: string,
    public nama: string,
    public slug: string,
    public deskripsi: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, RecipientTypes> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, RecipientTypes>;
    return new RecipientTypes(apiData.id, apiData.name, apiData.slug, apiData.desc) as ReturnType<T, IncomingApiData, RecipientTypes>;
  }

  public static toApiData<T extends RecipientTypes | RecipientTypes[]>(recipientTypes: T): ReturnType<T, RecipientTypes, OutgoingApiData> {
    if (Array.isArray(recipientTypes)) return recipientTypes.map((object) => this.toApiData(object)) as ReturnType<T, RecipientTypes, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: recipientTypes.nama,
      slug: recipientTypes.slug,
      desc: recipientTypes.deskripsi
    };

    return apiData as ReturnType<T, RecipientTypes, OutgoingApiData>;
  }
}
