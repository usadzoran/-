import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Plus, 
  Image as ImageIcon, 
  MapPin, 
  Clock, 
  Search, 
  ArrowRight,
  Settings,
  Globe,
  Compass,
  Navigation,
  Heart
} from 'lucide-react';

// --- Types ---
interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  images: string[];
  date: string;
  preview: string;
}

const CATEGORIES = [
  "Home",
  "Arab Countries",
  "European Countries",
  "American Countries",
  "Asian Countries"
];

const TRENDING_COUNTRIES = [
  { name: "USA", image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=800" },
  { name: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800" },
  { name: "Thailand", image: "https://images.unsplash.com/photo-1528181304800-2f140819ad9c?auto=format&fit=crop&q=80&w=800" },
  { name: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800" },
  { name: "Morocco", image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800" }
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: "The Golden Sands of Dubai",
    content: "Dubai is a city of superlatives, where the desert meets the sea and the future meets the past. From the Burj Khalifa to the traditional souks, it's a destination like no other.",
    category: "Arab Countries",
    images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800"],
    date: "2024-03-15",
    preview: "Discover the luxury and tradition of the Middle East's most vibrant city."
  },
  {
    id: '2',
    title: "A Parisian Romance",
    content: "Paris is always a good idea. The Eiffel Tower, the Louvre, and the charming cafes of Montmartre await those who seek beauty and inspiration.",
    category: "European Countries",
    images: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800"],
    date: "2024-03-14",
    preview: "Walk through the streets of the world's most romantic city."
  },
  {
    id: '3',
    title: "Tokyo: Neon and Tradition",
    content: "Tokyo is a city that never sleeps, yet finds peace in its ancient temples. Experience the thrill of Shibuya Crossing and the serenity of Meiji Shrine.",
    category: "Asian Countries",
    images: ["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800"],
    date: "2024-03-13",
    preview: "Explore the fascinating contrast between high-tech and history."
  }
];

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState("Home");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Admin Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[1]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('atlas_escape_articles');
    if (saved) {
      setArticles(JSON.parse(saved));
    } else {
      setArticles(INITIAL_ARTICLES);
      localStorage.setItem('atlas_escape_articles', JSON.stringify(INITIAL_ARTICLES));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    localStorage.setItem('atlas_escape_articles', JSON.stringify(newArticles));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const article: Article = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      category: newCategory,
      images: newImages.length > 0 ? newImages : ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800"],
      date: new Date().toISOString().split('T')[0],
      preview: newContent.substring(0, 100) + "..."
    };

    saveArticles([article, ...articles]);
    setNewTitle('');
    setNewContent('');
    setNewImages([]);
    setIsAdminOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const readers = Array.from(files).map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(results => {
        setNewImages(prev => [...prev, ...results]);
      });
    }
  };

  const filteredArticles = activeCategory === "Home" 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const latestArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-sans selection:bg-[#C5A059] selection:text-white">
      
      {/* --- Navigation --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className={`w-8 h-8 ${scrolled ? 'text-[#C5A059]' : 'text-white'}`} />
            <h1 className={`text-2xl font-black tracking-tighter uppercase ${scrolled ? 'text-[#1A1A1A]' : 'text-white'}`}>
              Atlas <span className={scrolled ? 'text-[#C5A059]' : 'text-[#C5A059]'}>Escape</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-[#C5A059] ${
                  activeCategory === cat 
                    ? 'text-[#C5A059]' 
                    : scrolled ? 'text-[#1A1A1A]' : 'text-white'
                }`}
              >
                {cat === "Home" ? "Home" : cat.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAdminOpen(true)}
              className={`p-2 rounded-full transition-all ${scrolled ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <Plus className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-all ${scrolled ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-white'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white transition-all duration-500 md:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => { setActiveCategory(cat); setIsMenuOpen(false); }}
              className="text-2xl font-black uppercase tracking-tighter text-[#1A1A1A] hover:text-[#C5A059]"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- Hero Section --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.2]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-block px-4 py-1 bg-[#C5A059] text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-fade-in-up">
            Premium Travel Magazine
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8 animate-fade-in-up delay-100">
            Explore the world through <span className="text-[#C5A059]">stories</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-medium mb-12 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Discover hidden gems, luxury retreats, and authentic cultural experiences across the globe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <button 
              onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white text-[#1A1A1A] font-black uppercase tracking-widest rounded-full hover:bg-[#C5A059] hover:text-white transition-all shadow-2xl flex items-center gap-3"
            >
              Start Exploring <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-white/30"></div>
        </div>
      </header>

      {/* --- About Section --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <Compass className="w-12 h-12 text-[#C5A059] mx-auto mb-8" />
          <h3 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-8 tracking-tight">
            A modern travel platform where you discover destinations, restaurants, hotels, and real travel experiences.
          </h3>
          <div className="w-24 h-1 bg-[#C5A059] mx-auto"></div>
        </div>
      </section>

      {/* --- Latest Articles --- */}
      <section id="latest" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="text-[#C5A059] font-black uppercase tracking-widest text-xs mb-2 block">The Journal</span>
            <h3 className="text-5xl font-black text-[#1A1A1A] tracking-tighter">Latest Stories</h3>
          </div>
          <div className="hidden md:block w-1/3 h-px bg-slate-200 mb-4"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {latestArticles.map((article, idx) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-8 shadow-xl">
                <img 
                  src={article.images[0]} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={article.title}
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">
                    {article.category}
                  </span>
                </div>
              </div>
              <h4 className="text-2xl font-black text-[#1A1A1A] mb-4 group-hover:text-[#C5A059] transition-colors">
                {article.title}
              </h4>
              <p className="text-slate-500 font-medium mb-6 line-clamp-2">
                {article.preview}
              </p>
              <button className="flex items-center gap-2 text-[#C5A059] font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                Read More <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Trending Countries (Horizontal Scroll) --- */}
      <section className="py-24 bg-[#1A1A1A] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <span className="text-[#C5A059] font-black uppercase tracking-widest text-xs mb-2 block">World Tour</span>
          <h3 className="text-5xl font-black tracking-tighter">Trending Destinations</h3>
        </div>

        <div className="flex gap-8 overflow-x-auto px-6 pb-12 no-scrollbar snap-x">
          {TRENDING_COUNTRIES.map((country) => (
            <div 
              key={country.name} 
              className="flex-none w-72 md:w-96 aspect-[3/4] relative rounded-[2.5rem] overflow-hidden group snap-center cursor-pointer shadow-2xl"
            >
              <img 
                src={country.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={country.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute bottom-10 left-10">
                <h5 className="text-3xl font-black tracking-tighter mb-2">{country.name}</h5>
                <div className="w-0 group-hover:w-12 h-1 bg-[#C5A059] transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- All Articles Grid --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div>
            <span className="text-[#C5A059] font-black uppercase tracking-widest text-xs mb-2 block">Archive</span>
            <h3 className="text-5xl font-black text-[#1A1A1A] tracking-tighter">
              {activeCategory === "Home" ? "All Experiences" : `${activeCategory}`}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' 
                    : 'bg-white text-slate-400 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
              <div className="relative aspect-video overflow-hidden rounded-[2rem] mb-6">
                <img 
                  src={article.images[0]} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={article.title}
                />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-[#1A1A1A]">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  <Clock className="w-3 h-3" /> {article.date}
                </div>
                <h4 className="text-xl font-black text-[#1A1A1A] mb-3 group-hover:text-[#C5A059] transition-colors">
                  {article.title}
                </h4>
                <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
                  {article.preview}
                </p>
                <div className="flex items-center justify-between">
                  <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] flex items-center gap-2">
                    Read <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="py-24 text-center">
            <Navigation className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">No stories found in this category yet.</p>
          </div>
        )}
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-100 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <Globe className="w-10 h-10 text-[#C5A059]" />
              <h1 className="text-3xl font-black tracking-tighter uppercase text-[#1A1A1A]">
                Atlas <span className="text-[#C5A059]">Escape</span>
              </h1>
            </div>
            <p className="text-slate-500 font-medium text-lg max-w-md leading-relaxed">
              We are a global community of travelers, storytellers, and dreamers. Join us as we explore the most beautiful corners of our planet.
            </p>
          </div>
          <div>
            <h6 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] mb-8">Explore</h6>
            <ul className="space-y-4">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button onClick={() => setActiveCategory(cat)} className="text-slate-500 font-bold hover:text-[#C5A059] transition-colors">{cat}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] mb-8">Newsletter</h6>
            <p className="text-slate-500 text-sm mb-6">Get the latest stories delivered to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#C5A059] outline-none"
              />
              <button className="p-4 bg-[#1A1A1A] text-white rounded-2xl hover:bg-[#C5A059] transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2024 Atlas Escape. All rights reserved.</p>
          <div className="flex gap-8">
            <button className="text-slate-400 hover:text-[#C5A059] transition-colors"><Globe className="w-5 h-5" /></button>
            <button className="text-slate-400 hover:text-[#C5A059] transition-colors"><MapPin className="w-5 h-5" /></button>
            <button className="text-slate-400 hover:text-[#C5A059] transition-colors"><Search className="w-5 h-5" /></button>
          </div>
        </div>
      </footer>

      {/* --- Admin Modal --- */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#1A1A1A]/90 backdrop-blur-xl" onClick={() => setIsAdminOpen(false)}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-modal-in">
              <div className="p-12">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <span className="text-[#C5A059] font-black uppercase tracking-widest text-[10px] mb-2 block">Editor Panel</span>
                    <h3 className="text-4xl font-black text-[#1A1A1A] tracking-tighter">Publish New Story</h3>
                  </div>
                  <button onClick={() => setIsAdminOpen(false)} className="p-4 bg-slate-50 text-slate-400 rounded-3xl hover:bg-red-50 hover:text-red-500 transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handlePublish} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-4">Story Title</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. The Hidden Temples of Bali"
                      className="w-full bg-slate-50 border-none rounded-[1.5rem] px-8 py-5 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-[#C5A059] outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-4">Category</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-[1.5rem] px-8 py-5 font-bold text-slate-900 focus:ring-2 focus:ring-[#C5A059] outline-none appearance-none cursor-pointer"
                      >
                        {CATEGORIES.slice(1).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-4">Media</label>
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-slate-50 border-none rounded-[1.5rem] px-8 py-5 font-bold text-slate-400 hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
                      >
                        <ImageIcon className="w-5 h-5" />
                        {newImages.length > 0 ? `${newImages.length} Images` : 'Upload Images'}
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-4">The Story</label>
                    <textarea 
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Share the experience..."
                      rows={6}
                      className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-6 text-lg font-medium text-slate-700 focus:ring-2 focus:ring-[#C5A059] outline-none transition-all resize-none"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#1A1A1A] text-white py-6 rounded-full font-black uppercase tracking-widest text-lg shadow-2xl hover:bg-[#C5A059] transition-all transform active:scale-95"
                  >
                    Publish Article
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Floating Admin Button --- */}
      <button 
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-10 right-10 z-50 w-16 h-16 bg-[#C5A059] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-90"
      >
        <Settings className="w-8 h-8 animate-spin-slow" />
      </button>

      {/* --- Styles --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }

        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in {
          animation: modal-in 0.6s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

// --- Helper Components ---
const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const Send = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
