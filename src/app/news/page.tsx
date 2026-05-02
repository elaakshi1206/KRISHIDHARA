"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Search, Calendar, Share2, 
  ExternalLink, Newspaper, Loader2, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  published_at: string;
  source: string;
  author: string;
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/news`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Failed to fetch news");
      }

      setNews(data.data || []);
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(err.message || "Something went wrong while fetching news.");
      
      // Fallback data for demonstration if API fails
      setNews([
        {
          title: "New Government Subsidy for Organic Farming",
          description: "The Ministry of Agriculture has announced a new scheme to promote organic farming practices across rural India with direct cash transfers.",
          url: "#",
          image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&auto=format&fit=crop",
          published_at: new Date().toISOString(),
          source: "Krishi News",
          author: "Admin"
        },
        {
          title: "Revolutionary Drip Irrigation Tech Hits Markets",
          description: "Low-cost drip irrigation systems developed by local startups are helping farmers save up to 40% more water this season.",
          url: "#",
          image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop",
          published_at: new Date().toISOString(),
          source: "AgriTech Daily",
          author: "S. Kumar"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-[32px] shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.push("/")}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agri News</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search news, topics, or trends..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Newspaper size={20} className="text-primary-green" />
            Latest Updates
          </h2>
          <button 
            onClick={fetchNews}
            className="p-2 text-slate-400 hover:text-primary-green transition-colors"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={40} className="text-primary-green animate-spin" />
            <p className="text-slate-500 font-medium italic">Fetching latest agricultural news...</p>
          </div>
        ) : error && news.length === 0 ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button 
              onClick={fetchNews}
              className="btn-primary py-2 px-6"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredNews.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative h-48 w-full bg-slate-100">
                    {article.image ? (
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-green-light/30">
                        <Newspaper size={48} className="text-primary-green/20" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-primary-green uppercase tracking-wider shadow-sm">
                        {article.source}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(article.published_at).toLocaleDateString()}
                      </div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                      <div>{article.author || "Global News"}</div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug group-hover:text-primary-green transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-4">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary-green font-bold text-sm"
                      >
                        Read Full Article <ExternalLink size={14} />
                      </a>
                      <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredNews.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-500 font-medium">No news found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Spacer for Nav */}
      <div className="h-10"></div>
    </div>
  );
}
