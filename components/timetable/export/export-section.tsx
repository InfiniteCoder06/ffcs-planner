"use client";

import { Button } from "@/components/ui/button";
import { MotionDiv, ScrollAnimation } from "@/components/ui/motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/radix/tabs";
import { exportToImage, exportToPdf } from "@/lib/export-utils";
import { useScheduleStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Download,
  FileIcon as FilePdf,
  ImageIcon,
  Printer,
  Share2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExportPreview } from "./export-preview";
import { useTheme } from "next-themes";

export function ExportSection() {
  const [exportType, setExportType] = useState<"pdf" | "image">("image");
  const [isExporting, setIsExporting] = useState(false);
  const { getSelectedTeachers } = useScheduleStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const selectedTeachers = getSelectedTeachers();

  const handleExport = async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      // Use a temporary div with full scale for export
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.transform = "scale(1)";
      tempDiv.innerHTML = previewRef.current.innerHTML;
      document.body.appendChild(tempDiv);

      switch (exportType) {
        case "pdf":
          await exportToPdf(tempDiv, "ffcs-timetable.pdf");
          toast("PDF exported successfully", {
            description: "Your timetable has been exported as a PDF file",
          });
          break;
        case "image":
          await exportToImage(tempDiv, "ffcs-timetable.png", isDarkMode);
          toast("Image exported successfully", {
            description: "Your timetable has been exported as an image",
          });
          break;
      }

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      toast.error("Export failed", {
        description: "There was an error exporting your timetable",
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const hasSelectedCourses = selectedTeachers.length > 0;

  return (
    <ScrollAnimation animation="fadeIn" duration={0.6} className="mb-6">
      <div className="border rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold">Export Timetable</h2>
        </div>

        <div className="p-4">
          <Tabs
            defaultValue="pdf"
            className="mb-4"
            onValueChange={(value) => setExportType(value as "pdf" | "image")}
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <FilePdf className="w-4 h-4" />
                PDF
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="print" className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pdf" className="mt-2">
              <div className="p-4 border rounded-md">
                <h3 className="mb-2 text-lg font-medium">PDF Export</h3>
                <p className="text-sm text-muted-foreground">
                  Export your timetable as a PDF file that you can save, share,
                  or print later.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="image" className="mt-2">
              <div className="p-4 border rounded-md">
                <h3 className="mb-2 text-lg font-medium">Image Export</h3>
                <p className="text-sm text-muted-foreground">
                  Export your timetable as a PNG image that you can easily share
                  on social media or messaging apps.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="print" className="mt-2">
              <div className="p-4 border rounded-md">
                <h3 className="mb-2 text-lg font-medium">Print</h3>
                <p className="text-sm text-muted-foreground">
                  Open the print dialog to print your timetable directly from
                  your browser.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <h3 className="text-lg font-medium">Preview</h3>
            <div
              // ref={containerRef}
              className={cn(
                "border rounded-md p-4 max-h-[60vh] overflow-auto",
                "flex justify-center items-start",
              )}
            >
              <ScrollAnimation animation="fadeIn" duration={0.5}>
                <div
                  ref={previewRef}
                  className="origin-top"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <ExportPreview />
                </div>
              </ScrollAnimation>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleExport}
              disabled={isExporting || !hasSelectedCourses}
              className="gap-2"
            >
              {isExporting ? (
                <MotionDiv
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1,
                    ease: "linear",
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </MotionDiv>
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting
                ? "Exporting..."
                : `Export as ${exportType.toWellFormed()}`}
            </Button>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  );
}
