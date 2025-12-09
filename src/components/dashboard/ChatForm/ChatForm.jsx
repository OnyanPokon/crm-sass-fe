/* eslint-disable react/prop-types */
import { useNotification } from '@/hooks';
import { useChatStore } from '@/store/chat.store';
import { FileImageOutlined, FileOutlined } from '@ant-design/icons';
import { Button, Form, Upload } from 'antd';
import React from 'react';

import { useSendText } from '@/hooks/useSendText';
import { useSendImage } from '@/hooks/useSendImage';
import { useSendFile } from '@/hooks/useSendFile';

import SendText from './SendText';
import SendImage from './SendImage';
import SendFile from './sendFile';

const ChatForm = ({ phoneId }) => {
  const [form] = Form.useForm();
  const { error } = useNotification();

  const activeConversation = useChatStore((s) => s.activeConversation);

  const { send: sendText, isLoading: loadingText } = useSendText(phoneId);
  const { send: sendImages, isLoading: loadingImage } = useSendImage(phoneId);
  const { send: sendFiles, isLoading: loadingFile } = useSendFile(phoneId);

  const [imagePanelOpen, setImagePanelOpen] = React.useState(false);
  const [filePanelOpen, setFilePanelOpen] = React.useState(false);

  const [imageItems, setImageItems] = React.useState([]);
  const [imageActiveIndex, setImageActiveIndex] = React.useState(0);

  const [fileItems, setFileItems] = React.useState([]);
  const [fileActiveIndex, setFileActiveIndex] = React.useState(0);

  React.useEffect(() => {
    form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation]);

  const handleSubmitText = async (values) => {
    const { isSuccess, message } = await sendText(activeConversation._chat.id, values.message);
    if (!isSuccess) return error('Gagal', message);
    form.resetFields();
  };

  const handleInitUploadImage = ({ fileList }) => {
    if (!fileList.length) return;
    const file = fileList[0].originFileObj;

    setImageItems([{ file, preview: URL.createObjectURL(file), caption: '' }]);
    setImageActiveIndex(0);
    setImagePanelOpen(true);
  };

  const handleExtendUploadImage = ({ fileList }) => {
    if (!fileList.length) return;
    const file = fileList[fileList.length - 1].originFileObj;

    setImageItems((prev) => [...prev, { file, preview: URL.createObjectURL(file), caption: '' }]);

    setImageActiveIndex(imageItems.length);
  };

  const handleInitUploadFile = ({ fileList }) => {
    if (!fileList.length) return;
    const file = fileList[0].originFileObj;

    setFileItems([{ file, caption: '' }]);
    setFileActiveIndex(0);
    setFilePanelOpen(true);
  };

  const handleExtendUploadFile = ({ fileList }) => {
    if (!fileList.length) return;

    const file = fileList[fileList.length - 1].originFileObj;

    setFileItems((prev) => [...prev, { file, caption: '' }]);
    setFileActiveIndex(fileItems.length);
  };

  const handleImageCaptionChange = (value) => {
    setImageItems((prev) => {
      const next = [...prev];
      next[imageActiveIndex].caption = value;
      return next;
    });
  };

  const handleFileCaptionChange = (value) => {
    setFileItems((prev) => {
      const next = [...prev];
      next[fileActiveIndex].caption = value;
      return next;
    });
  };

  const handleSubmitImages = async () => {
    const payload = imageItems.map((i) => ({
      caption: i.caption,
      file: i.file
    }));

    const { isSuccess, message } = await sendImages(activeConversation._chat.id, payload);

    if (!isSuccess) return error('Gagal', message);

    handleClosePanel();
  };

  const handleSubmitFiles = async () => {
    const payload = fileItems.map((i) => ({
      caption: i.caption,
      file: i.file
    }));

    const { isSuccess, message } = await sendFiles(activeConversation._chat.id, payload);

    if (!isSuccess) return error('Gagal', message);

    handleClosePanel();
  };

  const handleClosePanel = () => {
    imageItems.forEach((i) => {
      if (i.preview?.startsWith('blob:')) URL.revokeObjectURL(i.preview);
    });

    setImagePanelOpen(false);
    setFilePanelOpen(false);

    setImageItems([]);
    setFileItems([]);

    setImageActiveIndex(0);
    setFileActiveIndex(0);
  };

  return (
    <div className="relative p-4">
      <SendText form={form} onSubmit={handleSubmitText} disabled={imagePanelOpen || filePanelOpen} loading={loadingText} />

      {!imagePanelOpen && !filePanelOpen && (
        <div className="mt-2 flex gap-2">
          <Upload accept=".png,.jpg,.jpeg" beforeUpload={() => false} showUploadList={false} onChange={handleInitUploadImage}>
            <Button icon={<FileImageOutlined />} size="large" />
          </Upload>

          <Upload accept=".pdf,.doc,.docx,.xls,.xlsx" beforeUpload={() => false} showUploadList={false} onChange={handleInitUploadFile}>
            <Button icon={<FileOutlined />} size="large" />
          </Upload>
        </div>
      )}

      {imagePanelOpen && (
        <SendImage
          imageItems={imageItems}
          activeIndex={imageActiveIndex}
          onClose={handleClosePanel}
          onExtend={handleExtendUploadImage}
          onChangeCaption={handleImageCaptionChange}
          onSelect={setImageActiveIndex}
          onSubmit={handleSubmitImages}
          loading={loadingImage}
        />
      )}

      {filePanelOpen && (
        <SendFile
          fileItems={fileItems}
          activeIndex={fileActiveIndex}
          onClose={handleClosePanel}
          onExtend={handleExtendUploadFile}
          onChangeCaption={handleFileCaptionChange}
          onSelect={setFileActiveIndex}
          onSubmit={handleSubmitFiles}
          loading={loadingFile}
        />
      )}
    </div>
  );
};

export default ChatForm;
