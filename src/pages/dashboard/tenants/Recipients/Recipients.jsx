import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { CheckCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, List, Space } from 'antd';
import React from 'react';
import { toSlug } from '@/utils/toSlug';
import { RecipientsService, RecipientTypesService } from '@/services';
import { recipientsFormFields } from './FormFields';

const Recipients = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllRecipients } = useService(RecipientsService.getAll);
  const { execute: fetchRecipientTypes, ...getAllRecipientTypes } = useService(RecipientTypesService.getAll);
  const storeRecipient = useService(RecipientsService.store);
  const updateRecipient = useService(RecipientsService.update);
  const deleteRecipient = useService(RecipientsService.delete);
  const pagination = usePagination({ totalData: getAllRecipients.totalData });

  const fetchRecipients = React.useCallback(() => {
    execute({
      page: pagination.page,
      perPage: pagination.perPage
    });
  }, [execute, pagination.page, pagination.perPage]);

  React.useEffect(() => {
    fetchRecipients();
    fetchRecipientTypes({});
  }, [fetchRecipientTypes, fetchRecipients]);

  const recipient = getAllRecipients.data ?? [];
  const recipientTypes = getAllRecipientTypes.data ?? [];

  const column = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Number',
      dataIndex: 'nomor',
      sorter: (a, b) => a.nomor.length - b.nomor.length,
      searchable: true
    },
    {
      title: 'Tipe Recipient',
      dataIndex: ['id_tipe_recipient', 'nama'],
      sorter: (a, b) => a.id_tipe_recipient.nama.length - b.id_tipe_recipient.nama.length,
      searchable: true
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.RECIPIENTTYPES}`,
                data: { ...record, id_tipe_recipient: record.id_tipe_recipient.id },
                formFields: recipientsFormFields({ options: { recipientTypes: recipientTypes } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateRecipient.execute(record.id, { ...values, slug: toSlug(values.nama) });
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRecipients({ page: pagination.page, perPage: pagination.perPage });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.RECIPIENTTYPES}`,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await deleteRecipient.execute(record.id, values);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRecipients({ page: pagination.page, perPage: pagination.perPage });
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

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.RECIPIENTTYPES}`,
      formFields: recipientsFormFields({ options: { recipientTypes: recipientTypes } }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeRecipient.execute({ ...values, slug: toSlug(values.nama) });
        if (isSuccess) {
          success('Berhasil', message);
          fetchRecipients({ page: pagination.page, perPage: pagination.perPage });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };
  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-8 w-full">
        <DataTableHeader onStore={onCreate} modul={Modul.RECIPIENTS} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={recipient} columns={column} loading={getAllRecipients.isLoading} pagination={pagination} />
        </div>
      </Card>
      <Card className="col-span-4 h-fit w-full">
        <DataTableHeader onStore={onCreate} modul={Modul.RECIPIENTTYPES} />
        <div className="w-full max-w-full overflow-x-auto">
          <List
            size="small"
            bordered
            dataSource={recipientTypes}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleFilled className="me-2 text-green-500" />
                {item.nama}
              </List.Item>
            )}
            loading={getAllRecipientTypes.isLoading}
          />
        </div>
      </Card>
    </div>
  );
};

export default Recipients;
