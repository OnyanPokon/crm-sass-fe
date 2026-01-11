import useFileModal from './FileModal';
import useImageModal from './ImageModal';
import useTextModal from './TextModal';
import useVideoModal from './VideoModal';

const useCreateModal = () => {
  const textModal = useTextModal();
  const imageModal = useImageModal();
  const videoModal = useVideoModal();
  const fileModal = useFileModal();

  return {
    textModal,
    imageModal,
    videoModal,
    fileModal
  };
};

export default useCreateModal;
