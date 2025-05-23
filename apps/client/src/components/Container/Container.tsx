import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => (
  <div className="flex flex-col border rounded-lg p-6 w-[95%] max-w-7xl mx-auto h-[80dvh]">
    {children}
  </div>
);

export default PageContainer;
