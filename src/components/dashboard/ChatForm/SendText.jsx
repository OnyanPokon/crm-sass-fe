/* eslint-disable react/prop-types */
import { useNotification, useService } from '@/hooks';
import { SubTemplatesService, TemplateMessagesService } from '@/services';
import { FileOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form, Input, List } from 'antd';
import React, { useEffect, useState } from 'react';

const SendText = ({ form, onSubmit, disabled }) => {
  const { execute, ...getAllTemplateMessages } = useService(TemplateMessagesService.getAll);
  const { error } = useNotification();
  const getSubTemplate = useService(SubTemplatesService.getAll);

  React.useEffect(() => {
    execute({ page: 1, perPage: 9999 });
  }, [execute]);

  const templateMessages = React.useMemo(() => {
    return getAllTemplateMessages.data ?? [];
  }, [getAllTemplateMessages.data]);

  const messageValue = Form.useWatch('message', form) || '';

  const match = messageValue.match(/(?:^|\s)\/([^\s]*)$/);
  const keyword = match?.[1] ?? '';
  const showTemplate = Boolean(match);

  const filteredTemplates = templateMessages.filter((item) => item.nama.toLowerCase().includes(keyword.toLowerCase()));

  const [activeTemplate, setActiveTemplate] = useState(null);
  const [subTemplate, setSubTemplate] = React.useState([]);

  const handleItemClick = async (item) => {
    setActiveTemplate(item);
    const next = messageValue.replace(/(?:^|\s)\/[^\s]*$/, ` /${item.nama} `);

    form.setFieldValue('message', next.trimStart());

    try {
      const { isSuccess, message, data } = await getSubTemplate.execute({
        templateMessageId: item.id
      });

      if (!isSuccess) {
        setSubTemplate([]);
        error('Gagal memuat sub template: ' + message);
        return;
      }

      const order = item.konten;
      let list = data;

      if (Array.isArray(order) && order.length > 0) {
        const ordered = [];
        order.forEach((id) => {
          const found = data.find((d) => d.key === id);
          if (found) ordered.push(found);
        });

        const remaining = data.filter((d) => !order.includes(d.key));
        list = [...ordered, ...remaining];
      }

      setSubTemplate(list);
    } catch (err) {
      console.error(err);
      setSubTemplate([]);
      error('Terjadi kesalahan saat memuat sub template');
    }
  };

  useEffect(() => {
    const value = messageValue.trim();

    if (!value.startsWith('/')) {
      setActiveTemplate(null);
      return;
    }

    const found = templateMessages.find((t) => value.startsWith(`/${t.nama}`));

    setActiveTemplate(found ?? null);
  }, [messageValue, templateMessages]);

  const handleFinish = async (values) => {
    if (!activeTemplate) {
      await onSubmit(values);
      return;
    }

    for (const sub of subTemplate) {
      await onSubmit({
        ...values,
        message: sub.konten
      });
    }

    form.setFieldValue('message', '');
    setSubTemplate([]);
    setActiveTemplate(null);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {showTemplate && filteredTemplates.length > 0 && (
        <div className="max-h-48 overflow-auto rounded-md border bg-white">
          <List
            size="small"
            dataSource={filteredTemplates}
            loading={getAllTemplateMessages.isLoading}
            renderItem={(item) => (
              <List.Item className="cursor-pointer hover:bg-gray-50" onClick={() => handleItemClick(item)}>
                <FileOutlined className="me-2 text-green-500" />
                <span className="font-mono text-sm">/{item.nama}</span>
              </List.Item>
            )}
          />
        </div>
      )}

      <Form form={form} onFinish={handleFinish}>
        <div className="flex items-end gap-2">
          <Form.Item className="flex-1" style={{ margin: 0 }} name="message">
            <Input.TextArea size="large" autoSize={{ minRows: 1, maxRows: 4 }} placeholder="Ketik '/' untuk template…" disabled={disabled} />
          </Form.Item>

          <Button icon={<SendOutlined />} size="large" htmlType="submit" disabled={disabled} />
        </div>
      </Form>
    </div>
  );
};

export default SendText;
