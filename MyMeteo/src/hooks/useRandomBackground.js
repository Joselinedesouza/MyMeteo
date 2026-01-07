import { useEffect, useState } from "react";

export function useRandomBackground(images) {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomIndex];

    const img = new Image();
    img.onload = () => {
      setBackgroundImage(imageUrl);
      setIsLoaded(true);
    };
    img.src = imageUrl;
  }, [images]);

  return { backgroundImage, isLoaded };
}
