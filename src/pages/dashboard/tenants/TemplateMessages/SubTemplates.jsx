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
import { FileImageOutlined, FileOutlined, FontSizeOutlined, PlusOutlined, SaveOutlined, VideoCameraOutlined } from '@ant-design/icons';
import useCreateModal from './Modals/UseCreateModal';

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
  const deleteSubTemplate = useService(SubTemplatesService.delete);

  const { imageModal, textModal, videoModal, fileModal } = useCreateModal();

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

  const addModal = () => {
    modal.show.paragraph({
      data: {
        content: (
          <div className="mt-4 flex items-start justify-center gap-x-4">
            <Card
              className="h-full w-full"
              hoverable
              onClick={() =>
                textModal.open({
                  fetchAllSubTemplate,
                  templateMessageId
                })
              }
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <FontSizeOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Teks</span>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() =>
                imageModal.open({
                  fetchAllSubTemplate,
                  templateMessageId
                })
              }
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <FileImageOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Gambar</span>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() =>
                videoModal.open({
                  fetchAllSubTemplate,
                  templateMessageId
                })
              }
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <VideoCameraOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Video</span>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() =>
                fileModal.open({
                  fetchAllSubTemplate,
                  templateMessageId
                })
              }
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <FileOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">File</span>
              </div>
            </Card>
          </div>
        )
      }
    });
  };

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      addModal();
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
      <Card className="col-span-12 w-full">
        <div className="col-span-12 inline-flex w-full items-center justify-between px-2">
          <div>
            <Typography.Title style={{ margin: 0 }} level={4}>
              Sub Template Message
            </Typography.Title>
            <span>Kelola Sub Template Message</span>
          </div>
          <div className="inline-flex items-center gap-x-2">
            <Button
              icon={<PlusOutlined />}
              shape="round"
              color="primary"
              variant="outlined"
              onClick={() => {
                addModal();
              }}
            >
              Tambah
            </Button>
            <Button
              icon={<SaveOutlined />}
              shape="round"
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
        </div>
      </Card>

      <Card className="col-span-12 w-full">
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
