/* eslint-disable react/prop-types */
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, useService } from '@/hooks';
import { SubTemplatesService } from '@/services';
import { EditOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { subTemplateFormFields } from './FormFields';

export default function EditSubTemplateForm({ data, fetch }) {
  const updateSubTemplate = useService(SubTemplatesService.update);

  const modal = useCrudModal();
  const { success, error } = useNotification();

  return (
    <div>
      <Typography.Paragraph>{data.konten}</Typography.Paragraph>
      <hr />
      <div className="mt-4 inline-flex w-full items-center gap-x-2">
        <Button
          color="primary"
          variant="outlined"
          icon={<EditOutlined />}
          onClick={() => {
            modal.edit({
              title: `Edit ${Modul.SUB_TEMPLATE}`,
              data: { ...data },
              formFields: subTemplateFormFields(),
              onSubmit: async (values) => {
                const { message, isSuccess } = await updateSubTemplate.execute(data.id, values);
                if (isSuccess) {
                  success('Berhasil', message);
                  fetch();
                } else {
                  error('Gagal', message);
                }
                return isSuccess;
              }
            });
          }}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
