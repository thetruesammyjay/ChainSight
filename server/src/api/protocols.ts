import express from 'express'
import { ProtocolService } from '../services/protocolService'
import { GraphQLContext } from '../types'

const router = express.Router()

router.get('/metrics', async (req, res) => {
  try {
    const context = req.app.locals.context as GraphQLContext
    const metrics = await ProtocolService.getProtocolMetrics(context)
    res.json(metrics)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
  }
})

router.get('/:protocolId', async (req, res) => {
  try {
    const { protocolId } = req.params
    const context = req.app.locals.context as GraphQLContext
    const protocol = await ProtocolService.getProtocolDetails(protocolId, context)
    res.json(protocol)
  } catch (error) {
    res.status(404).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
  }
})

export default router