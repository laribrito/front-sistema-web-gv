import React, { cloneElement, Children, ReactElement } from "react";
import config from "@/utils/config";

interface FormFieldRootProps {
  children: React.ReactNode;
  id: string;
  width?: string;
  required?: boolean;
}

interface ChildProps {
  required?: boolean;
  id: string
}

export default function FormFieldRoot({children, id, required = false, width = config.WIDTH_WIDGETS}: FormFieldRootProps) {
    const cloneChildrenWithProps = () =>
        Children.map(children, (child, index) =>
            React.isValidElement(child) ? cloneElement(child as ReactElement<ChildProps>, {
                ...(index === 0 ? { htmlFor: id } : {}),
                ...(index === 1 ? { id: id } : {}),
                required
            }) : child
        );

  return (
    <div style={{ width: width, paddingBottom: "20px" }}>
      {cloneChildrenWithProps()}
    </div>
  );
}
