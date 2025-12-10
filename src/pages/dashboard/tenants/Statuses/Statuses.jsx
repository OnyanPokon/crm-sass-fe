import { DataTable } from '@/components';
import Modul from '@/constants/Modul';
import { useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import { AudioOutlined, ClockCircleOutlined, DeleteOutlined, DownOutlined, ExclamationOutlined, FileImageOutlined, FontSizeOutlined, PlusOutlined, ScheduleOutlined, ThunderboltOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Image, Space, Typography } from 'antd';
import React from 'react';
import { statusFormFields } from './FormFields';
import { PhonesService, StatusesService } from '@/services';
import { InputType } from '@/constants';
import dayjs from 'dayjs';
import dateFormatter from '@/utils/dateFormatter';

const Statuses = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { execute, ...getAllStatuses } = useService(StatusesService.getAll);
  const { execute: fetchAllPhones, ...getAllPhones } = useService(PhonesService.getAll);
  const storeStatusText = useService(StatusesService.storeText);
  const storeStatusImage = useService(StatusesService.storeImage);
  const storeStatusVoice = useService(StatusesService.storeVoice);
  const storeStatusVideo = useService(StatusesService.storeVideo);
  const deleteStatus = useService(StatusesService.delete);
  const pagination = usePagination({ totalData: getAllStatuses.totalData });

  const fetchStatuses = React.useCallback(() => {
    execute({
      page: pagination.page,
      perPage: pagination.perPage
    });
  }, [execute, pagination.page, pagination.perPage]);

  React.useEffect(() => {
    fetchStatuses();
    fetchAllPhones();
  }, [fetchAllPhones, fetchStatuses]);

  const statuses = getAllStatuses.data ?? [];
  const phones = getAllPhones.data ?? [];

  const menuItems = [
    {
      label: 'Text',
      key: 'text',
      icon: <FontSizeOutlined />
    },
    {
      label: 'Gambar',
      key: 'image',
      icon: <FileImageOutlined />
    },
    {
      label: 'Suara',
      key: 'voice',
      icon: <AudioOutlined />
    },
    {
      label: 'Video',
      key: 'video',
      icon: <VideoCameraOutlined />
    }
  ];

  const handleMenuClick = (e) => {
    modal.show.paragraph({
      data: {
        content: (
          <div className="mt-4 flex items-start justify-center gap-x-4">
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                onCreate(e.key, 'instant');
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <ThunderboltOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Instan</span>
                <small className="text-center text-gray-500">Buat Status Instan.</small>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                onCreate(e.key, 'terjadwal');
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <ClockCircleOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Terjadwal</span>
                <small className="text-center text-gray-500">Buat status untuk nanti.</small>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                onCreate(e.key, 'rentang');
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <ScheduleOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Rentang</span>
                <small className="text-center text-gray-500">Buat status rentang waktu.</small>
              </div>
            </Card>
          </div>
        )
      }
    });
  };

  const onCreate = (type, time) => {
    let fields = [...statusFormFields({ options: { phones: phones } })];
    switch (type) {
      case 'image':
        fields.push({
          label: 'Upload Gambar',
          name: 'file',
          type: InputType.UPLOAD,
          max: 1,
          beforeUpload: () => false,
          getFileList: (data) => [
            {
              url: data?.file,
              name: data?.name
            }
          ],
          accept: ['.png', '.jpg', '.jpeg']
        });
        break;

      case 'voice':
        fields.push({
          label: 'Upload Audio',
          name: 'file',
          type: InputType.UPLOAD,
          max: 1,
          beforeUpload: () => false,
          getFileList: (data) => [
            {
              url: data?.file,
              name: data?.name
            }
          ],
          accept: ['.mp3', '.wav', '.ogg']
        });
        break;

      case 'video':
        fields.push({
          label: 'Upload Video',
          name: 'file',
          type: InputType.UPLOAD,
          max: 1,
          beforeUpload: () => false,
          getFileList: (data) => [
            {
              url: data?.file,
              name: data?.name
            }
          ],
          accept: ['.mp4', '.mov', '.mkv']
        });
        break;
    }
    switch (time) {
      case 'terjadwal':
        fields.push({
          label: 'Tanggal Mulai',
          name: 'tanggal_mulai',
          type: InputType.DATE
        });
        break;

      case 'rentang':
        fields.push(
          {
            label: 'Tanggal Mulai',
            name: 'tanggal_mulai',
            type: InputType.DATE
          },
          {
            label: 'Tanggal Berakhir',
            name: 'tanggal_berakhir',
            type: InputType.DATE
          }
        );
        break;
    }

    const serviceMap = {
      text: storeStatusText,
      image: storeStatusImage,
      voice: storeStatusVoice,
      video: storeStatusVideo
    };

    modal.create({
      title: `Tambah ${Modul.STATUS} ${type} ${time} `,
      formFields: fields,
      onSubmit: async (values) => {
        console.log(values);

        const file = values.file?.file ?? null;

        const service = serviceMap[type];

        if (!service) {
          error('Gagal', 'Tipe status tidak dikenali');
          return false;
        }

        const payload = {
          ...values,
          data: [],
          kirim_sekarang: time === 'instant',
          tipe: type
        };

        if (values.tanggal_mulai) {
          payload.tanggal_mulai = dayjs(values.tanggal_mulai).toISOString();
        }

        if (values.tanggal_berakhir) {
          payload.tanggal_berakhir = dayjs(values.tanggal_berakhir).toISOString();
        }

        if (file) {
          payload.file = file;
        }

        const { message, isSuccess } = await service.execute(payload, file ? values.file.file : {});

        if (isSuccess) {
          success('Berhasil', message);
          fetchStatuses({ page: pagination.page, per_page: pagination.perPage });
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  const column = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      sorter: (a, b) => a.nama.length - b.nama.length,
      searchable: true
    },
    {
      title: 'Tipe Status',
      dataIndex: 'tipe',
      sorter: (a, b) => a.tipe.length - b.tipe.length,
      searchable: true
    },
    {
      title: 'tanggal_mulai',
      dataIndex: 'tanggal_mulai',
      sorter: (a, b) => a.tanggal_mulai.length - b.tanggal_mulai.length,
      searchable: true,
      render: (record) => (record ? dateFormatter(record) : '-')
    },
    {
      title: 'Tanggal Berakhir',
      dataIndex: 'tanggal_berakhir',
      sorter: (a, b) => a.tanggal_berakhir.length - b.tanggal_berakhir.length,
      searchable: true,
      render: (record) => (record ? dateFormatter(record) : '-')
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<ExclamationOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              let data = [
                {
                  key: 'nama',
                  label: `Nama ${Modul.STATUS}`,
                  children: record.nama
                },
                {
                  key: 'tipe',
                  label: `Tipe ${Modul.STATUS}`,
                  children: record.tipe
                },
                {
                  key: 'konten',
                  label: `Konten ${Modul.STATUS}`,
                  children: record.konten
                },
                {
                  key: 'tanggal_mulai',
                  label: `Tanggal Publish Dimulai ${Modul.STATUS}`,
                  children: dateFormatter(record.tanggal_mulai)
                },
                {
                  key: 'tanggal_berakhir',
                  label: `Tanggal Publish Berakhir ${Modul.STATUS}`,
                  children: dateFormatter(record.tanggal_berakhir)
                }
              ];

              switch (record.tipe) {
                case 'image':
                  data.push({
                    key: 'file',
                    label: `File ${Modul.STATUS}`,
                    children: <Image src={record.image} />
                  });
                  break;
                case 'video':
                  data.push({
                    key: 'file',
                    label: `File ${Modul.STATUS}`,
                    children: <video src={record.file} controls style={{ width: '100%', maxHeight: 400, borderRadius: 8 }} />
                  });
                  break;

                case 'audio':
                  data.push({
                    key: 'file',
                    label: `File ${Modul.STATUS}`,
                    children: <audio src={record.file} controls style={{ width: '100%' }} />
                  });
                  break;
              }

              modal.show.description({
                title: record.nama,
                data: data
              });
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.STATUS}`,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await deleteStatus.execute(record.id, values);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchStatuses({ page: pagination.page, perPage: pagination.perPage });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    }
  ];

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-12 w-full">
        <div className="mb-6">
          <Typography.Title level={5}>Data {Modul.STATUS}</Typography.Title>
        </div>
        <div className="mb-6 flex flex-col-reverse justify-end gap-2 empty:hidden md:flex-row">
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
            <Button icon={<PlusOutlined />} color="primary" variant="solid">
              <Space>
                Tambah
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={statuses} columns={column} loading={getAllStatuses.isLoading} pagination={pagination} />
        </div>
      </Card>
    </div>
  );
};

export default Statuses;
