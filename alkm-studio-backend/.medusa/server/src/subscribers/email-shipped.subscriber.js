"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = handleShipmentCreated;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.config = {
    event: "shipment.created",
};
async function handleShipmentCreated({ container, event }) {
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
    }
    catch (e) {
        console.error("❌ Error fetching fulfillment details using remoteQuery", e);
        return;
    }
    if (!fulfillment || !fulfillment.order) {
        console.error("❌ Fulfillment or order not found");
        return;
    }
    // Send shipping notification email
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            secure: true,
            auth: {
                user: "hello@alkmstudio.com",
                pass: process.env.SMTP_PASS,
            },
        });
        // Extract tracking numbers from both tracking_numbers field and labels
        let trackingNumbers = [];
        // Add tracking_numbers if they exist
        if (fulfillment.tracking_numbers?.length) {
            trackingNumbers.push(...fulfillment.tracking_numbers);
        }
        // Add tracking numbers from labels if they exist
        if (fulfillment.labels?.length) {
            const labelTrackingNumbers = fulfillment.labels
                .filter((label) => label.tracking_number)
                .map((label) => label.tracking_number);
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
            text: `Hi ${fulfillment.order.customer?.first_name ?? "there"}, your order has shipped!\nTracking number: ${tracking}`,
        });
        console.log("✅ Shipping email sent successfully");
    }
    catch (e) {
        console.error("❌ Failed to send shipping email", e);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwtc2hpcHBlZC5zdWJzY3JpYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL2VtYWlsLXNoaXBwZWQuc3Vic2NyaWJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFPQSx3Q0FzRkM7QUE1RkQsNERBQW9DO0FBRXZCLFFBQUEsTUFBTSxHQUFxQjtJQUN0QyxLQUFLLEVBQUUsa0JBQWtCO0NBQzFCLENBQUM7QUFFYSxLQUFLLFVBQVUscUJBQXFCLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFPO0lBQzNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFcEUsTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7SUFDbkMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNoRCxPQUFPO0lBQ1QsQ0FBQztJQUVELElBQUksV0FBVyxDQUFDO0lBQ2hCLElBQUksQ0FBQztRQUNILE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDckQsTUFBTSxNQUFNLEdBQUcsTUFBTSxXQUFXLENBQUM7WUFDL0IsVUFBVSxFQUFFLGFBQWE7WUFDekIsTUFBTSxFQUFFO2dCQUNOLElBQUk7Z0JBQ0osa0JBQWtCO2dCQUNsQixXQUFXO2dCQUNYLHdCQUF3QjtnQkFDeEIscUJBQXFCO2dCQUNyQixVQUFVO2dCQUNWLGFBQWE7Z0JBQ2IsMkJBQTJCO2dCQUMzQiwwQkFBMEI7YUFDM0I7WUFDRCxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFO1NBQzlCLENBQUMsQ0FBQztRQUNILFdBQVcsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFD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