import { ForceGraph2D } from 'react-force-graph';
import { useMemo } from 'react';

interface Wallet {
  address: string;
  balance: number;
  tags?: string[];
}

interface Connection {
  from: string;
  to: string;
  value: number;
}

interface WalletGraphData {
  wallets: Wallet[];
  connections: Connection[];
}

interface WalletGraphProps {
  width: number;
  height: number;
  data: WalletGraphData;
  onNodeClick?: (node: any) => void;
}

interface GraphNode {
  id: string;
  group: string | number;
  value: number;
  x?: number;
  y?: number;
}

export default function WalletGraph({ width, height, data, onNodeClick }: WalletGraphProps) {
  const graphData = useMemo(() => ({
    nodes: data.wallets.map((wallet: Wallet) => ({
      id: wallet.address,
      group: wallet.tags?.[0] || 1,
      value: wallet.balance
    })),
    links: data.connections.map((conn: Connection) => ({
      source: conn.from,
      target: conn.to,
      value: conn.value
    }))
  }), [data]);

  return (
    <ForceGraph2D
      width={width}
      height={height}
      graphData={graphData}
      nodeLabel="id"
      nodeAutoColorBy="group"
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      linkCurvature={0.25}
      onNodeClick={onNodeClick}
      nodeCanvasObject={(node: GraphNode, ctx: CanvasRenderingContext2D) => {
        const label = node.id.slice(0, 4) + '...' + node.id.slice(-4);
        const fontSize = 12;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText(label, node.x! + 8, node.y! + 3);
      }}
    />
  );
}