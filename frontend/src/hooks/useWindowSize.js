import { useEffect, useState } from "react";

const useWindowSize = () => {
  const determineAvatarSize = (width) => (width <= 640 ? 'sm' : 'md');
  const determineTextSize = (width) => {
    const ratio = width / (1920 / 20);
    return ratio > 20 ? 20 : ratio;
  };

  const [avatarSize, setAvatarSize] = useState(determineAvatarSize(window.innerWidth));
  const [responsiveTextSize, setResponsiveTextSize] = useState(determineTextSize(window.innerWidth));

  useEffect(() => {
    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        setAvatarSize(determineAvatarSize(width));
        setResponsiveTextSize(determineTextSize(width));
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { avatarSize, responsiveTextSize };
};

export default useWindowSize;