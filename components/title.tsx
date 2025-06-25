import getConfig from "next/config";
import { MobileNav } from "./mobile-nav";
import { IssueButton } from "./custom-ui/buttons/issues";
import { ModeToggle } from "./mode-toggle";
import { HowToButton } from "./custom-ui/buttons/how-to";
import { ChangelogDialog } from "./changelog-dialog";

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
        <ChangelogDialog currentAppVersion={undefined} />
        <HowToButton />
        <IssueButton />
        <ModeToggle />
      </div>
    </>
  );
}
