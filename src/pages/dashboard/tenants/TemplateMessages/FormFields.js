import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const templateMessageFormFields = () => [
  {
    label: `Nama ${Modul.TEMPLATE_MESSAGE}`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.TEMPLATE_MESSAGE} harus diisi`
      }
    ]
  }
];

export const subTemplateFormFields = () => [
  {
    label: `Konten ${Modul.SUB_TEMPLATE}`,
    name: 'konten',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Konten ${Modul.SUB_TEMPLATE} harus diisi`
      }
    ]
  }
];
