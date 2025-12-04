import { dummyRecipientList, dummyTemplates } from '@/data/dummyData';
import { WarningOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Form, Input, Select, Typography } from 'antd';

const Create = () => {
  const recipients = dummyRecipientList;
  const tempaltes = dummyTemplates;
  return (
    <div className="grid min-h-screen w-full grid-cols-12 gap-4">
      <Card className="col-span-8 h-fit">
        <div className="w-full">
          <Typography.Title level={4}>Setup Campaign</Typography.Title>
          <Form layout="vertical" className="mt-8">
            <Form.Item label="Nama Campaign :">
              <Input size="large" placeholder="Nama Campaign" />
            </Form.Item>
            <Form.Item label="List Recipient :">
              <Select size="large" placeholder="Pilih List Recipient">
                {recipients.map((item) => (
                  <Select.Option key={item.id}>{item.recipient_list_name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Template :">
              <Select size="large" placeholder="Pilih Template">
                {tempaltes.map((item) => (
                  <Select.Option key={item.id}>{item.template_name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Typography.Title level={5}>Content :</Typography.Title>
              <div className="flex w-full flex-col gap-y-2 rounded-lg bg-gray-100 p-6">
                <span className="font-bold">Message</span>
                <div className="inline-flex items-center gap-x-2">
                  <WarningOutlined className="text-yellow-500" />
                  Mohon untuk memilih template terlebih dahulu
                </div>
              </div>
            </Form.Item>
            <Form.Item>
              <Button variant="solid" color="primary" size="large">
                Buat Campaign
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
      <Card className="col-span-4 h-fit">
        <div className="w-full">
          <div
            className="h-[600px] w-full overflow-y-auto rounded-lg p-4"
            style={{
              backgroundImage: "url('/image_asset/backgrounds/whatsapp_bg.png')",
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="flex w-full items-start gap-x-2">
              <Avatar>U</Avatar>
              <div className="flex max-w-[80%] flex-col gap-y-1">
                <span className="text-[11px] font-medium text-gray-500">Admin • 15:00</span>
                <div className="rounded-xl bg-white px-4 py-3 text-sm leading-relaxed shadow-sm">This template provides</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Create;
