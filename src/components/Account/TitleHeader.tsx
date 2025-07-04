"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { vesionMap } from "@/helper/common";

interface TitleHeaderProps {
  id: number;
  title: string;
  version: string;
}

const TitleHeader = ({ id, title, version }: TitleHeaderProps) => (
  <div className="mb-6 flex flex-wrap items-center gap-4 ">
    <Link href="/" passHref>
      <Button variant="outline" size="sm" className="cursor-pointer">
        <FiArrowLeft className="mr-2 text-gray-800" />
      </Button>
    </Link>

    <h1 className="text-2xl lg:text-4xl font-bold text-gray-800">{title}</h1>

    <div className="flex items-center text-sm text-gray-500 space-x-2">
      <span>ID: {id}</span>
      <span>&bull;</span>
      <span>
        Phiên bản:{" "}
        <span className="font-semibold text-blue-600">
          {vesionMap[version]}
        </span>
      </span>
    </div>
  </div>
);

export default TitleHeader;
