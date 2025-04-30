import { useState } from 'react';
import { useStore } from '../../store';

// Define the investigation type
interface Investigation {
  id: string;
  name: string;
  createdAt: string | number;
}

export default function PathHistory() {
  // Update your store.ts to include these properties or modify this component
  const store = useStore();
  // Type assertions for properties that might not be defined in the store type
  const investigationHistory = (store as any).investigationHistory || [];
  const loadInvestigation = (store as any).loadInvestigation;
  
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`path-history ${expanded ? 'expanded' : ''}`}>
      <div className="header" onClick={() => setExpanded(!expanded)}>
        <h4>Investigation History</h4>
        <span>{expanded ? '▼' : '▶'}</span>
      </div>
      
      {expanded && (
        <div className="history-list">
          {investigationHistory.length === 0 ? (
            <div className="empty">No investigations yet</div>
          ) : (
            investigationHistory.map((investigation: Investigation, i: number) => (
              <div 
                key={i} 
                className="history-item"
                onClick={() => loadInvestigation(investigation.id)}
              >
                <div className="name">{investigation.name}</div>
                <div className="date">
                  {new Date(investigation.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}