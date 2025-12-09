/* eslint-disable react/prop-types */
import { SendOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const SendText = ({ form, onSubmit, disabled }) => {
  return (
    <Form form={form} onFinish={onSubmit} className="flex items-center gap-2">
      <Form.Item className="flex-1" style={{ margin: 0 }} name="message">
        <Input.TextArea size="large" autoSize={{ minRows: 1, maxRows: 4 }} placeholder="Ketik sesuatu..." disabled={disabled} />
      </Form.Item>
      <Button icon={<SendOutlined />} size="large" htmlType="submit" disabled={disabled} />
    </Form>
  );
};

export default SendText;
