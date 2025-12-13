import React, { useEffect, useState } from 'react';
import { Button, Card, Tabs, Typography } from 'antd';
import { closestCenter, DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCrudModal, useNotification, useService } from '@/hooks';
import { SubTemplatesService, TemplateMessagesService } from '@/services';
import { useNavigate, useParams } from 'react-router-dom';
import EditSubTemplateForm from './EditSubTemplateForm';
import Modul from '@/constants/Modul';
import { subTemplateFormFields } from './FormFields';
import { InputType } from '@/constants';
import { FileImageOutlined, FontSizeOutlined, VideoCameraOutlined } from '@ant-design/icons';

const DraggableTabNode = ({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props['data-node-key']
  });

  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'grab'
  };

  return React.cloneElement(children, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners
  });
};

const SubTemplates = () => {
  const { templateMessageId } = useParams();
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { execute: fetchDetailTemplateMessage, ...getDetailTemplateMessage } = useService(TemplateMessagesService.getDetailTemplateMessage);
  const { execute: fetchAllSubTemplate, ...getAllSubTemplate } = useService(SubTemplatesService.getAll);
  const updateTemplateMessage = useService(TemplateMessagesService.update);
  const storeSubTemplate = useService(SubTemplatesService.store);
  const deleteSubTemplate = useService(SubTemplatesService.delete);

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchDetailTemplateMessage(templateMessageId);
    fetchAllSubTemplate({
      templateMessageId: templateMessageId
    });
  }, [fetchAllSubTemplate, fetchDetailTemplateMessage, templateMessageId]);

  const detailTemplateMessage = React.useMemo(() => {
    return getDetailTemplateMessage.data ?? {};
  }, [getDetailTemplateMessage.data]);

  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (!getAllSubTemplate.data) return;

    let list = getAllSubTemplate.data.map((s, index) => ({
      key: s.id,
      label: String(index + 1),
      children: <EditSubTemplateForm data={s} fetch={() => fetchAllSubTemplate({ templateMessageId })} />
    }));

    const order = detailTemplateMessage?.konten;

    if (Array.isArray(order) && order.length > 0) {
      const ordered = [];
      order.forEach((id) => {
        const found = list.find((item) => item.key === id);
        if (found) ordered.push(found);
      });

      const remaining = list.filter((item) => !order.includes(item.key));
      list = [...ordered, ...remaining];
    }

    setItems(list);
  }, [getAllSubTemplate.data, detailTemplateMessage, fetchAllSubTemplate, templateMessageId]);

  useEffect(() => {
    if (items.length > 0) {
      if (!activeKey || !items.some((i) => i.key === activeKey)) {
        setActiveKey(items[0].key);
      }
    }
  }, [activeKey, items]);

  const createModal = (type) => {
    let fields = [...subTemplateFormFields()];
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
    modal.create({
      title: `Tambah ${Modul.SUB_TEMPLATE}`,
      formFields: fields,
      onSubmit: async (values) => {
        const payload = {
          ...values,
          tipe: type,
          id_template_message: templateMessageId
        };

        if (values.file) {
          payload.file = values.file.file;
        }
        const fileToSend = values.file ? values.file.file : null;

        const { message, isSuccess } = await storeSubTemplate.execute(payload, fileToSend);
        if (isSuccess) {
          success('Berhasil', message);
          fetchAllSubTemplate({ templateMessageId: templateMessageId });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }
  });

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.key === active.id);
        const newIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      modal.show.paragraph({
        data: {
          content: (
            <div className="mt-4 flex items-start justify-center gap-x-4">
              <Card
                className="h-full w-full"
                hoverable
                onClick={() => {
                  createModal('text');
                }}
              >
                <div className="flex h-full flex-col items-center justify-center gap-y-2">
                  <FontSizeOutlined className="mb-2 text-3xl" />
                  <span className="text-sm font-semibold">Teks</span>
                </div>
              </Card>
              <Card
                className="h-full w-full"
                hoverable
                onClick={() => {
                  createModal('image');
                }}
              >
                <div className="flex h-full flex-col items-center justify-center gap-y-2">
                  <FileImageOutlined className="mb-2 text-3xl" />
                  <span className="text-sm font-semibold">Gambar</span>
                </div>
              </Card>
              <Card
                className="h-full w-full"
                hoverable
                onClick={() => {
                  createModal('video');
                }}
              >
                <div className="flex h-full flex-col items-center justify-center gap-y-2">
                  <VideoCameraOutlined className="mb-2 text-3xl" />
                  <span className="text-sm font-semibold">Video</span>
                </div>
              </Card>
            </div>
          )
        }
      });
    }

    if (action === 'remove') {
      modal.delete.default({
        title: `Delete ${Modul.SUB_TEMPLATE}`,
        onSubmit: async () => {
          const { message, isSuccess } = await deleteSubTemplate.execute(targetKey);
          if (isSuccess) {
            success('Berhasil', message);
            fetchAllSubTemplate({
              templateMessageId: templateMessageId
            });
          } else {
            error('Gagal', message);
          }
          return isSuccess;
        }
      });
    }
  };

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <Card className="col-span-4 h-fit w-full">
        <Typography.Title level={5}>{detailTemplateMessage.nama}</Typography.Title>
        <hr className="my-4" />
        <div className="w-full">
          <Button
            color="primary"
            variant="solid"
            onClick={async () => {
              const ids = items.map((item) => item.key);
              const { message, isSuccess } = await updateTemplateMessage.execute(detailTemplateMessage.id, {
                ...detailTemplateMessage,
                konten: ids
              });

              if (isSuccess) {
                success('Berhasil', message);
                fetchAllSubTemplate({ templateMessageId: templateMessageId });
                navigate(-1);
              } else {
                error('Gagal', message);
              }

              return isSuccess;
            }}
          >
            Simpan
          </Button>
        </div>
      </Card>

      <Card className="col-span-8 h-fit w-full">
        <Tabs
          type="editable-card"
          items={items}
          activeKey={activeKey}
          onEdit={onEdit}
          onChange={setActiveKey}
          renderTabBar={(tabBarProps, DefaultTabBar) => (
            <DndContext sensors={[sensor]} onDragEnd={onDragEnd} collisionDetection={closestCenter}>
              <SortableContext items={items.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
                <DefaultTabBar {...tabBarProps}>
                  {(node) => (
                    <DraggableTabNode key={node.key} {...node.props} data-node-key={node.key}>
                      {node}
                    </DraggableTabNode>
                  )}
                </DefaultTabBar>
              </SortableContext>
            </DndContext>
          )}
        />
      </Card>
    </div>
  );
};

export default SubTemplates;
