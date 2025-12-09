import { StatusBadge } from '@/components';
import { InputType } from '@/constants';
import { useCrudModal, useNotification, useService } from '@/hooks';
import { PhonesService } from '@/services';
import {
  CheckCircleFilled,
  CheckOutlined,
  ClockCircleFilled,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  InboxOutlined,
  LogoutOutlined,
  PauseCircleFilled,
  PauseOutlined,
  PhoneOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  QrcodeOutlined,
  ReloadOutlined,
  WarningFilled,
  WhatsAppOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Modal, Spin, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Phones = () => {
  const navigate = useNavigate();
  const crudModal = useCrudModal();
  const { error, success } = useNotification();
  const { execute, ...getAllPhones } = useService(PhonesService.getAll);
  const { execute: fetchDetailPhone, ...getDetailPhone } = useService(PhonesService.getDetailPhone);
  const { execute: fetchDetailProfile, ...getDetailProfile } = useService(PhonesService.getDetailProfile);
  const { execute: generateQr, ...getAllGenerateQr } = useService(PhonesService.generateQr);
  const startSession = useService(PhonesService.startSession);
  const stopSession = useService(PhonesService.stopSession);
  const logoutSession = useService(PhonesService.logoutSession);
  const storePhone = useService(PhonesService.store);
  const deletePhone = useService(PhonesService.delete);
  const storeDisplayName = useService(PhonesService.storeDisplayName);
  const storeDisplayStatus = useService(PhonesService.storeDisplayStatus);
  const storeDisplayPicture = useService(PhonesService.storeDisplayPicture);
  const [modal, setModal] = React.useState({ isOpen: false, phoneData: null, profileData: null });
  const [qrCode, setQrCode] = React.useState();

  const fetchAllPhones = React.useCallback(() => {
    execute();
  }, [execute]);

  React.useEffect(() => {
    fetchAllPhones();
  }, [fetchAllPhones]);

  const phones = getAllPhones.data ?? [];

  const handleStartSession = async (id) => {
    const { isSuccess, message } = await startSession.execute(id);
    if (isSuccess) {
      success('Berhasil', message);
      setModal({ isOpen: false, phoneData: null });
    } else {
      error('Gagal', message);
    }

    return isSuccess;
  };

  const handleStopSession = async (id) => {
    const { isSuccess, message } = await stopSession.execute(id);
    if (isSuccess) {
      success('Berhasil', message);
      setModal({ isOpen: false, phoneData: null });
    } else {
      error('Gagal', message);
    }

    return isSuccess;
  };

  const handleLogoutSession = async (id) => {
    const { isSuccess, message } = await logoutSession.execute(id);
    if (isSuccess) {
      success('Berhasil', message);
      setModal({ isOpen: false, phoneData: null });
    } else {
      error('Gagal', message);
    }

    return isSuccess;
  };

  const badgeIcon = {
    FAILED: <ExclamationCircleFilled className="text-red-500" />,
    SCAN_QR_CODE: <ClockCircleFilled className="text-yellow-500" />,
    STARTING: <ClockCircleFilled className="text-yellow-500" />,
    WORKING: <CheckCircleFilled className="text-green-500" />,
    STOPPED: <PauseCircleFilled className="text-gray-500" />
  };

  return (
    <>
      <div className="grid w-full grid-cols-12 gap-4">
        <div className="col-span-12 mb-4 inline-flex w-full items-end justify-between px-2">
          <div>
            <Typography.Title style={{ margin: 0 }} level={4}>
              Phones
            </Typography.Title>
            <span>Daftar nomor telephone</span>
          </div>
          <Button
            icon={<PlusOutlined />}
            shape="round"
            color="primary"
            variant="solid"
            onClick={() => {
              crudModal.create({
                title: `Tambah Nomor`,
                formFields: [
                  {
                    label: `Nama Akun`,
                    name: 'name',
                    type: InputType.TEXT,
                    rules: [
                      {
                        required: true,
                        message: `Nama Akun harus diisi`
                      }
                    ]
                  },
                  {
                    label: `Nomor telp`,
                    name: 'number',
                    type: InputType.TEXT,
                    rules: [
                      {
                        required: true,
                        message: `Nomor telp harus diisi`
                      },
                      {
                        pattern: /^62[0-9]{7,13}$/,
                        message: 'Nomor telepon harus diawali dengan 62 dan berisi 9–15 digit angka!'
                      }
                    ],
                    extra: {
                      prefix: <PhoneOutlined />
                    }
                  }
                ],
                onSubmit: async (values) => {
                  const { message, isSuccess } = await storePhone.execute(values);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchAllPhones();
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          >
            Tambah
          </Button>
        </div>
        {phones.map((item) => (
          <Card
            key={item.id}
            hoverable
            className="col-span-3"
            onClick={async () => {
              const phoneRes = await fetchDetailPhone(item.id);
              if (!phoneRes.isSuccess) return error('Gagal', phoneRes.message);

              let profileRes = { isSuccess: true, data: null };

              if (item.session.status === 'WORKING') {
                profileRes = await fetchDetailProfile(item.id);

                if (!profileRes.isSuccess) return error('Gagal', profileRes.message);
              }

              setModal({
                isOpen: true,
                phoneData: phoneRes.data,
                profileData: profileRes.data
              });

              return true;
            }}
          >
            <div className="inline-flex items-center gap-x-4">
              <Badge count={badgeIcon[item?.session?.status] ?? null}>
                <Avatar size={48} src={item.picture ? item.picture : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} style={{ backgroundColor: '#fff' }} />
              </Badge>
              <div className="flex flex-col">
                <b className="inline-flex items-center gap-x-2">
                  {item.name}
                  {getDetailPhone.isLoading || (getDetailProfile.isLoading && <Spin size="small" />)}
                </b>
                <span className="text-xs text-gray-500">{item.number}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal
        open={modal.isOpen}
        onCancel={() => {
          setModal({ isOpen: false, phoneData: null });
          fetchAllPhones();
          setQrCode(null);
        }}
        footer={null}
        destroyOnClose
      >
        <div className="w-full">
          <div className="relative h-24 w-full rounded-lg bg-blue-500">
            <div className="group absolute -bottom-6 left-4 cursor-pointer">
              {/* Avatar */}
              <Avatar size={86} src={modal.profileData?.picture ? modal.profileData?.picture : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} style={{ backgroundColor: '#fff' }} className="rounded-full" />

              <button
                onClick={() => {
                  crudModal.create({
                    title: `Tambah Nomor`,
                    formFields: [
                      {
                        label: `Foto Profil`,
                        name: 'file',
                        type: InputType.UPLOAD,
                        max: 1,
                        beforeUpload: () => {
                          return false;
                        },
                        getFileList: (data) => {
                          return [
                            {
                              url: data?.file,
                              name: data?.name
                            }
                          ];
                        },
                        accept: ['.png', '.jpg', '.jpeg']
                      }
                    ],
                    onSubmit: async (values) => {
                      const { message, isSuccess } = await storeDisplayPicture.execute(values, modal.phoneData.id, values.file.file);
                      if (isSuccess) {
                        success('Berhasil', message);
                        fetchAllPhones();
                        setModal({ isOpen: false, profileData: null, phoneData: null });
                        setQrCode(null);
                      } else {
                        error('Gagal', message);
                      }
                      return isSuccess;
                    }
                  });
                }}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-all duration-200 group-hover:opacity-100"
              >
                <EditOutlined className="text-xl text-white" />
              </button>
            </div>
          </div>

          {(() => {
            const sessionStatus = modal.phoneData?.session?.status;
            const isWaiting = sessionStatus === 'SCAN_QR_CODE' || sessionStatus === 'STARTING';

            return (
              <>
                <div className="mb-4 mt-8 flex flex-col gap-y-1 px-4">
                  <div className="inline-flex items-center justify-between">
                    <div className="inline-flex items-center gap-x-2">
                      <span className="text-lg font-semibold">{modal.phoneData?.name}</span>

                      {sessionStatus === 'STOPPED' && <StatusBadge color="gray" icon={<PauseOutlined />} text="Stopped" />}

                      {sessionStatus === 'WORKING' && <StatusBadge color="green" icon={<CheckOutlined />} text="Signed" />}

                      {isWaiting && <StatusBadge color="yellow" icon={<ClockCircleOutlined />} text="Waiting" />}

                      {sessionStatus === 'FAILED' && <StatusBadge color="red" icon={<WarningFilled />} text="Failed" />}
                    </div>

                    <div className="inline-flex items-center gap-x-2">
                      {isWaiting && (
                        <>
                          <Button
                            shape="round"
                            icon={<QrcodeOutlined />}
                            color="primary"
                            variant="solid"
                            loading={getAllGenerateQr.isLoading}
                            onClick={async () => {
                              const res = await generateQr(modal.phoneData.id);
                              if (res?.data) {
                                setQrCode(res.data);
                              }
                            }}
                          >
                            Generate QR
                          </Button>

                          <Button
                            shape="circle"
                            icon={<ReloadOutlined />}
                            color="primary"
                            variant="outlined"
                            loading={getDetailPhone.isLoading}
                            onClick={async () => {
                              const { isSuccess, data } = await fetchDetailPhone(modal.phoneData.id);
                              if (isSuccess) {
                                setModal({ isOpen: true, phoneData: data });
                                fetchAllPhones();
                                setQrCode(null);
                              }
                            }}
                          />
                        </>
                      )}

                      {sessionStatus === 'WORKING' && (
                        <>
                          <Button shape="round" icon={<PauseOutlined />} variant="solid" loading={stopSession.isLoading} onClick={() => handleStopSession(modal.phoneData.id)}>
                            Stop
                          </Button>

                          <Button shape="round" icon={<LogoutOutlined />} color="danger" variant="solid" loading={logoutSession.isLoading} onClick={() => handleLogoutSession(modal.phoneData.id)}>
                            Logout
                          </Button>
                        </>
                      )}

                      {sessionStatus === 'STOPPED' && (
                        <>
                          <Button shape="round" icon={<PlayCircleOutlined />} color="green" variant="solid" loading={startSession.isLoading} onClick={() => handleStartSession(modal.phoneData.id)}>
                            Start
                          </Button>

                          <Button shape="round" icon={<LogoutOutlined />} color="danger" variant="solid" loading={logoutSession.isLoading} onClick={() => handleLogoutSession(modal.phoneData.id)}>
                            Logout
                          </Button>
                        </>
                      )}
                      <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        color="danger"
                        variant="outlined"
                        loading={deletePhone.isLoading}
                        onClick={async () => {
                          const { isSuccess, message } = await deletePhone.execute(modal.phoneData.id);
                          if (isSuccess) {
                            setModal({ isOpen: false, phoneData: null, profileData: null });
                            fetchAllPhones();
                            setQrCode(null);
                          } else {
                            error('Gagal', message);
                          }
                          return isSuccess;
                        }}
                      />
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-x-1 text-xs text-gray-500">
                    <WhatsAppOutlined className="text-green-500" />
                    {modal.phoneData?.number ?? '-'}
                  </span>

                  {modal.profileData && (
                    <>
                      <hr className="my-2 w-full" />
                      <div className="inline-flex items-center gap-x-1">
                        <span className="text-xs text-gray-500">Name :</span>
                        <span>{modal.profileData?.name}</span>
                        <Button
                          icon={<EditOutlined />}
                          color="primary"
                          type="text"
                          size="small"
                          onClick={() => {
                            crudModal.create({
                              title: `Tambah Nomor`,
                              formFields: [
                                {
                                  label: `Nama`,
                                  name: 'name',
                                  type: InputType.TEXT,
                                  rules: [
                                    {
                                      required: true,
                                      message: `Nama harus diisi`
                                    }
                                  ]
                                }
                              ],
                              onSubmit: async (values) => {
                                const { message, isSuccess } = await storeDisplayName.execute(values, modal.phoneData.id);
                                if (isSuccess) {
                                  success('Berhasil', message);
                                  fetchAllPhones();
                                  setModal({ isOpen: false, profileData: null, phoneData: null });
                                  setQrCode(null);
                                } else {
                                  error('Gagal', message);
                                }
                                return isSuccess;
                              }
                            });
                          }}
                        />
                      </div>
                      <div className="inline-flex items-center gap-x-1">
                        <span className="text-xs text-gray-500">Status :</span>
                        <span>{modal.profileData?.status}</span>
                        <Button
                          icon={<EditOutlined />}
                          color="primary"
                          type="text"
                          size="small"
                          onClick={() => {
                            crudModal.create({
                              title: `Tambah Nomor`,
                              formFields: [
                                {
                                  label: `Status`,
                                  name: 'status',
                                  type: InputType.TEXT,
                                  rules: [
                                    {
                                      required: true,
                                      message: `Status harus diisi`
                                    }
                                  ]
                                }
                              ],
                              onSubmit: async (values) => {
                                const { message, isSuccess } = await storeDisplayStatus.execute(values, modal.phoneData.id);
                                if (isSuccess) {
                                  success('Berhasil', message);
                                  fetchAllPhones();
                                  setModal({ isOpen: false, profileData: null, phoneData: null });
                                  setQrCode(null);
                                } else {
                                  error('Gagal', message);
                                }
                                return isSuccess;
                              }
                            });
                          }}
                        />
                      </div>
                      <hr className="my-2 w-full" />
                      <Button icon={<InboxOutlined />} shape="round" color="primary" size="large" variant="filled" onClick={() => navigate('/tenant/dashboard/inbox/' + modal.phoneData.id)}>
                        To Inbox
                      </Button>
                    </>
                  )}
                </div>

                {qrCode && (
                  <div className="flex w-full flex-col items-center gap-y-2">
                    <img src={qrCode} alt="QR Code" />
                    <span>Scan this QR code using WhatsApp to connect</span>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </Modal>
    </>
  );
};

export default Phones;
