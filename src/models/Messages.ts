import Model from './Model';

export interface IncomingApiData {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
}

export interface OutgoingApiData {
  name: string;
  startDateTime?: string;
  endDateTime?: string;
  templateMessageIds: string[];
  recipientTypeIds: string[];
  recipientIds: string[];
  phoneIds: string[];
  isSendNow: boolean;
}

interface FormValues {
  nama: string;
  tanggal_mulai?: string;
  tanggal_berakhir?: string;
  id_template_message: string[];
  id_recipient_type: string[];
  id_recipient: string[];
  id_phone: string[];
  kirim_sekarang: boolean;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Messages extends Model {
  constructor(
    public id: string,
    public nama: string,
    public tanggal_mulai: string,
    public tanggal_berakhir: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Messages> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Messages>;
    return new Messages(apiData.id, apiData.name, apiData.startDateTime, apiData.endDateTime) as ReturnType<T, IncomingApiData, Messages>;
  }

  public static toApiData<T extends FormValues | FormValues[]>(messages: T): ReturnType<T, FormValues, OutgoingApiData> {
    if (Array.isArray(messages)) return messages.map((object) => this.toApiData(object)) as ReturnType<T, FormValues, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: messages.nama,
      ...(messages.tanggal_mulai ? { startDateTime: messages.tanggal_mulai } : {}),
      ...(messages.tanggal_berakhir ? { endDateTime: messages.tanggal_berakhir } : {}),
      templateMessageIds: messages.id_template_message,
      recipientTypeIds: messages.id_recipient_type,
      recipientIds: messages.id_recipient,
      phoneIds: messages.id_phone,
      isSendNow: messages.kirim_sekarang
    };

    return apiData as ReturnType<T, FormValues, OutgoingApiData>;
  }
}
