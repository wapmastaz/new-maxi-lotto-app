import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { BetList, Game } from '@/types/game'

interface BetStore {
  betsList: BetList[]
  selectedGame: Game | null

  // Actions
  addBet: (bet: BetList) => void
  removeBet: (index: number) => void
  clearBets: () => void
  setSelectedGame: (game: Game | null) => void
  setBetsList: (bets: BetList[]) => void
}

export const useBetStore = create<BetStore>()(
  persist(
    (set) => ({
      // Initial state
      betsList: [],
      selectedGame: null,

      // Actions
      addBet: (bet) => set((state) => ({
        betsList: [...state.betsList, bet]
      })),

      removeBet: (index) => set((state) => ({
        betsList: state.betsList.filter((_, i) => i !== index)
      })),

      clearBets: () => set({ betsList: [] }),

      setSelectedGame: (game) => set({ selectedGame: game }),

      setBetsList: (bets) => set({ betsList: bets }),
    }),
    {
      name: 'lotto-bet-storage', // localStorage key
      storage: createJSONStorage(() => sessionStorage),
      // Only persist betsList and selectedGame
      partialize: (state) => ({
        betsList: state.betsList,
        selectedGame: state.selectedGame
      }),
    }
  )
)
