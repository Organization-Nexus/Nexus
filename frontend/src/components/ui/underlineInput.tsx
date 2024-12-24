import { Input } from "./input";
import { cn } from "@/lib/utils";

interface UnderlineInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function UnderlineInput({ className, ...props }: UnderlineInputProps) {
  return (
    <Input
      className={cn(
        "w-full p-4 text-lg border-t-0 border-l-0 border-r-0 border-b-2 rounded-none focus:ring-0 focus:border-[#50E161] bg-transparent outline-none focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
