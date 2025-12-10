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
        message: `Deskripsi ${Modul.RECIPIENTTYPES} harus diisi`
      }
    ]
  }
];

export const recipientsFormFields = ({ options }) => [
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
    label: `Nomor telp ${Modul.RECIPIENTS}`,
    name: 'nomor',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nomor telp ${Modul.RECIPIENTS} harus diisi`
      },
      {
        pattern: /^62[0-9]{7,13}$/,
        message: 'Nomor telepon harus diawali dengan 62 dan berisi 9–15 digit angka!'
      }
    ]
  },
  {
    label: `Tipe Recipient ${Modul.RECIPIENTS}`,
    name: 'id_tipe_recipient',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Tipe Recipient ${Modul.RECIPIENTS} harus diisi`
      }
    ],
    options: options.recipientTypes.map((item) => ({
      label: item.nama,
      value: item.id
    }))
  }
];
