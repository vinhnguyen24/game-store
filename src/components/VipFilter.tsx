"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VipFilterProps {
  selectedVips: number[];
  onVipChange: (vip: number) => void;
}

const vipLevels = [20, 19, 18, 17, 16, 15];

const VipFilter: FC<VipFilterProps> = ({ selectedVips, onVipChange }) => {
  const getButtonText = () => {
    if (selectedVips.length === 0) {
      return "Chọn VIP";
    }
    if (selectedVips.length === 1) {
      const vip = selectedVips[0];
      return vip === 20 ? "SVIP" : `VIP ${vip}`;
    }
    return `${selectedVips.length} VIPs selected`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-40 justify-start text-white cursor-pointer text-gray-700"
        >
          {getButtonText()}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gray-700">Chọn VIP</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {vipLevels.map((vip) => (
            <label
              key={vip}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedVips.includes(vip)}
                onChange={() => onVipChange(vip)}
                className="h-4 w-4"
              />
              <span className="text-gray-700">
                {vip === 20 ? "SVIP" : `VIP ${vip}`}
              </span>
            </label>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VipFilter;
