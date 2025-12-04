import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { dummyRecipientList } from '@/data/dummyData';
import { useCrudModal } from '@/hooks';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Descriptions, Space } from 'antd';

const Recipients = () => {
  const modal = useCrudModal();

  const column = [
    {
      title: 'Nama',
      dataIndex: 'recipient_list_name',
      sorter: (a, b) => a.recipient_list_name.length - b.recipient_list_name.length,
      searchable: true
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<ExclamationCircleOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              modal.show.paragraph({
                data: {
                  content: (
                    <div className="mt-4 flex w-full flex-col gap-y-4">
                      <div className="inline-flex w-full items-center gap-x-2 rounded-xl bg-blue-500 p-4 text-white">
                        <Avatar size="large" src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                        <div className="flex flex-col">
                          <b>{record.name}</b>
                          <small>{record.phone}</small>
                        </div>
                      </div>
                      <Descriptions column={1} bordered>
                        <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
                        <Descriptions.Item label="Company">{record.company}</Descriptions.Item>
                        <Descriptions.Item label="Product">{record.product}</Descriptions.Item>
                        <Descriptions.Item label="Subscription Status">{record.subscriptionStatus}</Descriptions.Item>
                        <Descriptions.Item label="Last Contact">{record.lastContact}</Descriptions.Item>
                      </Descriptions>
                    </div>
                  )
                }
              });
            }}
          />
        </Space>
      )
    }
  ];

  const onCreate = () => {};
  return (
    <Card>
      <DataTableHeader onStore={onCreate} modul={Modul.RECIPIENTS} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={dummyRecipientList} columns={column} />
      </div>
    </Card>
  );
};

export default Recipients;
