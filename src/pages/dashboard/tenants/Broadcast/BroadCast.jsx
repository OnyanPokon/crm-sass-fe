import { DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { RightOutlined } from '@ant-design/icons';
import { Card, Tag, Typography } from 'antd';

const BroadCast = () => {
  const onCreate = () => {};

  return (
    <Card>
      <DataTableHeader modul={Modul.BROADCAST} onStore={onCreate} />
      <div className="flex flex-col divide-y">
        <Card hoverable>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1">
              <Typography.Title style={{ margin: 0 }} level={5}>
                Penawaran spesial
              </Typography.Title>
              <div className="flex items-center divide-x text-xs">
                <span className="pe-2">Created At: 12 Jun 2024</span>
                <span className="px-2">Last Modified: 12 Jun 2024</span>
                <span className="px-2">
                  status: <Tag color="blue">Active</Tag>
                </span>
              </div>
            </div>
            <RightOutlined />
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default BroadCast;
