import { BellOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Input, Select, Typography } from 'antd';

const ManageBroadcast = () => {
  return (
    <Card>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-4">
          <Typography.Title level={5} style={{ margin: 0 }}>
            Penawaran spesial
          </Typography.Title>
          <Badge status="processing" text="Aktif" />
        </div>
        <div className="flex flex-col divide-y">
          <div className="py-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-x-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 p-4 text-2xl text-blue-500">
                  <BellOutlined />
                </div>
                <div className="flex flex-col">
                  <b>Trigger</b>
                  <small className="text-gray-500">Kapan broadcast ini akan muncul dan kondisi seperti apa yang harus terpenuhi</small>
                </div>
              </div>
              <Button icon={<PlusOutlined />} type="link">
                Tambah Trigger
              </Button>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-2">
                <div className="w-full bg-blue-100 p-8">
                  <div className="mb-2 flex flex-col gap-y-2">
                    Pilih Trigger :
                    <Select placeholder="Pilih Trigger" size="large">
                      <Select.Option>User memilih suatu produk</Select.Option>
                    </Select>
                  </div>
                  <Button variant="solid" color="primary">
                    Simpan
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="w-full bg-blue-100 p-8">
                  <div className="mb-2 flex flex-col gap-y-2">
                    Pilih Trigger :
                    <Select placeholder="Pilih Trigger" size="large">
                      <Select.Option>User memilih suatu produk</Select.Option>
                    </Select>
                  </div>
                  <Button variant="solid" color="primary">
                    Simpan
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-x-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 p-4 text-2xl text-blue-500">
                  <MailOutlined />
                </div>
                <div className="flex flex-col">
                  <b>Pesan</b>
                  <small className="text-gray-500">Pesan apa yang akan dikirim kepada user</small>
                </div>
              </div>
              <Button icon={<PlusOutlined />} type="link">
                Tambah Trigger
              </Button>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-2">
                <div className="w-full bg-blue-100 p-8">
                  <div className="mb-2 flex flex-col gap-y-2">
                    Message :
                    <Input.TextArea placeholder="Masukan Text message" size="large" />
                  </div>
                  <Button variant="solid" color="primary">
                    Simpan
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4">
            <Button variant="solid" color="primary">
              Mulai Broadcast
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ManageBroadcast;
