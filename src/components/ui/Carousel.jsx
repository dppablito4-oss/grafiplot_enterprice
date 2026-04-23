import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export function Carousel({ items }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div className="flex-[0_0_100%] min-w-0" key={index}>
              <div className="relative h-64 md:h-80 w-full bg-gray-100 dark:bg-gray-800">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-200">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button 
        variant="outline" 
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-white/20 hover:bg-white/40 border-0 text-white dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button 
        variant="outline" 
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-white/20 hover:bg-white/40 border-0 text-white dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md"
        onClick={scrollNext}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? 'bg-brand-yellow' : 'bg-white/50'}`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
