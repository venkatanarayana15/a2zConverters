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

          {/* PDF Tools - Coming Soon */}
          <Route path="/merge-pdf" element={<ComingSoon />} />
          <Route path="/split-pdf" element={<ComingSoon />} />
          <Route path="/remove-pages" element={<ComingSoon />} />
          <Route path="/extract-pages" element={<ComingSoon />} />
          <Route path="/organize-pdf" element={<ComingSoon />} />
          <Route path="/scan-to-pdf" element={<ComingSoon />} />
          <Route path="/compress-pdf" element={<ComingSoon />} />
          <Route path="/repair-pdf" element={<ComingSoon />} />
          <Route path="/ocr-pdf" element={<ComingSoon />} />
          <Route path="/powerpoint-to-pdf" element={<ComingSoon />} />
          <Route path="/html-to-pdf" element={<ComingSoon />} />
          <Route path="/pdf-to-jpg" element={<ComingSoon />} />
          <Route path="/pdf-to-word" element={<ComingSoon />} />
          <Route path="/pdf-to-powerpoint" element={<ComingSoon />} />
          <Route path="/pdf-to-excel" element={<ComingSoon />} />
          <Route path="/pdf-to-pdfa" element={<ComingSoon />} />
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
