'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  FiMapPin, FiPhone, FiMail, FiStar, FiAward, FiUsers, FiTrendingUp, 
  FiFilter, FiSearch, FiGrid, FiList, FiArrowRight, FiArrowLeft,
  FiClock, FiNavigation, FiCheckCircle, FiHeart, FiShare2, FiExternalLink
} from 'react-icons/fi';
import { useOptimizedIntersectionObserver } from '@/utils/hooks/useOptimizedIntersectionObserver';
import styles from './clinic.module.scss';

const CenterList = dynamic(() => import('@/components/sections/CenterList/CenterList'), {
  ssr: false,
});

const Contact = dynamic(() => import('@/components/sections/Contact/Contact'), {
  ssr: false,
});

interface Clinic {
  id: number;
  name: string;
  location: string;
  address: string;
  rating: number;
  specialties: string[];
  treatments: string[];
  awards: string[];
  experience: string;
  monthlyPatients: number;
  successRate: number;
  featured: boolean;
  certified: boolean;
  coordinates: { x: number; y: number };
  region: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  description?: string;
}

const ClinicClient = () => {
  const t = useTranslations('Clinic');
  const [activeMap, setActiveMap] = useState<'israel' | 'coverage'>('israel');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [hoveredClinic, setHoveredClinic] = useState<Clinic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'patients' | 'experience'>('rating');

  // Intersection observer for animations
  const { targetRef: heroRef, isIntersecting: heroVisible } = useOptimizedIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  const { targetRef: statsRef, isIntersecting: statsVisible } = useOptimizedIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true
  });

  const clinics: Clinic[] = [
    {
      id: 1,
      name: "מרכז רפואי הדסה עין כרם",
      location: "ירושלים",
      address: "רחוב הדסה 1, עין כרם, ירושלים",
      rating: 4.9,
      specialties: ["דרמטולוגיה", "כירורגיה פלסטית", "רפואה אסתטית"],
      treatments: ["טיפול בפצעים", "השתלות עור", "טיפולים לייזר"],
      awards: ["מרכז מצוינות 2024", "איכות הטיפול הגבוהה"],
      experience: "25+ שנים",
      monthlyPatients: 450,
      successRate: 98,
      featured: true,
      certified: true,
      coordinates: { x: 45, y: 35 },
      region: "ירושלים והסביבה",
      phone: "+972-2-677-7111",
      email: "info@hadassah.org.il",
      website: "https://www.hadassah.org.il",
      hours: "א-ה: 8:00-20:00, ו: 8:00-14:00",
      description: "מרכז רפואי מוביל עם מומחיות מיוחדת בטיפולים מתקדמים"
    },
    {
      id: 2,
      name: "בית החולים איכילוב",
      location: "תל אביב",
      address: "רחוב ויצמן 6, תל אביב",
      rating: 4.8,
      specialties: ["דרמטולוגיה", "כירורגיה כללית", "רפואה דחופה"],
      treatments: ["טיפול בפצעים", "ניתוחים דחופים", "טיפולים מתקדמים"],
      awards: ["מרכז טראומה מוביל", "איכות הטיפול הגבוהה"],
      experience: "30+ שנים",
      monthlyPatients: 520,
      successRate: 97,
      featured: true,
      certified: true,
      coordinates: { x: 35, y: 45 },
      region: "תל אביב והמרכז",
      phone: "+972-3-697-4000",
      email: "info@ichilov.co.il",
      website: "https://www.tasmc.org.il",
      hours: "א-ה: 7:00-22:00, ו: 7:00-15:00",
      description: "בית חולים מוביל עם צוות מקצועי וציוד מתקדם"
    },
    {
      id: 3,
      name: "מרכז רפואי רמב\"ם",
      location: "חיפה",
      address: "רחוב עליה 8, חיפה",
      rating: 4.7,
      specialties: ["דרמטולוגיה", "כירורגיה פלסטית", "רפואה אסתטית"],
      treatments: ["טיפול בפצעים", "השתלות עור", "טיפולים לייזר"],
      awards: ["מרכז מצוינות 2024", "איכות הטיפול הגבוהה"],
      experience: "20+ שנים",
      monthlyPatients: 380,
      successRate: 96,
      featured: false,
      certified: true,
      coordinates: { x: 25, y: 25 },
      region: "חיפה והצפון",
      phone: "+972-4-777-2000",
      email: "info@rambam.health.gov.il",
      website: "https://www.rambam.org.il",
      hours: "א-ה: 8:00-19:00, ו: 8:00-13:00",
      description: "מרכז רפואי מתקדם עם דגש על חדשנות וטיפול אישי"
    },
    {
      id: 4,
      name: "בית החולים סורוקה",
      location: "באר שבע",
      address: "רחוב יצחק רגר 151, באר שבע",
      rating: 4.6,
      specialties: ["דרמטולוגיה", "כירורגיה כללית", "רפואה דחופה"],
      treatments: ["טיפול בפצעים", "ניתוחים דחופים", "טיפולים מתקדמים"],
      awards: ["מרכז מצוינות 2024", "איכות הטיפול הגבוהה"],
      experience: "15+ שנים",
      monthlyPatients: 320,
      successRate: 95,
      featured: false,
      certified: true,
      coordinates: { x: 15, y: 15 },
      region: "הדרום",
      phone: "+972-8-640-0000",
      email: "info@soroka.health.gov.il",
      website: "https://www.soroka.org.il",
      hours: "א-ה: 7:30-20:30, ו: 7:30-14:30",
      description: "בית חולים מוביל בדרום עם שירותים מקיפים"
    }
  ];

  const specialties = [
    "דרמטולוגיה", "כירורגיה פלסטית", "רפואה אסתטית", 
    "כירורגיה כללית", "רפואה דחופה", "אונקולוגיה"
  ];

  const regions = [
    "ירושלים והסביבה", "תל אביב והמרכז", "חיפה והצפון", "הדרום"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = !selectedSpecialty || clinic.specialties.includes(selectedSpecialty);
    const matchesRegion = !selectedRegion || clinic.region === selectedRegion;
    
    return matchesSearch && matchesSpecialty && matchesRegion;
  });

  // Sort clinics
  const sortedClinics = [...filteredClinics].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'patients':
        return b.monthlyPatients - a.monthlyPatients;
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience);
      case 'rating':
      default:
        return b.rating - a.rating;
    }
  });

  const handleClinicClick = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setShowModal(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      'דרמטולוגיה': '#ff6b6b',
      'כירורגיה פלסטית': '#4ecdc4',
      'רפואה אסתטית': '#45b7d1',
      'כירורגיה כללית': '#96ceb4',
      'רפואה דחופה': '#feca57',
      'אונקולוגיה': '#ff9ff3'
    };
    return colors[specialty as keyof typeof colors] || '#636e72';
  };

  return (
    <div className={styles.clinicPage}>
      {/* Animated Background */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
      </div>
      
      {/* Glass Background */}
      <div className={styles.glassBg}></div>
      
      <div className={styles.clinicContent}>
        {/* Enhanced Hero Section */}
        <motion.section 
          ref={heroRef}
          className={styles.heroSection}
          initial={{ opacity: 0, y: 50 }}
          animate={heroVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.gradientTitle}>Find Your Perfect Clinic</h1>
          <p className={styles.heroDescription}>
            Discover certified medical centers with advanced treatments and expert care
          </p>
          
          {/* Enhanced Search and Filters */}
          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search clinics, locations, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.filterControls}>
              <select 
                value={selectedSpecialty} 
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              
              <select 
                value={selectedRegion} 
                onChange={(e) => setSelectedRegion(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className={styles.filterSelect}
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
                <option value="patients">Sort by Patients</option>
                <option value="experience">Sort by Experience</option>
              </select>
              
              <div className={styles.viewModeToggle}>
                <button 
                  className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid />
                </button>
                <button 
                  className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Statistics Section */}
        <motion.section 
          ref={statsRef}
          className={styles.statsSection}
          initial={{ opacity: 0, y: 30 }}
          animate={statsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiUsers />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {animateStats ? clinics.length : 0}
                </span>
                <span className={styles.statLabel}>Certified Clinics</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiStar />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {animateStats ? Math.round(clinics.reduce((acc, c) => acc + c.rating, 0) / clinics.length * 10) / 10 : 0}
                </span>
                <span className={styles.statLabel}>Average Rating</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiTrendingUp />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {animateStats ? clinics.reduce((acc, c) => acc + c.monthlyPatients, 0) : 0}
                </span>
                <span className={styles.statLabel}>Monthly Patients</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiCheckCircle />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {animateStats ? Math.round(clinics.reduce((acc, c) => acc + c.successRate, 0) / clinics.length) : 0}%
                </span>
                <span className={styles.statLabel}>Success Rate</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Map Toggle */}
        <section className={styles.mapToggleSection}>
          <div className={styles.mapToggle}>
            <button 
              className={`${styles.toggleButton} ${activeMap === 'israel' ? styles.active : ''}`}
              onClick={() => setActiveMap('israel')}
            >
              <FiMapPin />
              Israel Map
            </button>
            <button 
              className={`${styles.toggleButton} ${activeMap === 'coverage' ? styles.active : ''}`}
              onClick={() => setActiveMap('coverage')}
            >
              <FiNavigation />
              Coverage Areas
            </button>
          </div>
        </section>

        {/* Enhanced Clinics Grid */}
        <section className={styles.clinicsSection}>
          <div className={styles.resultsHeader}>
            <h2>Found {sortedClinics.length} Clinics</h2>
            <p>Click on any clinic to view detailed information</p>
          </div>
          
          <div className={`${styles.clinicsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {sortedClinics.map((clinic, index) => (
              <motion.div
                key={clinic.id}
                className={`${styles.clinicCard} ${clinic.featured ? styles.featured : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => handleClinicClick(clinic)}
                onMouseEnter={() => setHoveredClinic(clinic)}
                onMouseLeave={() => setHoveredClinic(null)}
              >
                {clinic.featured && (
                  <div className={styles.featuredBadge}>
                    <FiStar />
                    Featured
                  </div>
                )}
                
                <div className={styles.clinicHeader}>
                  <div className={styles.clinicInfo}>
                    <h3 className={styles.clinicName}>{clinic.name}</h3>
                    <div className={styles.clinicLocation}>
                      <FiMapPin />
                      <span>{clinic.location}</span>
                    </div>
                  </div>
                  
                  <div className={styles.clinicRating}>
                    <div className={styles.stars}>
                      {renderStars(clinic.rating)}
                    </div>
                    <span className={styles.ratingText}>{clinic.rating}/5</span>
                  </div>
                </div>
                
                <div className={styles.clinicDetails}>
                  <div className={styles.specialties}>
                    {clinic.specialties.slice(0, 3).map(specialty => (
                      <span 
                        key={specialty} 
                        className={styles.specialtyTag}
                        style={{ backgroundColor: getSpecialtyColor(specialty) }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className={styles.clinicStats}>
                    <div className={styles.stat}>
                      <FiUsers />
                      <span>{clinic.monthlyPatients} patients/month</span>
                    </div>
                    <div className={styles.stat}>
                      <FiTrendingUp />
                      <span>{clinic.successRate}% success rate</span>
                    </div>
                    <div className={styles.stat}>
                      <FiClock />
                      <span>{clinic.experience} experience</span>
                    </div>
                  </div>
                  
                  {clinic.awards.length > 0 && (
                    <div className={styles.awards}>
                      <FiAward />
                      <span>{clinic.awards[0]}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.clinicActions}>
                  <button className={styles.actionButton}>
                    <FiPhone />
                    Contact
                  </button>
                  <button className={styles.actionButton}>
                    <FiExternalLink />
                    Website
                  </button>
                  <button className={styles.actionButton}>
                    <FiHeart />
                    Save
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {sortedClinics.length === 0 && (
            <div className={styles.emptyState}>
              <FiMapPin className={styles.emptyIcon} />
              <h3>No clinics found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </section>
      </div>

      {/* Enhanced Clinic Modal */}
      <AnimatePresence>
        {showModal && selectedClinic && (
          <motion.div 
            className={styles.clinicModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.modalContent}>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              
              <div className={styles.modalHeader}>
                <div className={styles.modalClinicInfo}>
                  <h2>{selectedClinic.name}</h2>
                  <div className={styles.modalLocation}>
                    <FiMapPin />
                    <span>{selectedClinic.address}</span>
                  </div>
                  <div className={styles.modalRating}>
                    {renderStars(selectedClinic.rating)}
                    <span>{selectedClinic.rating}/5</span>
                  </div>
                </div>
                
                {selectedClinic.featured && (
                  <div className={styles.modalFeaturedBadge}>
                    <FiStar />
                    Featured Clinic
                  </div>
                )}
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.modalSection}>
                  <h3>About</h3>
                  <p>{selectedClinic.description}</p>
                </div>
                
                <div className={styles.modalSection}>
                  <h3>Specialties</h3>
                  <div className={styles.modalSpecialties}>
                    {selectedClinic.specialties.map(specialty => (
                      <span 
                        key={specialty} 
                        className={styles.modalSpecialtyTag}
                        style={{ backgroundColor: getSpecialtyColor(specialty) }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.modalSection}>
                  <h3>Treatments</h3>
                  <ul className={styles.treatmentsList}>
                    {selectedClinic.treatments.map(treatment => (
                      <li key={treatment}>{treatment}</li>
                    ))}
                  </ul>
                </div>
                
                <div className={styles.modalSection}>
                  <h3>Contact Information</h3>
                  <div className={styles.contactInfo}>
                    {selectedClinic.phone && (
                      <div className={styles.contactItem}>
                        <FiPhone />
                        <span>{selectedClinic.phone}</span>
                      </div>
                    )}
                    {selectedClinic.email && (
                      <div className={styles.contactItem}>
                        <FiMail />
                        <span>{selectedClinic.email}</span>
                      </div>
                    )}
                    {selectedClinic.website && (
                      <div className={styles.contactItem}>
                        <FiExternalLink />
                        <a href={selectedClinic.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </div>
                    )}
                    {selectedClinic.hours && (
                      <div className={styles.contactItem}>
                        <FiClock />
                        <span>{selectedClinic.hours}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.modalSection}>
                  <h3>Awards & Recognition</h3>
                  <div className={styles.awardsList}>
                    {selectedClinic.awards.map(award => (
                      <div key={award} className={styles.awardItem}>
                        <FiAward />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button className={styles.primaryButton}>
                  <FiPhone />
                  Contact Clinic
                </button>
                <button className={styles.secondaryButton}>
                  <FiShare2 />
                  Share
                </button>
                <button className={styles.secondaryButton}>
                  <FiHeart />
                  Save to Favorites
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClinicClient; 