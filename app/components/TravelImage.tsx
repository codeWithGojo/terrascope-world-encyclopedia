"use client";

import Image from "next/image";
import {useEffect, useState} from "react";

type TravelImageProps = {
  query: string;
  country: string;
  alt: string;
  priority?: boolean;
};

type WikipediaImage = {source: string; width: number; height: number};

const imageCache = new Map<string, WikipediaImage | null>();

export function TravelImage({query, country, alt, priority = false}: TravelImageProps) {
  const cacheKey = `${query}|${country}`;
  const [image, setImage] = useState<WikipediaImage | null | undefined>(() => imageCache.get(cacheKey));

  useEffect(() => {
    if (imageCache.has(cacheKey)) return;
    const controller = new AbortController();
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: `${query} ${country}`,
      gsrlimit: "1",
      prop: "pageimages",
      piprop: "thumbnail",
      pithumbsize: "1200",
      format: "json",
      origin: "*",
    });

    fetch(`https://en.wikipedia.org/w/api.php?${params}`, {signal: controller.signal})
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Image lookup failed")))
      .then((payload) => {
        const page = Object.values(payload?.query?.pages ?? {})[0] as {thumbnail?: WikipediaImage} | undefined;
        const nextImage = page?.thumbnail ?? null;
        imageCache.set(cacheKey, nextImage);
        setImage(nextImage);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        imageCache.set(cacheKey, null);
        setImage(null);
      });

    return () => controller.abort();
  }, [cacheKey, country, query]);

  if (!image) {
    return <div className="travel-image-placeholder" aria-hidden="true"><span>{country.slice(0, 2).toUpperCase()}</span></div>;
  }

  return (
    <Image
      src={image.source}
      alt={alt}
      fill
      sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
      priority={priority}
      className="travel-image"
    />
  );
}
