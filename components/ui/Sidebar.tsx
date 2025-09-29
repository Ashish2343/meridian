'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <motion.section
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 left-0 h-screen 
      flex flex-col justify-between 
      p-6 pt-20 text-white max-sm:hidden lg:w-[264px]
      bg-gradient-to-b from-zinc-950 via-zinc-900 to-black
      border-r border-white/10 shadow-lg"
    >
      {/* Nav Links */}
      <div className="flex flex-1 flex-col gap-4">
        {sidebarLinks.map((item, index) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <motion.div
              key={item.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={item.route}
                className={cn(
                  "flex gap-4 items-center p-3 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={item.imgUrl}
                    alt={item.label}
                    width={24}
                    height={24}
                  />
                </motion.div>
                <p className="text-lg font-medium max-lg:hidden">
                  {item.label}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Profile Section */}
      {user && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/user"
            className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="size-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center"
            >
              <span className="font-bold">
                {user.firstName?.[0] || "A"}
              </span>
            </motion.div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">
                {user.firstName} {user.lastName}
              </p>
              <span className="text-xs text-gray-400 hover:text-indigo-400">
                View Profile
              </span>
            </div>
          </Link>
        </motion.div>
      )}
    </motion.section>
  );
};

export default Sidebar;
