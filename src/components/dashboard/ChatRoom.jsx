import { useChatStore } from '@/store/chat.store';
import { CommentOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Image, Input, Upload } from 'antd';
import React from 'react';

const ChatRoom = () => {
  const [fileList, setFileList] = React.useState([]);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [form] = Form.useForm();

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const activeConversation = useChatStore((state) => state.activeConversation);

  React.useEffect(() => {
    form.resetFields();
    setFileList([]);
    setPreviewImage('');
    setPreviewOpen(false);
  }, [activeConversation, form]);

  if (!activeConversation)
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
        <CommentOutlined className="mb-4 text-5xl" />
        <span>Kirim dan terima pesan</span>
      </div>
    );

  const onFinish = (values) => {
    const payload = {
      ...values,
      files: fileList.map((f) => f.originFileObj || f.url)
    };

    console.log('SUBMIT PAYLOAD:', payload);
  };

  return (
    <div className="relative h-full w-full rounded-lg bg-white shadow-sm">
      <div className="absolute top-0 z-10 w-full rounded-t-lg border-b border-gray-100 bg-white p-4">
        <div className="flex items-center gap-x-2">
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
          <span className="font-semibold">{activeConversation.contact_name}</span>
        </div>
      </div>
      <div className="h-full w-full">
        <div className="flex h-full w-full flex-col overflow-auto pb-12 pt-20">
          <div className="flex w-full flex-col items-start gap-y-2 px-6">
            <div className="w-fit max-w-lg rounded-lg bg-gray-500 p-4 text-justify text-xs text-white">
              orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It
              has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
              with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </div>
            <span className="px-2 text-xs text-gray-400">10:21</span>
          </div>
          <div className="flex w-full flex-col items-end gap-y-2 px-6 text-white">
            <div className="w-fit max-w-lg rounded-lg bg-blue-500 p-4 text-justify text-xs text-white">orem Ipsum is simply dummy text of the printing and typesetting industry.</div>
            <span className="px-2 text-xs text-gray-400">10:21</span>
          </div>
        </div>
      </div>
      <Form form={form} onFinish={onFinish} className="absolute bottom-0 w-full rounded-b-lg bg-white p-4">
        {fileList.length > 0 && <Upload className="mb-2" listType="picture-card" fileList={fileList} onChange={({ fileList }) => setFileList(fileList)} onPreview={handlePreview} beforeUpload={() => false} showUploadList={{ showRemoveIcon: true }} />}

        <div className="mb-2 flex items-center gap-2">
          <Form.Item className="w-full" style={{ margin: 0 }} name="message">
            <Input.TextArea size="large" autoSize={{ minRows: 1, maxRows: 4 }} className="flex-1" />
          </Form.Item>
          <Form.Item className="" style={{ margin: 0 }}>
            <Button icon={<SendOutlined />} size="large" htmlType="submit" />
          </Form.Item>
        </div>

        <Form.Item style={{ margin: 0 }} name="files">
          <Upload multiple beforeUpload={() => false} fileList={fileList} onChange={({ fileList }) => setFileList(fileList)} onPreview={handlePreview} showUploadList={false}>
            <Button icon={<PaperClipOutlined />} size="large" />
          </Upload>
        </Form.Item>

        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage('')
            }}
            src={previewImage}
          />
        )}
      </Form>
    </div>
  );
};

export default ChatRoom;
