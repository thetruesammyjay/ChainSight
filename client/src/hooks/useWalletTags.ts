import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { Tag, Investigation } from '../types'

export default function useWalletTags(walletAddress: string) {
  const { investigations, updateInvestigation } = useStore();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTags = () => {
      const investigation = investigations.find(inv => 
        inv.wallets.some(w => w.address === walletAddress)
      );
      
      if (investigation) {
        const wallet = investigation.wallets.find(w => w.address === walletAddress);
        setTags(wallet?.tags || []);
      }
      setLoading(false);
    };

    loadTags();
  }, [walletAddress, investigations]);

  const addTag = (newTag: string) => {
    const updatedInvestigations = investigations.map(inv => {
      if (inv.wallets.some(w => w.address === walletAddress)) {
        return {
          ...inv,
          wallets: inv.wallets.map(w => 
            w.address === walletAddress
              ? { 
                  ...w, 
                  tags: [...(w.tags || []), { 
                    id: crypto.randomUUID(), 
                    name: newTag,
                    createdAt: new Date().toISOString() 
                  }] 
                }
              : w
          )
        };
      }
      return inv;
    });

    updateInvestigation(updatedInvestigations);
    setTags(prev => [...prev, { 
      id: crypto.randomUUID(), 
      name: newTag,
      createdAt: new Date().toISOString() 
    }]);
  };

  const removeTag = (tagId: string) => {
    const updatedInvestigations = investigations.map(inv => {
      if (inv.wallets.some(w => w.address === walletAddress)) {
        return {
          ...inv,
          wallets: inv.wallets.map(w => 
            w.address === walletAddress
              ? { 
                  ...w, 
                  tags: (w.tags || []).filter(t => t.id !== tagId) 
                }
              : w
          )
        };
      }
      return inv;
    });

    updateInvestigation(updatedInvestigations);
    setTags(prev => prev.filter(t => t.id !== tagId));
  };

  return { tags, loading, addTag, removeTag };
}