import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { BusinessCard } from '../types';
import { Search, Filter, Trash2, Edit, ChevronDown, Mail, Phone, Building, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function MyCards() {
  const { user } = useAuth();
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchCards();
  }, [user]);

  const fetchCards = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const qCards = query(collection(db, 'cards'), where('userId', '==', user.uid));
      const snapshot = await getDocs(qCards);
      const fetchedCards: BusinessCard[] = [];
      snapshot.forEach((doc) => {
        fetchedCards.push({ id: doc.id, ...doc.data() } as BusinessCard);
      });
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error fetching cards", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      await deleteDoc(doc(db, 'cards', id));
      setCards(cards.filter(c => c.id !== id));
    }
  };

  const filteredCards = cards.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      (c.fullName || '').toLowerCase().includes(term) ||
      (c.company || '').toLowerCase().includes(term) ||
      (c.category || '').toLowerCase().includes(term) ||
      (c.emails || []).some(e => e.toLowerCase().includes(term)) ||
      (c.phoneNumbers || []).some(p => p.includes(term))
    );
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === 'latest') return b.createdAt - a.createdAt;
    if (sortBy === 'oldest') return a.createdAt - b.createdAt;
    if (sortBy === 'name') return (a.fullName || '').localeCompare(b.fullName || '');
    if (sortBy === 'company') return (a.company || '').localeCompare(b.company || '');
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-0">My Cards</h1>
        <div className="flex space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg leading-5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-full"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="company">Company A-Z</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading cards...</div>
      ) : sortedCards.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
          <p className="text-gray-500">No cards found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCards.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              {card.imageUrl ? (
                <div className="h-32 bg-gray-100 overflow-hidden relative">
                   <img src={card.imageUrl} alt="Card Thumbnail" className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                   <div className="absolute bottom-3 left-4 text-white">
                      <p className="font-semibold">{card.fullName}</p>
                      <p className="text-xs opacity-90">{card.designation}</p>
                   </div>
                </div>
              ) : (
                <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex flex-col justify-end text-white">
                   <p className="font-semibold text-lg">{card.fullName || 'Unknown'}</p>
                   <p className="text-sm opacity-90">{card.designation}</p>
                </div>
              )}
              
              <div className="p-4 space-y-3">
                {card.company && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{card.company}</span>
                  </div>
                )}
                {card.phoneNumbers?.[0] && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{card.phoneNumbers[0]}</span>
                  </div>
                )}
                {card.emails?.[0] && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{card.emails[0]}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {card.category || 'Uncategorized'}
                  </span>
                  <div className="flex space-x-2">
                    <button onClick={() => handleDelete(card.id!)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
