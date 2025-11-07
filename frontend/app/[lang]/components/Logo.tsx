import Image from "next/image";
import Link from "next/link";

const Logo = ({
  src,
  children,
}: {
  src: string | null;
  children?: React.ReactNode;
}) => {
  return (
    <Link
      href="/"
      aria-label="Back to homepage"
      className="flex items-center p-2"
    >
      {src && (
        <Image src={src} alt="logo" width={45} height={45} unoptimized={true} />
      )}
      <div className="ml-2">{children}</div>
    </Link>
  );
};

export default Logo;
