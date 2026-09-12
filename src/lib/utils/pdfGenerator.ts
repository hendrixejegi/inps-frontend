import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type {
  UnifiedResultsData,
  PDFOptions,
  UnifiedSubjectResult,
} from '@/lib/types/results';

/**
 * PDF Generation Strategy
 *
 * This file provides two approaches for PDF generation:
 *
 * 1. jsPDF (generateResultsPDF): Programmatic PDF generation
 *    - Best for: Batch generation, simple layouts, high performance
 *    - Use when: Generating multiple documents, need precise control over layout
 *    - Limitations: Complex CSS/Tailwind styling may not render perfectly
 *
 * 2. html2pdf.js (generateReportCardFromRef): WYSIWYG PDF generation
 *    - Best for: Single documents, complex styling, visual fidelity
 *    - Use when: Need exact match to screen preview, rich HTML/CSS styling
 *    - Import from: '@/lib/utils/html2pdfGenerator'
 *    - Limitations: Slower performance, requires DOM element reference
 *
 * Recommendation:
 * - Use html2pdf.js for single report cards where visual accuracy is important
 * - Use jsPDF for batch generation or when performance is critical
 */

// School branding configuration
const SCHOOL_CONFIG = {
  name: 'International Nursery and Primary School',
  address: 'Trans-Ekulu Enugu',
  logoUrl:
    'https://res.cloudinary.com/dligmvsem/image/upload/v1786435836/logoo_ddwy4c.png',
};

// Color constants for reliable jsPDF color handling
const PRIMARY_COLOR = { r: 41, g: 128, b: 185 }; // Blue
const SECONDARY_COLOR = { r: 39, g: 174, b: 96 }; // Green
const TEXT_COLOR = { r: 51, g: 51, b: 51 }; // Dark gray
const ORANGE_COLOR = { r: 243, g: 156, b: 18 };
const PURPLE_COLOR = { r: 155, g: 89, b: 182 };
const WHITE_COLOR = { r: 255, g: 255, b: 255 };

// Grading scale reference
const GRADING_SCALE = [
  {
    grade: 'A',
    range: '70-100',
    description: 'Excellent',
    color: { r: 39, g: 174, b: 96 },
  },
  {
    grade: 'B',
    range: '60-69',
    description: 'Very Good',
    color: { r: 41, g: 128, b: 185 },
  },
  {
    grade: 'C',
    range: '55-59',
    description: 'Good',
    color: { r: 41, g: 128, b: 185 },
  },
  {
    grade: 'D',
    range: '50-54',
    description: 'Fair',
    color: { r: 243, g: 156, b: 18 },
  },
  {
    grade: 'F',
    range: '0-44',
    description: 'Fail',
    color: { r: 231, g: 76, b: 60 },
  },
];

/**
 * Generate a professional report card PDF using jsPDF and jsPDF-autotable
 */
export const generateResultsPDF = async (
  data: UnifiedResultsData,
  options: PDFOptions = {},
): Promise<void> => {
  const {
    filename = `ReportCard_${data.student.admissionNumber}.pdf`,
    orientation = 'portrait',
    format = 'a4',
    unit = 'mm',
  } = options;

  // Create PDF document
  const doc = new jsPDF({
    orientation,
    format,
    unit,
  });

  let yPos = 10;

  // Add school header
  addSchoolHeader(doc, yPos);
  yPos += 30;

  // Add report card title
  addReportCardTitle(doc, yPos);
  yPos += 15;

  // Add student information
  yPos = addStudentInfo(doc, yPos, data);
  yPos += 10;

  // Add academic performance table
  yPos = addResultsTable(doc, yPos, data.results);
  yPos += 10;

  // Add summary statistics if available
  if (data.summary) {
    yPos = addSummaryStatistics(doc, yPos, data.summary);
    yPos += 10;
  }

  // Add remarks if available
  if (data.remarks) {
    yPos = addRemarks(doc, yPos, data.remarks);
    yPos += 10;
  }

  // Add grading scale
  yPos = addGradingScale(doc, yPos);
  yPos += 10;

  // Add footer with signatures
  addFooter(doc, yPos, data);

  // Save the PDF
  doc.save(filename);
};

// Keep backward compatibility
export const generateReportCardPDF = generateResultsPDF;

/**
 * Add school header with logo and name
 */
