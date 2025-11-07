import { dummyCust, dummyCustCompleted, dummyCustInOnHold, dummyCustInProgress, dummyCustNew, dummyCustOpen } from '@/data/dummyData';
import { useCrudModal } from '@/hooks';
import { EllipsisOutlined, FilterOutlined, GroupOutlined, PhoneOutlined, PlusOutlined, ShopOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, Tag, Tooltip } from 'antd';
import { assignsToFormFields, categoryFormFields, labelFormFields } from './FormFields';
import Modul from '@/constants/Modul';
import { InputType } from '@/constants';

const CustBoards = () => {
  const modal = useCrudModal();

  const statusList = [
    { title: 'Open', color: 'red', data: dummyCustOpen },
    { title: 'In Progress', color: 'orange', data: dummyCustInProgress },
    { title: 'On Hold', color: 'blue', data: dummyCustInOnHold },
    { title: 'Completed', color: 'green', data: dummyCustCompleted },
    { title: 'Completed', color: 'green', data: dummyCustNew }
  ];

  return (
    <Card>
      <div className="flex w-full flex-col gap-y-8">
        <div className="flex items-center gap-x-2">
          <Input.Search style={{ margin: 0 }} onSearch={() => {}} className="mt-6 w-full lg:mt-0 lg:w-fit" placeholder="Cari" allowClear />
          <Button
            icon={<UserOutlined />}
            onClick={() => {
              modal.create({
                title: `Tetapkan User Pada`,
                formFields: [
                  ...assignsToFormFields({ options: { users: dummyCust } }),
                  {
                    label: `Kategori`,
                    name: 'kategori',
                    type: InputType.SELECT,
                    options: [
                      {
                        label: 'sample',
                        value: 'sample'
                      }
                    ]
                  }
                ],
                onSubmit: async (values) => {
                  console.log(values);
                }
              });
            }}
          >
            Tetapkan Pada
          </Button>
          <Button
            icon={<TagOutlined />}
            onClick={() => {
              modal.create({
                title: `Tambah ${Modul.LABEL}`,
                formFields: labelFormFields(),
                onSubmit: async (values) => {
                  console.log(values);
                }
              });
            }}
          >
            Label Baru
          </Button>
          <Button
            icon={<GroupOutlined />}
            onClick={() => {
              modal.create({
                title: `Tambah ${Modul.LABEL}`,
                formFields: categoryFormFields(),
                onSubmit: async (values) => {
                  console.log(values);
                }
              });
            }}
          >
            Kategori Baru
          </Button>
          <Button icon={<FilterOutlined />} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            border: '1px solid #d9d9d9',
            borderRight: 'none',
            borderBottom: 'none'
          }}
        >
          {statusList.map((status, index) => (
            <div
              key={index}
              style={{
                borderRight: '1px solid #d9d9d9',
                borderBottom: '1px solid #d9d9d9',
                minHeight: '24rem',
                display: 'flex',
                flexDirection: 'column',
                padding: '12px',
                gap: '8px'
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span
                  style={{
                    width: '100%',
                    padding: '0 8px',
                    borderLeft: `4px solid ${status.color}`,
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  {status.title}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <Button icon={<EllipsisOutlined />} type="text" />
                  <Tooltip title="Tetapkan Pada">
                    <Button
                      icon={<PlusOutlined />}
                      type="text"
                      onClick={() => {
                        modal.create({
                          title: `Tetapkan User Pada`,
                          formFields: assignsToFormFields({ options: { users: dummyCust } }),
                          onSubmit: async (values) => {
                            console.log(values);
                          }
                        });
                      }}
                    />
                  </Tooltip>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '8px' }}>
                {status.data.map((item) => (
                  <Card
                    key={item.id}
                    hoverable
                    styles={{
                      body: { padding: '12px' }
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', userSelect: 'none' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>#{item.id}</span>
                        <Tag color="blue" style={{ margin: 0 }}>
                          High
                        </Tag>
                      </div>

                      <p style={{ fontWeight: 700, marginBottom: 0 }}>{item.name}</p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                        <PhoneOutlined /> {item.phone}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShopOutlined /> {item.company}
                        </div>
                        <Avatar size="small" src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.name}`} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CustBoards;
