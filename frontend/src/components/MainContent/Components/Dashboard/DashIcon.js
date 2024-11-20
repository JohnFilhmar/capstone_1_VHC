import { useContext } from "react";
import { colorTheme } from "../../../../App";

const DashIcon = ({ Icon, title, value, isLoading }) => {
  const [selectedTheme] = useContext(colorTheme);

  if (isLoading) {
    return (
      <div
        className={`p-4 bg-${selectedTheme}-400 flex flex-row rounded-md animate-pulse`}
      >
        <div className="flex flex-col px-2 gap-2">
          <span className={`text-${selectedTheme}-600 w-6 h-6`}> </span>
          <p className="text-normal md:text-lg lg:text-xl font-normal text-slate-600 w-full">
             
          </p>
        </div>
        <div className="flex w-full items-center justify-end">
          <p className="text-3xl font-semibold text-slate-600"> </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`p-4 bg-${selectedTheme}-50 flex flex-row rounded-md`}>
        <div className="flex flex-col px-2 gap-2">
          <Icon className={`text-${selectedTheme}-600 w-6 h-6`} />
          <p className="text-normal md:text-lg lg:text-xl font-normal text-slate-600 w-full text-nowrap">
            {title}
          </p>
        </div>
        <div className="flex w-full items-center justify-end">
          <p className="text-3xl font-semibold text-slate-600">{value}</p>
        </div>
      </div>
    );
  }
};
 
export default DashIcon;