import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { dummyCampaign } from '@/data/dummyData';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const Campaigns = () => {
  const navigate = useNavigate();
  const campaigns = dummyCampaign;

  const column = [
    {
      title: 'Nama',
      dataIndex: 'nama_campaign',
      sorter: (a, b) => a.nama_campaign.length - b.nama_campaign.length,
      searchable: true
    },
    {
      title: 'List Recipient',
      dataIndex: 'recipient_list',
      sorter: (a, b) => a.recipient_list.length - b.recipient_list.length,
      searchable: true
    },
    {
      title: 'Template',
      dataIndex: 'template',
      sorter: (a, b) => a.template.length - b.template.length,
      searchable: true
    }
  ];

  const onCreate = () => {
    navigate(window.location.pathname + '/create');
  };
  return (
    <Card>
      <DataTableHeader onStore={onCreate} modul={Modul.CAMPAIGNS} />
      <div className="w-full max-w-full overflow-x-auto">
        <DataTable data={campaigns} columns={column} />
      </div>
    </Card>
  );
};

export default Campaigns;
