'use client';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {JobCard} from '@/components/ui/job-card';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {Analytics} from '@/lib/analytics';
import {motion, AnimatePresence} from 'framer-motion';
import {Search, X, Filter} from 'lucide-react';
import type {SanityDocument} from 'next-sanity';
import {useTranslations} from 'next-intl';

interface Position {
  _id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  summary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
}

interface TeamPageClientProps {
  positions: SanityDocument[];
}

const AnimatedHero = () => {
  const t = useTranslations('team');
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      t('hero.animate.code'),
      t('hero.animate.blog'),
      t('hero.animate.design')
    ],
    [t]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <motion.div
      className="w-full bg-gradient-to-br bg-[#C61E1E] text-white"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.8}}
    >
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col relative overflow-hidden">
          {/* Animated background elements */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-16 h-16 bg-white opacity-10 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          <motion.div
            className="flex gap-4 flex-col"
            initial={{y: 50, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.8, delay: 0.2}}
          >
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-regular">
              <span className="text-white">{t('hero.title.prefix')}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-white"
                    initial={{opacity: 0, y: '-100'}}
                    transition={{type: 'spring', stiffness: 50}}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              className="text-lg md:text-xl leading-relaxed tracking-tight text-white/90 max-w-3xl text-center"
              initial={{y: 30, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              transition={{duration: 0.8, delay: 0.4}}
            >
              {t('hero.description')}
            </motion.p>
          </motion.div>
          <Button
            variant="outline"
            size="lg"
            className="bg-white text-[#C61E1E] hover:bg-gray-100 border-white hover:border-gray-100"
            onClick={() =>
              (window.location.href = 'mailto:contact@turkishclub-munich.com')
            }
          >
            Bize Katıl
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamPageClient({positions}: TeamPageClientProps) {
  const t = useTranslations('team');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // Convert Sanity documents to Position interface
  const typedPositions: Position[] = positions.map((pos) => ({
    _id: pos._id,
    title: pos.title || '',
    department: pos.department || '',
    type: pos.type || '',
    location: pos.location || '',
    summary: pos.summary || '',
    description: pos.description || '',
    requirements: pos.requirements || [],
    responsibilities: pos.responsibilities || [],
    benefits: pos.benefits || []
  }));

  // Memoize expensive calculations
  const departments = useMemo(
    () => [...new Set(typedPositions.map((p) => p.department).filter(Boolean))],
    [typedPositions]
  );
  const types = useMemo(
    () => [...new Set(typedPositions.map((p) => p.type).filter(Boolean))],
    [typedPositions]
  );
  const locations = useMemo(
    () => [...new Set(typedPositions.map((p) => p.location).filter(Boolean))],
    [typedPositions]
  );

  const filteredPositions = useMemo(() => {
    return typedPositions.filter((position) => {
      const matchesSearch =
        position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        !selectedDepartment || position.department === selectedDepartment;
      const matchesType = !selectedType || position.type === selectedType;
      const matchesLocation =
        !selectedLocation || position.location === selectedLocation;

      return (
        matchesSearch && matchesDepartment && matchesType && matchesLocation
      );
    });
  }, [
    typedPositions,
    searchTerm,
    selectedDepartment,
    selectedType,
    selectedLocation
  ]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm, selectedDepartment, selectedType, selectedLocation]);

  // Get visible positions for virtual scrolling effect
  const visiblePositions = useMemo(
    () => filteredPositions.slice(0, visibleCount),
    [filteredPositions, visibleCount]
  );
  const hasMore = visibleCount < filteredPositions.length;

  const loadMore = useCallback(() => {
    setIsLoading(true);

    // Track load more action
    Analytics.trackTeamEvent({
      action: 'load_more'
    });

    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 6, filteredPositions.length));
      setIsLoading(false);
    }, 300);
  }, [filteredPositions.length]);

  const clearAllFilters = useCallback(() => {
    // Track filter clear action
    Analytics.trackTeamEvent({
      action: 'filter',
      filters_applied: {}
    });

    setSelectedDepartment(null);
    setSelectedType(null);
    setSelectedLocation(null);
    setSearchTerm('');
  }, []);

  const activeFiltersCount = [
    selectedDepartment,
    selectedType,
    selectedLocation
  ].filter(Boolean).length;

  return (
    <div className="bg-[#C61E1E] min-h-screen text-white">
      <Navbar />

      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Open Positions */}
      <motion.section
        className="py-20 px-6 bg-gray-50"
        initial={{opacity: 0, y: 50}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8, delay: 0.3}}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.4}}
          >
            <motion.p
              className="text-sm font-medium text-gray-600 mb-2"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.6, delay: 0.5}}
            >
              {t('positions.subtitle')}
            </motion.p>
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-4"
              initial={{opacity: 0, x: -30}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.6}}
            >
              {t('positions.title')}
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.6, delay: 0.7}}
            >
              {t('positions.description')}
            </motion.p>
          </motion.div>

          {/* Search and Filter Button */}
          <motion.div
            className="mb-8 flex gap-4"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.8}}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Track search action (debounced in practice)
                  if (e.target.value) {
                    Analytics.trackTeamEvent({
                      action: 'filter',
                      filters_applied: {
                        department: selectedDepartment || undefined,
                        type: selectedType || undefined,
                        location: selectedLocation || undefined
                      }
                    });
                  }
                }}
                className="pl-10 transition-all duration-300 focus:scale-[1.02]"
              />
            </div>

            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                  <Button className="flex items-center gap-2 bg-white text-black hover:bg-gray-200">
                    <Filter className="w-4 h-4" />
                    {t('filter.button')}
                    <AnimatePresence>
                      {activeFiltersCount > 0 && (
                        <motion.div
                          initial={{scale: 0, opacity: 0}}
                          animate={{scale: 1, opacity: 1}}
                          exit={{scale: 0, opacity: 0}}
                          transition={{duration: 0.2}}
                        >
                          <Badge
                            variant="secondary"
                            className="ml-1 bg-[#C61E1E] text-white"
                          >
                            {activeFiltersCount}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <motion.div
                  className="space-y-6"
                  initial={{opacity: 0, scale: 0.95}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{duration: 0.2}}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {t('filter.title')}
                    </h3>
                    <AnimatePresence>
                      {activeFiltersCount > 0 && (
                        <motion.div
                          initial={{opacity: 0, x: 10}}
                          animate={{opacity: 1, x: 0}}
                          exit={{opacity: 0, x: 10}}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="w-4 h-4 mr-1" />
                            {t('filter.clearAll')}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Department Filter */}
                  <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3, delay: 0.1}}
                  >
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      {t('filter.department')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept, index) => (
                        <motion.div
                          key={dept}
                          initial={{opacity: 0, scale: 0.8}}
                          animate={{opacity: 1, scale: 1}}
                          transition={{duration: 0.2, delay: index * 0.05}}
                          whileHover={{scale: 1.05}}
                          whileTap={{scale: 0.95}}
                        >
                          <Badge
                            variant={
                              selectedDepartment === dept
                                ? 'default'
                                : 'outline'
                            }
                            className={`cursor-pointer ${
                              selectedDepartment === dept
                                ? 'bg-[#C61E1E] text-white hover:bg-[#A01818]'
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() =>
                              setSelectedDepartment(
                                selectedDepartment === dept ? null : dept
                              )
                            }
                          >
                            {dept}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Job Type Filter */}
                  <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3, delay: 0.2}}
                  >
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      {t('filter.jobType')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {types.map((type, index) => (
                        <motion.div
                          key={type}
                          initial={{opacity: 0, scale: 0.8}}
                          animate={{opacity: 1, scale: 1}}
                          transition={{duration: 0.2, delay: index * 0.05}}
                          whileHover={{scale: 1.05}}
                          whileTap={{scale: 0.95}}
                        >
                          <Badge
                            variant={
                              selectedType === type ? 'default' : 'outline'
                            }
                            className={`cursor-pointer ${
                              selectedType === type
                                ? 'bg-[#C61E1E] text-white hover:bg-[#A01818]'
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() =>
                              setSelectedType(
                                selectedType === type ? null : type
                              )
                            }
                          >
                            {type}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Location Filter */}
                  <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3, delay: 0.3}}
                  >
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      {t('filter.location')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((location, index) => (
                        <motion.div
                          key={location}
                          initial={{opacity: 0, scale: 0.8}}
                          animate={{opacity: 1, scale: 1}}
                          transition={{duration: 0.2, delay: index * 0.05}}
                          whileHover={{scale: 1.05}}
                          whileTap={{scale: 0.95}}
                        >
                          <Badge
                            variant={
                              selectedLocation === location
                                ? 'default'
                                : 'outline'
                            }
                            className={`cursor-pointer ${
                              selectedLocation === location
                                ? 'bg-[#C61E1E] text-white hover:bg-[#A01818]'
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() =>
                              setSelectedLocation(
                                selectedLocation === location ? null : location
                              )
                            }
                          >
                            {location}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </PopoverContent>
            </Popover>
          </motion.div>

          {/* Results count */}
          <motion.div
            className="mb-6"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6, delay: 0.9}}
          >
            <p className="text-sm text-gray-600">
              {t('results.showing', {
                filtered: visiblePositions.length.toString(),
                total: filteredPositions.length.toString()
              })}
              {hasMore && (
                <span className="ml-2 text-[#C61E1E]">
                  • {filteredPositions.length - visibleCount} more available
                </span>
              )}
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6, delay: 1}}
          >
            <AnimatePresence mode="wait">
              {visiblePositions.map((position, index) => (
                <motion.div
                  key={position._id}
                  initial={{opacity: 0, y: 30, scale: 0.95}}
                  animate={{opacity: 1, y: 0, scale: 1}}
                  exit={{opacity: 0, y: -30, scale: 0.95}}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05, // Reduced delay for better performance
                    type: 'spring',
                    stiffness: 100
                  }}
                  layout
                >
                  <JobCard
                    title={position.title}
                    department={position.department}
                    summary={position.summary}
                    description={position.description}
                    type={position.type}
                    location={position.location}
                    requirements={position.requirements}
                    responsibilities={position.responsibilities}
                    benefits={position.benefits}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                className="flex justify-center pt-8"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
              >
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="bg-[#C61E1E] hover:bg-red-700 text-white px-8 py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Loading...
                    </div>
                  ) : (
                    `Load More (${filteredPositions.length - visibleCount} remaining)`
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {filteredPositions.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.9}}
                transition={{duration: 0.4}}
              >
                <p className="text-gray-500 mb-4">{t('results.noResults')}</p>
                <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                  <Button variant="outline" onClick={clearAllFilters}>
                    {t('filter.clearAll')}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
