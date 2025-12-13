import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const messageFormFields = ({ options }) => [
  {
    label: `Nama ${Modul.MESSAGE}`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.MESSAGE} harus diisi`
      }
    ]
  },
  {
    label: `Template ${Modul.MESSAGE}`,
    name: 'id_template_message',
    type: InputType.SELECT,
    mode: 'multiple',
    rules: [
      {
        required: true,
        message: `Template ${Modul.MESSAGE} harus diisi`
      }
    ],
    options: options.templateMessages.map((item) => ({
      label: item.nama,
      value: item.id
    }))
  },

  {
    label: `Tipe Recipient ${Modul.MESSAGE}`,
    name: 'id_recipient_type',
    type: InputType.SELECT,
    mode: 'multiple',
    rules: [
      {
        required: true,
        message: `Tipe Recipient ${Modul.MESSAGE} harus diisi`
      }
    ],
    options: options.recipientTypes.map((item) => ({
      label: item.nama,
      value: item.id
    }))
  },
  {
    label: `Recipient ${Modul.MESSAGE}`,
    name: 'id_recipient',
    type: InputType.SELECT,
    mode: 'multiple',
    rules: [
      {
        required: true,
        message: `Recipient ${Modul.MESSAGE} harus diisi`
      }
    ],
    options: options.recipients.map((item) => ({
      label: item.nama,
      value: item.id
    }))
  },
  {
    label: `Phone ${Modul.MESSAGE}`,
    name: 'id_phone',
    type: InputType.SELECT,
    mode: 'multiple',
    rules: [
      {
        required: true,
        message: `Phone ${Modul.MESSAGE} harus diisi`
      }
    ],
    options: options.phones.map((item) => ({
      label: item.name,
      value: item.id
    }))
  }
];
