import React, { useState } from 'react';
import axios from 'axios';

// PdfDownloadButton Component
const PdfDownloadButton: React.FC<{ onClick: () => void; isLoading: boolean }> = ({ onClick, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="relative overflow-hidden z-0 text-[var(--white-color)] ps-2.5 pe-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
  >
    {isLoading ? 'Generating PDF...' : 'Download PDF'}
  </button>
);

// Parent Component
const AdminReport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to generate and download PDF
  const handleGeneratePdf = async () => {
    setIsLoading(true);

    const pdfData = {
      userId: "user-id-placeholder", // Replace with actual user ID from state or props
      selectedDomain: "selected-domain-placeholder", // Replace with actual selected domain
      selectedSubdomain: "selected-subdomain-placeholder" // Replace with actual selected subdomain
    };

    try {
      const response = await axios.post('/api/generate-report', pdfData, {
        responseType: 'arraybuffer' // Expecting a binary PDF response
      });

      // Trigger PDF download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'performance_report.pdf'; // The name of the downloaded file
      link.click();
      window.URL.revokeObjectURL(url); // Clean up the object URL after download
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Admin Report</h1>
      {/* PdfDownloadButton Component */}
      <PdfDownloadButton onClick={handleGeneratePdf} isLoading={isLoading} />
      {/* You can add more content here */}
    </div>
  );
};

export default AdminReport;
