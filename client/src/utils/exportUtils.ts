export function prepareCSVData(investigation: any) {
  const headers = ['Address', 'Balance (SOL)', 'Transactions', 'Tags'];
  const rows = investigation.wallets.map((wallet: any) => [
    wallet.address,
    wallet.balance?.toFixed(2) || '0',
    wallet.transactions?.length || '0',
    wallet.tags?.join(', ') || ''
  ]);
  
  return [headers, ...rows];
}

export function generatePDFContent(investigation: any) {
  return {
    title: `Investigation: ${investigation.name}`,
    date: new Date().toLocaleString(),
    wallets: investigation.wallets.map((wallet: any) => ({
      address: wallet.address,
      balance: wallet.balance?.toFixed(2) || '0',
      transactions: wallet.transactions?.length || '0'
    }))
  };
}