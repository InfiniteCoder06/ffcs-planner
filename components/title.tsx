import getConfig from "next/config";

export function Title() {
  const { publicRuntimeConfig } = getConfig();
  return (
    <h1 className="mb-6 text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      FFCS Planner
      <p className="text-lg font-normal text-gray-400">
        Version {publicRuntimeConfig.version}
      </p>
    </h1>
  );
}
