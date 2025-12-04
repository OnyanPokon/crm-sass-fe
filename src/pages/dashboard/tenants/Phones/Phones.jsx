import { useNotification, useService } from '@/hooks';
import { PhonesService } from '@/services';
import { CheckOutlined, ClockCircleOutlined, LogoutOutlined, PauseOutlined, PlayCircleOutlined, QrcodeOutlined, WarningFilled, WhatsAppOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Modal, Spin, Typography } from 'antd';
import React from 'react';

const Phones = () => {
  const { error, success } = useNotification();
  const { execute, ...getAllPhones } = useService(PhonesService.getAll);
  const { execute: fetchDetailPhone, ...getDetailPhone } = useService(PhonesService.getDetail);
  const { execute: generateQr, ...getAllGenerateQr } = useService(PhonesService.generateQr);
  const startSession = useService(PhonesService.startSession);
  const stopSession = useService(PhonesService.stopSession);
  const logoutSession = useService(PhonesService.logoutSession);
  const [modal, setModal] = React.useState({ isOpen: false, data: null });
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
      setModal({ isOpen: false, data: null });
    } else {
      error('Gagal', message);
    }

    return isSuccess;
  };

  const handleStopSession = async (id) => {
    const { isSuccess, message } = await stopSession.execute(id);
    if (isSuccess) {
      success('Berhasil', message);
      setModal({ isOpen: false, data: null });
    } else {
      error('Gagal', message);
    }

    return isSuccess;
  };

  const handleLogoutSession = async (id) => {
    const { isSuccess, message } = await logoutSession.execute(id);
    if (isSuccess) {
      success('Berhasil', message);
      setModal({ isOpen: false, data: null });
    } else {
      error('Gagal', message);
    }

    return isSuccess;
  };

  return (
    <>
      <div className="grid w-full grid-cols-12 gap-4">
        <div className="col-span-12 mb-4 w-full px-2">
          <Typography.Title style={{ margin: 0 }} level={4}>
            Phones
          </Typography.Title>
          <span>Daftar nomor telephone</span>
        </div>
        {phones.map((item) => (
          <Card
            key={item.id}
            hoverable
            className="col-span-3"
            onClick={async () => {
              const { isSuccess, data, message } = await fetchDetailPhone(item.id);
              if (isSuccess) {
                setModal({ isOpen: true, data: data });
              } else {
                error(message);
              }
              return isSuccess;
            }}
          >
            <div className="inline-flex items-center gap-x-4">
              <Badge count={<WhatsAppOutlined className="text-green-500" />}>
                <Avatar size={48} />
              </Badge>
              <div className="flex flex-col">
                <b className="inline-flex items-center gap-x-2">
                  {item.name}
                  {getDetailPhone.isLoading && <Spin size="small" />}
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
          setModal({ isOpen: false, data: null });
          setQrCode(null);
        }}
        footer={null}
        destroyOnClose
      >
        <div className="w-full">
          <div className="relative h-24 w-full rounded-lg bg-blue-500">
            <Avatar size={86} className="absolute -bottom-6 left-4" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{ backgroundColor: '#fff' }} />
          </div>

          <div className="mb-4 mt-8 flex flex-col gap-y-1 px-4">
            <div className="inline-flex items-center justify-between">
              <div className="inline-flex items-center gap-x-2">
                <span className="text-lg font-semibold">{modal.data?.name}</span>

                {modal.data?.session?.status === 'STOPPED' && (
                  <div className="inline-flex items-center gap-x-1 rounded-full bg-gray-500 px-1.5 py-0.5 text-xs text-white">
                    <PauseOutlined className="text-xs" />
                    <span className="text-xs">Stopped</span>
                  </div>
                )}

                {(modal.data?.session?.status === 'WORKING' || modal.data?.session?.status === 'STARTING') && (
                  <div className="inline-flex items-center gap-x-1 rounded-full bg-green-500 px-1.5 py-0.5 text-xs text-white">
                    <CheckOutlined className="text-xs" />
                    <span className="text-xs">Signed</span>
                  </div>
                )}

                {modal.data?.session?.status === 'SCAN_QR_CODE' && (
                  <div className="inline-flex items-center gap-x-1 rounded-full bg-yellow-500 px-1.5 py-0.5 text-xs text-white">
                    <ClockCircleOutlined className="text-xs" />
                    <span className="text-xs">Waiting</span>
                  </div>
                )}

                {modal.data?.session?.status === 'FAILED' && (
                  <div className="inline-flex items-center gap-x-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                    <WarningFilled className="text-xs" />
                    <span className="text-xs">Failed</span>
                  </div>
                )}
              </div>

              {modal.data?.session?.status === 'SCAN_QR_CODE' && (
                <Button
                  shape="round"
                  icon={<QrcodeOutlined />}
                  color="primary"
                  variant="solid"
                  loading={getAllGenerateQr.isLoading}
                  onClick={async () => {
                    const res = await generateQr(modal.data.id);
                    if (res?.data) {
                      setQrCode(res.data);
                      setModal((prev) => ({ ...prev }));
                    }
                  }}
                >
                  Generate QR
                </Button>
              )}

              {(modal.data?.session?.status === 'WORKING' || modal.data?.session?.status === 'STARTING') && (
                <div className="inline-flex items-center gap-x-2">
                  <Button shape="round" icon={<PauseOutlined />} variant="solid" loading={stopSession.isLoading} onClick={() => handleStopSession(modal.data.id)}>
                    Stop
                  </Button>
                  <Button shape="round" icon={<LogoutOutlined />} color="danger" variant="solid" loading={logoutSession.isLoading} onClick={() => handleLogoutSession(modal.data.id)}>
                    Logout
                  </Button>
                </div>
              )}

              {modal.data?.session?.status === 'STOPPED' && (
                <div className="inline-flex items-center gap-x-2">
                  <Button shape="round" icon={<PlayCircleOutlined />} color="green" variant="solid" loading={startSession.isLoading} onClick={() => handleStartSession(modal.data.id)}>
                    Start
                  </Button>
                  <Button shape="round" icon={<LogoutOutlined />} color="danger" variant="solid" loading={logoutSession.isLoading} onClick={() => handleLogoutSession(modal.data.id)}>
                    Logout
                  </Button>
                </div>
              )}
            </div>

            <span className="inline-flex items-center gap-x-1 text-xs text-gray-500">
              <WhatsAppOutlined className="text-green-500" />
              {modal.data?.number ?? '-'}
            </span>
          </div>
          {qrCode && (
            <div className="flex w-full flex-col items-center gap-y-2">
              <img src={qrCode} alt="QR Code" />
              <span>Scan this QR code using WhatsApp to connect</span>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Phones;
