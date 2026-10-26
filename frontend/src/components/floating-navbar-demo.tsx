"use client";
import { FloatingNav } from "@/components/ui/floating-navbar";
import {
  IconHome,
  IconUsers,
  IconBriefcase,
  IconMessage,
} from "@tabler/icons-react";

export default function FloatingNavDemo() {
  const navItems = [
    {
      name: "Home",
      link: "#home",
      icon: <IconHome className="h-4 w-4" />,
    },
    {
      name: "Who We Are",
      link: "#about",
      icon: <IconUsers className="h-4 w-4" />,
    },
    {
      name: "What Do We Do",
      link: "#services",
      icon: <IconBriefcase className="h-4 w-4" />,
    },
    {
      name: "Contact Us",
      link: "#contact",
      icon: <IconMessage className="h-4 w-4" />,
    },
  ];

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}
