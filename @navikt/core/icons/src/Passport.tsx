import * as React from "react";
import { SVGProps, Ref, forwardRef } from "react";
import { useId } from "./util/useId";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgPassport = forwardRef(
  (
    { title, titleId: _titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
    ref: Ref<SVGSVGElement>
  ) => {
    let titleId: string | undefined = useId();
    titleId = title ? (_titleId ? _titleId : "title-" + titleId) : undefined;
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable={false}
        role="img"
        ref={ref}
        aria-labelledby={titleId}
        {...props}
      >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19 2H4v20h15V2ZM2 0v24h17a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm9.5 14A4.826 4.826 0 0 0 15 9.36V6H8v3.36A4.826 4.826 0 0 0 11.5 14ZM10 8v1.36c0 1.06.591 2.013 1.5 2.496A2.826 2.826 0 0 0 13 9.36V8h-3Zm6 10v-2H7v2h9Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);
export default SvgPassport;