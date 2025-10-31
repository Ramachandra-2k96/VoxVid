"use client"

import { GeistSans } from "geist/font/sans"
import Dock from '@/components/ui/Dock';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => router.push('/home') },
    { icon: <Users size={18} />, label: 'Social', onClick: () => router.push('/home/social') },
    { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => router.push('/home/profile') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => router.push('/home/settings') },
  ];

  return (
    <div className={`relative min-h-screen ${GeistSans.className}`}>
        {children}
      <Dock
        items={items}
        panelHeight={48}
        baseItemSize={50}
        magnification={70}
      />
    </div>
  )
}