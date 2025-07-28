"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const webhooks_1 = __importDefault(require("./routes/webhooks"));
function default_1(app) {
    (0, webhooks_1.default)(app);
    // You can add more custom routes here
    return app;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsNEJBSUM7QUFORCxpRUFBeUM7QUFFekMsbUJBQXlCLEdBQUc7SUFDMUIsSUFBQSxrQkFBUSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2Qsc0NBQXNDO0lBQ3RDLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyJ9