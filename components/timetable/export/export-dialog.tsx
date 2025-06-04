"use client";

import { ExportPreview } from "@/components/timetable/export/export-preview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { MotionDiv, ScrollAnimation } from "@/components/ui/motion";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToImage, exportToPdf } from "@/lib/export-utils";
import { useScheduleStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Download,
  FileIcon as FilePdf,
  ImageIcon,
  Printer,
  Share2,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function ExportDialog() {
  const [open, setOpen] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "image">("pdf");
  const [scale, setScale] = useState(0.6);
  const [isExporting, setIsExporting] = useState(false);
  const { selectedTeachers } = useScheduleStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && containerRef.current && previewRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = previewRef.current.scrollWidth;

      if (contentWidth > containerWidth) {
        const idealScale = (containerWidth - 40) / contentWidth;
        setScale(Math.min(Math.max(idealScale, 0.4), 0.9)); // Limit between 0.4 and 0.9
      }
    }
  }, [open, exportType]);

  const handleExport = async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.transform = "scale(1)";
      tempDiv.innerHTML = previewRef.current.innerHTML;
      document.body.appendChild(tempDiv);

      switch (exportType) {
        case "pdf":
          await exportToPdf(previewRef.current, "ffcs-timetable.pdf");
          toast("PDF exported successfully", {
            description: "Your timetable has been exported as a PDF file",
          });
          break;
        case "image":
          await exportToImage(previewRef.current, "ffcs-timetable.png");
          toast("Image exported successfully", {
            description: "Your timetable has been exported as an image",
          });
          break;
      }
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton
          icon="download"
          variant="default"
          size="sm"
          label="Export"
          disabled={!hasSelectedCourses}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="w-5/6">
            <DialogTitle>Export Timetable</DialogTitle>
            <DialogDescription>
              Choose how you want to export your timetable
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="pdf"
            className="mt-4 w-5/6"
            onValueChange={(value) => setExportType(value as "pdf" | "image")}
          >
            <TabsList className="grid w-full grid-cols-3">
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
            <TabsContent value="pdf" className="mt-4">
              <div className="p-4 border rounded-md">
                <h3 className="mb-2 text-lg font-medium">PDF Export</h3>
                <p className="text-sm text-muted-foreground">
                  Export your timetable as a PDF file that you can save, share,
                  or print later.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="image" className="mt-4">
              <div className="p-4 border rounded-md">
                <h3 className="mb-2 text-lg font-medium">Image Export</h3>
                <p className="text-sm text-muted-foreground">
                  Export your timetable as a PNG image that you can easily share
                  on social media or messaging apps.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="print" className="mt-4">
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Preview</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ZoomOutIcon className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={[scale]}
                    min={0.4}
                    max={1}
                    step={0.05}
                    onValueChange={(values) => setScale(values[0])}
                    className="w-24"
                  />
                  <ZoomInIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(scale * 100)}%
                </span>
              </div>
            </div>
            <div
              ref={containerRef}
              className={cn(
                "border rounded-md p-4 max-h-[60vh] overflow-auto dark:bg-white",
                "flex justify-center items-start",
              )}
            >
              <ScrollAnimation animation="fadeIn" duration={0.5}>
                <div ref={previewRef} className="bg-white">
                  {<ExportPreview />}
                </div>
              </ScrollAnimation>
            </div>
          </div>

          <DialogFooter className="mt-6 w-5/6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
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
                : `Export as ${exportType.toUpperCase()}`}
            </Button>
          </DialogFooter>
        </MotionDiv>
      </DialogContent>
    </Dialog>
  );
}
