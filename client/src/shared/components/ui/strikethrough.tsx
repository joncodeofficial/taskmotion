type strikethroughProps = {
  checked: boolean;
  children: React.ReactNode;
  className?: string;
};

export const Strikethrough = ({ checked, children, className }: strikethroughProps) => {
  return (
    <span
      className={`${checked && 'after:scale-x-100'} relative after:absolute after:block
      after:border-neutral-500 dark:after:border-neutral-200 after:dark:border-white
    after:w-full after:border-b after:-mt-2.5 after:bg-foreground after:scale-x-0 after:origin-bottom-left
    after:transition-all after:duration-500 after:delay-150 after:ease-strikethrough ${className}`}
    >
      {children}
    </span>
  );
};
