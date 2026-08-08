import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import FeedbackButton from './components/FeedbackButton';
import NotFound from './pages/NotFound';
import About from './pages/About';
import FeaturesPage from './pages/Features';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import StatePatterns from './pages/StatePatterns';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Help from './pages/Help';
import FAQ from './pages/FAQ';
import Security from './pages/Security';
import Cookies from './pages/Cookies';
import Status from './pages/Status';
import Changelog from './pages/Changelog';
import ToolsIndex from './pages/ToolsIndex';
import Loading from './pages/Loading';
import OfflineBanner from './components/OfflineBanner';
import ScrollToTop from './components/ScrollToTop';
import PrevPathTracker from './components/PrevPathTracker';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import PageLoader from './components/PageLoader';

/* Tool pages are lazy-loaded so their heavy libraries (pdfjs-dist, pdf-lib,
   xlsx, docx, pptxgenjs, jspdf, html2canvas, …) only load when a tool is
   actually opened. This keeps the homepage fast and isolates any library
   failure to a single route instead of blanking the whole site. */
const GovResizer = lazy(() => import('./pages/image-tools/GovResizer'));
const ImageResizer = lazy(() => import('./pages/image-tools/ImageResizer'));
const ImageEditor = lazy(() => import('./pages/image-tools/ImageEditor'));
const BackgroundRemover = lazy(() => import('./pages/image-tools/BackgroundRemover'));
const ImageConverter = lazy(() => import('./pages/image-tools/ImageConverter'));
const JPGToPDF = lazy(() => import('./pages/pdf-tools/convert-to-pdf/JPGToPDF'));
const WordToPDF = lazy(() => import('./pages/pdf-tools/convert-to-pdf/WordToPDF'));
const ExcelToPDF = lazy(() => import('./pages/pdf-tools/convert-to-pdf/ExcelToPDF'));
const HTMLToPDF = lazy(() => import('./pages/pdf-tools/convert-to-pdf/HTMLToPDF'));
const MergePDF = lazy(() => import('./pages/pdf-tools/organize/MergePDF'));
const SplitPDF = lazy(() => import('./pages/pdf-tools/organize/SplitPDF'));
const RemovePages = lazy(() => import('./pages/pdf-tools/organize/RemovePages'));
const RotatePDF = lazy(() => import('./pages/pdf-tools/edit-security/RotatePDF'));
const CropPDF = lazy(() => import('./pages/pdf-tools/edit-security/CropPDF'));
const UnlockPDF = lazy(() => import('./pages/pdf-tools/edit-security/UnlockPDF'));
const ProtectPDF = lazy(() => import('./pages/pdf-tools/edit-security/ProtectPDF'));
const RedactPDF = lazy(() => import('./pages/pdf-tools/edit-security/RedactPDF'));
const EditPDF = lazy(() => import('./pages/pdf-tools/edit-security/EditPDF'));
const PDFToJPG = lazy(() => import('./pages/pdf-tools/convert-from-pdf/PDFToJPG'));
const PDFToWord = lazy(() => import('./pages/pdf-tools/convert-from-pdf/PDFToWord'));
const PDFToExcel = lazy(() => import('./pages/pdf-tools/convert-from-pdf/PDFToExcel'));
const PDFToPPT = lazy(() => import('./pages/pdf-tools/convert-from-pdf/PDFToPPT'));
const CompressPDF = lazy(() => import('./pages/pdf-tools/convert-from-pdf/CompressPDF'));
const PDFValidate = lazy(() => import('./pages/pdf-tools/edit-security/PDFValidate'));
const ESign = lazy(() => import('./pages/pdf-tools/edit-security/ESign'));
const WatermarkPDF = lazy(() => import('./pages/pdf-tools/edit-security/WatermarkPDF'));
const AddPageNumbers = lazy(() => import('./pages/pdf-tools/edit-security/AddPageNumbers'));
const ComparePDF = lazy(() => import('./pages/pdf-tools/edit-security/ComparePDF'));
const TranslatePDF = lazy(() => import('./pages/pdf-tools/edit-security/TranslatePDF'));
const ExtractPages = lazy(() => import('./pages/pdf-tools/organize/ExtractPages'));
const OrganizePDF = lazy(() => import('./pages/pdf-tools/organize/OrganizePDF'));
const ScanToPDF = lazy(() => import('./pages/pdf-tools/organize/ScanToPDF'));
const RepairPDF = lazy(() => import('./pages/pdf-tools/optimize/RepairPDF'));
const OCRPDF = lazy(() => import('./pages/pdf-tools/optimize/OCRPDF'));
const PowerPointToPDF = lazy(() => import('./pages/pdf-tools/convert-to-pdf/PowerPointToPDF'));
const PDFToPDFA = lazy(() => import('./pages/pdf-tools/convert-from-pdf/PDFToPDFA'));

