import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Users, FileImage, Layers, Plus } from 'lucide-react';
import { BusinessCard } from '../types';
import { format, isToday } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, today: 0, categories: 0 });
  const [recentCards, setRecentCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const qCards = query(collection(db, 'cards'), where('userId', '==', user.uid));
        const snapshot = await getDocs(qCards);
        const cards: BusinessCard[] = [];
        let todayCount = 0;
        
        snapshot.forEach((doc) => {
          const data = doc.data() as BusinessCard;
          data.id = doc.id;
          cards.push(data);
          if (isToday(data.createdAt)) {
            todayCount++;
          }
        });

        cards.sort((a, b) => b.createdAt - a.createdAt);

        const qCats = query(collection(db, 'categories'), where('userId', '==', user.uid));
        const catSnap = await getDocs(qCats);

        setStats({
          total: cards.length,
          today: todayCount,
          categories: catSnap.size
        });
        setRecentCards(cards.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <div className="flex">
          <Link to="/scan" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-blue-700 transition-colors w-full justify-center sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Quick Scan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-4 bg-blue-50 rounded-xl mr-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Scanned</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-4 bg-emerald-50 rounded-xl mr-4">
            <FileImage className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Scanned Today</p>
            <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-4 bg-purple-50 rounded-xl mr-4">
            <Layers className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Categories</p>
            <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Scans</h2>
          <Link to="/cards" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentCards.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No cards scanned yet.</div>
          ) : (
            recentCards.map(card => (
              <div key={card.id} className="p-6 flex items-center hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 mr-4 shrink-0">
                  {card.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium text-gray-900 truncate">{card.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">{card.designation} {card.company ? `at ${card.company}` : ''}</p>
                </div>
                <div className="text-sm text-gray-500 shrink-0">
                  {format(card.createdAt, 'MMM d, yyyy')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
