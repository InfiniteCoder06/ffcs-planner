"use client";

import { remoteConfig } from "@/lib/firebase";
import { fetchAndActivate, getString } from "firebase/remote-config";
import { useEffect, useState } from "react";
import { AnimatePresenceWrapper, MotionDiv } from "./ui/motion";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function Updater({ version }: { version: string }) {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    fetchAndActivate(remoteConfig)
      .then(() => {
        const latestVersion = getString(remoteConfig, "version");
        if (latestVersion && latestVersion !== version) {
          console.log("New version available:", latestVersion);
          setIsUpdateAvailable(true);
        } else {
          console.log("App is up to date.");
          setIsUpdateAvailable(false);
        }
      })
      .catch((err) => {
        console.log("Error fetching remote config:", err);
      });
  }, [version]);
  return (
    <AnimatePresenceWrapper>
      {isUpdateAvailable === true && (
        <div className="mb-4">
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => {
              window.location.reload();
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "p-4 rounded-lg border flex items-center justify-between",
              "bg-reda-ui border-reda-dim text-reda-dim",
            )}
          >
            <div className="flex items-center gap-3">
              <MotionDiv
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [-5, 0, 5, 0],
                  transition: { duration: 0.5, ease: "easeInOut" },
                }}
              >
                {<AlertTriangle className={cn("h-6 w-6")} />}
              </MotionDiv>
              <div>
                <h3 className={cn("font-medium")}>{"Update Available"}</h3>
                <p className={cn("text-sm")}>
                  {"Please refresh the page to get the latest version."}
                </p>
              </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresenceWrapper>
  );
}
