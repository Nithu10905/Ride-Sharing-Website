
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    text: "More than 400€ paid into my account thanks to RideShare, even though I've only been using it for a few months... There's no denying how good their app is!",
    name: "Daniel",
    avatar: "🧑‍💼"
  },
  {
    id: 2,
    text: "RideShare has completely transformed my daily commute. I've met amazing people and saved so much money. Highly recommended!",
    name: "Sarah",
    avatar: "👩‍💻"
  },
  {
    id: 3,
    text: "As a driver, I love how easy it is to publish rides and connect with passengers. The app is user-friendly and reliable.",
    name: "Michael",
    avatar: "👨‍🚗"
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-teal-700 text-white py-16">
      <div className="container px-4 md:px-6">
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevTestimonial}
              className="text-white hover:bg-white/10 absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="flex-1 px-16">
              <div className="text-center">
                <div className="flex justify-center items-center mb-6">
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-2xl">{testimonials[currentIndex].avatar}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                  "{testimonials[currentIndex].text}"
                </blockquote>
                
                <cite className="text-lg font-semibold">
                  {testimonials[currentIndex].name}
                </cite>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextTestimonial}
              className="text-white hover:bg-white/10 absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