const addSchoolHeader = (doc: jsPDF, yPos: number): void => {
  // Try to add logo centered above text
  try {
    // Center the logo (page width is 210mm, so center is 105mm)
    // Logo width 15mm, so x position = 105 - (15/2) = 97.5
    doc.addImage(SCHOOL_CONFIG.logoUrl, 'PNG', 97.5, yPos, 15, 15);
  } catch (error) {
    console.warn('Failed to load school logo:', error);
  }

  // School name centered below logo
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY_COLOR.r, PRIMARY_COLOR.g, PRIMARY_COLOR.b);
  doc.text(SCHOOL_CONFIG.name, 105, yPos + 20, { align: 'center' });

  // School address centered below school name
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_COLOR.r, TEXT_COLOR.g, TEXT_COLOR.b);
  doc.text(SCHOOL_CONFIG.address, 105, yPos + 26, { align: 'center' });
};

/**
 * Add report card title
 */
const addReportCardTitle = (doc: jsPDF, yPos: number): void => {
  doc.setFillColor(PRIMARY_COLOR.r, PRIMARY_COLOR.g, PRIMARY_COLOR.b);
  doc.rect(20, yPos, 170, 8, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(WHITE_COLOR.r, WHITE_COLOR.g, WHITE_COLOR.b);
  doc.text('STUDENT REPORT CARD', 105, yPos + 5, { align: 'center' });
};

/**
 * Add student information section
 */
const addStudentInfo = (
  doc: jsPDF,
  yPos: number,
  data: UnifiedResultsData,
): number => {
  // Student info box
  doc.setDrawColor(PRIMARY_COLOR.r, PRIMARY_COLOR.g, PRIMARY_COLOR.b);
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 25);

  // Title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY_COLOR.r, PRIMARY_COLOR.g, PRIMARY_COLOR.b);
  doc.text('STUDENT INFORMATION', 25, yPos + 5);

  // Student details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_COLOR.r, TEXT_COLOR.g, TEXT_COLOR.b);

  const studentName = `${data.student.firstName} ${data.student.middleName || ''} ${data.student.lastName}`;
  const classTeacher = data.student.classTeacher
    ? `${data.student.classTeacher.firstName || ''} ${data.student.classTeacher.lastName || ''}`
    : 'N/A';

  const details = [
    [`Name: ${studentName}`, `Admission No: ${data.student.admissionNumber}`],
    [`Class: ${data.student.className || 'N/A'}`, `Session: ${data.session}`],
    [`Term: ${data.term}`, `Class Teacher: ${classTeacher}`],
  ];

  let currentY = yPos + 10;
  details.forEach((row, index) => {
    doc.text(row[0], 25, currentY);
    doc.text(row[1], 105, currentY);
    currentY += 5;
  });

  return yPos + 25;
};

/**
 * Add academic performance table using jsPDF-autotable
 */
const addResultsTable = (
  doc: jsPDF,
  yPos: number,
  results: UnifiedSubjectResult[],
): number => {
  if (!results || results.length === 0) return yPos;

  // Title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY_COLOR.r, PRIMARY_COLOR.g, PRIMARY_COLOR.b);
  doc.text('ACADEMIC PERFORMANCE', 20, yPos);

  // Prepare table data
  const tableHead = [
    ['Subject', 'CA1', 'CA2', 'Exam', 'Total', 'Grade', 'Position', 'Remark'],
  ];
  const tableBody = results.map((result) => [
    result.subject.subjectName || 'N/A',
    result.scores.ca1.toFixed(0) || '-',
    result.scores.ca2.toFixed(0) || '-',
    result.scores.exam.toFixed(0) || '-',
    result.scores.total.toFixed(0) || '-',
    result.scores.grade || '-',
    result.position?.toString() || '-',
    result.subjectTeacherRemark || '-',
  ]);

  // Generate table using jsPDF-autotable
  autoTable(doc, {
    startY: yPos + 5,
    head: tableHead,
    body: tableBody,
    margin: { top: 10, left: 20, right: 20 },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle',
      halign: 'left',
    },
    headStyles: {
      fillColor: [PRIMARY_COLOR.r, PRIMARY_COLOR.g, PRIMARY_COLOR.b],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 35 }, // Subject
      1: { cellWidth: 15, halign: 'center' }, // CA1
      2: { cellWidth: 15, halign: 'center' }, // CA2
      3: { cellWidth: 15, halign: 'center' }, // Exam
      4: { cellWidth: 15, halign: 'center', fontStyle: 'bold' }, // Total
      5: { cellWidth: 15, halign: 'center', fontStyle: 'bold' }, // Grade
      6: { cellWidth: 15, halign: 'center' }, // Position
      7: { cellWidth: 'auto' }, // Remark
    },
  });

  // Return the Y position after the table
  return (doc as any).lastAutoTable.finalY + 5;
};

/**
 * Add summary statistics section
 */
