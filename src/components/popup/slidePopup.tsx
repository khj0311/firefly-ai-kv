import { ContentsProps } from '@/data/contents';
import { useSlideAnimation } from '@/hooks/useSlideAnimation';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { pxToVw } from '@/utils';

interface SlidePopupProps {
  data: ContentsProps;
  isOpen: boolean;
  onClose: () => void;
  imageId: number;
}

function Pagination({
  images,
  selectedImageId,
  onChange,
}: {
  images: { id: number; src: string }[];
  selectedImageId: number;
  onChange: (id: number) => void;
}) {
  return (
    <>
      {images.map((image) => (
        <button
          key={image.id}
          className={selectedImageId === image.id ? 'opacity-100' : 'opacity-40'}
          onClick={() => onChange(image.id)}
          style={{ width: `${pxToVw(154)}vw`, height: `${pxToVw(120)}vw` }}
        >
          <img src={`${image.src}_thumbnail.jpg`} alt="" className="slide-pagination-img" />
        </button>
      ))}
    </>
  );
}

export default function SlidePopup({ data, isOpen, onClose, imageId }: SlidePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLImageElement>(null);
  const [selectedImageId, setSelectedImageId] = useState(imageId);
  const { open, close } = useSlideAnimation(popupRef, onClose);

  const uniqueImages = data.images.filter((image) => !image.isDuplicate);
  const reorderedImages = useMemo(() => {
    const clickedImage = uniqueImages.find((img) => img.id === imageId);
    if (!clickedImage) return uniqueImages;

    const otherImages = uniqueImages.filter((img) => img.id !== imageId);
    return [clickedImage, ...otherImages];
  }, [imageId, uniqueImages]);

  const handlePageChange = (id: number) => {
    if (id === selectedImageId || !contentRef.current) return;

    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        setSelectedImageId(id);
        gsap.to(contentRef.current, {
          opacity: 1,
          duration: 0.2,
          ease: 'power2.inOut',
        });
      },
    });
  };

  useEffect(() => {
    if (isOpen) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const image = reorderedImages.find((img) => img.id === selectedImageId);
  const isRowLayout = data.layoutDir === 'row';

  return (
    <div className="absolute top-0 left-0 w-screen h-screen overflow-hidden">
      <div
        ref={popupRef}
        className={`absolute left-1/2 top-1/2 z-[9998] h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[#eee] ${
          isRowLayout ? 'pl-[8.3vw] pr-[1.25vw] pt-[6.25vw]' : 'pb-[8.854vw] pl-[7.81vw] pr-[5.73vw] pt-[5.73vw]'
        }`}
      >
        <div className="flex justify-between w-full h-auto">
          <div
            className="absolute z-[2000] text-[#989898]"
            style={{ fontSize: `${pxToVw(16)}vw`, bottom: `${pxToVw(22)}vw`, left: `${pxToVw(24)}vw` }}
          >
            본 영상 및 시연은 내부 쇼케이스용으로, 상업적 활용 목적이 아닙니다.
          </div>
          {isRowLayout ? (
            <>
              <div className="w-[75vw] space-y-[2.08vw]">
                <img ref={contentRef} src={`${image && image.src}.jpg`} alt="" className="slide-img" />
                <div className="slide-text-box">
                  <h2 className="slide-title">{data.title}</h2>
                  <p className="slide-desc">{data.description}</p>
                </div>
              </div>

              <div className="slide-pagination-box w-[8.02vw] flex-col">
                <Pagination images={reorderedImages} selectedImageId={selectedImageId} onChange={handlePageChange} />
              </div>
            </>
          ) : (
            <>
              <img ref={contentRef} src={`${image && image.src}.jpg`} alt="" className="slide-img w-[55.2vw]" />

              <div className="flex w-[28.125vw] flex-col">
                <div className="slide-text-box">
                  <h2 className="slide-title">{data.title}</h2>
                  <p className="slide-desc">{data.description}</p>
                </div>

                <div className="slide-pagination-box mt-auto flex w-[26.56vw]">
                  <Pagination images={reorderedImages} selectedImageId={selectedImageId} onChange={handlePageChange} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        className="shadow-m absolute bottom-[2.08vw] left-1/2 z-[9999] flex h-[4.06vw] w-[4.06vw] -translate-x-1/2 items-center justify-center rounded-full bg-[#808080] backdrop-blur-[1.04vw]"
        onClick={close}
      >
        <ChevronDown className="h-[1.77vw] w-[1.77vw] text-white" />
      </button>
    </div>
  );
}
