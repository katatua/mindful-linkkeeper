
import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";

export interface AIGeneratedReport {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  language: string;
  metadata: any;
  chart_data: any;
  report_type: string | null;
  file_url: string | null;
}

export const saveReport = async (report: Omit<AIGeneratedReport, 'id' | 'created_at' | 'updated_at'>) => {
  // Ensure content is at least 2000 words
  if (report.content.split(/\s+/).length < 2000) {
    console.warn("Report content less than 2000 words, might not meet quality standards");
  }

  const { data, error } = await supabase
    .from('ai_generated_reports')
    .insert(report)
    .select('*')
    .single();

  if (error) {
    console.error('Error saving report:', error);
    throw error;
  }

  return data;
};

export const fetchReports = async (language?: string): Promise<AIGeneratedReport[]> => {
  let query = supabase
    .from('ai_generated_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (language) {
    query = query.eq('language', language);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }

  return data || [];
};

export const deleteReport = async (id: string) => {
  const { error } = await supabase
    .from('ai_generated_reports')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting report:', error);
    throw error;
  }

  return true;
};

export const extractVisualizations = (content: string): any[] => {
  const visualizationMarkers = content.match(/\[Visualization:([^\]]+)\]/g) || [];
  return visualizationMarkers.map(marker => {
    try {
      const jsonStr = marker.substring(14, marker.length - 1);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Error parsing visualization data:', e);
      return null;
    }
  }).filter(Boolean);
};

export const generatePDF = (report: AIGeneratedReport): string => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set document properties
  pdf.setProperties({
    title: report.title,
    creator: 'ANI Portal',
    author: 'ANI',
    subject: report.report_type || 'AI Generated Report',
    keywords: 'report, ai, research, innovation'
  });
  
  // Set font sizes
  pdf.setFontSize(22);
  pdf.text(report.title, 20, 30);
  
  pdf.setFontSize(12);
  pdf.text(`Generated on: ${new Date(report.created_at).toLocaleDateString()}`, 20, 45);
  pdf.text(`Report Type: ${report.report_type || 'AI Generated Report'}`, 20, 55);
  
  // Handle report content
  pdf.setFontSize(12);
  
  // Process content as markdown-like - extract sections
  const sections = report.content.split(/^#{1,2} /gm);
  let yPosition = 65;
  
  sections.forEach((section, index) => {
    if (index === 0 && !section.trim()) return; // Skip empty first section
    
    const lines = section.split('\n');
    const heading = lines[0];
    const content = lines.slice(1).join('\n');
    
    if (index > 0) { // Skip for the first section which doesn't have a heading
      pdf.setFontSize(16);
      pdf.text(heading, 20, yPosition);
      yPosition += 10;
    }
    
    pdf.setFontSize(12);
    const contentLines = pdf.splitTextToSize(content, 170);
    
    // Check if we need a new page
    if (yPosition + contentLines.length * 5 > 280) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.text(contentLines, 20, yPosition);
    yPosition += contentLines.length * 5 + 10;
  });
  
  // If there's chart data, we could potentially add visualization here
  // but that would require additional libraries for PDF chart rendering
  
  // Add footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(`ANI Portal - Page ${i} of ${pageCount}`, 20, 287);
  }

  const pdfOutput = pdf.output('datauristring');
  return pdfOutput;
};
