import getConfig from "next/config";
import { Updater } from "./updater";
import { MobileNav } from "./mobile-nav";
import { IssueButton } from "./issues";
import { ModeToggle } from "./mode-toggle";

export function Title() {
  const { publicRuntimeConfig } = getConfig();
  const version = publicRuntimeConfig.version;

  return (
    <>
      <h1 className="mb-6 text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        FFCS Planner
        <p className="text-lg font-normal text-gray-400">Version {version}</p>
      </h1>
      <MobileNav />
      <div className="hidden md:flex fixed top-4 right-6 gap-2">
        <IssueButton />
        <ModeToggle />
      </div>
      {process.env.NODE_ENV === "production" && <Updater version={version} />}
    </>
  );
}
