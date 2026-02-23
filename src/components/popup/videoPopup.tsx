import { useSlideAnimation } from '@/hooks/useSlideAnimation';
import { pxToVw } from '@/utils';
import { Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface VideoPopupProps {
  videoSrc: string;
  isOpen: boolean;
  onClose: () => void;
}

const CONTROLS_HIDE_DELAY = 3000;

export default function VideoPopup({ videoSrc, isOpen, onClose }: VideoPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const { open, close } = useSlideAnimation(popupRef, onClose);

  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const resetControlsTimer = () => {
    setShowControls(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, CONTROLS_HIDE_DELAY);
  };

  const handleVideoDimmTab = () => {
    if (!isPlaying) {
      setShowControls(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    resetControlsTimer();
  };

  const handlePopupClose = () => {
    close();
    setShowControls(false);

    const video = videoRef.current;
    if (!video) return;
    video.pause();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleVideoEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnded);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, []);

  // video mute
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
  }, [isMuted]);

  // video open
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      setShowControls(false);
      video.play();
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isOpen) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-screen overflow-hidden">
      <div ref={popupRef} className="absolute left-1/2 top-1/2 z-[999] h-full w-full -translate-x-1/2 -translate-y-1/2 bg-black">
        <div className="relative w-full h-full aspect-video">
          <video ref={videoRef} className="w-full h-full" autoPlay>
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 cursor-pointer" onClick={resetControlsTimer} />
          {showControls && (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowControls(false);
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/30" onClick={handleVideoDimmTab}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying((prev) => !prev);
                    resetControlsTimer();
                  }}
                  className="h-[3.75vw] w-[3.75vw]"
                >
                  {isPlaying ? (
                    <img src="./images/Icon_Pause.png" style={{ width: `${pxToVw(72)}vw`, height: `${pxToVw(72)}vw` }} />
                  ) : (
                    <img src="./images/Icon_Play.png" style={{ width: `${pxToVw(72)}vw`, height: `${pxToVw(72)}vw` }} />
                  )}
                </button>
              </div>

              <div className="absolute bottom-[2.08vw] left-1/2 flex w-[75vw] -translate-x-1/2 items-center gap-[1.25vw]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted((prev) => !prev);
                  }}
                  className="flex h-[2.91vw] w-[2.91vw] items-center justify-center text-white"
                >
                  {isMuted ? <VolumeX className="h-[1.45vw] w-[1.45vw]" /> : <Volume2 className="h-[1.45vw] w-[1.45vw]" />}
                </button>

                <span className="min-w-[2vw] font-samsung-one text-[0.93vw] font-bold text-white">{formatTime(currentTime)}</span>

                <div className="relative h-[0.42vw] flex-1 cursor-pointer rounded-full bg-white/50">
                  <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>

                <span className="min-w-[2vw] font-samsung-one text-[0.93vw] font-bold text-white">{formatTime(duration)}</span>
              </div>

              <button
                className="shadow-m absolute right-[2.5vw] top-[2.5vw] z-[9999] flex h-[4.06vw] w-[4.06vw] items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-[1.04vw]"
                onClick={handlePopupClose}
              >
                <X className="h-[1.77vw] w-[1.77vw] text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
