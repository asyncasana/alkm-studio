"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = handleOrderPlaced;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function handleOrderPlaced({ container, event: { data: { id }, }, }) {
    console.log("📦 Order placed event received. Order ID:", id);
    // DEBUG: List all container registrations to find the correct order service key
    if (typeof container.registrations === "object") {
        console.log("🪝 Container registrations:", Object.keys(container.registrations));
    }
    else {
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
    }
    catch (e) {
        console.error("❌ Error fetching order using remoteQuery", e);
        return;
    }
    if (!order) {
        console.error("❌ Order not found");
        return;
    }
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
            text: `New order from ${order.customer?.first_name ?? ""} ${order.customer?.last_name ?? ""}`,
        });
        console.log("✅ Emails sent successfully");
    }
    catch (e) {
        console.error("❌ Failed to send email(s)", e);
    }
}
exports.config = {
    event: "order.placed",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwtc2VydmljZS5zdWJzY3JpYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL2VtYWlsLXNlcnZpY2Uuc3Vic2NyaWJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQSxvQ0E0RUM7QUE5RUQsNERBQW9DO0FBRXJCLEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxFQUM5QyxTQUFTLEVBQ1QsS0FBSyxFQUFFLEVBQ0wsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQ2IsR0FDOEI7SUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU3RCxnRkFBZ0Y7SUFDaEYsSUFBSSxPQUFPLFNBQVMsQ0FBQyxhQUFhLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FDVCw2QkFBNkIsRUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQ3JDLENBQUM7SUFDSixDQUFDO1NBQU0sQ0FBQztRQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUM7SUFDVixJQUFJLENBQUM7UUFDSCxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sTUFBTSxHQUFHLE1BQU0sV0FBVyxDQUFDO1lBQy9CLFVBQVUsRUFBRSxPQUFPO1lBQ25CLE1BQU0sRUFBRTtnQkFDTixJQUFJO2dCQUNKLE9BQU87Z0JBQ1AsYUFBYTtnQkFDYixxQkFBcUI7Z0JBQ3JCLG9CQUFvQjthQUNyQjtZQUNELFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRTtTQUNsQixDQUFDLENBQUM7UUFDSCxLQUFLLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdELE9BQU87SUFDVCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ25DLE9BQU87SUFDVCxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxXQUFXLEdBQUcsb0JBQVUsQ0FBQyxlQUFlLENBQUM7WUFDN0MsSUFBSSxFQUFFLHVCQUF1QjtZQUM3QixJQUFJLEVBQUUsR0FBRztZQUNULE1BQU0sRUFBRSxJQUFJO1lBQ1osSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxzQkFBc0I7Z0JBQzVCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7YUFDNUI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcsQ0FBQyxRQUFRLENBQUM7WUFDekIsSUFBSSxFQUFFLHNDQUFzQztZQUM1QyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUs7WUFDZixPQUFPLEVBQUUsK0JBQStCO1lBQ3hDLElBQUksRUFBRSxNQUNKLEtBQUssQ0FBQyxRQUFRLEVBQUUsVUFBVSxJQUFJLE9BQ2hDLDBCQUEwQjtTQUMzQixDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcsQ0FBQyxRQUFRLENBQUM7WUFDekIsSUFBSSxFQUFFLDZDQUE2QztZQUNuRCxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPO1lBQ3ZCLE9BQU8sRUFBRSxvQkFBb0I7WUFDN0IsSUFBSSxFQUFFLGtCQUFrQixLQUFLLENBQUMsUUFBUSxFQUFFLFVBQVUsSUFBSSxFQUFFLElBQ3RELEtBQUssQ0FBQyxRQUFRLEVBQUUsU0FBUyxJQUFJLEVBQy9CLEVBQUU7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7QUFDSCxDQUFDO0FBRVksUUFBQSxNQUFNLEdBQXFCO0lBQ3RDLEtBQUssRUFBRSxjQUFjO0NBQ3RCLENBQUMifQ==