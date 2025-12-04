import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { Card, Button, Space, Avatar } from 'antd';
import { PauseCircleOutlined, ReloadOutlined, LogoutOutlined } from '@ant-design/icons';
import { useCrudModal } from '@/hooks';
import { botList } from '@/data/dummyData';

const BotNumbers = () => {
  const bots = botList;
  const modal = useCrudModal();

  const column = [
    {
      title: 'Nama Bot',
      dataIndex: 'bot_name',
      sorter: (a, b) => a.bot_name.length - b.bot_name.length,
      searchable: true
    },
    {
      title: 'Nomor',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      render: (value) => (value ? 'Aktif' : 'Nonaktif'),
      sorter: (a, b) => a.is_active - b.is_active,
      searchable: true
    },
    {
      title: 'Aksi',
      render: () => (
        <Space size="small">
          {/* STOP */}
          <Button
            icon={<PauseCircleOutlined />}
            variant="outlined"
            color="warning"
            onClick={() => {
              // action nanti saja
            }}
          />

          {/* RESTART */}
          <Button
            icon={<ReloadOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              // action nanti saja
            }}
          />

          {/* LOGOUT */}
          <Button
            icon={<LogoutOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              // action nanti saja
            }}
          />
        </Space>
      )
    }
  ];

  const onCreate = () => {
    modal.show.paragraph({
      data: {
        content: (
          <div className="mt-3 flex w-full flex-col items-center">
            <Avatar shape="square" size={180} src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=bot-register" />
            <p className="mt-4 text-center">Scan QR Code ini untuk menambahkan nomor bot baru ke sistem.</p>
          </div>
        )
      }
    });
  };

  return (
    <Card>
      <DataTableHeader onStore={onCreate} modul={Modul.BOT_NUMBERS} />

      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={bots} columns={column} />
      </div>
    </Card>
  );
};

export default BotNumbers;
