import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

import BaseNode from './BaseNode';
import { useFlowStore } from '@/store/flow.store';
import { flowMock } from '@/data/dummyData';
import { FloatButton, Menu, Modal } from 'antd';
import { LoginOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import AiAutomationForm from './AiAutomationForm';
import InputForm from './InputForm';
import OutputForm from './OutputForm';
import React from 'react';

const nodeTypes = {
  base: BaseNode
};

export default function FlowCanvas() {
  const { nodes, edges, setNodes, setEdges, onConnect, loadFlow } = useFlowStore();

  const [activeMenuKey, setActiveMenuKey] = React.useState('1');

  const [modal, setModal] = React.useState({ open: false, modalData: null });

  React.useEffect(() => {
    loadFlow(flowMock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex-1">
      <FloatButton
        onClick={() => {
          setModal({ open: true, modalData: null });
        }}
        style={{ insetBlockEnd: 100, insetInlineEnd: 24 }}
        icon={<PlusOutlined />}
        type="primary"
      />
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={setNodes} onEdgesChange={setEdges} onConnect={onConnect}>
        <Background gap={12} />
        <Controls />
      </ReactFlow>
      <Modal open={modal.open} onCancel={() => setModal({ open: false, modalData: null })} footer={null} title="Tambah Node Baru" width={800}>
        <div className="mt-4 grid w-full grid-cols-6 gap-x-5">
          <div className="col-span-2 w-full">
            <Menu
              selectedKeys={[activeMenuKey]}
              onClick={({ key }) => setActiveMenuKey(key)}
              items={[
                { key: '1', icon: <SettingOutlined />, label: 'AI Automation' },
                { key: '2', icon: <LoginOutlined />, label: 'Input' },
                { key: '3', icon: <LoginOutlined />, label: 'Output' }
              ]}
            />
          </div>
          <div className="col-span-4 w-full">
            {activeMenuKey === '1' && <AiAutomationForm />}
            {activeMenuKey === '2' && <InputForm />}
            {activeMenuKey === '3' && <OutputForm />}
          </div>
        </div>
      </Modal>
    </div>
  );
}
