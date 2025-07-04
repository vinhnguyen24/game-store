"use client";

import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "keen-slider/keen-slider.min.css";

type Props = {
  images: string[];
};

export default function AccountCarousel({ images }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    loop: true,
  });

  return (
    <div className="relative w-full">
      {/* Main Image Carousel */}
      <div
        ref={sliderRef}
        className="keen-slider h-[300px] rounded-lg overflow-hidden"
      >
        {images?.map((src, idx) => (
          <div key={idx} className="keen-slider__slide relative">
            <Image
              src={src}
              alt={`Slide ${idx}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Next Button */}
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Thumbnails */}
      <div className="mt-4 flex overflow-x-auto gap-2">
        {images.map((src, idx) => (
          <div
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`relative w-20 h-14 flex-shrink-0 cursor-pointer border-2 ${
              idx === currentSlide ? "border-blue-500" : "border-transparent"
            } rounded-md overflow-hidden`}
          >
            <Image
              src={src}
              alt={`Thumb ${idx}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
