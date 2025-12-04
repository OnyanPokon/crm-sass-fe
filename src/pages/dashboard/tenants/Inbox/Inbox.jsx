import { ChatRoom, ConversationList } from '@/components';
import { useChatStore } from '@/store/chat.store';
import { UserOutlined } from '@ant-design/icons';
import { Button, Input, Tabs } from 'antd';
import React, { useState } from 'react';

const Inbox = () => {
  const activeConversation = useChatStore((state) => state.activeConversation);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);

  const [activeTab, setActiveTab] = useState('contact');

  const TabItems = [
    {
      key: 'contact',
      label: 'Kontak'
    }
  ];

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setActiveConversation(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setActiveConversation]);

  return (
    <div className="grid h-screen w-full grid-cols-12 gap-4">
      <div className="col-span-3 h-screen w-full p-[0.10rem]">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="w-full border-b border-gray-100 bg-white p-4">
            <Tabs items={TabItems} activeKey={activeTab} onChange={(key) => setActiveTab(key)} />
            <Input.Search />
          </div>

          <div className="mt-2 flex-1 overflow-y-auto px-4">
            <ConversationList />
          </div>
        </div>
      </div>
      <div className="col-span-9 flex h-screen w-full gap-x-4 p-[0.10rem]">
        <ChatRoom />
        <div className="h-full rounded-lg bg-white p-4 shadow-sm">
          <Button variant="outlined" icon={<UserOutlined />} color="primary" disabled={!activeConversation} />
        </div>
      </div>
    </div>
  );
};

export default Inbox;
