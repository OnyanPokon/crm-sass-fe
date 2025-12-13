import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { DatabaseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tooltip } from 'antd';
import React from 'react';
import { TemplateMessagesService } from '@/services';
import { templateMessageFormFields } from './FormFields';
import { useNavigate } from 'react-router-dom';

const TemplateMessages = () => {
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { execute, ...getAllTemplateMessages } = useService(TemplateMessagesService.getAll);
  const storeTemplateMessage = useService(TemplateMessagesService.store);
  const updateTemplateMessage = useService(TemplateMessagesService.update);
  const deleteTemplateMessage = useService(TemplateMessagesService.delete);
  const pagination = usePagination({ totalData: getAllTemplateMessages.totalData });

  const fetchTemplateMessages = React.useCallback(() => {
    execute({
      page: pagination.page,
      perPage: pagination.perPage
    });
  }, [execute, pagination.page, pagination.perPage]);

  React.useEffect(() => {
    fetchTemplateMessages();
  }, [fetchTemplateMessages]);

  const templateMessages = getAllTemplateMessages.data ?? [];

  const column = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
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
                title: `Edit ${Modul.TEMPLATE_MESSAGE}`,
                data: record,
                formFields: templateMessageFormFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateTemplateMessage.execute(record.id, { ...values, konten: record.konten });
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchTemplateMessages({ page: pagination.page, perPage: pagination.perPage });
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
                title: `Delete ${Modul.TEMPLATE_MESSAGE}`,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await deleteTemplateMessage.execute(record.id, values);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchTemplateMessages({ page: pagination.page, perPage: pagination.perPage });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Tooltip>
            <Button icon={<DatabaseOutlined />} variant="outlined" color="primary" onClick={() => navigate(window.location.pathname + '/' + record.id)} />
          </Tooltip>
        </Space>
      )
    }
  ];

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.TEMPLATE_MESSAGE}`,
      formFields: templateMessageFormFields(),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeTemplateMessage.execute({ ...values, konten: [] });
        if (isSuccess) {
          success('Berhasil', message);
          fetchTemplateMessages({ page: pagination.page, perPage: pagination.perPage });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };
  return (
    <Card>
      <DataTableHeader onStore={onCreate} modul={Modul.TEMPLATE_MESSAGE} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={templateMessages} columns={column} loading={getAllTemplateMessages.isLoading} pagination={pagination} />
      </div>
    </Card>
  );
};

export default TemplateMessages;
