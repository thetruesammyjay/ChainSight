import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Investigation } from './types'

interface AppState {
  investigations: Investigation[];
  currentInvestigation: Investigation | null;
  loadInvestigationHistory: () => Promise<void>;
  updateInvestigation: (updatedInvestigations: Investigation[]) => void;
  createInvestigation: (investigation: Investigation) => void;
  deleteInvestigation: (id: string) => void;
  updateLiveData: (data: any) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      investigations: [],
      currentInvestigation: null,
      loadInvestigationHistory: async () => {
        // Load from localStorage/API
      },
      updateInvestigation: (updatedInvestigations) => 
        set({ investigations: updatedInvestigations }),
      createInvestigation: (investigation) => 
        set(state => ({ 
          investigations: [...state.investigations, investigation] 
        })),
      deleteInvestigation: (id) =>
        set(state => ({
          investigations: state.investigations.filter(inv => inv.id !== id)
        })),
      updateLiveData: (data) => {
        // Handle live data updates
        console.log('Live data received:', data);
        // Implement how you want to update state with this data
      }
    }),
    { name: 'chain-sight-store' }
  )
)