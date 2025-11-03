import { useEffect, useCallback } from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";

const reviews = [
  {
    name: "Rahul Sharma",
    location: "Mumbai",
    rating: 5,
    review: "Bhai ekdum mast service hai! Netflix premium liya tha, instantly activate ho gaya. Price bhi bahut reasonable hai compared to official. Highly recommended! 🔥",
    date: "2 weeks ago",
    verified: true
  },
  {
    name: "Priya Patel",
    location: "Ahmedabad",
    rating: 4.5,
    review: "Best platform for OTT subscriptions! Maine Amazon Prime aur Hotstar dono liye. Customer support bhi kaafi helpful hai. Will definitely buy again.",
    date: "1 month ago",
    verified: true
  },
  {
    name: "Amit Kumar",
    location: "Delhi",
    rating: 4,
    review: "Initially I was skeptical but after purchasing I'm completely satisfied. Got Spotify Premium family plan at such amazing price. Totally genuine service! 👍",
    date: "3 weeks ago",
    verified: true
  },
  {
    name: "Sneha Reddy",
    location: "Bangalore",
    rating: 5,
    review: "Mere friends se suna tha about this service. Maine bhi try kiya and I must say it's amazing! YouTube Premium + Netflix combo liya, working perfectly for 6 months now.",
    date: "1 week ago",
    verified: true
  },
  {
    name: "Vikram Singh",
    location: "Pune",
    rating: 4.5,
    review: "Value for money! Official subscription se compare karo toh yaha pe 70% tak save ho jata hai. Service quality bhi top notch hai. No complaints at all! ⭐",
    date: "2 months ago",
    verified: true
  },
  {
    name: "Anjali Gupta",
    location: "Jaipur",
    rating: 4,
    review: "WhatsApp pe order kiya, within minutes activate ho gaya account. Very smooth process and the seller is very cooperative. Thank you so much! 💯",
    date: "1 month ago",
    verified: true
  }
];

function ReviewStars({ rating }: { rating: number }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className="h-4 w-4 text-yellow-500 fill-yellow-500"
      />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative h-4 w-4">
        <Star className="h-4 w-4 text-yellow-500 absolute" />
        <div className="overflow-hidden absolute w-1/2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        </div>
      </div>
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        className="h-4 w-4 text-yellow-500"
      />
    );
  }

  return <>{stars}</>;
}

export default function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    slidesToScroll: 1
  });

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      scrollNext();
    }, 3000);

    return () => clearInterval(autoplay);
  }, [emblaApi, scrollNext]);

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary">2000+ Happy Customers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real reviews from real customers who are enjoying premium entertainment at unbeatable prices
          </p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {reviews.map((review, index) => (
              <div 
                key={index}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
              >
                <Card 
                  className="hover-elevate transition-all duration-300 border-2 h-full"
                  data-testid={`card-review-${index}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-0.5">
                        <ReviewStars rating={review.rating} />
                      </div>
                      <Quote className="h-8 w-8 text-primary/20" />
                    </div>

                    <p className="text-sm md:text-base mb-4 leading-relaxed" data-testid={`text-review-${index}`}>
                      {review.review}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm" data-testid={`text-reviewer-name-${index}`}>
                            {review.name}
                          </p>
                          {review.verified && (
                            <CheckCircle2 
                              className="h-4 w-4 text-white fill-blue-500" 
                              data-testid={`icon-verified-${index}`}
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground" data-testid={`text-reviewer-location-${index}`}>
                          {review.location}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {review.date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
