import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import nodemailer from "nodemailer";

export default async function handleOrderPlaced({
  container,
  event: { data: { id } },
}: SubscriberArgs<{ id: string }>) {
  console.log("📦 Order placed event received. Order ID:", id);

  const orderService = container.resolve("orderService") as any;

  const order = await orderService.retrieve(id, {
    relations: ["customer"],
  });

  if (!order) {
    console.error("❌ Order not found");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: "hello@alkmstudio.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"ALKM Studio" <hello@alkmstudio.com>',
    to: order.email,
    subject: "Your Order Has Been Received!",
    text: `Hi ${order.customer?.first_name ?? "there"}, thanks for your order!`,
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
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
