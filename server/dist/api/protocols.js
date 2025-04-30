"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protocolService_1 = require("../services/protocolService");
const router = express_1.default.Router();
router.get('/metrics', async (req, res) => {
    try {
        const context = req.app.locals.context;
        const metrics = await protocolService_1.ProtocolService.getProtocolMetrics(context);
        res.json(metrics);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
router.get('/:protocolId', async (req, res) => {
    try {
        const { protocolId } = req.params;
        const context = req.app.locals.context;
        const protocol = await protocolService_1.ProtocolService.getProtocolDetails(protocolId, context);
        res.json(protocol);
    }
    catch (error) {
        res.status(404).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.default = router;
//# sourceMappingURL=protocols.js.map