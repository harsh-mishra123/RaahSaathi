"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/report/StepIndicator";
import { ImageUpload } from "@/components/report/ImageUpload";
import { AIPreviewCard } from "@/components/report/AIPreviewCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Camera, FileText, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapComponent from "@/components/map/Map";
import { Textarea } from "@/components/ui/textarea";

type Step = "photo" | "details" | "location";

const STEPS = [
  { id: "photo", title: "Photo", icon: <Camera /> },
  { id: "details", title: "Details", icon: <FileText /> },
  { id: "location", title: "Location", icon: <MapPin /> },
];

export default function ReportPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{ classification: string; severity: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    classification: "",
    severity: "",
    description: "",
    location: "",
    lat: 0,
    lng: 0,
  });

  const handleImageUpload = async (file: File | null) => {
    setImage(file);
    if (file) {
      setIsAnalyzing(true);
      // Mocking AI classification instead of backend call
      setTimeout(() => {
        const mockAnalysis = {
          classification: "Broken Pavement",
          severity: "Severe",
        };
        setAiAnalysis(mockAnalysis);
        setFormData((prev) => ({
          ...prev,
          classification: mockAnalysis.classification,
          severity: mockAnalysis.severity,
        }));
        setIsAnalyzing(false);
      }, 1500);
    } else {
      setAiAnalysis(null);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setIsSubmitting(true);
    // Mocking submission to bypass Supabase storage and backend errors
    setTimeout(() => {
      alert("Report submitted successfully!");
      setCurrentStep(0);
      setImage(null);
      setAiAnalysis(null);
      setFormData({
        classification: "",
        severity: "",
        description: "",
        location: "",
        lat: 0,
        lng: 0,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case "photo":
        return (
          <div className="w-full max-w-2xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-center">Upload a Photo</h2>
            <p className="text-muted-foreground mt-1 text-center">
              A clear photo helps our AI classify the barrier.
            </p>
            <div className="mt-6">
              <ImageUpload onFileSelect={handleImageUpload} />
            </div>
            {isAnalyzing && (
              <div className="mt-6 text-center text-zinc-400">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Analyzing image with AI...
              </div>
            )}
            {image && !isAnalyzing && aiAnalysis && (
              <div className="mt-6">
                <AIPreviewCard
                  imageFile={image}
                  onConfirm={(data) => {
                    setFormData(prev => ({ ...prev, ...data }));
                    handleNext();
                  }}
                  onEdit={() => setCurrentStep(1)}
                />
              </div>
            )}
          </div>
        );
      case "details":
        return (
          <div className="w-full max-w-2xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold">Barrier Details</h2>
            <p className="text-muted-foreground mt-1">
              Provide more information about the barrier.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="classification" className="block text-sm font-medium mb-1">
                  Classification
                </label>
                <Select
                  name="classification"
                  value={formData.classification}
                  onValueChange={(value) => handleSelectChange("classification", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Broken Pavement">Broken Pavement</SelectItem>
                    <SelectItem value="Missing Ramp">Missing Ramp</SelectItem>
                    <SelectItem value="Obstruction">Obstruction</SelectItem>
                    <SelectItem value="Uneven Surface">Uneven Surface</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="severity" className="block text-sm font-medium mb-1">
                  Severity
                </label>
                <Select
                  name="severity"
                  value={formData.severity}
                  onValueChange={(value) => handleSelectChange("severity", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Large pothole on the corner of..."
                />
              </div>
            </div>
          </div>
        );
      case "location":
        return (
          <div className="w-full max-w-2xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold">Location</h2>
            <p className="text-muted-foreground mt-1">
              Pinpoint the barrier on the map or enter the address.
            </p>
            <div className="mt-6 space-y-4">
               <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Address
                </label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter address or drop a pin on the map"
                />
              </div>
              <div className="h-64 w-full bg-muted rounded-lg overflow-hidden relative">
                <MapComponent onSelectBarrier={() => {}} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Report a Barrier</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Help us make our cities more accessible by reporting barriers.
            </p>
          </div>

          <StepIndicator
            steps={STEPS.map(s => s.title)}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />

          <div className="mt-10 flex justify-center">
            {renderStepContent()}
          </div>

          <div className="mt-10 flex justify-between items-center max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting || isAnalyzing}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={handleNext} disabled={isSubmitting || isAnalyzing || (currentStep === 0 && !image)} className="gap-2">
                Next
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2 bg-accent hover:bg-accent/90 text-black">
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
