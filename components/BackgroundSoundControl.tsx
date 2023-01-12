import React, { useEffect, useRef, useState } from 'react';

interface IBackgroundSoundControl {
  className?: string;
}

const BackgroundSoundControl: React.FC<IBackgroundSoundControl> = ({ className }) => {
  const audioRef: any = useRef();
  const [isPlaying, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
    }
  }, [!audioRef.current])

  const togglePlay = () => {
    if (!audioRef || !audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!isPlaying);
  }

  return (
    <>
      <audio key="background-audio" controls loop ref={audio => audioRef.current = audio} className="hidden">
        <source src="/sounds/background.mp3" />
      </audio>
      <div
        className={`btn-circle p-2 flex justify-center items-center cursor-pointer ${className || ''}`}
        onClick={togglePlay}
      >
        <div className="h-7 w-7">
          <i className={`fas fa-compact-disc text-[28px] leading-[28px] text-dark dark:text-light ${isPlaying ? "fa-spin " : ""}`} />
        </div>
      </div>
    </>
  )
}

export default BackgroundSoundControl;