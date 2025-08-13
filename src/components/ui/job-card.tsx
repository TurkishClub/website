import React, {useState, memo, useCallback} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Clock, MapPin, ChevronDown} from 'lucide-react';
import {Analytics} from '@/lib/analytics';
import {motion, AnimatePresence} from 'framer-motion';

interface JobCardProps {
  title: string;
  department: string;
  summary: string;
  description: string;
  type: string;
  location: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
}

function JobCardComponent({
  title,
  department,
  summary,
  description,
  type,
  location,
  requirements,
  responsibilities
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    // Track job expansion
    Analytics.trackTeamEvent({
      action: 'job_expand',
      job_title: title,
      job_department: department,
      job_type: type
    });
  }, [isExpanded, title, department, type]);

  return (
    <div className="hover:shadow-lg transition-shadow duration-200">
      <Card className="transition-all duration-200 border border-gray-200 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleExpanded}
                    className="ml-4 text-gray-400 hover:text-[#C61E1E] transition-colors duration-200"
                  >
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {summary}
              </p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="space-y-6 mb-6 border-t pt-6"
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: -10
                    }}
                    animate={{
                      opacity: 1,
                      height: 'auto',
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: -10
                    }}
                    transition={{
                      duration: 0.4,
                      ease: 'easeInOut'
                    }}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    <motion.div
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.3, delay: 0.2}}
                    >
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        Requirements
                      </h4>
                      <ul className="space-y-2">
                        {requirements.map((req, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            <span className="text-gray-900 mr-2 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.3, delay: 0.4}}
                    >
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {responsibilities.map((resp, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            <span className="text-gray-900 mr-2">•</span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      className="pt-4 border-t"
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.3, delay: 0.6}}
                    >
                      <Button className="bg-[#C61E1E] hover:bg-[#A01818] text-white transition-colors duration-200">
                        Apply for this position
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="flex items-center justify-between"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.4, delay: 0.2}}
              >
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{scale: 1.05}}
                    transition={{duration: 0.2}}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{type}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{scale: 1.05}}
                    transition={{duration: 0.2}}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{location}</span>
                  </motion.div>
                </div>
                <motion.div
                  whileHover={{scale: 1.05}}
                  transition={{duration: 0.2}}
                >
                  <Badge
                    variant="secondary"
                    className="bg-gray-50 text-gray-900 text-xs px-2 py-1"
                  >
                    {department}
                  </Badge>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export const JobCard = memo(JobCardComponent);
