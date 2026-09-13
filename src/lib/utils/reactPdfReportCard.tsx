import { pdf } from '@react-pdf/renderer';
import type { UnifiedResultsData } from '@/lib/types/results';
import { ReportCardDocument } from '@/components/results/pdf/ReportCardDocument';

export const downloadReportCardPDF = async (
  data: UnifiedResultsData,
  filename = `ReportCard_${data.student.admissionNumber}.pdf`,
): Promise<void> => {
  const blob = await pdf(<ReportCardDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
