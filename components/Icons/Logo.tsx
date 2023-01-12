import React from "react";
import { IIcon } from "./types";

const Logo: React.FC<IIcon> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 496" fill="none" className={className || ''}>
    <path
      d="M123.774 33C5.129 101.5-35.5 253.129 33 371.774c68.5 118.646 220.129 159.275 338.774 90.775 118.646-68.5 159.275-220.129 90.775-338.775C394.049 5.129 242.42-35.5 123.774 33Zm250.952 166.549-104 180c-9.283 15.521-36.25 15.521-45.5-.5L120.853 198.424c-9.2-15.935 2.373-36.875 20.373-36.875s204.774.225 204.774.225c18.803-.232 38.379 21.694 28.726 37.775Z"
      className="fill-blue-900 dark:fill-light"
    />
</svg>
);

export default Logo;