import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => (
  <div className="mx-auto flex h-[80dvh] w-[95%] max-w-7xl flex-col rounded-xl bg-white p-6 shadow-lg">
    {children}
  </div>
);

export default PageContainer;
