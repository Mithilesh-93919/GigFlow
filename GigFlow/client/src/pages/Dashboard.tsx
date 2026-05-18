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
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Mock data for beautiful overview charts and lists
  const stats = [
    {
      title: 'Total Prospect Leads',
      value: '148',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Qualified Deals',
      value: '42',
      change: '+18.2%',
      trend: 'up',
      icon: UserCheck,
      color: 'from-emerald-400 to-teal-600',
    },
    {
      title: 'Monthly Conversion',
      value: '28.4%',
      change: '+4.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      leadName: 'Amit Patel',
      action: 'Qualified as active prospective buyer',
      time: '15 mins ago',
      source: 'Social Media',
      sourceIcon: Share2,
    },
    {
      id: 2,
      leadName: 'Sneha Rao',
      action: 'Inbound inquiry submitted via form',
      time: '1 hour ago',
      source: 'Website',
      sourceIcon: Globe,
    },
    {
      id: 3,
      leadName: 'Vikram Singh',
      action: 'Initial discovery call logged by team',
      time: '3 hours ago',
      source: 'Referral',
      sourceIcon: PhoneCall,
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
              Welcome to your Workspace, {user?.name}!
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

      {/* ─── DYNAMIC STATISTICS CARDS ─── */}
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
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
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
        {/* Recent Activity List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-slate-800">Recent Prospect Activity</h3>
              <Link to="/leads" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View all leads
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivities.map((act) => {
                const SourceIcon = act.sourceIcon;
                return (
                  <div key={act.id} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-150">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <SourceIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{act.leadName}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{act.action}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap pl-2">
                      {act.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sales Guide Sidebar */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Accent Shapes */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          
          <div className="space-y-4 relative z-10">
            <h4 className="text-lg font-bold">Quick Sales Assist</h4>
            <p className="text-sm text-blue-100 font-light leading-relaxed">
              Ensure you record status shifts (e.g. converting a lead to "Qualified") immediately. Doing so triggers active marketing emails on the server!
            </p>
          </div>

          <div className="pt-6 relative z-10 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-blue-50 font-medium">
              <Mail className="w-4 h-4 text-blue-200" />
              <span>automated-outreach@gigflow.com</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-blue-50 font-medium">
              <Users className="w-4 h-4 text-blue-200" />
              <span>Role Level: <span className="capitalize">{user?.role}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
