import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Trash, FilterX, Calendar, Search, Filter, Download, Upload, Send, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, RefreshCw, Clock, CheckCircle2, AlertCircle, XCircle, Loader2, Terminal, Import as FileImport, File as FileExport } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../components/DashboardLayout';
import { Tooltip } from '../components/Tooltip';
import { CommandPopup } from '../components/CommandPopup';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../components/Toast';
import { fetchCommands, type Command, type Status, type CommandData, deleteCommand, deleteCommands } from '../api/commands';

interface SortConfig {
    key: 'terminalId' | 'command' | 'status' | 'startDate' | 'endDate';
    direction: 'asc' | 'desc';
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Filters {
    terminalId: string;
    command: string;
    status: string;
    dateFilterType: 'specific' | 'range';
    specificDate: string;
    dateRange: {
        from: string;
        to: string;
    };
}

const CommandCenter: React.FC = () => {
    const [data, setData] = useState<CommandData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');
    const [filters, setFilters] = useState<Filters>({
        terminalId: '',
        command: '',
        status: '',
        dateFilterType: 'specific',
        specificDate: '',
        dateRange: {
            from: '',
            to: ''
        }
    });
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'startDate',
        direction: 'desc',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [showCommandPopup, setShowCommandPopup] = useState(false);

    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const commandOptions: Command[] = [
        'Full Download',
        'Mini Download',
        'Check Download',
        'Open',
        'Supply Counter',
        'Sync',
        'Close',
    ];

    const statusOptions: Status[] = ['Started', 'In-Progress', 'Completed', 'Stopped', 'Error'];
    const entriesOptions = [5, 10, 15, 20, 25];

    const specificDateRef = useRef<HTMLInputElement>(null);
    const fromDateRef = useRef<HTMLInputElement>(null);
    const toDateRef = useRef<HTMLInputElement>(null);

    const handleSessionExpired = () => {
        logout();
        navigate('/login');
    };
    


    const loadCommands = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchCommands({
                page: currentPage,
                limit: entriesPerPage,
                search: searchTerm,
                terminalId: filters.terminalId,
                command: filters.command as Command,
                status: filters.status as Status,
                dateType: filters.dateFilterType,
                specificDate: filters.specificDate,
                dateFrom: filters.dateRange.from,
                dateTo: filters.dateRange.to,
                sortBy: sortConfig.key,
                sortDirection: sortConfig.direction,
            });
            
            setData(response.data);
            setTotalItems(response.pagination.total);
        } catch (err) {
            if (err instanceof Error && err.message === 'Session expired. Please login again.') {
                handleSessionExpired();
                return;
            }
            setError('Failed to load commands');
            console.error('Error loading commands:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, entriesPerPage, searchTerm, filters, sortConfig]);

    useEffect(() => {
        loadCommands();
    }, [loadCommands]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await loadCommands();
        setIsRefreshing(false);
    }, [loadCommands]);

    const handleSort = useCallback((key: SortConfig['key']) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    const handleEntriesPerPageChange = useCallback((value: number) => {
        setEntriesPerPage(value);
        setCurrentPage(1);
    }, []);

    const handleFilterChange = (key: keyof Filters, value: any) => {
        setFilters(prev => {
            if (key === 'dateFilterType') {
                return {
                    ...prev,
                    [key]: value,
                    specificDate: '',
                    dateRange: {
                        from: '',
                        to: ''
                    }
                };
            }
            return { ...prev, [key]: value };
        });
        setCurrentPage(1);
    };

    const handleDateRangeChange = (type: 'from' | 'to', value: string) => {
        setFilters(prev => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [type]: value
            }
        }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            terminalId: '',
            command: '',
            status: '',
            dateFilterType: 'specific',
            specificDate: '',
            dateRange: {
                from: '',
                to: ''
            }
        });
    };

    const handleSelectItem = (id: string) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(data.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };

    const handleDelete = async () => {
        try {
          if (selectedItems.length === 1) {
            // Single delete
            
            await deleteCommand(selectedItems[0]);

            setToastMessage(`Delete Operation Success`);
            setToastType("success")
            setShowToast(true);
            
          } else {
            // Bulk delete
            await deleteCommands(selectedItems);
            setToastMessage(`${selectedItems.length} entries Deleted Successfully`);
            setToastType("success")
            setShowToast(true);
          }
          
          // Clear selected items and refresh the data
          setSelectedItems([]);
          setSelectAll(false);
          setShowDeleteConfirm(false);
          setIsRefreshing(true);
          await loadCommands();
          setIsRefreshing(false);
        } catch (error) {
          console.error('Error deleting commands:', error);
          setToastMessage(`Error deleting commands`);
            setToastType("error")
            setShowToast(true);
        }
      };

    useEffect(() => {
        setSelectedItems([]);
        setSelectAll(false);
    }, [currentPage]);

    useEffect(() => {
        if (data.length > 0 && data.every(item => selectedItems.includes(item.id))) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedItems, data]);

    const getStatusIcon = (status: Status) => {
        const statusIcons = {
            Started: (
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                    <Clock className="w-6 h-6 text-blue-500 transition-all duration-300 transform hover:rotate-12" />
                    <div className="absolute -right-0.5 -top-0.5">
                        <span className="flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                        </span>
                    </div>
                </div>
            ),
            "In-Progress": (
                <div className="relative inline-flex group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin transition-colors duration-300 group-hover:text-amber-600" />
                    <div className="absolute inset-0 border-2 border-amber-200 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20" />
                </div>
            ),
            Completed: (
                <div className="relative inline-flex group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300" />
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 transition-all duration-300 transform group-hover:scale-110" />
                    <div className="absolute inset-0 border-2 border-emerald-500 rounded-full scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-20 transition-all duration-300" />
                </div>
            ),
            Stopped: (
                <div className="relative inline-flex group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300" />
                    <XCircle className="w-6 h-6 text-orange-500 transition-all duration-300 transform group-hover:rotate-90" />
                    <div className="absolute inset-0 border-2 border-orange-500 rounded-full scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-20 transition-all duration-300" />
                </div>
            ),
            Error: (
                <div className="relative inline-flex group">
                    <div className="absolute inset-0 rounded-full animate-pulse opacity-20" />
                    <AlertCircle className="w-6 h-6 text-red-500 transition-all duration-300" />
                    <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20" />
                </div>
            )
        };

        return statusIcons[status] || null;
    };

    const getStatusColor = (status: Status) => {
        switch (status) {
            case 'Started':
                return 'text-blue-500';
            case 'In-Progress':
                return 'text-yellow-500';
            case 'Completed':
                return 'text-emerald-500';
            case 'Stopped':
                return 'text-orange-500';
            case 'Error':
                return 'text-red-500';
        }
    };

    const filterAreaVariants = {
        hidden: {
            height: 0,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1]
            }
        },
        visible: {
            height: 'auto',
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1]
            }
        }
    };

    const handleCalendarClick = (inputRef: React.RefObject<HTMLInputElement>) => {
        if (inputRef.current) {
            inputRef.current.showPicker();
        }
    };

    const confirmDialogVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.2
            }
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3
            }
        }
    };

    const totalPages = Math.ceil(totalItems / entriesPerPage);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Error Loading Commands</h2>
                    <p className="text-white/60">{error}</p>
                    <button
                        onClick={loadCommands}
                        className="mt-4 px-4 py-2 bg-[#FFD700] text-black rounded-lg font-medium hover:bg-[#FFD700]/90 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="pt-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-2xl font-bold text-[#FFD700]">Command Center</h1>
                    <p className="text-white/60">Monitor and manage ATM commands</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] rounded-xl border border-[#FFD700]/10 p-4 mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                            <div className="flex items-center gap-2 min-w-[200px]">
                                <span className="text-white/60 text-sm">Show</span>
                                <select
                                    value={entriesPerPage}
                                    onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
                                    className="bg-black/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                >
                                    {entriesOptions.map(value => (
                                        <option
                                            key={value}
                                            value={value}
                                            className="bg-[#1a1a1a] text-white"
                                        >
                                            {value}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-white/60 text-sm">entries</span>
                            </div>

                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search commands..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Tooltip text="Send">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowCommandPopup(true)}
                                    className="px-4 py-2 bg-[#FFD700] text-black rounded-lg font-medium flex items-center gap-2 hover:bg-[#FFD700]/90 transition-colors"
                                >
                                    <Terminal className="w-5 h-5" />
                                </motion.button>
                            </Tooltip>

                            {selectedItems.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Tooltip text={`Delete selected (${selectedItems.length})`}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-red-700 transition-colors"
                                        >
                                            <Trash className="w-5 h-5" />
                                            <span className="hidden sm:inline">{selectedItems.length}</span>
                                        </motion.button>
                                    </Tooltip>
                                </motion.div>
                            )}

                            <Tooltip text="Import">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-[#121212] border border-[#333] text-white rounded-lg text-sm font-medium hover:bg-[#3a3a3a]/90 transition-colors"
                                >
                                    <FileImport className="w-5 h-5" />
                                </motion.button>
                            </Tooltip>

                            <Tooltip text="Export">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-[#121212] border border-[#333] text-white rounded-lg text-sm font-medium hover:bg-[#3a3a3a]/90 transition-colors"
                                >
                                    <FileExport className="w-5 h-5" />
                                </motion.button>
                            </Tooltip>

                            <Tooltip text="Filter">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                                        showFilters
                                            ? 'bg-[#FFD700]/20 text-[#FFD700]'
                                            : 'bg-[#121212] border border-[#333] text-white rounded-lg text-sm font-medium hover:bg-[#3a3a3a]/90 transition-colors'
                                    }`}
                                >
                                    <Filter className="w-5 h-5" />
                                </motion.button>
                            </Tooltip>

                            <Tooltip text="Refresh">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="px-4 py-2 bg-[#121212] border border-[#333] text-white rounded-lg text-sm font-medium hover:bg-[#3a3a3a]/90 transition-colors"
                                >
                                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                </motion.button>
                            </Tooltip>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                variants={filterAreaVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="mt-4 pt-4 border-t border-white/10"
                            >
                                <div className="relative">
                                    <div className="flex justify-between mb-4">
                                        <h3 className="text-white text-lg font-medium">Filter Options</h3>
                                        <Tooltip text="Clear" position="left">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={clearFilters}
                                                className="p-2 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                <FilterX className="w-5 h-5" />
                                            </motion.button>
                                        </Tooltip>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Terminal ID</label>
                                            <input
                                                type="text"
                                                value={filters.terminalId}
                                                onChange={(e) => handleFilterChange('terminalId', e.target.value)}
                                                placeholder="Filter by Terminal ID"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Command</label>
                                            <select
                                                value={filters.command}
                                                onChange={(e) => handleFilterChange('command', e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            >
                                                <option value="">All Commands</option>
                                                {commandOptions.map((cmd) => (
                                                    <option key={cmd} value={cmd}>
                                                        {cmd}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Status</label>
                                            <select
                                                value={filters.status}
                                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            >
                                                <option value="">All Status</option>
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Date Filter Type</label>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-4 bg-black/20 border border-white/10 rounded-lg px-4 py-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            checked={filters.dateFilterType === 'specific'}
                                                            onChange={() => handleFilterChange('dateFilterType', 'specific')}
                                                            className="text-[#FFD700] bg-black/20 border-white/10 focus:ring-[#FFD700]/30"
                                                        />
                                                        <span className="text-white">Specific Date</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            checked={filters.dateFilterType === 'range'}
                                                            onChange={() => handleFilterChange('dateFilterType', 'range')}
                                                            className="text-[#FFD700] bg-black/20 border-white/10 focus:ring-[#FFD700]/30"
                                                        />
                                                        <span className="text-white">Date Range</span>
                                                    </label>
                                                </div>

                                                {filters.dateFilterType === 'specific' && (
                                                    <div className="mt-2">
                                                        <label className="block text-sm text-white/60 mb-2">Select Date</label>
                                                        <div className="relative">
                                                            <input
                                                                ref={specificDateRef}
                                                                type="date"
                                                                value={filters.specificDate}
                                                                onChange={(e) => handleFilterChange('specificDate', e.target.value)}
                                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                                            />
                                                            <button
                                                                onClick={() => handleCalendarClick(specificDateRef)}
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                                                            >
                                                                <Calendar className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {filters.dateFilterType === 'range' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm text-white/60 mb-2">From Date</label>
                                                    <div className="relative">
                                                        <input
                                                            ref={fromDateRef}
                                                            type="date"
                                                            value={filters.dateRange.from}
                                                            onChange={(e) => handleDateRangeChange('from', e.target.value)}
                                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                                        />
                                                        <button
                                                            onClick={() => handleCalendarClick(fromDateRef)}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                                                        >
                                                            <Calendar className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-white/60 mb-2">To Date</label>
                                                    <div className="relative">
                                                        <input
                                                            ref={toDateRef}
                                                            type="date"
                                                            value={filters.dateRange.to}
                                                            onChange={(e) => handleDateRangeChange('to', e.target.value)}
                                                            min={filters.dateRange.from}
                                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                                        />
                                                        <button
                                                            onClick={() => handleCalendarClick(toDateRef)}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                                                        >
                                                            <Calendar className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] rounded-xl border border-[#FFD700]/10 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-4 py-4 text-left">
                                        <div className="flex items-center">
                                            <div className=" inline-flex items-center">
                                                <label className="relative flex items-center rounded-full cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectAll}
                                                        onChange={handleSelectAll}
                                                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/10 transition-all checked:border-[#FFD700] checked:bg-[#FFD700] focus:outline-none"
                                                    />
                                                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-black opacity-0 transition-opacity peer-checked:opacity-100">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3.5 w-3.5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            stroke="currentColor"
                                                            strokeWidth="1"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-sm font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort('terminalId')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Terminal ID
                                            {sortConfig.key === 'terminalId' && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {sortConfig.direction === 'asc' ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </motion.span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-sm font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort('command')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Command
                                            {sortConfig.key === 'command' && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {sortConfig.direction === 'asc' ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </motion.span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-sm font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Status
                                            {sortConfig.key === 'status' && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {sortConfig.direction === 'asc' ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </motion.span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-sm font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort('startDate')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Start Date
                                            {sortConfig.key === 'startDate' && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {sortConfig.direction === 'asc' ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </motion.span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-sm font-medium text-white/60 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort('endDate')}
                                    >
                                        <div className="flex items-center gap-2">
                                            End Date
                                            {sortConfig.key === 'endDate' && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {sortConfig.direction === 'asc' ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </motion.span>
                                            )}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {data.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                                                selectedItems.includes(item.id) ? 'bg-[#FFD700]/5' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-4">
                                                <div className="inline-flex items-center">
                                                    <label className="relative flex items-center rounded-full cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(item.id)}
                                                            onChange={() => handleSelectItem(item.id)}
                                                            className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/10 transition-all checked:border-[#FFD700] checked:bg-[#FFD700] focus:outline-none"
                                                        />
                                                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-black opacity-0 transition-opacity peer-checked:opacity-100">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-3.5 w-3.5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                                stroke="currentColor"
                                                                strokeWidth="1"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.terminalId}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.command}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(item.status)}
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.startDate}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.endDate || '-'}</span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                        <div className="text-sm text-white/60">
                            Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
                            {Math.min(currentPage * entriesPerPage, totalItems)} of{' '}
                            {totalItems} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <motion.button
                                        key={page}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                            currentPage === page
                                                ? 'bg-[#FFD700] text-black'
                                                : 'text-white/60 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {page}
                                    </motion.button>
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <motion.div
                            variants={confirmDialogVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="bg-[#1A1A1A] rounded-xl border border-[#FFD700]/10 p-6 max-w-md w-full mx-4"
                        >
                            <div className="flex flex-col items-center">
                                <div className="mb-4 p-3 bg-red-500/10 rounded-full">
                                    <Trash className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
                                <p className="text-white/60 text-center mb-6">
                                    Are you sure you want to delete {selectedItems.length} selected {selectedItems.length === 1 ? 'item' : 'items'}? This action cannot be undone.
                                </p>
                                <div className="flex gap-4 w-full">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 py-2 px-4 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleDelete}
                                        className="flex-1 py-2 px-4 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <CommandPopup
                isOpen={showCommandPopup}
                onClose={() => setShowCommandPopup(false)}
                onSessionExpired={handleSessionExpired}
            />
            {showToast && (
                      <Toast
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setShowToast(false)}
                      />
                    )}
        </DashboardLayout>
    );
};

export default CommandCenter;
export { CommandCenter };