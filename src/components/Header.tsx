"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { FiUser } from "react-icons/fi";
import AuthModal from "@/components/AuthModal";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Thêm delay mount để tránh hydration mismatch
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={clsx(
          "sticky top-0 z-50 w-full transition-colors duration-300",
          isSticky ? "bg-white/80 shadow-md backdrop-blur-md" : "bg-[#ebc660]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between transition-all duration-300">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: isSticky ? 0.9 : 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <Image
                src="/images/logo.png"
                alt="Game Store"
                width={50}
                height={50}
                className="transition-all duration-300"
              />
            </motion.div>
          </Link>

          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={clsx(
              "flex items-center space-x-6 font-medium transition-colors",
              isSticky ? "text-black" : "text-white"
            )}
          >
            <motion.div
              className="flex items-center space-x-6"
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ staggerChildren: 0.1 }}
            >
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/about">Giới thiệu</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/services">Dịch vụ</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/contact">Liên hệ</Link>
              </motion.div>
              {user ? (
                <motion.div whileHover={{ y: -2 }}>
                  <Button>Đăng bán tài khoản</Button>
                </motion.div>
              ) : null}
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-4"
            >
              <AuthModal>
                <FiUser className="w-5 h-5 cursor-pointer" />
              </AuthModal>
            </motion.div>
          </motion.nav>
        </div>
      </motion.header>
    </AnimatePresence>
  );
}
