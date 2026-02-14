import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const FORM_FIELDS = ["Full Name", "Email Address", "Phone Number", "Service Type", "Budget", "Timeline"];

export function StepForms({ formData, setFormData, nextStep, prevStep }: any) {
    const toggleField = (field: string) => {
        const current = formData.formFields || [];
        if (current.includes(field)) {
            setFormData({ ...formData, formFields: current.filter((f: string) => f !== field) });
        } else {
            setFormData({ ...formData, formFields: [...current, field] });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Customize Intake Form</h2>
            <p className="text-muted-foreground text-sm">Select fields to include in your customer contact form.</p>

            <div className="grid grid-cols-2 gap-3">
                {FORM_FIELDS.map((field) => (
                    <div
                        key={field}
                        onClick={() => toggleField(field)}
                        className={`p-3 border rounded px-4 py-3 cursor-pointer text-sm flex justify-between items-center ${formData.formFields?.includes(field) ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                    >
                        {field}
                        {formData.formFields?.includes(field) && <Check className="w-4 h-4" />}
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Continue</Button>
            </div>
        </div>
    )
}
