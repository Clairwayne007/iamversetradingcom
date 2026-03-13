import { Star, ThumbsUp, CheckCircle, Shield } from "lucide-react";
import { useState } from "react";

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  likes: number;
  adminResponse: {
    message: string;
    date: string;
  };
}

const reviews: Review[] = [
  {
    id: "1",
    author: "Clair Wayne",
    date: "03/13/2026",
    rating: 5,
    title: "Trusted platform with immediate withdrawal",
    content:
      "I decided to invest with Iamverse and tried Bitcoin Elite Group in order to earn profit. My investment in the Business plan expired yesterday, and this morning I requested a withdrawal of 50,000 Usdt. The withdrawal was processed immediately and sent straight to my Kraken account without even needing to contact support. This has really increased my confidence in continuing to work with them.\n\nBravo à l'équipe 👏",
    verified: true,
    likes: 24,
    adminResponse: {
      message:
        "Thank you so much for your kind words, Clair! We're thrilled to hear that your withdrawal was processed seamlessly. Our team works around the clock to ensure every transaction is handled swiftly and securely. We truly appreciate your trust in IAMVERSE and we promise to keep delivering the best experience possible. Looking forward to many more successful investments together! 🚀",
      date: "03/13/2026",
    },
  },
  {
    id: "2",
    author: "Aleksander",
    date: "01/03/2026",
    rating: 5,
    title: "I love the level of transparency on their website…",
    content:
      "I love the level of transparency on their website operations, both deposit and withdrawal lists. No hidden charges, or withdrawal fees here. All operations/transactions goes exactly as they stated.",
    verified: true,
    likes: 18,
    adminResponse: {
      message:
        "We really appreciate your feedback, Aleksander! Transparency is at the core of everything we do at IAMVERSE. We believe our investors deserve complete clarity on every transaction. We'll continue to uphold these standards and strive to make your experience even better. Thank you for being part of our community! 💪",
      date: "01/04/2026",
    },
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground/30"
        }`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likes);

  const handleLike = () => {
    if (!liked) {
      setLikeCount((c) => c + 1);
      setLiked(true);
    } else {
      setLikeCount((c) => c - 1);
      setLiked(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {review.author}
            </span>
            {review.verified && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                <CheckCircle className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
        <StarRating rating={review.rating} />
      </div>

      {/* Content */}
      <div>
        <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {review.content}
        </p>
      </div>

      {/* Like button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-1.5 text-sm transition-colors ${
          liked
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ThumbsUp className={`h-4 w-4 ${liked ? "fill-primary" : ""}`} />
        <span>Helpful ({likeCount})</span>
      </button>

      {/* Admin response */}
      {review.adminResponse && (
        <div className="ml-4 pl-4 border-l-2 border-primary/30 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              IAMVERSE Team
            </span>
            <span className="text-xs text-muted-foreground">
              {review.adminResponse.date}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.adminResponse.message}
          </p>
        </div>
      )}
    </div>
  );
};

export const Reviews = () => {
  return (
    <section id="reviews" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Investors Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real reviews from verified members of the IAMVERSE community.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <StarRating rating={5} />
            <span className="text-sm text-muted-foreground font-medium">
              4.9 / 5 based on 1,200+ reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};
