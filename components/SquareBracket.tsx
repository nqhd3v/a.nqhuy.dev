interface iSquareBracketAction {
  onClick: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  content: string;
}
const SquareBracketAction: React.FC<iSquareBracketAction> = ({ className, content, disabled, onClick }) => {
  return (
    <span
      className={
        "relative font-bold px-4 " +
        (disabled ? "opacity-30 cursor-not-allowed " : "cursor-pointer ") +
        "before:content-['['] before:left-1 before:top-0 before:absolute before:duration-300 " +
        "after:content-[']'] after:right-1 after:top-0 after:absolute after:duration-300 " +
        "hover:before:left-0 hover:after:right-0 " +
        (className || '')
      }
      onClick={() => disabled ? null : onClick()}
    >
      {content}
    </span>
  )
};

export default SquareBracketAction;