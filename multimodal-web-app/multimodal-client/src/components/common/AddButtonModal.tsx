import { Plus } from "lucide-react";

type BotonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const LeftDownAddButton: React.FC<BotonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg ${className}`}
      {...props}>
      <Plus/>
    </button>
  );
};

export default LeftDownAddButton;