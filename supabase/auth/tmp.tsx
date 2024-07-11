"use client";

import LogoSection from "@/components/ui/logo";

const Template = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="bg-background block md:hidden">
        <main className="flex flex-col place-content-center h-[100svh]">
          <LogoSection />

          <section className="justify-center px-6 md:px-0 md:flex md:w-2/3 md:border-r">
            <div className="w-full max-w-sm py-4 mx-auto my-auto min-w-min md:py-9 md:w-7/12">
              {children}
            </div>
          </section>
        </main>
      </div>

      <div className="bg-background hidden md:block">
        <main className="flex flex-col md:flex-row-reverse h-[100svh]">
          <LogoSection />

          <section className="justify-center bg-grid-gray-200/[0.4] dark:lg:bg-grid-gray-800 px-4 md:px-0 md:flex md:w-2/3 md:border-r md:border-gray-200/[0.4]">
            <div className="w-full max-w-sm py-4 mx-auto my-auto min-w-min md:py-9 md:w-7/12">
              {children}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Template;
