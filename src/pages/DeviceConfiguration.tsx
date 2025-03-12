import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Trash, FilterX, Calendar, Plus, Pencil } from "lucide-react";
import { DashboardLayout } from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '../components/Tooltip';
import { Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, RefreshCw, Import as FileImport, File as FileExport } from 'lucide-react';

type ATMType = 'APTRA' | 'Diebold' | 'NCR' | 'Wincor';

interface DeviceData {
    id: string;
    terminalId: string;
    atmType: ATMType;
    ip: string;
    merchantId: string;
    merchantLocation: string;
}

type SortKey = 'terminalId' | 'atmType' | 'ip' | 'merchantId' | 'merchantLocation';

interface SortConfig {
    key: SortKey;
    direction: 'asc' | 'desc';
}

interface Filters {
    terminalId: string;
    atmType: string;
    ip: string;
    merchantId: string;
    merchantLocation: string;
}

const sampleDeviceData: DeviceData[] = [
    {
        id: '1',
        terminalId: 'ADCCON01',
        atmType: 'APTRA',
        ip: '27.60.132.237.1',
        merchantId: '000000000100001',
        merchantLocation: 'Mahape Navi Mumbai',
    },
    {
        id: '2',
        terminalId: 'ADCCON02',
        atmType: 'APTRA',
        ip: '106.222.177.42',
        merchantId: '000000000100001',
        merchantLocation: 'Mahape Navi Mumbai',
    },
    {
        id: '3',
        terminalId: 'ADCCON04',
        atmType: 'APTRA',
        ip: '10.10.8.254',
        merchantId: '000000000100001',
        merchantLocation: 'Mahape Navi Mumbai',
    },
    {
        id: '4',
        terminalId: 'ADCCON05',
        atmType: 'APTRA',
        ip: '10.10.8.255',
        merchantId: '000000000100001',
        merchantLocation: 'Mahape Navi Mumbai',
    },
    {
        id: '5',
        terminalId: 'ADCCON08',
        atmType: 'APTRA',
        ip: '192.168.100.77',
        merchantId: '12345678',
        merchantLocation: 'KL',
    },
    {
        id: '6',
        terminalId: 'KSCB0001',
        atmType: 'APTRA',
        ip: '103.42.197.89',
        merchantId: 'KSCBHEADOFFATM1',
        merchantLocation: 'Kadukutty Service Co-Operative Bank',
    },
];

