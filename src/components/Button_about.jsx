import clsx from "clsx";

const Button = ({ id, title, leftIcon, containerClass, onClick }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-yellow-300 px-7 py-3 text-black",
        containerClass
      )}
    >
      <div className="flex items-center gap-2">
        {leftIcon}
        <span className="relative inline-flex h-4 overflow-hidden font-general text-xs uppercase">
          <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-full group-hover:skew-y-12">
            {title}
          </div>
          <div className="absolute translate-y-full skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
            {title}
          </div>
        </span>
      </div>
    </button>
  );
};

export default Button;