const addSummaryStatistics = (
  doc: jsPDF,
  yPos: number,
  summary: UnifiedResultsData['summary'],
): number => {
  // Summary box
  doc.setDrawColor(SECONDARY_COLOR.r, SECONDARY_COLOR.g, SECONDARY_COLOR.b);
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 20);

  // Title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SECONDARY_COLOR.r, SECONDARY_COLOR.g, SECONDARY_COLOR.b);
  doc.text('SUMMARY STATISTICS', 25, yPos + 5);

  // Statistics
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_COLOR.r, TEXT_COLOR.g, TEXT_COLOR.b);

  const stats = [
    [
      `Total Subjects: ${summary.totalSubjects}`,
      `Average Score: ${summary.averageScore.toFixed(2)}`,
    ],
    [
      `Subjects Passed: ${summary.subjectsPassed}/${summary.totalSubjects}`,
      `Class Size: ${summary.classEnrollmentCount || 'N/A'} students`,
    ],
  ];

  let currentY = yPos + 10;
  stats.forEach((row) => {
    doc.text(row[0], 25, currentY);
    doc.text(row[1], 105, currentY);
    currentY += 5;
  });

  return yPos + 20;
};

/**
 * Add remarks section
 */
const addRemarks = (
  doc: jsPDF,
  yPos: number,
  remarks: UnifiedResultsData['remarks'],
): number => {
  // Remarks box
  doc.setDrawColor(ORANGE_COLOR.r, ORANGE_COLOR.g, ORANGE_COLOR.b);
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 20);

  // Title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ORANGE_COLOR.r, ORANGE_COLOR.g, ORANGE_COLOR.b);
  doc.text('REMARKS', 25, yPos + 5);

  // Remarks
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_COLOR.r, TEXT_COLOR.g, TEXT_COLOR.b);

  const classTeacherRemark = remarks?.classTeacherRemark || 'No remark';
  const headTeacherRemark = remarks?.headTeacherRemark || 'No remark';

  doc.text(`Class Teacher: ${classTeacherRemark}`, 25, yPos + 10);
  doc.text(`Head Teacher: ${headTeacherRemark}`, 25, yPos + 15);

  return yPos + 20;
};

/**
 * Add grading scale reference
 */
const addGradingScale = (doc: jsPDF, yPos: number): number => {
  // Grading scale box
  doc.setDrawColor(PURPLE_COLOR.r, PURPLE_COLOR.g, PURPLE_COLOR.b);
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 15);

  // Title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PURPLE_COLOR.r, PURPLE_COLOR.g, PURPLE_COLOR.b);
  doc.text('GRADING SCALE', 25, yPos + 5);

  // Grading scale table
  const scaleText = GRADING_SCALE.map(
    (scale) => `${scale.grade}: ${scale.range} - ${scale.description}`,
  ).join(' | ');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_COLOR.r, TEXT_COLOR.g, TEXT_COLOR.b);
  doc.text(scaleText, 25, yPos + 10, { maxWidth: 160 });

  return yPos + 15;
};

/**
 * Add footer with signatures and date
 */
const addFooter = (
  doc: jsPDF,
  yPos: number,
  data: UnifiedResultsData,
): void => {
  // Official document text
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(TEXT_COLOR.r, TEXT_COLOR.g, TEXT_COLOR.b);
  doc.text(
    'This is an official document from International Nursery and Primary School',
    105,
    yPos,
    { align: 'center' },
  );

  // Generation date
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos + 5, {
    align: 'center',
  });

  // Signature placeholders
  const signatureY = yPos + 15;

  // Class Teacher signature
  doc.setDrawColor(PRIMARY_COLOR.r, PRIMARY_COLOR.g, PRIMARY_COLOR.b);
  doc.setLineWidth(0.3);
  doc.line(25, signatureY, 65, signatureY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Class Teacher', 45, signatureY + 5, { align: 'center' });

  // Head Teacher signature
  doc.line(145, signatureY, 185, signatureY);
  doc.text('Head Teacher', 165, signatureY + 5, { align: 'center' });
};

/**
 * Generate PDF from parent results data
 */
export const generateParentResultsPDF = async (
  childData: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    class?: { name: string };
    middleName?: string;
  },
  resultsData: {
    session: string;
    term: string;
    results?: unknown[];
    summary?: unknown;
    classTeacherRemark?: string;
    headTeacherRemark?: string;
  },
  options: PDFOptions = {},
): Promise<void> => {
  // Import transformation function dynamically to avoid circular dependency
  const { transformParentToUnified } = await import('@/lib/types/results');

  // Transform parent data to unified format
  const unifiedData = transformParentToUnified(resultsData, childData);

  await generateResultsPDF(unifiedData, options);
};
