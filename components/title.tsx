import { ChangelogDialog } from "./changelog-dialog";
import { HowToButton } from "./nav-bar/buttons/how-to";
import { IssueButton } from "./nav-bar/buttons/issues";
import { ModeToggle } from "./nav-bar/buttons/mode-toggle";
import { MobileNav } from "./nav-bar/mobile-nav";

export function Title() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <>
      <h1 className="mb-6 text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        FFCS Planner
        <p className="text-lg font-normal text-gray-400">Version {version}</p>
      </h1>
      <MobileNav />
      <div className="hidden xl:flex fixed top-4 right-6 gap-2">
        <ChangelogDialog currentAppVersion={undefined} />
        <HowToButton />
        <IssueButton />
        <ModeToggle />
      </div>
    </>
  );
}
