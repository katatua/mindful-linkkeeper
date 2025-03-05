
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

/**
 * Generates and downloads a PDF of the specified element
 * @param elementId The ID of the DOM element to convert to PDF
 * @param filename The name of the PDF file
 */
export const downloadAsPdf = async (
  elementId: string,
  filename: string,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  toast({
    title: "Preparing PDF export...",
    description: "This may take a few seconds.",
  });

  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const element = document.getElementById(elementId);
    if (!element) {
      toast({
        title: "Export failed",
        description: "Could not find content to export.",
        variant: "destructive",
      });
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, (pdfHeight - 30) / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    pdf.setFontSize(16);
    pdf.text('ANI Innovation Portal - Export', 20, 15);
    
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 22);
    
    pdf.addImage(imgData, 'PNG', imgX, 30, imgWidth * ratio, imgHeight * ratio);
    
    pdf.save(filename);
    
    toast({
      title: "Export successful",
      description: "Your content has been exported as a PDF.",
    });
  } catch (error) {
    console.error('PDF export error:', error);
    toast({
      title: "Export failed",
      description: "There was an error generating the PDF. Please try again.",
      variant: "destructive",
    });
  }
};

/**
 * Copies the current URL to clipboard
 */
export const copyLinkToClipboard = (toast: ReturnType<typeof useToast>["toast"]) => {
  navigator.clipboard.writeText(window.location.href);
  toast({
    title: "Link copied",
    description: "Link has been copied to clipboard"
  });
};
