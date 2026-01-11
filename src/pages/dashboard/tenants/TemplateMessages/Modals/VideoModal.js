import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, useService } from '@/hooks';
import { SubTemplatesService } from '@/services';

const useVideoModal = () => {
  const { success, error } = useNotification();
  const storeVideo = useService(SubTemplatesService.storeVideo);
  const modal = useCrudModal();

  const open = ({ fetchAllSubTemplate, templateMessageId }) => {
    modal.create({
      title: `Tambah ${Modul.SUB_TEMPLATE} Tipe Video`,
      formFields: [
        {
          label: `Konten ${Modul.SUB_TEMPLATE}`,
          name: 'content',
          type: InputType.LONGTEXT,
          rules: [{ required: true, message: `Konten ${Modul.SUB_TEMPLATE} harus diisi` }]
        },
        {
          label: 'Upload Video',
          name: 'file',
          type: InputType.UPLOAD,
          max: 1,
          beforeUpload: () => false,
          getFileList: (data) => [
            {
              url: data?.file,
              name: data?.name
            }
          ],
          accept: ['.mp4', '.mov', '.mkv']
        }
      ],
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeVideo.execute({ ...values, templateMessageId }, values.file.file);

        if (isSuccess) {
          success('Berhasil', message);
          fetchAllSubTemplate({ templateMessageId });
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  return { open };
};

export default useVideoModal;
