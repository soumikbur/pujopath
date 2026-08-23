'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';

export function PujaHighlights() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const highlights = [
    {
      title: isBn ? 'ঐতিহ্যবাহী সাবেকি পুজো' : 'Traditional Puja',
      desc: isBn ? 'শতবর্ষের বনেদি বাড়ির পুজো পরিক্রমা।' : "Discover Bengal's timeless community celebrations.",
      image: '/images/pandals/sovabazar-rajbari.jpg',
      href: '/explore?heritageOnly=true',
      badge: isBn ? 'ঐতিহ্য' : 'Heritage',
    },
    {
      title: isBn ? 'মণ্ডপ শিল্পকলা' : 'Pandal Art',
      desc: isBn ? 'কলকাতার সেরা সৃজনশীল শিল্পকর্ম।' : 'Explore creative installations across Kolkata.',
      image: '/images/pandals/art-craft-terracotta.jpg',
      href: '/explore',
      badge: isBn ? 'শিল্প' : 'Artistry',
    },
    {
      title: isBn ? 'সন্ধ্যায় পুজো পরিক্রমা' : 'Pujo Evenings',
      desc: isBn ? 'আলোকসজ্জা ও রাতের মণ্ডপ দর্শন।' : 'Plan your route for the best evening experience.',
      image: '/images/pandals/college-square-water.jpg',
      href: '/planner',
      badge: isBn ? 'পরিক্রমা' : 'Routes',
    },
  ];

  return (
    <section className="space-y-2.5 pt-1">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-bold text-[#242424] tracking-tight flex items-center gap-1.5">
            <span className="text-[#D52F2F] font-black text-lg">✣</span>
            <span>{isBn ? 'পূজার বিশেষ আকর্ষণ' : 'Puja Highlights'}</span>
          </h2>
          <p className="text-[13px] text-[#665A54] mt-0.5 font-medium">
            {isBn ? 'বাংলার দুর্গাপূজা সংস্কৃতির একটি ঝলক' : "A glimpse of Bengal's Durga Puja culture"}
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm font-bold text-[#D52F2F] hover:text-[#BD2424] transition-colors"
        >
          <span>{isBn ? 'সব দেখুন' : 'View all'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 Horizontal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {highlights.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="group flex items-center gap-3.5 p-3 rounded-[16px] hover:shadow-md transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid rgba(234, 220, 206, 0.9)',
              boxShadow: '0 1px 4px rgba(70, 35, 15, 0.03)',
            }}
          >
            {/* Left Image */}
            <div className="relative w-24 h-20 sm:w-[110px] sm:h-[80px] rounded-xl overflow-hidden shrink-0" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="110px"
              />
              <span
                className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white"
                style={{ background: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(8px)' }}
              >
                {item.badge}
              </span>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <h3 className="text-[14px] sm:text-[15px] font-bold text-[#242424] group-hover:text-[#D52F2F] transition-colors truncate">
                {item.title}
              </h3>
              <p className="text-xs text-[#665A54] line-clamp-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
