import { useState, useRef } from 'react';
import { UnifiedResultsData } from '@/lib/types/results';
import { Button } from '@/components/ui/button';
import { Download, Printer, Loader2 } from 'lucide-react';
import { downloadReportCardPDF } from '@/lib/utils/reactPdfReportCard';

interface ReportCardLayoutProps {
  data: UnifiedResultsData;
  showAsPreview?: boolean;
  showControls?: boolean;
  onGeneratePDF?: (filename?: string) => Promise<void>;
  className?: string;
  pdfFilename?: string;
}

export function ReportCardLayout({
  data,
  showAsPreview = true,
  showControls = false,
  onGeneratePDF,
  className,
  pdfFilename,
}: ReportCardLayoutProps) {
  const reportCardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      if (onGeneratePDF) {
        await onGeneratePDF(pdfFilename);
      } else {
        const filename =
          pdfFilename || `ReportCard_${data.student.admissionNumber}.pdf`;
        await downloadReportCardPDF(data, filename);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (reportCardRef.current) {
      const printContent = reportCardRef.current.innerHTML;
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Report Card</title>
              <style>
                @page { size: A4 portrait; margin: 0; }
                body { font-family: Helvetica, Arial, sans-serif; padding: 0; margin: 0; }
                .report-card-pdf { width: 794px; min-height: 1123px; box-sizing: border-box; }
                @media print { body { padding: 0; margin: 0; } }
              </style>
            </head>
            <body>${printContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  // Rating checkbox component
  const RatingCheckbox = ({
    value,
    max = 5,
  }: {
    value?: number;
    max?: number;
  }) => {
    return (
      <>
        {Array.from({ length: max }).map((_, index) => (
          <td key={index}>
            <div
              className={`size-3 border mx-auto ${
                value !== undefined && index < value
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-400 bg-white'
              }`}
            />
          </td>
        ))}
      </>
    );
  };

  return (
    <div className="relative">
      {showControls && (
        <div className="flex gap-2 mb-4" data-html2canvas-ignore="true">
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            data-html2canvas-ignore="true"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      )}

      <div
        ref={reportCardRef}
        className={`report-card-pdf min-h-[1123px] w-[794px] box-border bg-white p-6 ${className || ''}`}
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '10px',
          lineHeight: 1.15,
        }}
      >
        {/* School Header */}
        <div className="mb-2 flex items-center justify-center gap-2 text-center">
          <img
            src="https://res.cloudinary.com/dligmvsem/image/upload/v1786435836/logoo_ddwy4c.png"
            alt="School Logo"
            className="h-20"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-bold">
              INTERNATIONAL NURSERY AND PRIMARY SCHOOL
            </h1>
            <span>11/17 Hill view avenue trans Ekulu Enugu</span>
            <span>STUDENT REPORT SHEET</span>
          </div>
        </div>

        {/* Student Information - Matching Image Layout */}
        <div className="mb-2  flex items-stretch">
          <table className="w-full table-fixed border-collapse">
            <tr className="*:border *:p-1 ">
              <td className="uppercase font-bold bg-gray-50">Name</td>
              <td>
                {data.student.lastName.toUpperCase()} {data.student.firstName}{' '}
                {data.student.middleName || ''}
              </td>
              <td className="uppercase font-bold bg-gray-50">
                Admission Number
              </td>
              <td>{data.student.admissionNumber}</td>
              <td className="uppercase font-bold bg-gray-50">Gender</td>
              <td className="break-words">{data.student.gender || 'N/A'}</td>
            </tr>
            <tr className="*:border *:p-1 ">
              <td className="uppercase font-bold bg-gray-50">Class</td>
              <td>{data.student.className}</td>
              <td className="uppercase font-bold bg-gray-50">Term</td>
              <td>{data.term}</td>
              <td className="uppercase font-bold bg-gray-50">Year</td>
              <td className="break-words">{data.session}</td>
            </tr>
            <tr className="*:border *:p-1 ">
              <td className="uppercase font-bold bg-gray-50">Age</td>
              <td>N/A</td>
              <td className="uppercase font-bold bg-gray-50">
                Class Age Average
              </td>
              <td>N/A</td>
              <td className="uppercase font-bold bg-gray-50">No. In Class</td>
              <td>N/A</td>
            </tr>
            <tr className="*:border *:p-1 ">
              {/* <td className="uppercase font-bold bg-gray-50">
                Times School Opened
              </td>
              <td>N/A</td>
              <td className="uppercase font-bold bg-gray-50">
                % Times Present
              </td>
              <td>N/A</td> */}
              <td className="uppercase font-bold bg-gray-50">Position</td>
              <td>{data.summary?.overallPosition || 'N/A'}</td>
            </tr>
          </table>

          <div className="w-[110px] border flex items-center justify-center text-center text-xs p-1">
            NWAKALT
            <br />
            Brielle
          </div>
        </div>

        {/* Academic Performance Table */}
        {data.results && data.results.length > 0 && (
          <div className="mb-2">
            <div className="border  overflow-hidden">
              <table className="w-full table-fixed border border-collapse text-[9px] [&_th]:break-words [&_th]:leading-tight">
                <colgroup>
                  <col className="w-[13%]" />
                  <col className="w-[6%]" />
                  <col className="w-[6%]" />
                  <col className="w-[6%]" />
                  <col className="w-[7%]" />
                  <col className="w-[6%]" />
                  <col className="w-[6%]" />
                  <col className="w-[9%]" />
                  <col className="w-[12%]" />
                  <col className="w-[6%]" />
                  <col className="w-[6%]" />
                  <col className="w-[17%]" />
                </colgroup>
                <thead className="bg-gray-50">
                  <tr className="*:border">
                    <th className="border-b p-0.5 text-left text-[9px] font-semibold"></th>
                    <th
                      className="border-b p-0.5 text-center text-[9px] font-semibold"
                      colSpan={4}
                    >
                      3rd TERM
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      2nd TERM
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      1st TERM
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold"></th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold"></th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold"></th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold"></th>
                    <th className="border-b p-0.5 text-left text-[9px] font-semibold"></th>
                  </tr>
                  <tr className="*:border">
                    <th className="border-b p-0.5 text-left text-[9px] font-semibold">
                      SUBJECT
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      TEST1 30
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      TEST2 30
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      EXAM 40
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      TOTAL 100
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      100
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      100
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      CUMULATIVE 300
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      AGGREGATE WEIGHTED AVERAGE
                    </th>
                    <th className="border-b p-0.5 text-center text-[9px] font-semibold">
                      GRADE
                    </th>
                    <th className="border-b p-0.5 text-left text-[9px] font-semibold">
                      POSITION
                    </th>
                    <th className="border-b p-0.5 text-left text-[9px] font-semibold">
                      REMARK
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((result, index) => (
                    <tr key={index} className={`break-inside-avoid`}>
                      <td className="break-words border p-1 text-[10px]">
                        {result.subject.subjectName || 'N/A'}
                      </td>
                      <td className="border p-1 text-center text-[10px]">
                        {result.scores.ca1.toFixed(0) || '-'}
                      </td>
                      <td className="border p-1 text-center text-[10px]">
                        {result.scores.ca2.toFixed(0) || '-'}
                      </td>
                      <td className="border p-1 text-center text-[10px]">
                        {result.scores.exam.toFixed(0) || '-'}
                      </td>
                      <td className="border p-1 text-center text-[10px] font-semibold">
                        {result.scores.total.toFixed(0) || '-'}
                      </td>
                      <td className="border bg-gray-100 p-1 text-center text-[10px]">
                        -
                      </td>
                      <td className="border bg-gray-100 p-1 text-center text-[10px]">
                        -
                      </td>
                      <td className="border p-1 text-center text-[10px] font-semibold">
                        {result.cumulativeTotal?.toFixed(0) || '-'}
                      </td>
                      <td className="border p-1 text-center text-[10px]">
                        {result.weightedAverage?.toFixed(1) || '-'}
                      </td>
                      <td className="border p-1 text-center text-[10px] font-semibold">
                        {result.scores.grade || '-'}
                      </td>
                      <td className="border p-1 text-center text-[10px]">
                        {result.position?.toString() || '-'}
                      </td>
                      <td className="break-words border p-1 text-left text-[10px]">
                        {result.subjectTeacherRemark || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary & Remarks */}
        <div className="mb-2 break-inside-avoid border">
          <table className="border-collapse border table-auto w-full">
            <tr className="*:border">
              <td className="font-bold px-1 py-2 bg-gray-50">
                SUBJECT OFFERED
              </td>
              <td className="px-1 py-2 text-center">
                {data.summary?.totalSubjects ?? 0}
              </td>
              <td className="font-bold px-1 py-2 bg-gray-50">MARK OBTAINED</td>
              <td className="px-1 py-2 text-center">N/A</td>
              <td className="font-bold px-1 py-2 bg-gray-50">
                MARK OBTAINABLE
              </td>
              <td className="px-1 py-2 text-center">N/A</td>
              <td className="font-bold px-1 py-2 bg-gray-50">% OF MARK</td>
              <td className="px-1 py-2 text-center">N/A</td>
            </tr>
            <tr className="*:border">
              <td className="font-bold px-1 py-2 bg-gray-50" colSpan={2}>
                CLASS TEACHER'S REMARK
              </td>
              <td className="px-1 py-2 text-center" colSpan={4}>
                {data.remarks?.classTeacherRemark || 'N/A'}
              </td>
              <td className="px-1 py-2" colSpan={2}></td>
            </tr>
            <tr className="*:border">
              <td className="font-bold px-1 py-2 bg-gray-50" colSpan={2}>
                HEAD OF SCHOOL REMARK
              </td>
              <td className="px-1 py-2 text-center" colSpan={4}>
                {data.remarks?.headTeacherRemark || 'N/A'}
              </td>
              <td className="px-1 py-2" colSpan={2}></td>
            </tr>
            <tr className="*:border">
              <td className="font-bold px-1 py-2 bg-gray-50" colSpan={2}>
                NEXT TERM BEGINS
              </td>
            </tr>
          </table>
        </div>

        {/* Skills & Behavior Section */}
        <div className="mb-2 border">
          <h3 className="text-xs font-bold py-1 uppercase text-center">
            Skills & Behavior
          </h3>
          <div className="grid grid-cols-2 items-start">
            {/* Skills */}
            <table className="border-collapse table-auto">
              <thead>
                <tr className="*:border *:p-1 bg-gray-50">
                  <th className="uppercase">Skills 1 - 5</th>
                  <th>5</th>
                  <th>4</th>
                  <th>3</th>
                  <th>2</th>
                  <th>1</th>
                </tr>
              </thead>
              <tbody>
                <tr className="*:border *:p-1 *:leading-none">
                  <td>Fluency</td>
                  <RatingCheckbox value={data.skillsRatings?.fluency} />
                </tr>
                <tr className="*:border *:p-1">
                  <td>Games:</td>
                  <RatingCheckbox value={data.skillsRatings?.games} />
                </tr>
                <tr className="*:border *:p-1">
                  <td>Musical Skills:</td>
                  <RatingCheckbox value={data.skillsRatings?.musicalSkills} />
                </tr>
              </tbody>
            </table>
            {/* Behavior */}
            <table className="border-collapse table-auto">
              <thead>
                <tr className="*:border *:p-1 bg-gray-50">
                  <th className="uppercase">Behavior 1 - 5</th>
                  <th>5</th>
                  <th>4</th>
                  <th>3</th>
                  <th>2</th>
                  <th>1</th>
                </tr>
              </thead>
              <tbody>
                <tr className="*:border *:p-1 *:leading-none">
                  <td>Punctuality</td>
                  <RatingCheckbox value={data.behaviorRatings?.punctuality} />
                </tr>
                <tr className="*:border *:p-1">
                  <td>Neatness</td>
                  <RatingCheckbox value={data.behaviorRatings?.neatness} />
                </tr>
                <tr className="*:border *:p-1">
                  <td>Politeness</td>
                  <RatingCheckbox value={data.behaviorRatings?.politeness} />
                </tr>
                <tr className="*:border *:p-1">
                  <td>Self Control</td>
                  <RatingCheckbox value={data.behaviorRatings?.selfControl} />
                </tr>
              </tbody>
            </table>
          </div>
          {/* Key to Ratings */}
          <div className="mb-2 p-3 border">
            <h3 className="text-xs font-bold mb-2 uppercase">Key to Ratings</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <p>
                <span className="font-bold">5:</span> Maintains an excellent
                degree of observable traits
              </p>
              <p>
                <span className="font-bold">4:</span> Maintains high level of
                observable traits
              </p>
              <p>
                <span className="font-bold">3:</span> Maintains an acceptable
                level of observable traits
              </p>
              <p>
                <span className="font-bold">2:</span> Shows minimal level for
                observable traits
              </p>
              <p>
                <span className="font-bold">1:</span> Has no regards for
                observable traits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
