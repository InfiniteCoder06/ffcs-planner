"use client";

import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/lib/store";
import { toast } from "sonner";
import { Database, RefreshCw, TestTube } from "lucide-react";
import { useState } from "react";

export function MigrationHelper() {
  const store = useScheduleStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const timetables = store.getTimetables();
  const version = store.getVersion();

  const handleMigration = async () => {
    setIsProcessing(true);
    try {
      store.migrateFromLegacyData();
      toast.success("Migration completed", {
        description:
          "Your data has been successfully migrated to the new timetable system.",
      });
    } catch (error) {
      console.error("Migration failed:", error);
      toast.error("Migration failed", {
        description:
          "There was an error migrating your data. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestMigration = async () => {
    setIsTesting(true);
    try {
      const { runMigrationTest } = await import("@/lib/migration-test");
      const result = runMigrationTest();

      if (result.success) {
        toast.success("Migration test passed", {
          description: result.message,
        });
      } else {
        toast.error("Migration test failed", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Test failed:", error);
      toast.error("Test failed", {
        description: "There was an error running the migration test.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Don't show migration helper if already migrated and has timetables
  if (version >= 2 && timetables.length > 0) {
    // In development mode, still show a minimal version for testing
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="p-2 mb-2 border border-blue-200 rounded bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-700 dark:text-blue-300">
              Migration testing (dev only)
            </span>
            <Button
              onClick={handleTestMigration}
              disabled={isTesting}
              variant="outline"
              size="sm"
              className="gap-1 text-xs h-6"
            >
              {isTesting ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <TestTube className="w-3 h-3" />
              )}
              Test Migration
            </Button>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="p-4 mb-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
      <div className="flex items-start gap-3">
        <Database className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
            Data Migration Available
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            We&lsquo;ve updated the timetable system to support multiple
            timetables. Your existing data can be migrated to the new system.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={handleMigration}
              disabled={isProcessing}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              {isProcessing ? "Migrating..." : "Migrate Data"}
            </Button>

            {process.env.NODE_ENV === "development" && (
              <Button
                onClick={handleTestMigration}
                disabled={isTesting}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                {isTesting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4" />
                )}
                Test Migration
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
