import { ReloadIcon } from "@radix-ui/react-icons";

const Loading = () => {
  return (
    <div className="flex items-center place-content-center place-items-center fixed inset-0 ">
      <ReloadIcon className="fill-black animate-spin justify-center" />
    </div>
  );
};

export default Loading;
