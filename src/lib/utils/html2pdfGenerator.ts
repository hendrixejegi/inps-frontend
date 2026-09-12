import html2pdf from 'html2pdf.js';
import type { RefObject } from 'react';

export interface Html2PdfOptions {
  filename?: string;
  element?: HTMLElement;
  quality?: number;
  margin?: number;
  format?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  imageType?: 'jpeg' | 'png' | 'webp';
}

/**
 * Generate PDF from HTML element using html2pdf.js
 * This provides WYSIWYG PDF generation that matches the screen preview
 */
export const generatePDFFromElement = async (
  options: Html2PdfOptions = {},
): Promise<void> => {
  const {
    filename = 'document.pdf',
    element,
    quality = 2,
    margin = 0,
    format = 'a4',
    orientation = 'portrait',
    imageType = 'jpeg',
  } = options;

  if (!element) {
    throw new Error('Element is required for PDF generation');
  }

  try {
    const pdfOptions = {
      margin: margin,
      filename: filename,
      image: { type: imageType, quality: quality },
      html2canvas: {
        scale: Math.min(quality, 1.5),
        useCORS: true,
        letterRendering: true,
        windowWidth: element.scrollWidth,
        logging: false,
      },
      jsPDF: {
        unit: 'mm',
        format: format,
        orientation: orientation,
      },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    await html2pdf().set(pdfOptions).from(element).save();
  } catch (error) {
    console.error('Error generating PDF with html2pdf.js:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate PDF: ${errorMessage}`);
  }
};

/**
 * Generate PDF from a React ref using html2pdf.js
 * This is a convenience function for React components
 */
export const generatePDFFromRef = async (
  ref: RefObject<HTMLElement>,
  options: Omit<Html2PdfOptions, 'element'> = {},
): Promise<void> => {
  if (!ref.current) {
    throw new Error('Ref current is null or undefined');
  }

  return generatePDFFromElement({
    ...options,
    element: ref.current,
  });
};
