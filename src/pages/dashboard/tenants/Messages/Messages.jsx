import { DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { ClockCircleOutlined, DeleteOutlined, ExclamationOutlined, PlusOutlined, ScheduleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Image, Space, Typography } from 'antd';
import React from 'react';
import { InputType } from '@/constants';
import dayjs from 'dayjs';
import dateFormatter from '@/utils/dateFormatter';
import { MessagesService, PhonesService, RecipientsService, RecipientTypesService, TemplateMessagesService } from '@/services';
import { messageFormFields } from './FormFields';

const Messages = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllMessages } = useService(MessagesService.getAll);
  const { execute: fetchTemplateMessages, ...getAllTemplateMessages } = useService(TemplateMessagesService.getAll);
  const { execute: fetchRecipientTypes, ...getAllRecipientTypes } = useService(RecipientTypesService.getAll);
  const { execute: fetchRecipients, ...getAllRecipients } = useService(RecipientsService.getAll);
  const { execute: fetchPhones, ...getAllPhones } = useService(PhonesService.getAll);
  const deleteMessage = useService(MessagesService.delete);
  const storeMessage = useService(MessagesService.store);
  const pagination = usePagination({ totalData: getAllMessages.totalData });

  const fetchMessages = React.useCallback(() => {
    execute({
      page: pagination.page,
      perPage: pagination.perPage
    });
  }, [execute, pagination.page, pagination.perPage]);

  React.useEffect(() => {
    fetchMessages();
    fetchRecipientTypes({ page: 1, perPage: 99999 });
    fetchTemplateMessages({ page: 1, perPage: 99999 });
    fetchRecipients({ page: 1, perPage: 99999 });
    fetchPhones();
  }, [fetchMessages, fetchPhones, fetchRecipientTypes, fetchRecipients, fetchTemplateMessages]);

  const messages = getAllMessages.data ?? [];
  const recipientTypes = getAllRecipientTypes.data ?? [];
  const templateMessages = getAllTemplateMessages.data ?? [];
  const recipients = getAllRecipients.data ?? [];
  const phones = getAllPhones.data ?? [];

  const handleMenuClick = () => {
    modal.show.paragraph({
      data: {
        content: (
          <div className="mt-4 flex items-start justify-center gap-x-4">
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                onCreate('instant');
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <ThunderboltOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Instan</span>
                <small className="text-center text-gray-500">Kirim pesan Instan.</small>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                onCreate('terjadwal');
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <ClockCircleOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Terjadwal</span>
                <small className="text-center text-gray-500">Kirim pesan untuk nanti.</small>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                onCreate('rentang');
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <ScheduleOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Rentang</span>
                <small className="text-center text-gray-500">Kirim pesan rentang waktu.</small>
              </div>
            </Card>
          </div>
        )
      }
    });
  };

  const onCreate = (time) => {
    let fields = [...messageFormFields({ options: { recipientTypes, templateMessages, recipients, phones } })];
    switch (time) {
      case 'terjadwal':
        fields.push({
          label: 'Tanggal Mulai',
          name: 'tanggal_mulai',
          type: InputType.DATE
        });
        break;

      case 'rentang':
        fields.push(
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
        );
        break;
    }

    modal.create({
      title: `Tambah ${Modul.MESSAGE} ${time} `,
      formFields: fields,
      onSubmit: async (values) => {
        const payload = {
          ...values,
          kirim_sekarang: time === 'instant'
        };

        if (values.tanggal_mulai) {
          payload.tanggal_mulai = dayjs(values.tanggal_mulai).toISOString();
        }

        if (values.tanggal_berakhir) {
          payload.tanggal_berakhir = dayjs(values.tanggal_berakhir).toISOString();
        }

        const { message, isSuccess } = await storeMessage.execute(payload);

        if (isSuccess) {
          success('Berhasil', message);
          fetchMessages({ page: pagination.page, per_page: pagination.perPage });
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  const column = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'tanggal_mulai',
      dataIndex: 'tanggal_mulai',
      sorter: (a, b) => a.tanggal_mulai.length - b.tanggal_mulai.length,
      searchable: true,
      render: (record) => (record ? dateFormatter(record) : '-')
    },
    {
      title: 'Tanggal Berakhir',
      dataIndex: 'tanggal_berakhir',
      sorter: (a, b) => a.tanggal_berakhir.length - b.tanggal_berakhir.length,
      searchable: true,
      render: (record) => (record ? dateFormatter(record) : '-')
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<ExclamationOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              let data = [
                {
                  key: 'nama',
                  label: `Nama ${Modul.MESSAGE}`,
                  children: record.nama
                },
                {
                  key: 'tanggal_mulai',
                  label: `Tanggal Publish Dimulai ${Modul.MESSAGE}`,
                  children: dateFormatter(record.tanggal_mulai)
                },
                {
                  key: 'tanggal_berakhir',
                  label: `Tanggal Publish Berakhir ${Modul.MESSAGE}`,
                  children: dateFormatter(record.tanggal_berakhir)
                }
              ];

              switch (record.tipe) {
                case 'image':
                  data.push({
                    key: 'file',
                    label: `File ${Modul.MESSAGE}`,
                    children: <Image src={record.image} />
                  });
                  break;
                case 'video':
                  data.push({
                    key: 'file',
                    label: `File ${Modul.MESSAGE}`,
                    children: <video src={record.file} controls style={{ width: '100%', maxHeight: 400, borderRadius: 8 }} />
                  });
                  break;

                case 'audio':
                  data.push({
                    key: 'file',
                    label: `File ${Modul.MESSAGE}`,
                    children: <audio src={record.file} controls style={{ width: '100%' }} />
                  });
                  break;
              }

              modal.show.description({
                title: record.nama,
                data: data
              });
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.MESSAGE}`,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await deleteMessage.execute(record.id, values);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchMessages({ page: pagination.page, perPage: pagination.perPage });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    }
  ];

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-12 w-full">
        <div className="mb-6">
          <Typography.Title level={5}>Data {Modul.MESSAGE}</Typography.Title>
        </div>
        <div className="mb-6 flex flex-col-reverse justify-end gap-2 empty:hidden md:flex-row">
          <Button icon={<PlusOutlined />} color="primary" variant="solid" onClick={() => handleMenuClick()}>
            Tambah
          </Button>
        </div>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={messages} columns={column} loading={getAllMessages.isLoading} pagination={pagination} />
        </div>
      </Card>
    </div>
  );
};

export default Messages;
