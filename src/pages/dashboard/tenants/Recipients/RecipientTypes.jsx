import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
import { recipientTypesFormFields } from './FormFields';
import { RecipientTypesService } from '@/services';
import React from 'react';
import { toSlug } from '@/utils/toSlug';

const RecipientTypes = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllRecipientTypes } = useService(RecipientTypesService.getAll);
  const storeRecipientTypes = useService(RecipientTypesService.store);
  const updateRecipientTypes = useService(RecipientTypesService.update);
  const deleteRecipientTypes = useService(RecipientTypesService.delete);
  const pagination = usePagination({ totalData: getAllRecipientTypes.totalData });

  const fetchRecipientTypes = React.useCallback(() => {
    execute({
      page: pagination.page,
      perPage: pagination.perPage
    });
  }, [execute, pagination.page, pagination.perPage]);

  React.useEffect(() => {
    fetchRecipientTypes();
  }, [fetchRecipientTypes]);

  const recipientTypes = getAllRecipientTypes.data ?? [];

  const column = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Deskripsi',
      dataIndex: 'deskripsi',
      sorter: (a, b) => a.deskripsi.length - b.deskripsi.length,
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
                data: record,
                formFields: recipientTypesFormFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateRecipientTypes.execute(record.id, { ...values, slug: toSlug(values.nama) });
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRecipientTypes({ page: pagination.page, perPage: pagination.perPage });
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
                  const { message, isSuccess } = await deleteRecipientTypes.execute(record.id, values);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRecipientTypes({ page: pagination.page, perPage: pagination.perPage });
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
      formFields: recipientTypesFormFields(),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeRecipientTypes.execute({ ...values, slug: toSlug(values.nama) });
        if (isSuccess) {
          success('Berhasil', message);
          fetchRecipientTypes({ page: pagination.page, perPage: pagination.perPage });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };
  return (
    <Card>
      <DataTableHeader onStore={onCreate} modul={Modul.RECIPIENTTYPES} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={recipientTypes} columns={column} loading={getAllRecipientTypes.isLoading} pagination={pagination} />
      </div>
    </Card>
  );
};

export default RecipientTypes;
