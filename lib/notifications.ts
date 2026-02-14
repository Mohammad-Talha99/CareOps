/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type NotificationType = "EMAIL" | "SMS" | "ALERT";

interface SendOptions {
    type: NotificationType;
    content: string;
    to?: string; // Email or Phone
    businessId: string;
    leadId?: string;
    bookingId?: string;
    sender?: "SYSTEM" | "USER";
}

export class NotificationService {

    /**
     * Send a notification via the appropriate provider (Mocked for now)
     * Wraps logic in try/catch to ensure main flow doesn't break.
     */
    static async send(options: SendOptions) {
        try {
            console.log(`[NotificationService] Attempting to send ${options.type}...`);

            // 1. Provider Logic (Abstracted)
            await this.executeProvider(options);

            // 2. Log to Database (Inbox)
            const message = await prisma.message.create({
                data: {
                    content: options.content,
                    sender: options.sender || "SYSTEM",
                    type: options.type,
                    read: true, // Outgoing messages are read
                    businessId: options.businessId,
                    leadId: options.leadId,
                    bookingId: options.bookingId
                }
            });

            console.log(`[NotificationService] Success. Message ID: ${message.id}`);
            return message;

        } catch (error) {
            console.error(`[NotificationService] FAILED to send ${options.type}`, error);
            // Critical: Do NOT re-throw. Return null so the calling function proceeds.
            return null;
        }
    }

    private static async executeProvider(options: SendOptions) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));

        if (options.type === "EMAIL") {
            // Integration Point: e.g., Resend.emails.send()
            console.log(`[MockProvider] Sending EMAIL to ${options.to}: ${options.content}`);
        } else if (options.type === "SMS") {
            // Integration Point: e.g., Twilio.messages.create()
            console.log(`[MockProvider] Sending SMS to ${options.to}: ${options.content}`);
        }
    }

    // --- Specific Use Cases ---

    static async sendBookingConfirmation(booking: any, lead: any) {
        if (lead.automationPaused) return;

        return this.send({
            type: "EMAIL",
            to: lead.email,
            content: `Booking Confirmed: ${booking.serviceName || "Service"} on ${new Date(booking.date).toLocaleString()}`,
            businessId: booking.businessId,
            leadId: lead.id,
            bookingId: booking.id
        });
    }

    static async sendAutoReply(lead: any) {
        if (lead.automationPaused) return;

        return this.send({
            type: "EMAIL",
            to: lead.email,
            content: "Thanks for reaching out! We've received your message and will get back to you shortly.",
            businessId: lead.businessId,
            leadId: lead.id
        });
    }

    static async sendReminder(booking: any) {
        if (booking.lead?.automationPaused) return;

        return this.send({
            type: "SMS",
            to: booking.lead?.email, // Using email as proxy for phone in MVP
            content: `Reminder: You have an appointment for ${booking.service?.name} tomorrow at ${new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
            businessId: booking.businessId,
            leadId: booking.leadId,
            bookingId: booking.id
        });
    }

    static async sendInventoryAlert(item: any, businessId: string) {
        return this.send({
            type: "ALERT",
            content: `⚠️ Low Stock Alert: ${item.name} is down to ${item.quantity}. Threshold: ${item.threshold}.`,
            businessId: businessId // Alert is internal, no Lead ID
        });
    }
}