const applyDarkMode = () => {
    try {
        const saved = JSON.parse(localStorage.getItem('a2z_settings'));
        if (saved?.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } catch { /* ignore */ }
};

const FOOTERLESS_PATHS = new Set([
    '/gov-resizer', '/image-resizer', '/image-editor', '/image-converter', '/bg-remover',
    '/jpg-to-pdf', '/word-to-pdf', '/excel-to-pdf', '/pdf-validate', '/esign-pdf', '/watermark-pdf',
    '/merge-pdf', '/split-pdf', '/remove-pages', '/extract-pages', '/organize-pdf', '/scan-to-pdf',
    '/compress-pdf', '/repair-pdf', '/ocr-pdf', '/powerpoint-to-pdf', '/html-to-pdf', '/pdf-to-jpg',
    '/pdf-to-word', '/pdf-to-powerpoint', '/pdf-to-excel', '/pdf-to-pdfa', '/rotate-pdf',
    '/add-page-numbers', '/crop-pdf', '/edit-pdf', '/unlock-pdf', '/protect-pdf', '/redact-pdf',
    '/compare-pdf', '/translate-pdf',
]);

const KNOWN_PATHS = new Set([
    ...FOOTERLESS_PATHS,
    '/', '/pricing', '/about', '/features', '/contact', '/profile',
    '/state-patterns', '/privacy', '/terms', '/help', '/faq', '/loading', '/security',
    '/cookies', '/status', '/changelog', '/pdf-tools', '/image-tools',
]);

const FooterSlot = () => {
    const { pathname } = useLocation();
    const hide = FOOTERLESS_PATHS.has(pathname) || !KNOWN_PATHS.has(pathname);
    return hide ? null : <Footer />;
};

const pt = (node) => <PageTransition>{node}</PageTransition>;

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={pt(<Home />)} />

              {/* Image Tools */}
              <Route path="/gov-resizer" element={pt(<GovResizer />)} />
              <Route path="/image-resizer" element={pt(<ImageResizer />)} />
              <Route path="/image-editor" element={pt(<ImageEditor />)} />
              <Route path="/bg-remover" element={pt(<BackgroundRemover />)} />
              <Route path="/image-converter" element={pt(<ImageConverter />)} />

              {/* PDF Tools - Built */}
              <Route path="/jpg-to-pdf" element={pt(<JPGToPDF />)} />
              <Route path="/word-to-pdf" element={pt(<WordToPDF />)} />
              <Route path="/excel-to-pdf" element={pt(<ExcelToPDF />)} />
              <Route path="/pdf-validate" element={pt(<PDFValidate />)} />
              <Route path="/esign-pdf" element={pt(<ESign />)} />
              <Route path="/watermark-pdf" element={pt(<WatermarkPDF />)} />
              <Route path="/html-to-pdf" element={pt(<HTMLToPDF />)} />
              <Route path="/merge-pdf" element={pt(<MergePDF />)} />
              <Route path="/split-pdf" element={pt(<SplitPDF />)} />
              <Route path="/remove-pages" element={pt(<RemovePages />)} />
              <Route path="/rotate-pdf" element={pt(<RotatePDF />)} />
              <Route path="/crop-pdf" element={pt(<CropPDF />)} />
              <Route path="/unlock-pdf" element={pt(<UnlockPDF />)} />
              <Route path="/protect-pdf" element={pt(<ProtectPDF />)} />
              <Route path="/redact-pdf" element={pt(<RedactPDF />)} />
              <Route path="/edit-pdf" element={pt(<EditPDF />)} />
              <Route path="/pdf-to-jpg" element={pt(<PDFToJPG />)} />
              <Route path="/pdf-to-word" element={pt(<PDFToWord />)} />
              <Route path="/pdf-to-excel" element={pt(<PDFToExcel />)} />
              <Route path="/pdf-to-powerpoint" element={pt(<PDFToPPT />)} />
              <Route path="/compress-pdf" element={pt(<CompressPDF />)} />
              <Route path="/extract-pages" element={pt(<ExtractPages />)} />
              <Route path="/organize-pdf" element={pt(<OrganizePDF />)} />
              <Route path="/scan-to-pdf" element={pt(<ScanToPDF />)} />
              <Route path="/repair-pdf" element={pt(<RepairPDF />)} />
              <Route path="/ocr-pdf" element={pt(<OCRPDF />)} />
              <Route path="/powerpoint-to-pdf" element={pt(<PowerPointToPDF />)} />
              <Route path="/pdf-to-pdfa" element={pt(<PDFToPDFA />)} />
              <Route path="/add-page-numbers" element={pt(<AddPageNumbers />)} />
              <Route path="/compare-pdf" element={pt(<ComparePDF />)} />
              <Route path="/translate-pdf" element={pt(<TranslatePDF />)} />

              <Route path="/pricing" element={pt(<Pricing />)} />
              <Route path="/about" element={pt(<About />)} />
              <Route path="/features" element={pt(<FeaturesPage />)} />
              <Route path="/contact" element={pt(<Contact />)} />
              <Route path="/profile" element={pt(<Profile />)} />

              <Route path="/pdf-tools" element={pt(<ToolsIndex type="pdf" />)} />
              <Route path="/image-tools" element={pt(<ToolsIndex type="image" />)} />

              <Route path="/state-patterns" element={pt(<StatePatterns />)} />
              <Route path="/privacy" element={pt(<Privacy />)} />
              <Route path="/terms" element={pt(<Terms />)} />
              <Route path="/cookies" element={pt(<Cookies />)} />
              <Route path="/status" element={pt(<Status />)} />
              <Route path="/changelog" element={pt(<Changelog />)} />
              <Route path="/help" element={pt(<Help />)} />
              <Route path="/faq" element={pt(<FAQ />)} />
              <Route path="/security" element={pt(<Security />)} />
              <Route path="/loading" element={pt(<Loading />)} />

              <Route path="*" element={pt(<NotFound />)} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    useEffect(() => {
        applyDarkMode();
        const handler = () => applyDarkMode();
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    return (
    <Router>
      <ScrollToTop />
      <PrevPathTracker />
      <div className="min-h-screen bg-background font-sans antialiased text-foreground overflow-x-hidden w-full max-w-screen">
        <Navbar />
        <OfflineBanner />
        <BottomNav />
        <FeedbackButton />
        <RouteErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </RouteErrorBoundary>
        <FooterSlot />
      </div>
    </Router>
  );
}

export default App;
