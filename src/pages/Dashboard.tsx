import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, X, Leaf, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    disease: string;
    confidence: number;
    description: string;
  } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate API analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setAnalysisResult({
      disease: "Leaf Spot Disease",
      confidence: 94,
      description:
        "Leaf spot is a common fungal disease that causes brown or black spots on leaves. Early detection and treatment with fungicides can help manage the disease and prevent spread to other plants.",
    });
    setIsAnalyzing(false);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          Plant Disease Detection
        </h1>
        <p className="text-muted-foreground">
          Upload an image of your plant to detect diseases using AI
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-soft"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Plant Image
          </h2>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`upload-zone flex flex-col items-center justify-center min-h-[300px] ${
              isDragging ? "upload-zone-active" : ""
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground font-medium mb-2">
                Drag & drop your image here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button variant="outline" size="sm" asChild>
                <span>Select Image</span>
              </Button>
            </label>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Supported formats: JPG, PNG, WebP • Max size: 10MB
          </p>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-soft"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Analysis Result
          </h2>

          {uploadedImage ? (
            <div className="space-y-6">
              {/* Uploaded Image Preview */}
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img
                  src={uploadedImage}
                  alt="Uploaded plant"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-3 right-3 p-2 bg-card rounded-lg shadow-soft hover:bg-accent transition-colors"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Analysis Result */}
              {isAnalyzing ? (
                <div className="bg-accent rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center animate-pulse">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-foreground font-medium">
                    Analyzing your plant...
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This may take a few seconds
                  </p>
                </div>
              ) : analysisResult ? (
                <div className="bg-accent rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {analysisResult.disease}
                        </h3>
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                          {analysisResult.confidence}% Match
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {analysisResult.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button className="flex-1">Save Result</Button>
                    <Button variant="outline" className="flex-1" onClick={clearImage}>
                      Analyze Another
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Upload an image to see the analysis results
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
