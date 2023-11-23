import React, { cloneElement, Children, ReactElement } from "react";
import config from "@/utils/config";

interface FormFieldRootProps {
  children: React.ReactNode;
  width?: string;
  required?: boolean;
}

interface ChildProps {
  required?: boolean;
}

export default function FormFieldRoot({children, required = false, width = config.WIDTH_WIDGETS}: FormFieldRootProps) {
    const cloneChildrenWithRequired = () =>
        Children.map(children, (child) =>
        React.isValidElement(child) ? cloneElement(child as ReactElement<ChildProps>, { required }): child
    );

  return (
    <div style={{ width: width, paddingBottom: "20px" }}>
      {cloneChildrenWithRequired()}
    </div>
  );
}
