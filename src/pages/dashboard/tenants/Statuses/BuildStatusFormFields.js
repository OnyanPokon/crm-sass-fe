import { InputType } from '@/constants';
import { statusFormFields } from './FormFields';

const FILE_FIELD_BY_TYPE = {
  image: {
    label: 'Upload Gambar',
    accept: ['.png', '.jpg', '.jpeg']
  },
  voice: {
    label: 'Upload Audio',
    accept: ['.mp3', '.wav', '.ogg']
  },
  video: {
    label: 'Upload Video',
    accept: ['.mp4', '.mov', '.mkv']
  }
};

const DATE_FIELD_BY_TIME = {
  terjadwal: [
    {
      label: 'Tanggal Mulai',
      name: 'tanggal_mulai',
      type: InputType.DATE
    }
  ],
  rentang: [
    {
      label: 'Tanggal Mulai',
      name: 'tanggal_mulai',
      type: InputType.DATE
    },
    {
      label: 'Tanggal Berakhir',
      name: 'tanggal_berakhir',
      type: InputType.DATE
    }
  ]
};

export const buildStatusFormFields = ({ type, time, phones, mode = 'create', initialData = null }) => {
  let fields = [...statusFormFields({ options: { phones } })];

  /** FILE */
  if (FILE_FIELD_BY_TYPE[type]) {
    const fileConfig = FILE_FIELD_BY_TYPE[type];

    fields.push({
      label: fileConfig.label,
      name: 'file',
      type: InputType.UPLOAD,
      max: 1,
      beforeUpload: () => false,
      accept: fileConfig.accept,
      getFileList: (data) =>
        data
          ? [
              {
                url: data,
                name: data.split('/').pop()
              }
            ]
          : []
    });
  }

  /** DATE */
  if (DATE_FIELD_BY_TIME[time]) {
    fields.push(...DATE_FIELD_BY_TIME[time]);
  }

  /** EDIT MODE */
  if (mode === 'edit' && initialData) {
    fields = fields.map((f) => ({
      ...f,
      initialValue: initialData[f.name]
    }));
  }

  return fields;
};
