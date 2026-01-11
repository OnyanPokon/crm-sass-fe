import { Button, Form, Select } from 'antd';

const AiAutomationForm = () => {
  return (
    <Form layout="vertical">
      <Form.Item style={{ margin: 0, marginBottom: 12 }} label="Sumber" name="srouce" rules={[{ required: true, message: 'Masukan Sumber' }]}>
        <Select placeholder="pilih sumber">
          <Select.Option>Sample</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item style={{ margin: 0, marginBottom: 12 }} label="Model" name="model_name" rules={[{ required: true, message: 'Masukan Model!' }]}>
        <Select placeholder="pilih model">
          <Select.Option>Sample</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <div className="inline-flex items-center gap-x-2">
          <Button variant="solid" color="primary">
            Kirim
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default AiAutomationForm;