const DeviceConfiguration: React.FC = () => {
    const [data, setData] = useState<DeviceData[]>(sampleDeviceData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Filters>({
        terminalId: '',
        atmType: '',
        ip: '',
        merchantId: '',
        merchantLocation: '',
    });

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'terminalId',
        direction: 'asc',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(5);

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const atmTypeOptions: ATMType[] = ['APTRA', 'Diebold', 'NCR', 'Wincor'];
    const entriesOptions = [5, 10, 15, 20, 25];

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => {
            const updatedData = data.map(item => {
                if (Math.random() > 0.7) {
                    const ipParts = item.ip.split('.');
                    const lastPart = parseInt(ipParts[ipParts.length - 1]);
                    const newLastPart = Math.max(1, Math.min(254, lastPart + Math.floor(Math.random() * 10) - 5));
                    ipParts[ipParts.length - 1] = newLastPart.toString();

                    return {
                        ...item,
                        ip: ipParts.join('.')
                    };
                }
                return item;
            });

            setData(updatedData);
            setIsRefreshing(false);
        }, 1000);
    }, [data]);

    const handleSort = useCallback((key: SortKey) => {
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
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            terminalId: '',
            atmType: '',
            ip: '',
            merchantId: '',
            merchantLocation: '',
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
            setSelectedItems(paginatedData.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };

    const handleDelete = () => {
        setData(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        setSelectAll(false);
        setShowDeleteConfirm(false);
    };

    const handleEdit = (id: string) => {
        console.log(`Edit item with id: ${id}`);
    };

    const handleItemDelete = (id: string) => {
        setSelectedItems([id]);
        setShowDeleteConfirm(true);
    };

    React.useEffect(() => {
        setSelectedItems([]);
        setSelectAll(false);
    }, [currentPage]);

    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        if (filters.terminalId) {
            result = result.filter(item =>
                item.terminalId.toLowerCase().includes(filters.terminalId.toLowerCase())
            );
        }
        if (filters.atmType) {
            result = result.filter(item =>
                item.atmType.toLowerCase().includes(filters.atmType.toLowerCase())
            );
        }
        if (filters.ip) {
            result = result.filter(item =>
                item.ip.toLowerCase().includes(filters.ip.toLowerCase())
            );
        }
        if (filters.merchantId) {
            result = result.filter(item =>
                item.merchantId.toLowerCase().includes(filters.merchantId.toLowerCase())
            );
        }
        if (filters.merchantLocation) {
            result = result.filter(item =>
                item.merchantLocation.toLowerCase().includes(filters.merchantLocation.toLowerCase())
            );
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(
                item =>
                    item.terminalId.toLowerCase().includes(searchLower) ||
                    item.atmType.toLowerCase().includes(searchLower) ||
                    item.ip.toLowerCase().includes(searchLower) ||
                    item.merchantId.toLowerCase().includes(searchLower) ||
                    item.merchantLocation.toLowerCase().includes(searchLower)
            );
        }

        result.sort((a, b) => {
            return sortConfig.direction === 'asc'
                ? a[sortConfig.key].localeCompare(b[sortConfig.key])
                : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        });

        return result;
    }, [data, filters, searchTerm, sortConfig]);

    const totalPages = Math.ceil(filteredAndSortedData.length / entriesPerPage);
    const paginatedData = filteredAndSortedData.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    React.useEffect(() => {
        if (paginatedData.length > 0 && paginatedData.every(item => selectedItems.includes(item.id))) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedItems, paginatedData]);

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

    return (
        <DashboardLayout>
            <div className="pt-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-2xl font-bold text-[#FFD700]">Device Configuration</h1>
                    <p className="text-white/60">Manage ATM device configurations</p>
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
                                    placeholder="Search devices..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Tooltip text="Add Device">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-[#FFD700] text-black rounded-lg font-medium flex items-center gap-2 hover:bg-[#FFD700]/90 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
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
                                    className="px-4 py-2 bg-[#121212] border border-[#333] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3a3a]/90 transition-colors"
                                >
                                    <FileImport className="w-5 h-5" />
                                </motion.button>
                            </Tooltip>

                            <Tooltip text="Export">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-[#121212] border border-[#333] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3a3a]/90 transition-colors "
                                >
                                    <FileExport className="w-5 h-5" />
                                </motion.button>
                            </Tooltip>

                            <Tooltip text="Filter">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${showFilters
                                        ? 'bg-[#FFD700]/20 text-[#FFD700]'
                                        : 'bg-[#121212] border border-[#333] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3a3a]/90 transition-colors'
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
                                    className="px-4 py-2 bg-[#121212] border border-[#333] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a3a3a]/90 transition-colors"
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
                                className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
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
                                            <label className="block text-sm text-white/60 mb-2">ATM Type</label>
                                            <select
                                                value={filters.atmType}
                                                onChange={(e) => handleFilterChange('atmType', e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            >
                                                <option value="">All Types</option>
                                                {atmTypeOptions.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">IP Address</label>
                                            <input
                                                type="text"
                                                value={filters.ip}
                                                onChange={(e) => handleFilterChange('ip', e.target.value)}
                                                placeholder="Filter by IP Address"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Merchant ID</label>
                                            <input
                                                type="text"
                                                value={filters.merchantId}
                                                onChange={(e) => handleFilterChange('merchantId', e.target.value)}
                                                placeholder="Filter by Merchant ID"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Merchant Location</label>
                                            <input
                                                type="text"
                                                value={filters.merchantLocation}
                                                onChange={(e) => handleFilterChange('merchantLocation', e.target.value)}
                                                placeholder="Filter by Merchant Location"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            />
                                        </div>
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
                                            <div className="inline-flex items-center">
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
                                        onClick={() => handleSort('atmType')}
                                    >
                                        <div className="flex items-center gap-2">
                                            ATM Type
                                            {sortConfig.key === 'atmType' && (
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
                                        onClick={() => handleSort('ip')}
                                    >
                                        <div className="flex items-center gap-2">
                                            IP
                                            {sortConfig.key === 'ip' && (
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
                                        onClick={() => handleSort('merchantId')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Merchant ID
                                            {sortConfig.key === 'merchantId' && (
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
                                        onClick={() => handleSort('merchantLocation')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Merchant Location
                                            {sortConfig.key === 'merchantLocation' && (
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
                                    <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {paginatedData.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className={`border-b border-white/5 hover:bg-white/5 transition-colors ${selectedItems.includes(item.id) ? 'bg-[#FFD700]/5' : ''
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
                                                <span className="text-white">{item.atmType}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.ip}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.merchantId}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.merchantLocation}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Tooltip text="Edit">
                                                        <button
                                                            onClick={() => handleEdit(item.id)}
                                                            className="p-2 rounded-lg bg-[#FFD500]/10 text-[#FFD500] hover:bg-[#FFD500]/30 transition-colors"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip text="Delete">
                                                        <button
                                                            onClick={() => handleItemDelete(item.id)}
                                                            className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </Tooltip>
                                                </div>
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
                            {Math.min(currentPage * entriesPerPage, filteredAndSortedData.length)} of{' '}
                            {filteredAndSortedData.length} entries
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
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
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
                                    Are you sure you want to delete {selectedItems.length} selected {selectedItems.length === 1 ? 'device' : 'devices'}? This action cannot be undone.
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
        </DashboardLayout>
    );
};

export default DeviceConfiguration;

export { DeviceConfiguration };