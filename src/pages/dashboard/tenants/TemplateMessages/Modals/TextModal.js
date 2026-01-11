import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, useService } from '@/hooks';
import { SubTemplatesService } from '@/services';

const useTextModal = () => {
  const { success, error } = useNotification();
  const storeText = useService(SubTemplatesService.storeText);
  const modal = useCrudModal();

  const open = ({ fetchAllSubTemplate, templateMessageId }) => {
    modal.create({
      title: `Tambah ${Modul.SUB_TEMPLATE} Tipe Text`,
      formFields: [
        {
          label: `Konten ${Modul.SUB_TEMPLATE}`,
          name: 'content',
          type: InputType.LONGTEXT,
          rules: [{ required: true, message: `Konten ${Modul.SUB_TEMPLATE} harus diisi` }]
        }
      ],
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeText.execute({ ...values, templateMessageId });

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

export default useTextModal;
