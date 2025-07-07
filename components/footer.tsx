export function Footer() {
  return (
    <section>
      <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        <p className="text-base leading-6 text-center text-gray-400">
          Made with ❤️ by Vitian <br />
          Copyright &copy; {new Date().getFullYear()} FFCS Planner. All rights
          reserved.
        </p>
      </div>
    </section>
  );
}
