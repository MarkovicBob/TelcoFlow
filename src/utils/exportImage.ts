import domtoimage from "dom-to-image-more";
import { jsPDF } from "jspdf";

// @ts-expect-error - dom-to-image-more lacks official TypeScript types

export const exportCanvasPNG = async (selector: string = ".react-flow") => {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) {
    console.error("Canvas element not found for selector:", selector);
    return;
  }
  try {
    const dataUrl = await domtoimage.toPng(el, {
      cacheBust: true,
      bgcolor: "#0f172a", // slate-950 background for consistency
      style: {
        transform: "none",
      },
    });
    const link = document.createElement("a");
    link.download = `telcoflow_canvas_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to export canvas PNG", err);
  }
};

export const exportCanvasPDF = async (selector: string = ".react-flow") => {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) {
    console.error("Canvas element not found for selector:", selector);
    return;
  }
  try {
    const dataUrl = await domtoimage.toPng(el, {
      cacheBust: true,
      bgcolor: "#0f172a",
      style: {
        transform: "none",
      },
    });

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [el.offsetWidth, el.offsetHeight],
    });

    pdf.addImage(dataUrl, "PNG", 0, 0, el.offsetWidth, el.offsetHeight);

    pdf.save(`telcoflow_canvas_${Date.now()}.pdf`);
  } catch (err) {
    console.error("Failed to export canvas PDF", err);
  }
};
