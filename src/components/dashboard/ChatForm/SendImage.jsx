/* eslint-disable react/prop-types */
import { Button, Input, Upload, Image } from 'antd';
import { PlusOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';

export default function SendImage({ imageItems, activeIndex, onClose, onExtend, onChangeCaption, onSelect, onSubmit, loading }) {
  return (
    <div className="absolute bottom-4 left-4 flex h-96 w-1/2 flex-col rounded-xl border border-gray-200 bg-white shadow-xl">
      <div className="flex w-full justify-end rounded-t-xl p-2">
        <Button icon={<CloseOutlined />} type="text" onClick={onClose} />
      </div>

      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-gray-100 p-4">
        <Image src={imageItems[activeIndex]?.preview} alt="preview" height={200} className="max-h-full max-w-full object-contain" preview />
      </div>

      <div className="w-full p-2">
        <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} placeholder="caption.." value={imageItems[activeIndex]?.caption || ''} onChange={(e) => onChangeCaption(e.target.value)} />

        <div className="mt-2 inline-flex w-full items-center justify-between">
          <Upload accept=".png,.jpg,.jpeg" beforeUpload={() => false} maxCount={1} onChange={onExtend} showUploadList={false}>
            <Button icon={<PlusOutlined />} />
          </Upload>

          <div className="flex flex-1 items-center justify-center gap-2 overflow-x-auto px-2">
            {imageItems.map((img, idx) => (
              <div key={idx} className="flex cursor-pointer flex-col items-center" onClick={() => onSelect(idx)}>
                <Image src={img.preview} width={26} height={26} className="rounded-md object-cover" preview={false} />
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
