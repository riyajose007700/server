import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUp, ArrowDown, Monitor, CheckCircle, XCircle, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { StatusCard } from '../components/StatusCard';
import { ConnectionStatusPanel } from '../components/ConnectionStatusPanel';

const websiteData = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 9800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 4800 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4300 },
];

const salesData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const projects = [
  {
    name: 'ATM Software Update',
    members: ['https://i.pravatar.cc/32?1', 'https://i.pravatar.cc/32?2'],
    progress: 60,
    color: '[#FFD700]'
  },
  {
    name: 'Security Protocol Implementation',
    members: ['https://i.pravatar.cc/32?3', 'https://i.pravatar.cc/32?4', 'https://i.pravatar.cc/32?5'],
    progress: 85,
    color: '[#FFD700]'
  },
  {
    name: 'Network Configuration',
    members: ['https://i.pravatar.cc/32?6'],
    progress: 32,
    color: '[#FFD700]'
  },
  {
    name: 'Hardware Maintenance',
    members: ['https://i.pravatar.cc/32?7', 'https://i.pravatar.cc/32?8'],
    progress: 45,
    color: '[#FFD700]'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const currentTime = new Date();
  const hour = currentTime.getHours();

  let greeting = 'Welcome';

  const statusCards = [
    {
      title: 'Total NDC Terminals',
      count: 6,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      icon: <Monitor size={36} />
    },
    {
      title: 'Active Terminals',
      count: 2,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      icon: <CheckCircle size={36} />
    },
    {
      title: 'Offline Terminals',
      count: 0,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      icon: <XCircle size={36} />
    },
    {
      title: 'Closed Terminals',
      count: 4,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      icon: <Lock size={36} />
    }
  ];

  return (
    <DashboardLayout>
      <motion.div
        className="pt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <h1 className="text-2xl font-bold text-[#FFD500] mb-2">{greeting}, {user?.name}!</h1>
          <p className="text-[white]/60 text-xs">Welcome to your ATM Management Dashboard. Here's what's happening today.</p>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          variants={itemVariants}
        >
          {statusCards.map((card, index) => (
            <motion.div
              key={index}
              variants={{
                ...itemVariants,
                hover: cardHoverVariants.hover
              }}
              whileHover="hover"
            >
              <StatusCard
                title={card.title}
                count={card.count}
                color={card.color}
                bgColor={card.bgColor}
                icon={card.icon}
              />
            </motion.div>
          ))}
        </motion.div>
        {/* Connection Status Panels */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          variants={itemVariants}
        >
          <motion.div
            variants={{
              ...itemVariants,
              hover: cardHoverVariants.hover
            }}
          >
            <ConnectionStatusPanel
              title="ATM Transaction Driver"
              ipAddress="192.168.100.179"
              port="8888"
              icon="network"
            />
          </motion.div>
          <motion.div
            variants={{
              ...itemVariants,
              hover: cardHoverVariants.hover
            }}
          >
            <ConnectionStatusPanel
              title="Transaction Manager"
              ipAddress="192.168.100.17"
              port="8888"
              icon="transaction"
            />
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            {
              title: 'Active ATMs',
              value: '291',
              change: '+2.45%',
              isPositive: true,
              chart: (
                <AreaChart data={websiteData}>
                  <defs>
                    <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#FFD700" fillOpacity={1} fill="url(#colorView)" />
                </AreaChart>
              )
            },
            {
              title: 'Daily Transactions',
              value: '2,300',
              change: '+3.75%',
              isPositive: true,
              chart: (
                <BarChart data={salesData}>
                  <Bar dataKey="value" fill="#FFD700" radius={[4, 4, 0, 0]} />
                </BarChart>
              )
            },
            {
              title: 'Success Rate',
              value: '98.5%',
              change: '-1.25%',
              isPositive: false,
              chart: (
                <AreaChart data={websiteData}>
                  <defs>
                    <linearGradient id="colorTask" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#FFD700" fillOpacity={1} fill="url(#colorTask)" />
                </AreaChart>
              )
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                ...itemVariants,
                hover: cardHoverVariants.hover
              }}
              whileHover="hover"
              className="bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-2xl border border-[#FFD700]/5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#FFD700] text-sm font-medium">{stat.title}</h3>
                <span className={`flex items-center text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-4">{stat.value}</p>
              <div className="h-[60px]">
                <ResponsiveContainer width="100%" height="100%">
                  {stat.chart}
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Overview */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl border border-[#FFD700]/5"
        >
          <h2 className="text-[#FFD700] text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[
              { title: 'Cash Replenishment - ATM #1234', date: '22 DEC 7:20 PM', color: '[#FFD700]' },
              { title: 'System Update - Branch Network', date: '21 DEC 11:21 PM', color: '[#FFD700]' },
              { title: 'Maintenance Check - ATM #5678', date: '21 DEC 9:28 PM', color: '[#FFD700]' },
              { title: 'Security Alert - Branch #910', date: '20 DEC 3:52 PM', color: '[#FFD700]' },
              { title: 'Transaction Report Generated', date: '19 DEC 2:20 PM', color: '[#FFD700]' }
            ].map((order, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full bg-[#FFD700]`}></div>
                <div>
                  <p className="text-white text-sm font-medium">{order.title}</p>
                  <p className="text-[#FFD700]/60 text-xs">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};