import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { Avatar, Tag } from 'antd';

export const labelFormFields = () => [
  {
    label: `Nama ${Modul.LABEL}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.LABEL} harus diisi`
      }
    ]
  }
];

export const categoryFormFields = () => [
  {
    label: `Kategori ${Modul.CATEGORY}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Kategori ${Modul.CATEGORY} harus diisi`
      }
    ]
  }
];

export const assignsToFormFields = ({ options }) => [
  {
    label: `Nama Pengguna`,
    name: 'name',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Nama Pengguna harus diisi`
      }
    ],
    options: options.users.map((item) => ({
      label: (
        <div className="inline-flex items-center gap-x-2">
          <Avatar size="small" src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.name}`} />
          <p>{item.name}</p>
        </div>
      ),
      value: item.id
    }))
  },
  {
    label: `Label`,
    name: 'label',
    type: InputType.SELECT,
    options: [
      {
        label: <Tag color="blue">Sample</Tag>,
        value: 'sample'
      }
    ]
  }
];
