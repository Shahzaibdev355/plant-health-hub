import { useState } from "react";
import { Images, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SavedImage {
  id: string;
  imageUrl: string;
  disease: string;
  confidence: number;
  date: string;
}

// Placeholder saved images data
const placeholderImages: SavedImage[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    disease: "Leaf Spot Disease",
    confidence: 94,
    date: "2024-01-15",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
    disease: "Powdery Mildew",
    confidence: 89,
    date: "2024-01-14",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    disease: "Bacterial Blight",
    confidence: 91,
    date: "2024-01-12",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400",
    disease: "Healthy Plant",
    confidence: 97,
    date: "2024-01-10",
  },
];

const SavedImages = () => {
  const [images, setImages] = useState<SavedImage[]>(placeholderImages);

  const deleteImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 flex items-center gap-3">
          <Images className="w-8 h-8 text-primary" />
          Saved Images
        </h1>
        <p className="text-muted-foreground">
          View your previously analyzed plant images
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border overflow-hidden shadow-soft group"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.disease}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteImage(image.id)}
                  className="absolute top-2 right-2 bg-card/90 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">
                    {image.disease}
                  </h3>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {image.confidence}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(image.date)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-2xl border border-border p-12 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-6 flex items-center justify-center">
            <Images className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No Saved Images
          </h2>
          <p className="text-muted-foreground mb-6">
            Your analyzed plant images will appear here once you start uploading
            and saving them.
          </p>
          <Button asChild>
            <a href="/dashboard">Analyze Your First Plant</a>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default SavedImages;
