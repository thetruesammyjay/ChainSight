import express from 'express'
import { SolanaService } from '../services/solana'
import { GraphQLContext } from '../types'

const router = express.Router()

router.get('/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params
    const context = req.app.locals.context as GraphQLContext
    const wallet = await SolanaService.getWalletDetails(address, context)
    res.json(wallet)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
  }
})

router.get('/wallets/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const context = req.app.locals.context as GraphQLContext
    const wallets = await context.pool.query(
      `SELECT address, balance FROM wallets 
       ORDER BY balance DESC LIMIT $1`,
      [limit]
    )
    res.json(wallets.rows)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
  }
})

export default router