import React from 'react';
import PdfDownloadButton from '../../components/PdfDownloadButton';// Adjust path as needed

const ReportScreen: React.FC = () => {
    return (
        <div>
            <h1>Report Screen</h1>
            {/* Add the PDF Download Button */}
            <PdfDownloadButton/>
        </div>
    );
};

export default ReportScreen;