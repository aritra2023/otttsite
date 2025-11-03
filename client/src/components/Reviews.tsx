import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    rating: 5,
    review: "Best platform for OTT subscriptions! Maine Amazon Prime aur Hotstar dono liye. Customer support bhi kaafi helpful hai. Will definitely buy again.",
    date: "1 month ago",
    verified: true
  },
  {
    name: "Amit Kumar",
    location: "Delhi",
    rating: 5,
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
    rating: 5,
    review: "Value for money! Official subscription se compare karo toh yaha pe 70% tak save ho jata hai. Service quality bhi top notch hai. No complaints at all! ⭐",
    date: "2 months ago",
    verified: true
  },
  {
    name: "Anjali Gupta",
    location: "Jaipur",
    rating: 5,
    review: "WhatsApp pe order kiya, within minutes activate ho gaya account. Very smooth process and the seller is very cooperative. Thank you so much! 💯",
    date: "1 month ago",
    verified: true
  }
];

export default function Reviews() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Card 
              key={index} 
              className="hover-elevate transition-all duration-300 border-2"
              data-testid={`card-review-${index}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-yellow-500"
                        data-testid={`icon-star-${index}-${i}`}
                      />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/20" />
                </div>

                <p className="text-sm md:text-base mb-4 leading-relaxed" data-testid={`text-review-${index}`}>
                  {review.review}
                </p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm" data-testid={`text-reviewer-name-${index}`}>
                        {review.name}
                      </p>
                      {review.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          ✓ Verified
                        </span>
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
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold">4.9</span>
              <span className="text-muted-foreground">/5</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Average rating from 2000+ customers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
