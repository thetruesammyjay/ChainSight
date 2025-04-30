import React, { useState, useEffect, useCallback } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { Sankey } from '@visx/sankey';
import { Group } from '@visx/group';
import { Tooltip, useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Connection, PublicKey, Commitment } from '@solana/web3.js';

// Define our basic data interfaces
interface TransactionNode {
  id: string;
  name: string;
  type: 'wallet' | 'program';
  size?: number;
}

interface TransactionLink {
  source: string;
  target: string;
  value: number;
  token?: string;
}

interface TransactionFlowProps {
  rpcUrl: string;
  initialAddress?: string;
  depth?: number;
}

const TransactionFlow: React.FC<TransactionFlowProps> = ({
  rpcUrl = 'https://api.mainnet-beta.solana.com',
  initialAddress,
  depth = 3
}) => {
  const [graphData, setGraphData] = useState<{
    nodes: TransactionNode[];
    links: TransactionLink[];
  }>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'sankey'>('graph');
  const [selectedNode, setSelectedNode] = useState<TransactionNode | null>(null);
  
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<TransactionNode>();

  const colorScale = (type: 'wallet' | 'program') => 
    type === 'wallet' ? '#9945FF' : '#14F195';

  const fetchTransactions = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const commitment: Commitment = 'confirmed';
      const connection = new Connection(rpcUrl, commitment);
      const pubKey = new PublicKey(address);
      
      // Fetch recent transactions using the correct method name
      const signatures = await connection.getConfirmedSignaturesForAddress2(pubKey, {
        limit: 10,
      });

      const nodes: TransactionNode[] = [{
        id: address,
        name: address.slice(0, 4) + '...' + address.slice(-4),
        type: 'wallet',
        size: 15
      }];

      const links: TransactionLink[] = [];

      // Process each transaction
      for (const { signature } of signatures) {
        const tx = await connection.getParsedTransaction(signature, commitment);
        if (!tx?.transaction) continue;

        // Process instructions
        for (const ix of tx.transaction.message.instructions) {
          // Ensure programId is available and is a PublicKey
          if ('programId' in ix) {
            const programId = ix.programId.toString();
            
            // Add program node if not exists
            if (!nodes.some(n => n.id === programId)) {
              nodes.push({
                id: programId,
                name: programId.slice(0, 4) + '...' + programId.slice(-4),
                type: 'program',
                size: 10
              });
            }

            // Create link
            links.push({
              source: address,
              target: programId,
              value: 1,
              token: 'SOL'
            });
          }
        }
      }

      setGraphData({ nodes, links });
    } catch (err) {
      setError(`Failed to fetch transactions: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }, [rpcUrl]);

  useEffect(() => {
    if (initialAddress) {
      fetchTransactions(initialAddress);
    }
  }, [initialAddress, fetchTransactions]);

  const handleNodeClick = (node: TransactionNode) => {
    setSelectedNode(node);
    fetchTransactions(node.id);
  };

  const handleMouseOver = (event: React.MouseEvent, node: TransactionNode) => {
    const coords = localPoint(event.currentTarget as SVGSVGElement, event);
    if (coords) {
      showTooltip({
        tooltipLeft: coords.x,
        tooltipTop: coords.y,
        tooltipData: node,
      });
    }
  };

  const handleMouseOut = () => {
    hideTooltip();
  };

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  // Define dimensions
  const sankeyWidth = 800;
  const sankeyHeight = 600;
  const margin = { top: 20, left: 50, right: 50, bottom: 20 };
  
  return (
    <div className="transaction-flow-container">
      <div className="view-controls">
        <button onClick={() => setViewMode('graph')}>Force Graph</button>
        <button onClick={() => setViewMode('sankey')}>Sankey Diagram</button>
      </div>

      {viewMode === 'graph' ? (
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeAutoColorBy="type"
          nodeVal={node => node.size || 5}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
          onNodeClick={handleNodeClick}
          width={800}
          height={600}
        />
      ) : (
        <div style={{ position: 'relative', width: sankeyWidth, height: sankeyHeight }}>
          <svg width={sankeyWidth} height={sankeyHeight}>
            <Group top={margin.top} left={margin.left}>
              <Sankey
                root={graphData}
                nodeWidth={15}
                nodePadding={10}
                nodeId={(node: any) => node.id}
              >
                {({ graph }) => {
                  // Make sure graph.links and graph.nodes exist
                  if (!graph || !graph.links || !graph.nodes) {
                    return null;
                  }
                  
                  return (
                    <>
                      {graph.links.map((link: any, i: number) => (
                        <path
                          key={`link-${i}`}
                          d={link.path || ''}
                          stroke="#7D7D7D"
                          strokeWidth={Math.max(1, link.value)}
                          strokeOpacity={0.6}
                          fill="none"
                        />
                      ))}
                      {graph.nodes.map((node: any, i: number) => {
                        // Extract the original node data
                        const originalNode = node.node as TransactionNode;
                        
                        // Adding null checks for coordinate values
                        const x0 = node.x0 ?? 0;
                        const x1 = node.x1 ?? 0;
                        const y0 = node.y0 ?? 0;
                        const y1 = node.y1 ?? 0;
                        
                        return (
                          <Group
                            key={`node-${i}`}
                            top={y0}
                            left={x0}
                            onMouseOver={(e) => handleMouseOver(e, originalNode)}
                            onMouseOut={handleMouseOut}
                            onClick={() => handleNodeClick(originalNode)}
                          >
                            <rect
                              width={x1 - x0}
                              height={y1 - y0}
                              fill={colorScale(originalNode.type)}
                              rx={4}
                            />
                            <text
                              x={(x1 - x0) + 5}
                              y={(y1 - y0) / 2}
                              fontSize={12}
                              fill="white"
                              dy=".35em"
                            >
                              {originalNode.name}
                            </text>
                          </Group>
                        );
                      })}
                    </>
                  );
                }}
              </Sankey>
            </Group>
          </svg>

          {tooltipOpen && tooltipData && (
            <Tooltip top={tooltipTop} left={tooltipLeft}>
              <div>
                <strong>{tooltipData.name}</strong>
                <div>Type: {tooltipData.type}</div>
                <div>ID: {tooltipData.id.slice(0, 8)}...</div>
              </div>
            </Tooltip>
          )}
        </div>
      )}

      {selectedNode && (
        <div className="node-details">
          <h3>Selected: {selectedNode.name}</h3>
          <p>Type: {selectedNode.type}</p>
          <p>Address: {selectedNode.id}</p>
        </div>
      )}
    </div>
  );
};

export default TransactionFlow;