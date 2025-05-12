import html2canvas from "html2canvas-pro"
import { jsPDF } from "jspdf"

/**
 * Exports the timetable as a PDF file
 * @param element The HTML element to export
 * @param filename The name of the PDF file
 */
export async function exportToPdf(element: HTMLElement, filename: string): Promise<void> {
  // Add a class to the element for styling during export
  element.classList.add("exporting")

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Remove the export class
    element.classList.remove("exporting")

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
    })

    // Calculate dimensions to fit the page
    const imgWidth = 280
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)

    // Save the PDF
    pdf.save(filename)
  } catch (error) {
    // Remove the export class in case of error
    element.classList.remove("exporting")
    console.error("Error exporting to PDF:", error)
    throw error
  }
}

/**
 * Exports the timetable as an image
 * @param element The HTML element to export
 * @param filename The name of the image file
 */
export async function exportToImage(element: HTMLElement, filename: string): Promise<void> {
  // Add a class to the element for styling during export
  element.classList.add("exporting")

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Remove the export class
    element.classList.remove("exporting")

    // Create a download link
    const link = document.createElement("a")
    link.download = filename
    link.href = canvas.toDataURL("image/png")
    link.click()
  } catch (error) {
    // Remove the export class in case of error
    element.classList.remove("exporting")
    console.error("Error exporting to image:", error)
    throw error
  }
}