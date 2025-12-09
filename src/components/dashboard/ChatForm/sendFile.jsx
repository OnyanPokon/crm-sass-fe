/* eslint-disable react/prop-types */
import { Button, Input, Upload } from 'antd';
import { PlusOutlined, SendOutlined, CloseOutlined, FileOutlined } from '@ant-design/icons';

export default function SendFile({ fileItems, activeIndex, onClose, onExtend, onChangeCaption, onSelect, onSubmit, loading }) {
  const current = fileItems[activeIndex];

  return (
    <div className="absolute bottom-4 left-4 flex h-96 w-1/2 flex-col rounded-xl border bg-white shadow-xl">
      <div className="flex w-full justify-end border-b p-2">
        <Button icon={<CloseOutlined />} type="text" onClick={onClose} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-gray-50">
        <FileOutlined style={{ fontSize: 40 }} />
        <span className="text-sm text-gray-600">{current?.file?.name}</span>
      </div>

      {/* CAPTION + ACTION */}
      <div className="border-t p-3">
        <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} placeholder="Tambahkan caption" value={current?.caption || ''} onChange={(e) => onChangeCaption(e.target.value)} />

        <div className="mt-2 flex items-center justify-between">
          <Upload accept=".pdf,.doc,.docx,.xls,.xlsx" beforeUpload={() => false} showUploadList={false} maxCount={1} onChange={onExtend}>
            <Button icon={<PlusOutlined />} />
          </Upload>

          <div className="flex flex-1 items-center justify-center gap-2 overflow-x-auto px-2">
            {fileItems.map((img, idx) => (
              <div key={idx} className="flex cursor-pointer flex-col items-center" onClick={() => onSelect(idx)}>
                <FileOutlined className="text-lg" />
                <div className={`mt-1 h-1 w-7 rounded-full ${activeIndex === idx ? 'bg-blue-500' : 'bg-transparent'}`} />
              </div>
            ))}
          </div>

          <Button icon={<SendOutlined />} type="primary" onClick={onSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
