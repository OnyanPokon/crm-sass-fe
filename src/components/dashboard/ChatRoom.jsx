/* eslint-disable react/prop-types */
import { useService } from '@/hooks';
import { MessagesService } from '@/services';
import { useChatStore } from '@/store/chat.store';
import { CommentOutlined, FileImageOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Image, Input, Upload } from 'antd';
import React from 'react';

const ChatRoom = ({ phoneId }) => {
  const [fileList, setFileList] = React.useState([]);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [form] = Form.useForm();
  const activeConversation = useChatStore((state) => state.activeConversation);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);

  const { execute: fetchAllMessages } = useService(MessagesService.getAllMessageInActiveConversation)

  const sendText = useService(MessagesService.sendText);

  React.useEffect(() => {
    if (activeConversation) {
      fetchAllMessages(phoneId, activeConversation._chat.id).then((res) => {
        if (res?.data) {
          setMessages(res.data);
        }
      })
    }
  }, [activeConversation, fetchAllMessages, phoneId, setMessages])



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

  React.useEffect(() => {
    form.resetFields();
    setFileList([]);
    setPreviewImage('');
    setPreviewOpen(false);
  }, [activeConversation, form]);

  const onFinish = async (values) => {
    const { isSuccess } = await sendText.execute({
      chatId: activeConversation._chat.id,
      reply_to: null,
      text: values.message,
      linkPreview: true,
      linkPreviewHighQuality: false
    }, phoneId)
    if (isSuccess) {
      const newMsg = {
        id: crypto.randomUUID(),
        fromMe: true,
        body: values.message,
        timestamp: Math.floor(Date.now() / 1000),
        ack: 0,
        _chat: { id: activeConversation._chat.id }
      };

      useChatStore.getState().addMessage(newMsg);
      form.resetFields();
    } else {
      console.log('gagal');
    }
    return isSuccess
  };

  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);





  if (!activeConversation)
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
        <CommentOutlined className="mb-4 text-5xl" />
        <span>Kirim dan terima pesan</span>
      </div>
    );

  return (
    <div className="h-full w-full flex flex-col rounded-lg bg-white shadow-sm">

      <div className="p-4 border-b border-gray-100 flex items-center gap-x-2">
        <Avatar src={activeConversation.picture} />
        <span className="font-semibold">
          {
            activeConversation.lastMessage.from.endsWith("lid")
              ? activeConversation.lastMessage._data.key.remoteJidAlt
                ? activeConversation.lastMessage._data.key.remoteJidAlt.split("@")[0]
                : '-'
              : activeConversation.lastMessage.from.split("@")[0]
          }
        </span>
      </div>

      <div ref={messagesEndRef} className="flex-1 overflow-y-auto px-8 py-6">
        {[...messages]
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((item) => {
            const text =
              item.body ||
              item?._data?.message?.extendedTextMessage?.text ||
              "";

            const time = new Date(item.timestamp * 1000).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const isMe = item.fromMe;

            return (
              <div
                key={item.id}
                className={`flex flex-col gap-y-1 mb-3 ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-lg rounded-lg p-3 text-xs ${isMe ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
                    }`}
                >
                  {text}
                </div>

                <span className="px-1 text-[10px] text-gray-400">{time}</span>
              </div>
            );
          })}
      </div>

      {/* FOOTER */}
      <Form form={form} onFinish={onFinish} className="p-4 border-t">
        {fileList.length > 0 && (
          <Upload
            className="mb-2"
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            onPreview={handlePreview}
            beforeUpload={() => false}
            showUploadList={{ showRemoveIcon: true }}
          />
        )}

        <div className="flex items-center gap-2">
          <Form.Item className="flex-1" style={{ margin: 0 }} name="message">
            <Input.TextArea
              size="large"
              autoSize={{ minRows: 1, maxRows: 4 }}
              placeholder="Ketik sesuatu..."
            />
          </Form.Item>
          <Button icon={<SendOutlined />} size="large" htmlType="submit" />
        </div>

        <Upload
          accept=".png,.jpg,.jpeg"
          multiple
          beforeUpload={() => false}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          onPreview={handlePreview}
          showUploadList={false}
        >
          <Button icon={<FileImageOutlined />} size="large" className="mt-2" />
        </Upload>

        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Form>
    </div>

  );
};

export default ChatRoom;
