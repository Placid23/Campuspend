'use client';

import { toast } from "@/hooks/use-toast";

/**
 * Service to handle simulated communication protocols (Email/SMS) 
 * for the CafePay Intelligent Engine.
 */
export const NotificationService = {
  /**
   * Simulates sending an email to a vendor when an order is placed.
   */
  sendOrderAlertToVendor: (vendorEmail: string, orderId: string) => {
    console.log(`[MAIL NODE] Dispatching Order Alert to: ${vendorEmail}`);
    toast({
      title: "Merchant Notified",
      description: `Order ${orderId} synced. Email sent to vendor registry.`,
    });
  },

  /**
   * Simulates sending an email to a student when their order is ready.
   */
  sendReadyAlertToStudent: (studentEmail: string, itemName: string) => {
    console.log(`[MAIL NODE] Dispatching Pickup Alert to: ${studentEmail}`);
    toast({
      title: "Mail Dispatched",
      description: `Pickup instructions for "${itemName}" sent to your university email.`,
    });
  }
};
