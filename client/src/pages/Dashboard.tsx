import React from 'react';
import { useAuthStore } from '../store/auth.store';
import {
  TrendingUp,
  Users,
  UserCheck,
  ArrowUpRight,
  Sparkles,
  PhoneCall,
  Mail,
  Share2,
  Globe,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { leadsApi } from '../api/leads';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Fetch real lead data for dashboard stats
  const { data: allLeads } = useQuery({
    queryKey: ['leads-dashboard'],
    queryFn: () => leadsApi.getLeads({ page: 1, limit: 1000 }),
  });

  const totalLeads = allLeads?.total ?? 0;
  const qualifiedLeads = allLeads?.data?.filter((l) => l.status === 'Qualified').length ?? 0;
  const newLeads = allLeads?.data?.filter((l) => l.status === 'New').length ?? 0;
  const recentLeads = allLeads?.data?.slice(0, 4) ?? [];

  const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0.0';

  const SOURCE_ICONS: Record<string, React.FC<{ className?: string }>> = {
    Website: Globe,
    Instagram: Share2,
    Referral: PhoneCall,
  };

  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads.toString(),
      change: `${newLeads} new`,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Qualified Leads',
      value: qualifiedLeads.toString(),
      change: `${totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(0) : 0}% of total`,
      icon: UserCheck,
      color: 'from-emerald-400 to-teal-600',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: 'Qualified / Total',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ─── HERO HEADER BANNER ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-900/10">
        {/* Neon Blur Accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500 rounded-full filter blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-indigo-500 rounded-full filter blur-3xl opacity-10 transform -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Workspace Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Welcome, {user?.name}!
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-light max-w-xl">
              Monitor prospect channels, coordinate marketing campaigns, and drive sales opportunities using your GigFlow CRM panels.
            </p>
          </div>
          <div>
            <Link
              to="/leads"
              className="inline-flex items-center px-5 py-3 bg-white text-slate-900 hover:bg-slate-50 font-bold text-sm rounded-2xl transition-all duration-200 shadow-md active:scale-95 group"
            >
              <span>Access Leads Directory</span>
              <ArrowUpRight className="w-4 h-4 ml-2 text-slate-500 group-hover:text-slate-950 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── LIVE STATISTICS CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
            >
              <div className="space-y-3">
                <span className="text-sm font-semibold text-slate-400 block">{stat.title}</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    {allLeads === undefined ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 inline" /> : stat.value}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── DOUBLE SECTION CONTENT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-slate-800">Recent Leads</h3>
              <Link to="/leads" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View all leads
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No leads yet. Add your first lead!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => {
                  const SIcon = SOURCE_ICONS[lead.source] ?? Globe;
                  return (
                    <Link
                      key={lead._id}
                      to={`/leads/${lead._id}`}
                      className="flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-150 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <SIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{lead.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{lead.email}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        lead.status === 'Qualified' ? 'bg-green-100 text-green-700' :
                        lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lead.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sales Guide Sidebar */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Accent Shapes */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />

          <div className="space-y-4 relative z-10">
            <h4 className="text-lg font-bold">Quick Sales Guide</h4>
            <p className="text-sm text-blue-100 font-light leading-relaxed">
              Record status shifts immediately (e.g., converting a lead to "Qualified"). This keeps your pipeline accurate and triggers the right follow-up actions.
            </p>
          </div>

          <div className="pt-6 relative z-10 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-blue-50 font-medium">
              <Mail className="w-4 h-4 text-blue-200" />
              <span>support@gigflow.com</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-blue-50 font-medium">
              <Users className="w-4 h-4 text-blue-200" />
              <span>Role: <span className="capitalize font-bold">{user?.role}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
