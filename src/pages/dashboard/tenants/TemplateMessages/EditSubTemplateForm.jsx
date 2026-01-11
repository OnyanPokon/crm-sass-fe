/* eslint-disable react/prop-types */
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, useService } from '@/hooks';
import { SubTemplatesService } from '@/services';
import { EditOutlined, FileOutlined } from '@ant-design/icons';
import { Button, Image, Typography } from 'antd';
import { subTemplateFormFields } from './FormFields';

export default function EditSubTemplateForm({ data, fetch }) {
  const updateSubTemplate = useService(SubTemplatesService.update);

  const modal = useCrudModal();
  const { success, error } = useNotification();

  console.log(data);

  return (
    <div className="grid w-full grid-cols-12 gap-6">
      <div className="col-span-5 flex w-full items-center justify-center p-4">
        <div
          style={{
            backgroundImage: `url('/image_asset/backgrounds/whatsapp_bg.png')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
          className="flex h-full w-full flex-col justify-end rounded-2xl p-4"
        >
          <div>
            {data.file !== null && (
              <div className={`mb-3 flex flex-col items-end gap-y-1`}>
                <div className="inline-flex items-start gap-x-2">
                  <div className={`max-w-md rounded-lg bg-blue-500 p-3 text-xs text-white`}>
                    {data.tipe === 'image' && <Image src={data.file} className="rounded-lg" width={200} />}
                    {data.tipe === 'video' && (
                      <video src={data.file} controls className="w-64 rounded-lg">
                        Browser kamu tidak mendukung video tag.
                      </video>
                    )}
                    {data.tipe === 'file' && (
                      <div className="flex h-44 w-44 items-center justify-center rounded-lg p-2">
                        <FileOutlined className="text-5xl text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <span className="px-1 text-[10px] text-gray-400">21:00</span>
              </div>
            )}
            <div className={`mb-3 flex flex-col items-end gap-y-1`}>
              <div className="inline-flex items-start gap-x-2">
                <div className={`max-w-xs rounded-lg bg-blue-500 p-3 text-xs text-white`}>{data.konten}</div>
              </div>

              <span className="px-1 text-[10px] text-gray-400">21:00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-7 mt-4 flex w-full flex-col gap-y-4">
        {data.file !== null && (
          <div className="flex flex-col gap-y-2">
            <p>File :</p>
            {data.tipe === 'image' && <Image src={data.file} className="rounded-lg border-2 border-dashed p-2" width={200} />}
            {data.tipe === 'video' && (
              <video src={data.file} controls className="w-64 rounded-lg border-2 border-dashed p-2">
                Browser kamu tidak mendukung video tag.
              </video>
            )}
            {data.tipe === 'file' && (
              <div className="flex h-44 w-44 items-center justify-center rounded-lg border-2 border-dashed p-2">
                <FileOutlined className="text-5xl text-gray-400" />
              </div>
            )}
          </div>
        )}

        <div className="flex w-full flex-col gap-y-2">
          <p>Konten Message :</p>
          <Typography.Paragraph className="w-full rounded-lg border-2 border-dashed p-4">{data.konten}</Typography.Paragraph>
        </div>
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
    </div>
  );
}
