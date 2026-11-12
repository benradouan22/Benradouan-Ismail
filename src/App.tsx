import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Database, 
  BarChart3, 
  BrainCircuit, 
  ChevronDown, 
  Moon, 
  Sun, 
  Menu, 
  X,
  MapPin,
  Send,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  Sparkles,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';

/**
 * =========================================================================
 * 📸 PHOTO DE PROFIL / YOUR PHOTO
 * =========================================================================
 * Bghiti tbddel la photo direct f le code ?
 * Bddel l-valeur dyal MY_PROFILE_PHOTO hna :
 * - Soit un fichier f dossier public : '/profile.jpg'
 * - Soit un lien direct d'une image (URL) : 'https://example.com/ma-photo.jpg'
 * =========================================================================
 */
export const MY_PROFILE_PHOTO = '/profile.jpg';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Photo state with persistent localStorage support & default fallback
  const [profilePhoto, setProfilePhoto] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('portfolio_profile_photo');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return MY_PROFILE_PHOTO;
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle local image file upload with responsive canvas compression
  const handleFileUpload = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setUploadError('Impossible de traiter l\'image.');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        try {
          localStorage.setItem('portfolio_profile_photo', dataUrl);
          setProfilePhoto(dataUrl);
          setUploadSuccess('Photo mise à jour avec succès !');
          setTimeout(() => {
            setIsPhotoModalOpen(false);
            setUploadSuccess(null);
          }, 1200);
        } catch (e) {
          // If storage limit reached, save compressed lower resolution
          try {
            const lowerRes = canvas.toDataURL('image/jpeg', 0.7);
            localStorage.setItem('portfolio_profile_photo', lowerRes);
            setProfilePhoto(lowerRes);
            setUploadSuccess('Photo optimisée et enregistrée !');
            setTimeout(() => {
              setIsPhotoModalOpen(false);
              setUploadSuccess(null);
            }, 1200);
          } catch {
            setUploadError('La photo est trop lourde pour le cache du navigateur.');
          }
        }
      };
      img.onerror = () => setUploadError('Erreur de lecture de l\'image.');
      img.src = event.target?.result as string;
    };
    reader.onerror = () => setUploadError('Erreur lors du chargement du fichier.');
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    try {
      localStorage.setItem('portfolio_profile_photo', urlInput.trim());
      setProfilePhoto(urlInput.trim());
      setUploadSuccess('Lien de la photo appliqué avec succès !');
      setUrlInput('');
      setTimeout(() => {
        setIsPhotoModalOpen(false);
        setUploadSuccess(null);
      }, 1200);
    } catch {
      setUploadError('Erreur lors de l\'enregistrement de l\'URL.');
    }
  };

  const handleResetPhoto = () => {
    try {
      localStorage.removeItem('portfolio_profile_photo');
    } catch {
      // ignore
    }
    setProfilePhoto('/profile.jpg');
    setUploadSuccess('Photo réinitialisée par défaut.');
    setTimeout(() => {
      setIsPhotoModalOpen(false);
      setUploadSuccess(null);
    }, 1000);
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const skills = [
    { name: 'Python', category: 'Languages', icon: <Code2 className="w-5 h-5" /> },
    { name: 'C / C++', category: 'Languages', icon: <Code2 className="w-5 h-5" /> },
    { name: 'SQL', category: 'Languages', icon: <Database className="w-5 h-5" /> },
    { name: 'JavaScript', category: 'Languages', icon: <Code2 className="w-5 h-5" /> },
    { name: 'Scikit-learn', category: 'Data Science', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'PyTorch', category: 'Data Science', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Pandas / NumPy', category: 'Data Science', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Hadoop / HBase', category: 'Big Data', icon: <Database className="w-5 h-5" /> },
    { name: 'MongoDB', category: 'Big Data', icon: <Database className="w-5 h-5" /> },
    { name: 'Matplotlib / Seaborn', category: 'Visualization', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const projects = [
    {
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce application built with Django, featuring authentication, cart management, and order processing.',
      tags: ['Django', 'Python', 'JavaScript', 'SQL'],
      year: '2024',
      link: '#'
    },
    {
      title: 'Predictive Analysis with ML',
      description: 'Exploratory data analysis and implementation of regression and classification models using Scikit-learn for Kaggle datasets.',
      tags: ['Scikit-learn', 'Pandas', 'EDA', 'ML'],
      year: '2025',
      link: '#'
    },
    {
      title: 'Big Data & NoSQL Architecture',
      description: 'Distributed processing environment setup using Hadoop, MongoDB Aggregation pipelines, and HBase data manipulation.',
      tags: ['Hadoop', 'MongoDB', 'HBase', 'Big Data'],
      year: '2025',
      link: '#'
    },
    {
      title: 'Algorithms & Data Structures',
      description: 'Implementation of core algorithms like Quicksort, Mergesort, and graph traversals (BFS/DFS) in Python and C++.',
      tags: ['Algorithms', 'C++', 'Python', 'Data Structures'],
      year: '2024',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-brand-500 selection:text-white">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }} 
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.a 
            href="#home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-xl font-bold tracking-tighter text-brand-600 dark:text-brand-400 group"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-brand-500/30 group-hover:ring-brand-500 transition-all">
              <img 
                src={profilePhoto} 
                alt="Ismail Benradouan" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default_profile.jpg';
                }}
              />
            </div>
            <span>IB.</span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
              >
                {link.name}
              </motion.a>
            ))}

            {/* Quick button to manage photo */}
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-brand-300 transition-all border border-slate-200 dark:border-slate-700"
              title="Changer la photo de profil"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              aria-label="Changer la photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-slate-600 dark:text-slate-400"
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsPhotoModalOpen(true);
                  }}
                  className="flex items-center gap-3 text-brand-600 dark:text-brand-400 font-semibold pt-4 border-t border-slate-100 dark:border-slate-800"
                >
                  <Camera className="w-5 h-5" />
                  <span>Changer ma photo de profil</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center pt-24 md:pt-20">
          <div className="section-container grid md:grid-cols-2 gap-12 items-center">
            
            {/* Mobile Photo Banner (visible only on small screens) */}
            <div className="md:hidden flex justify-center mb-2">
              <div className="relative group">
                <div className="w-40 h-40 rounded-3xl overflow-hidden ring-4 ring-brand-500/20 shadow-xl bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={profilePhoto} 
                    alt="Ismail Benradouan"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default_profile.jpg';
                    }}
                  />
                </div>
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute -bottom-2 -right-2 px-3 py-1.5 bg-brand-600 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Changer</span>
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                Available for opportunities
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Ismail <span className="text-brand-600 dark:text-brand-400">Benradouan</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed font-serif italic">
                Master's student in Mathematical Engineering & Data Science, passionate about predictive modeling and distributed architectures.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#projects"
                  className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-brand-600/20 active:scale-95"
                >
                  View Projects
                </a>
                <a 
                  href="#contact"
                  className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-600 dark:hover:border-brand-400 rounded-xl font-semibold transition-all active:scale-95"
                >
                  Contact Me
                </a>
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="px-5 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 active:scale-95"
                >
                  <Camera className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Ma Photo</span>
                </button>
              </div>
              <div className="mt-12 flex items-center gap-6 text-slate-400">
                <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Github className="w-6 h-6" /></a>
                <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Linkedin className="w-6 h-6" /></a>
                <a href="mailto:benradouanismail05@gmail.com" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Mail className="w-6 h-6" /></a>
              </div>
            </motion.div>

            {/* Desktop Hero Portrait Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative hidden md:block"
            >
              <div className="relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
                {/* Decorative border frame with gradient */}
                <div className="aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl relative z-10 border-4 border-white dark:border-slate-800 bg-slate-900 ring-1 ring-slate-900/10">
                  <img 
                    src={profilePhoto} 
                    alt="Ismail Benradouan"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default_profile.jpg';
                    }}
                  />

                  {/* Dark subtle gradient overlay at bottom for title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                    {/* Top camera action badge */}
                    <div className="flex justify-end">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/20 group-hover:bg-brand-600 group-hover:border-brand-500 transition-all shadow-md">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Changer la photo</span>
                      </span>
                    </div>

                    {/* Bottom identity tag */}
                    <div>
                      <p className="text-white text-lg font-bold tracking-tight">Ismail Benradouan</p>
                      <p className="text-brand-400 text-xs font-mono tracking-wider uppercase">Data Scientist & ML Engineer</p>
                    </div>
                  </div>
                </div>

                {/* Ambient glow backgrounds */}
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-brand-400 dark:bg-brand-600 rounded-full blur-3xl opacity-40 -z-10 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-brand-600 dark:bg-brand-800 rounded-full blur-3xl opacity-30 -z-10 group-hover:opacity-50 transition-opacity"></div>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400">
            <ChevronDown className="w-6 h-6" />
          </div>
        </section>

        {/* Photo Management Modal */}
        <AnimatePresence>
          {isPhotoModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsPhotoModalOpen(false);
                    setUploadError(null);
                    setUploadSuccess(null);
                  }}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ajouter ou Changer votre Photo</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Zid tswira dyalk f le portfolio</p>
                  </div>
                </div>

                {/* Notifications */}
                {uploadSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}
                {uploadError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Current Photo Preview & Upload Zone */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-brand-500 shadow-md shrink-0">
                    <img 
                      src={profilePhoto} 
                      alt="Aperçu photo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default_profile.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-semibold mb-1">Photo actuelle</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Visible sur l'en-tête, le Hero et la navigation.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choisir un fichier</span>
                    </button>
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors mb-6 ${
                    isDragging
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Glissez-déposez votre photo ici ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Format JPG, PNG, WebP (optimisé automatiquement)
                  </p>
                </div>

                {/* Option 2: Image URL */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Ou collez le lien d'une image (URL)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="url"
                        placeholder="https://example.com/ma-photo.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-brand-500 outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={handleApplyUrl}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-all"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>

                {/* Permanent file explanation & Reset */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    💡 Astuce : Vous pouvez aussi simplement nommer votre fichier <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-brand-600 dark:text-brand-400">profile.jpg</code> dans le dossier <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">public/</code>.
                  </p>
                  <button
                    onClick={handleResetPhoto}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors shrink-0"
                    title="Réinitialiser l'image par défaut"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Réinitialiser</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* About Section */}
        <section id="about" className="bg-slate-50 dark:bg-slate-900/50">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card relative z-10">
                  <h2 className="text-3xl font-bold mb-6">About Me</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    I am a dedicated student pursuing a Master's in Mathematical Engineering and Data Science. My expertise lies in the intersection of mathematics and computer science, specifically in Data Science, Machine Learning, and Big Data.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Passionate about data analysis and predictive modeling, I develop solutions ranging from exploratory analysis to the implementation of complex machine learning models on distributed architectures.
                  </p>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                    <MapPin className="w-4 h-4 text-brand-500" />
                    Zagora, Morocco
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-brand-500/20 rounded-2xl -rotate-3 -z-10"></div>
              </motion.div>
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Machine Learning</h3>
                    <p className="text-slate-600 dark:text-slate-400">Specialized in regression, classification, and deep learning models using Scikit-learn and PyTorch.</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Big Data</h3>
                    <p className="text-slate-600 dark:text-slate-400">Experience with Hadoop ecosystem, NoSQL databases like MongoDB and HBase for large-scale data processing.</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Data Visualization</h3>
                    <p className="text-slate-600 dark:text-slate-400">Creating insightful visualizations using Matplotlib and Seaborn to communicate data findings effectively.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills">
          <div className="section-container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Technical Skills</h2>
              <p className="text-slate-600 dark:text-slate-400">A comprehensive toolkit for data science and software engineering.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 flex flex-col items-center text-center hover:border-brand-500 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    {skill.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-1">{skill.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{skill.category}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="bg-slate-50 dark:bg-slate-900/50">
          <div className="section-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
                <p className="text-slate-600 dark:text-slate-400">Showcasing my work in web development, machine learning, and big data architecture.</p>
              </div>
              <a href="#" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold hover:underline">
                View all on GitHub <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-brand-500/10 transition-all"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">{project.year}</span>
                      <a href={project.link} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{project.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6">Let's <span className="text-brand-600 dark:text-brand-400">Connect</span></h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Email Me</p>
                      <a href="mailto:benradouanismail05@gmail.com" className="text-lg font-bold hover:text-brand-600 dark:hover:text-brand-400 transition-colors">benradouanismail05@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                      <Linkedin className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">LinkedIn</p>
                      <a href="#" className="text-lg font-bold hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Ismail Benradouan</a>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card"
              >
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-brand-500 dark:focus:border-brand-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Email</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-brand-500 dark:focus:border-brand-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Message</label>
                    <textarea 
                      rows={4}
                      placeholder="Your message here..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-brand-500 dark:focus:border-brand-500 outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  <button className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group">
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-xl font-bold tracking-tighter text-brand-600 dark:text-brand-400 mb-2">IB.</p>
            <p className="text-sm text-slate-400">© 2026 Ismail Benradouan. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                {link.name}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all"><Github className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
