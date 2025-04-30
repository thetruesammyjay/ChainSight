import { jsPDF } from 'jspdf';
import { useStore } from '../../store';

// You'll need to install file-saver: npm install file-saver @types/file-saver
import { saveAs } from 'file-saver';

export default function ExportPanel() {
  const { currentInvestigation } = useStore();

  const exportPDF = () => {
    if (!currentInvestigation) return;
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(`ChainSight Investigation Report`, 105, 20, { align: 'center' });
    
    // Metadata
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Investigation: ${currentInvestigation.name}`, 14, 40);
    
    // Wallet Data
    doc.setFontSize(14);
    doc.text('Tracked Wallets:', 14, 60);
    currentInvestigation.wallets.forEach((wallet, i) => {
      doc.text(`- ${wallet.address}`, 20, 70 + (i * 10));
    });
    
    doc.save(`chainsight-report-${Date.now()}.pdf`);
  };

  const exportCSV = () => {
    if (!currentInvestigation) return;
    
    let csvContent = "Address,Transactions,Value\n";
    currentInvestigation.wallets.forEach(wallet => {
      // Cast wallet to any to access non-standard properties or add type definitions
      const walletData = wallet as any;
      csvContent += `${wallet.address},${walletData.txCount || 0},${walletData.value || 0}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `chainsight-data-${Date.now()}.csv`);
  };

  if (!currentInvestigation) {
    return (
      <div className="export-panel">
        <h4>Export Investigation</h4>
        <p>No active investigation to export</p>
      </div>
    );
  }

  return (
    <div className="export-panel">
      <h4>Export Investigation</h4>
      <div className="export-options">
        <button onClick={exportPDF} className="export-btn pdf">
          Export PDF
        </button>
        <button onClick={exportCSV} className="export-btn csv">
          Export CSV
        </button>
      </div>
    </div>
  );
}