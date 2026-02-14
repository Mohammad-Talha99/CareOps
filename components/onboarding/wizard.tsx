"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepWorkspace } from "./steps/StepWorkspace";
import { StepChannels } from "./steps/StepChannels";
import { StepForms } from "./steps/StepForms";
import { StepBookings } from "./steps/StepBookings";
import { StepPostBooking } from "./steps/StepPostBooking";
import { StepResources } from "./steps/StepResources";
import { StepStaff } from "./steps/StepStaff";
import { StepActivation } from "./steps/StepActivation";

const steps = [
    { id: 1, title: "Workspace" },
    { id: 2, title: "Channels" },
    { id: 3, title: "Forms" },
    { id: 4, title: "Bookings" },
    { id: 5, title: "Post-Booking" },
    { id: 6, title: "Resources" },
    { id: 7, title: "Staff" },
    { id: 8, title: "Activation" },
];

export function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        channels: [],
        formFields: [],
        serviceName: "",
        duration: "",
        price: "",
        sendConfirmation: false,
        askFeedback: false,
        trackInventory: false,
        lowStockThreshold: "",
    });

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const StepComponent = [
        StepWorkspace,
        StepChannels,
        StepForms,
        StepBookings,
        StepPostBooking,
        StepResources,
        StepStaff,
        StepActivation
    ][currentStep - 1];

    return (
        <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
            {/* Progress Bar */}
            <div className="h-2 bg-muted w-full">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
            </div>

            <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Step {currentStep} of {steps.length}</span>
                <span className="text-sm font-bold">{steps[currentStep - 1].title}</span>
            </div>

            <div className="p-8 flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full"
                    >
                        <StepComponent
                            formData={formData}
                            setFormData={setFormData}
                            nextStep={nextStep}
                            prevStep={prevStep}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
