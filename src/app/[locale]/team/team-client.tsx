"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/ui/job-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Heart, Search, X, Filter } from "lucide-react";
import type { SanityDocument } from "next-sanity";

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
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Kodla", "Blog Yaz", "Tasarım Yap"],
    []
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
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
              ease: "easeInOut"
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
              ease: "easeInOut"
            }}
          />

          <motion.div 
            className="flex gap-4 flex-col"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-regular">
              <span className="text-white">Turkish Club&apos;da</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-white"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
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
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Help us build the strongest Turkish community in Munich. Join our team and make a meaningful impact 
              while developing your skills and connecting with amazing people.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="flex flex-row gap-3"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="gap-4 bg-white text-[#C61E1E] hover:bg-gray-100" variant="outline">
                View Positions <Target className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="gap-4 bg-[#222222] hover:bg-[#333333] text-white">
                Apply Now <Heart className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamPageClient({ positions }: TeamPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Convert Sanity documents to Position interface
  const typedPositions: Position[] = positions.map(pos => ({
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

  const departments = [...new Set(typedPositions.map(p => p.department).filter(Boolean))];
  const types = [...new Set(typedPositions.map(p => p.type).filter(Boolean))];
  const locations = [...new Set(typedPositions.map(p => p.location).filter(Boolean))];

  const filteredPositions = typedPositions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || position.department === selectedDepartment;
    const matchesType = !selectedType || position.type === selectedType;
    const matchesLocation = !selectedLocation || position.location === selectedLocation;
    
    return matchesSearch && matchesDepartment && matchesType && matchesLocation;
  });

  const clearAllFilters = () => {
    setSelectedDepartment(null);
    setSelectedType(null);
    setSelectedLocation(null);
    setSearchTerm('');
  };

  const activeFiltersCount = [selectedDepartment, selectedType, selectedLocation].filter(Boolean).length;

  return (
    <div className="bg-[#C61E1E] min-h-screen text-white">
      <MobileNavbar />
      
      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Open Positions */}
      <motion.section 
        className="py-20 px-6 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.p 
              className="text-sm font-medium text-gray-600 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Job openings
            </motion.p>
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Open Positions
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              We are always looking for talented individuals to join our team. Below are some of the roles we are currently hiring for.
            </motion.p>
          </motion.div>

          {/* Search and Filter Button */}
          <motion.div 
            className="mb-8 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="flex items-center gap-2 bg-white text-black hover:bg-gray-200">
                    <Filter className="w-4 h-4" />
                    Filter
                    <AnimatePresence>
                      {activeFiltersCount > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="secondary" className="ml-1 bg-[#C61E1E] text-white">
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Filter Positions</h3>
                    <AnimatePresence>
                      {activeFiltersCount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Clear all
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Department Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Department</h4>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept, index) => (
                        <motion.div
                          key={dept}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={selectedDepartment === dept ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedDepartment === dept 
                                ? 'bg-[#C61E1E] text-white hover:bg-[#A01818]' 
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setSelectedDepartment(selectedDepartment === dept ? null : dept)}
                          >
                            {dept}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Job Type Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Job Type</h4>
                    <div className="flex flex-wrap gap-2">
                      {types.map((type, index) => (
                        <motion.div
                          key={type}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={selectedType === type ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedType === type 
                                ? 'bg-[#C61E1E] text-white hover:bg-[#A01818]' 
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setSelectedType(selectedType === type ? null : type)}
                          >
                            {type}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Location Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Location</h4>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((location, index) => (
                        <motion.div
                          key={location}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={selectedLocation === location ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedLocation === location 
                                ? 'bg-[#C61E1E] text-white hover:bg-[#A01818]' 
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <p className="text-sm text-gray-600">
              Showing {filteredPositions.length} of {typedPositions.length} positions
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <AnimatePresence mode="wait">
              {filteredPositions.map((position, index) => (
                <motion.div
                  key={position._id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    type: "spring",
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
          </motion.div>

          <AnimatePresence>
            {filteredPositions.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-gray-500 mb-4">No positions found matching your criteria.</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear all filters
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