import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const statusFormFields = ({ options }) => [
  {
    label: `Nama ${Modul.STATUS}`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.STATUS} harus diisi`
      }
    ]
  },
  {
    label: `Konten ${Modul.STATUS}`,
    name: 'konten',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Konten ${Modul.STATUS} harus diisi`
      }
    ]
  },
  {
    label: `Kontak ${Modul.STATUS}`,
    name: 'id_phone',
    type: InputType.SELECT,
    mode: 'multiple',
    rules: [
      {
        required: true,
        message: `Kontak ${Modul.STATUS} harus diisi`
      }
    ],
    options: [
      {
        label: 'Untuk Semua Kontak Terdaftar',
        value: ''
      },
      ...options.phones.map((item) => ({
        label: `${item.name} - ${item.number}`,
        value: item.id
      }))
    ]
  }
];
