
import React from 'react';
import { Trophy, Medal, Star, ArrowUpRight, Award } from 'lucide-react';
import { User } from '../types';

interface LeaderboardProps {
  users: User[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const topThree = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3, 10);

  const BadgeIcon = ({ rank }: { rank: number }) => {
    if (rank === 0) return <Trophy className="h-10 w-10 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-10 w-10 text-slate-400" />;
    if (rank === 2) return <Medal className="h-10 w-10 text-amber-600" />;
    return null;
  };

  return (
    <div className="max-w-4xl auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex p-4 bg-indigo-100 rounded-[2rem] text-indigo-600 mb-6">
          <Award className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Community Leaders</h1>
        <p className="text-slate-500 text-lg">Top contributors helping thousands of students across India.</p>
      </div>

      <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16">
        {/* Rank 2 */}
        {topThree[1] && (
          <div className="w-full md:w-64 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg text-center order-2 md:order-1 relative mt-8 md:mt-0">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
               <BadgeIcon rank={1} />
            </div>
            <div className="h-20 w-20 rounded-full bg-slate-100 mx-auto mb-4 border-4 border-white shadow-inner flex items-center justify-center font-bold text-2xl text-slate-400">
              {(topThree[1].name || 'U').charAt(0)}
            </div>
            <h3 className="font-bold text-slate-800 truncate px-2">{topThree[1].name || 'User'}</h3>
            <div className="text-2xl font-black text-slate-400 mt-2">{topThree[1].points} <span className="text-xs uppercase">pts</span></div>
          </div>
        )}

        {/* Rank 1 */}
        {topThree[0] && (
          <div className="w-full md:w-72 bg-gradient-to-b from-blue-600 to-blue-700 rounded-[3rem] p-10 border border-blue-500 shadow-2xl text-center order-1 md:order-2 relative z-10 transform md:scale-110">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 drop-shadow-lg">
               <BadgeIcon rank={0} />
            </div>
            <div className="h-24 w-24 rounded-full bg-white/20 mx-auto mb-6 border-4 border-white/50 shadow-lg flex items-center justify-center font-bold text-3xl text-white">
              {(topThree[0].name || 'U').charAt(0)}
            </div>
            <h3 className="font-black text-white text-xl truncate px-2">{topThree[0].name || 'User'}</h3>
            <div className="text-4xl font-black text-white mt-2">{topThree[0].points} <span className="text-xs uppercase text-blue-100">pts</span></div>
            <div className="mt-4 inline-flex items-center px-4 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest">
              Grand Master
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {topThree[2] && (
          <div className="w-full md:w-64 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg text-center order-3 relative mt-8 md:mt-0">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2">
               <BadgeIcon rank={2} />
            </div>
            <div className="h-20 w-20 rounded-full bg-amber-50 mx-auto mb-4 border-4 border-white shadow-inner flex items-center justify-center font-bold text-2xl text-amber-600">
              {(topThree[2].name || 'U').charAt(0)}
            </div>
            <h3 className="font-bold text-slate-800 truncate px-2">{topThree[2].name || 'User'}</h3>
            <div className="text-2xl font-black text-amber-600 mt-2">{topThree[2].points} <span className="text-xs uppercase">pts</span></div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-20">
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-bold text-slate-700">Recent Risers</h4>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top 10 Contributors</span>
        </div>
        <div className="divide-y divide-slate-100">
          {rest.map((user, idx) => (
            <div key={user.id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-6">
                <span className="text-lg font-black text-slate-300 w-6">#{idx + 4}</span>
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                  {(user.name || 'U').charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{user.name || 'User'}</h5>
                  <p className="text-xs text-slate-400">Joined {new Date(user.joinedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                   <div className="font-black text-slate-700">{user.points}</div>
                   <div className="text-[10px] text-slate-400 uppercase tracking-widest">Points</div>
                </div>
                <div className="p-2 rounded-xl bg-green-50 text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
