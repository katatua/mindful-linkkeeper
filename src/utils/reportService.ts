
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
  const wordCount = report.content.split(/\s+/).length;
  if (wordCount < 2000) {
    console.warn(`Report content has only ${wordCount} words, which is less than the 2000 word minimum. It might not meet quality standards.`);
    
    // Do not save reports with less than 2000 words
    throw new Error("Report must contain at least 2000 words to meet quality standards");
  }

  // Verify visualizations are properly formatted
  const visualizations = extractVisualizations(report.content);
  if (visualizations.length === 0) {
    console.warn("Report does not contain any visualizations");
    throw new Error("Report must contain visualizations to meet quality standards");
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

// Improved function to validate report content quality
export const validateReportQuality = (content: string) => {
  const wordCount = content.split(/\s+/).length;
  const visualizations = extractVisualizations(content);
  
  const issues = [];
  
  if (wordCount < 2000) {
    issues.push(`Word count (${wordCount}) is below 2000 words minimum`);
  }
  
  if (visualizations.length === 0) {
    issues.push("No visualizations found in the report");
  }
  
  const paragraphs = content.split(/\n\n+/);
  // Check if visualizations are properly distributed throughout the report
  let visualizationCount = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    if (paragraphs[i].includes("[Visualization:")) {
      visualizationCount++;
    }
  }
  
  if (visualizationCount < 3) {
    issues.push(`Only ${visualizationCount} visualizations found. Reports should have at least 3 visualizations`);
  }
  
  return {
    isValid: issues.length === 0,
    wordCount,
    visualizationCount,
    issues
  };
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
