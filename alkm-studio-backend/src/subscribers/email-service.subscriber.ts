import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import type { EntityManager } from "typeorm";
import nodemailer from "nodemailer";

export default async function handleOrderPlaced({
  container,
  event: {
    data: { id },
  },
}: SubscriberArgs<{ id: string }>) {
  console.log("📦 Order placed event received. Order ID:", id);

  // DEBUG: List all container registrations to find the correct order service key
  if (typeof container.registrations === "object") {
    console.log(
      "🪝 Container registrations:",
      Object.keys(container.registrations)
    );
  } else {
    console.log("🪝 Container does not expose registrations directly.");
  }

  let order;
  try {
    const remoteQuery = container.resolve("remoteQuery");
    const result = await remoteQuery({
      entryPoint: "order",
      fields: [
        "id",
        "email",
        "customer.id",
        "customer.first_name",
        "customer.last_name",
      ],
      variables: { id },
    });
    order = result?.[0];
  } catch (e) {
    console.error("❌ Error fetching order using remoteQuery", e);
    return;
  }

  if (!order) {
    console.error("❌ Order not found");
    return;
  }

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

    await transporter.sendMail({
      from: '"ALKM Studio" <hello@alkmstudio.com>',
      to: order.email,
      subject: "Your Order Has Been Received!",
      text: `Hi ${
        order.customer?.first_name ?? "there"
      }, thanks for your order!`,
    });

    await transporter.sendMail({
      from: '"ALKM Studio Orders" <hello@alkmstudio.com>',
      to: process.env.SEND_TO,
      subject: "New Order Received",
      text: `New order from ${order.customer?.first_name ?? ""} ${
        order.customer?.last_name ?? ""
      }`,
    });

    console.log("✅ Emails sent successfully");
  } catch (e) {
    console.error("❌ Failed to send email(s)", e);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
