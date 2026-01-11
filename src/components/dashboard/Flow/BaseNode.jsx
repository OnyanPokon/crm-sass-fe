/* eslint-disable react/prop-types */
// BaseNode.jsx
import { Handle, Position } from 'reactflow';
import { RobotOutlined, LoginOutlined, ExportOutlined } from '@ant-design/icons';

const NODE_META = {
  ai: {
    color: 'border-purple-500',
    icon: <RobotOutlined />
  },
  input: {
    color: 'border-blue-500',
    icon: <LoginOutlined />
  },
  output: {
    color: 'border-green-500',
    icon: <ExportOutlined />
  }
};

export default function BaseNode({ data }) {
  const meta = NODE_META[data.nodeType] || {};

  return (
    <div className={`w-56 rounded-xl border-2 bg-white p-4 shadow-md ${meta.color}`}>
      <div className="mb-2 flex items-center gap-2 font-semibold">
        {meta.icon}
        {data.title}
      </div>

      <p className="text-sm text-gray-500">{data.description}</p>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
