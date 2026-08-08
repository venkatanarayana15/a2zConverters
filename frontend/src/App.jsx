import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import GovResizer from './pages/GovResizer';
import PDFValidate from './pages/PDFValidate';
import ESign from './pages/ESign';
import WatermarkPDF from './pages/WatermarkPDF';
import Pricing from './pages/Pricing';
import FeedbackButton from './components/FeedbackButton';

import ImageResizer from './pages/ImageResizer';
import ImageEditor from './pages/ImageEditor';
import BackgroundRemover from './pages/BackgroundRemover';

import ImageConverter from './pages/ImageConverter';
import JPGToPDF from './pages/JPGToPDF';
import WordToPDF from './pages/WordToPDF';
import ExcelToPDF from './pages/ExcelToPDF';
import MergePDF from './pages/MergePDF';
import SplitPDF from './pages/SplitPDF';
import RemovePages from './pages/RemovePages';
import ExtractPages from './pages/ExtractPages';
import OrganizePDF from './pages/OrganizePDF';
import ScanToPDF from './pages/ScanToPDF';
import PDFToJPG from './pages/PDFToJPG';
import PDFToWord from './pages/PDFToWord';
import PDFToPPT from './pages/PDFToPPT';
import PDFToExcel from './pages/PDFToExcel';
import PDFToPDFA from './pages/PDFToPDFA';
import ConvertFromPDF from './pages/ConvertFromPDF';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased text-foreground overflow-x-hidden w-full max-w-screen">
        <Navbar />
        <BottomNav />
        <FeedbackButton />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Image Tools */}
          <Route path="/gov-resizer" element={<GovResizer />} />
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/image-editor" element={<ImageEditor />} />
          <Route path="/bg-remover" element={<BackgroundRemover />} />
          <Route path="/image-converter" element={<ImageConverter />} />

          {/* PDF Tools - Existing */}
          <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
          <Route path="/word-to-pdf" element={<WordToPDF />} />
          <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
          <Route path="/pdf-validate" element={<PDFValidate />} />
          <Route path="/esign-pdf" element={<ESign />} />
          <Route path="/watermark-pdf" element={<WatermarkPDF />} />

          {/* PDF Tools - Now Available */}
          <Route path="/merge-pdf" element={<MergePDF />} />
          <Route path="/split-pdf" element={<SplitPDF />} />
          <Route path="/remove-pages" element={<RemovePages />} />
          <Route path="/extract-pages" element={<ExtractPages />} />
          <Route path="/organize-pdf" element={<OrganizePDF />} />
          <Route path="/scan-to-pdf" element={<ScanToPDF />} />

          {/* PDF Tools - Convert from PDF */}
          <Route path="/pdf-converter" element={<ConvertFromPDF />} />
          <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
          <Route path="/pdf-to-word" element={<PDFToWord />} />
          <Route path="/pdf-to-powerpoint" element={<PDFToPPT />} />
          <Route path="/pdf-to-excel" element={<PDFToExcel />} />
          <Route path="/pdf-to-pdfa" element={<PDFToPDFA />} />

          {/* PDF Tools - Coming Soon */}
          <Route path="/compress-pdf" element={<ComingSoon />} />
          <Route path="/repair-pdf" element={<ComingSoon />} />
          <Route path="/ocr-pdf" element={<ComingSoon />} />
          <Route path="/powerpoint-to-pdf" element={<ComingSoon />} />
          <Route path="/html-to-pdf" element={<ComingSoon />} />
          <Route path="/rotate-pdf" element={<ComingSoon />} />
          <Route path="/add-page-numbers" element={<ComingSoon />} />
          <Route path="/crop-pdf" element={<ComingSoon />} />
          <Route path="/edit-pdf" element={<ComingSoon />} />
          <Route path="/unlock-pdf" element={<ComingSoon />} />
          <Route path="/protect-pdf" element={<ComingSoon />} />
          <Route path="/redact-pdf" element={<ComingSoon />} />
          <Route path="/compare-pdf" element={<ComingSoon />} />
          <Route path="/translate-pdf" element={<ComingSoon />} />

          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
