import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const recipientTypesFormFields = () => [
  {
    label: `Nama ${Modul.RECIPIENTTYPES}`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.RECIPIENTTYPES} harus diisi`
      }
    ]
  },
  {
    label: `Deskripsi ${Modul.RECIPIENTTYPES}`,
    name: 'deskripsi',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Deskripsi ${Modul.APBD_ITEM} harus diisi`
      }
    ]
  }
];
