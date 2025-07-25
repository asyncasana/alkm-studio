import type { SubscriberConfig } from "@medusajs/framework";
import nodemailer from "nodemailer";

export const config: SubscriberConfig = {
  event: "shipment.created",
};

export default async function handleShipmentCreated({ container, event }: any) {
  console.log("📦 Shipment created event:", event?.type, event?.data);

  const shipmentId = event?.data?.id;
  if (!shipmentId) {
    console.error("❌ No shipment ID in event data");
    return;
  }

  let fulfillment;
  try {
    const remoteQuery = container.resolve("remoteQuery");
    const result = await remoteQuery({
      entryPoint: "fulfillment",
      fields: [
        "id",
        "tracking_numbers",
        "labels.id",
        "labels.tracking_number",
        "labels.tracking_url",
        "order.id",
        "order.email",
        "order.customer.first_name",
        "order.customer.last_name",
      ],
      variables: { id: shipmentId },
    });
    fulfillment = result?.[0];
    console.log("📦 Full fulfillment details:", fulfillment);
  } catch (e) {
    console.error("❌ Error fetching fulfillment details using remoteQuery", e);
    return;
  }

  if (!fulfillment || !fulfillment.order) {
    console.error("❌ Fulfillment or order not found");
    return;
  }

  // Send shipping notification email
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      secure: true,
      auth: {
        user: "hello@alkmstudio.com",
        pass: process.env.SMTP_PASS,
      },
    });

    // Extract tracking numbers from both tracking_numbers field and labels
    let trackingNumbers: string[] = [];

    // Add tracking_numbers if they exist
    if (fulfillment.tracking_numbers?.length) {
      trackingNumbers.push(...fulfillment.tracking_numbers);
    }

    // Add tracking numbers from labels if they exist
    if (fulfillment.labels?.length) {
      const labelTrackingNumbers = fulfillment.labels
        .filter((label: any) => label.tracking_number)
        .map((label: any) => label.tracking_number);
      trackingNumbers.push(...labelTrackingNumbers);
    }

    const tracking = trackingNumbers.length
      ? trackingNumbers.join(", ")
      : "No tracking number available.";

    console.log("📦 Extracted tracking numbers:", trackingNumbers);

    await transporter.sendMail({
      from: '"ALKM Studio" <hello@alkmstudio.com>',
      to: fulfillment.order.email,
      subject: "Your Order Has Shipped!",
      text: `Hi ${
        fulfillment.order.customer?.first_name ?? "there"
      }, your order has shipped!\nTracking number: ${tracking}`,
    });

    console.log("✅ Shipping email sent successfully");
  } catch (e) {
    console.error("❌ Failed to send shipping email", e);
  }
}
