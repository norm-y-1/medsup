import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import useClickOutside from "../hooks/useClickOutSide";

// Define the shape of each dropdown option
export interface DropdownOption {
  id: string | number;
  text?: string;
  value: string | number;
}

interface DropdownProps {
  text?: string | number;
  onChange: (option: DropdownOption) => void;
  options: DropdownOption[];
  classN?: string;
  label?: string;
  error?: string;
  defaultValue?: string | number;
  disabled?: boolean;
}

const DropdownUI = ({
  text,
  options,
  onChange,
  classN = "",
  label = "",
  error,
  defaultValue,
  disabled = false,
}: DropdownProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | number | undefined>(text);
  const ref = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const option = options[index];
    if (option) {
      setSelected(option.text ?? option.value);
      onChange(option);
    }
    setIsActive(false);
  };

  useClickOutside(ref, () => setIsActive(false), isActive);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsActive((prev) => !prev);
    }
  };

  return (
    <div className={`w-full min-w-[200px] ${classN}`} ref={ref}>
      {label && <label className="text-xs text-slate-500">{label}</label>}
      {error && <span className="text-sm text-red-500">{error}</span>}

      <div
        className={`relative mt-1 w-full ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {/* Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={toggleDropdown}
          className={`flex h-[49px] w-full items-center justify-between rounded-lg border px-4 py-2 text-left shadow-sm transition
            ${isActive ? "border-brown-500 ring-2 ring-brown-300" : "border-gray-300"}
            ${error ? "border-red-500" : ""}
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
        >
          <span>{selected ?? "Select an option"}</span>
          {isActive ? (
            <FontAwesomeIcon className="ml-2 text-gray-600" icon={faCaretUp} />
          ) : (
            <FontAwesomeIcon className="ml-2 text-gray-600" icon={faCaretDown} />
          )}
        </button>

        {/* Dropdown content */}
        <div
          ref={contentRef}
          className={`absolute left-0 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg transition-all
            ${
              isActive
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-95 invisible"
            }
            duration-200 ease-out z-10`}
        >
          {options.map((option, index) => (
            <div
              key={option.id}
              onClick={(event) => handleClick(event, index)}
              className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {option.text ?? option.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownUI;