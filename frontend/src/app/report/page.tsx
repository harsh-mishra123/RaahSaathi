"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/report/StepIndicator";
import { ImageUpload } from "@/components/report/ImageUpload";
import { AIPreviewCard } from "@/components/report/AIPreviewCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Step = "photo" | "details" | "location";

import { Camera, FileText, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapComponent } from "@/components/map/Map";
import { Textarea } from "@/components/ui/textarea";

const STEPS = [
  { id: "photo", title: "Photo", icon: <Camera /> },
  { id: "details", title: "Details", icon: <FileText /> },
  { id: "location", title: "Location", icon: <MapPin /> },
];

export default function ReportPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{ classification: string; severity: string } | null>(null);
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
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:8000/api/v1/classify", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("AI analysis failed");
        }

        const analysis = await response.json();
        setAiAnalysis(analysis);
        setFormData((prev) => ({
          ...prev,
          classification: analysis.classification,
          severity: analysis.severity,
        }));
      } catch (error) {
        console.error("Error during AI analysis:", error);
        // Fallback to mock data or show an error
        const mockAnalysis = {
          classification: "Broken Pavement",
          severity: "Moderate",
        };
        setAiAnalysis(mockAnalysis);
        setFormData((prev) => ({
          ...prev,
          classification: mockAnalysis.classification,
          severity: mockAnalysis.severity,
        }));
      }
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

  const handleLocationSelect = ({ lat, lng, address }: { lat: number; lng: number; address: string }) => {
    setFormData((prev) => ({ ...prev, lat, lng, location: address }));
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    console.log("Submitting report:", { ...formData, image });

    // In a real app, you would upload the image to a cloud storage like S3/Supabase storage
    // and get a URL. For now, we'll use a placeholder.
    const imageUrl = "https://images.unsplash.com/photo-1568605117036-5fe5e7185743?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const reportData = {
      description: formData.description,
      category: formData.classification,
      latitude: formData.lat,
      longitude: formData.lng,
      severity: formData.severity,
      image_url: imageUrl,
    };

    try {
      const response = await fetch("http://localhost:8000/api/v1/barriers/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit report");
      }

      alert("Report submitted successfully!");
      // Reset state and go back to start
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

    } catch (error) {
      console.error("Submission failed:", error);
      alert(`Submission failed: ${error.message}`);
    }
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
            {image && (
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
              <div className="h-64 w-full bg-muted rounded-lg overflow-hidden">
                <MapComponent onSelectBarrier={() => {}} onLocationSelect={handleLocationSelect} />
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
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-2">
                Submit Report
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
