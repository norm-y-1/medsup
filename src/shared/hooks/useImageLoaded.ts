import { useState, useEffect } from "react";

const useImageLoaded = (src: string | null | undefined = undefined) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [src])

  return isLoaded;
}

export default useImageLoaded;