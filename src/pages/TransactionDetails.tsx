import React, { useState, useMemo, useCallback } from 'react';
import { Trash, FilterX, Pencil } from "lucide-react";
import { DashboardLayout } from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '../components/Tooltip';
import { Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, RefreshCw, Import as FileImport, File as FileExport } from 'lucide-react';

type TransactionStatus = 'Approved' | 'Declined' | 'Processing' | 'Error';
type TransactionType = 'Purchase' | 'Withdrawal' | 'Balance Inquiry' | 'Transfer' | 'Payment';
type MessageType = 'Financial' | 'Non-Financial' | 'Reversal' | 'Network' | 'Administrative';
type ProcessingCode = '000000' | '010000' | '200000' | '300000' | '400000';
type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

interface TransactionData {
    id: string;
    messageType: MessageType;
    terminalId: string;
    amount: number;
    pan: string;
    processingCode: ProcessingCode;
    dateTime: string;
    currency: Currency;
    track2: string;
    transactionType: TransactionType;
    transactionId: string;
    result: string;
    status: TransactionStatus;
}

type SortKey = 'messageType' | 'terminalId' | 'amount' | 'pan' | 'processingCode' | 'dateTime' | 'currency' | 'track2' | 'transactionType' | 'transactionId' | 'result' | 'status';

interface SortConfig {
    key: SortKey;
    direction: 'asc' | 'desc';
}

interface Filters {
    messageType: string;
    terminalId: string;
    amount: string;
    pan: string;
    processingCode: string;
    dateTime: string;
    currency: string;
    track2: string;
    transactionType: string;
    transactionId: string;
    result: string;
    status: string;
}

const formatCurrency = (amount: number, currency: Currency) => {
    const symbols: Record<Currency, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        INR: '₹',
        JPY: '¥'
    };
    
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: currency === 'JPY' ? 0 : 2,
        maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    });
    
    return formatter.format(amount);
};

const maskPAN = (pan: string) => {
    if (pan.length <= 8) return pan;
    return pan.slice(0, 4) + ' **** **** ' + pan.slice(-4);
};

const sampleTransactionData: TransactionData[] = [
    {
        id: '1',
        messageType: 'Financial',
        terminalId: 'TERM001',
        amount: 500.00,
        pan: '4111111111111111',
        processingCode: '000000',
        dateTime: '2023-11-05T14:22:30',
        currency: 'USD',
        track2: '4111111111111111=24052200000000000',
        transactionType: 'Purchase',
        transactionId: 'TRX123456789',
        result: 'Success',
        status: 'Approved'
    },
    {
        id: '2',
        messageType: 'Financial',
        terminalId: 'TERM002',
        amount: 1200.50,
        pan: '5555555555554444',
        processingCode: '010000',
        dateTime: '2023-11-05T15:32:10',
        currency: 'EUR',
        track2: '5555555555554444=24052200000000000',
        transactionType: 'Withdrawal',
        transactionId: 'TRX123456790',
        result: 'Failed',
        status: 'Declined'
    },
    {
        id: '3',
        messageType: 'Non-Financial',
        terminalId: 'TERM003',
        amount: 0.00,
        pan: '4111111111111111',
        processingCode: '300000',
        dateTime: '2023-11-05T16:45:22',
        currency: 'USD',
        track2: '4111111111111111=24052200000000000',
        transactionType: 'Balance Inquiry',
        transactionId: 'TRX123456791',
        result: 'Success',
        status: 'Approved'
    },
    {
        id: '4',
        messageType: 'Financial',
        terminalId: 'TERM004',
        amount: 350.75,
        pan: '4111111111111111',
        processingCode: '200000',
        dateTime: '2023-11-05T17:12:45',
        currency: 'GBP',
        track2: '4111111111111111=24052200000000000',
        transactionType: 'Purchase',
        transactionId: 'TRX123456792',
        result: 'Success',
        status: 'Approved'
    },
    {
        id: '5',
        messageType: 'Financial',
        terminalId: 'TERM005',
        amount: 789.30,
        pan: '5555555555554444',
        processingCode: '400000',
        dateTime: '2023-11-05T18:22:15',
        currency: 'USD',
        track2: '5555555555554444=24052200000000000',
        transactionType: 'Transfer',
        transactionId: 'TRX123456793',
        result: 'Success',
        status: 'Approved'
    },
    {
        id: '6',
        messageType: 'Reversal',
        terminalId: 'TERM002',
        amount: 1200.50,
        pan: '5555555555554444',
        processingCode: '010000',
        dateTime: '2023-11-05T18:35:20',
        currency: 'EUR',
        track2: '5555555555554444=24052200000000000',
        transactionType: 'Withdrawal',
        transactionId: 'TRX123456794',
        result: 'Success',
        status: 'Approved'
    },
    {
        id: '7',
        messageType: 'Financial',
        terminalId: 'TERM001',
        amount: 25000,
        pan: '4111111111111111',
        processingCode: '000000',
        dateTime: '2023-11-06T09:12:40',
        currency: 'JPY',
        track2: '4111111111111111=24052200000000000',
        transactionType: 'Purchase',
        transactionId: 'TRX123456795',
        result: 'Success',
        status: 'Approved'
    },
];

const TransactionDetails: React.FC = () => {
    const [data, setData] = useState<TransactionData[]>(sampleTransactionData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Filters>({
        messageType: '',
        terminalId: '',
        amount: '',
        pan: '',
        processingCode: '',
        dateTime: '',
        currency: '',
        track2: '',
        transactionType: '',
        transactionId: '',
        result: '',
        status: ''
    });
    
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'dateTime',
        direction: 'desc',
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const messageTypeOptions: MessageType[] = ['Financial', 'Non-Financial', 'Reversal', 'Network', 'Administrative'];
    const statusOptions: TransactionStatus[] = ['Approved', 'Declined', 'Processing', 'Error'];
    const transactionTypeOptions: TransactionType[] = ['Purchase', 'Withdrawal', 'Balance Inquiry', 'Transfer', 'Payment'];
    const processingCodeOptions: ProcessingCode[] = ['000000', '010000', '200000', '300000', '400000'];
    const currencyOptions: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];
    const entriesOptions = [5, 10, 15, 20, 25];

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => {
            // Simulate data refresh with small changes
            const updatedData = data.map(item => {
                if (Math.random() > 0.7) {
                    return {
                        ...item,
                        amount: parseFloat((item.amount * (0.95 + Math.random() * 0.1)).toFixed(2)),
                        dateTime: new Date(new Date(item.dateTime).getTime() + Math.random() * 3600000).toISOString().slice(0, 19)
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
            messageType: '',
            terminalId: '',
            amount: '',
            pan: '',
            processingCode: '',
            dateTime: '',
            currency: '',
            track2: '',
            transactionType: '',
            transactionId: '',
            result: '',
            status: ''
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
        console.log(`Edit transaction with id: ${id}`);
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

        // Apply filters
        if (filters.messageType) {
            result = result.filter(item =>
                item.messageType.toLowerCase().includes(filters.messageType.toLowerCase())
            );
        }
        if (filters.terminalId) {
            result = result.filter(item =>
                item.terminalId.toLowerCase().includes(filters.terminalId.toLowerCase())
            );
        }
        if (filters.amount) {
            result = result.filter(item =>
                item.amount.toString().includes(filters.amount)
            );
        }
        if (filters.pan) {
            result = result.filter(item =>
                item.pan.includes(filters.pan)
            );
        }
        if (filters.processingCode) {
            result = result.filter(item =>
                item.processingCode.includes(filters.processingCode)
            );
        }
        if (filters.dateTime) {
            result = result.filter(item =>
                item.dateTime.includes(filters.dateTime)
            );
        }
        if (filters.currency) {
            result = result.filter(item =>
                item.currency.toLowerCase().includes(filters.currency.toLowerCase())
            );
        }
        if (filters.track2) {
            result = result.filter(item =>
                item.track2.includes(filters.track2)
            );
        }
        if (filters.transactionType) {
            result = result.filter(item =>
                item.transactionType.toLowerCase().includes(filters.transactionType.toLowerCase())
            );
        }
        if (filters.transactionId) {
            result = result.filter(item =>
                item.transactionId.toLowerCase().includes(filters.transactionId.toLowerCase())
            );
        }
        if (filters.result) {
            result = result.filter(item =>
                item.result.toLowerCase().includes(filters.result.toLowerCase())
            );
        }
        if (filters.status) {
            result = result.filter(item =>
                item.status.toLowerCase().includes(filters.status.toLowerCase())
            );
        }

        // Apply global search
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(
                item =>
                    item.messageType.toLowerCase().includes(searchLower) ||
                    item.terminalId.toLowerCase().includes(searchLower) ||
                    item.amount.toString().includes(searchLower) ||
                    item.pan.includes(searchLower) ||
                    item.processingCode.includes(searchLower) ||
                    item.dateTime.includes(searchLower) ||
                    item.currency.toLowerCase().includes(searchLower) ||
                    item.track2.includes(searchLower) ||
                    item.transactionType.toLowerCase().includes(searchLower) ||
                    item.transactionId.toLowerCase().includes(searchLower) ||
                    item.result.toLowerCase().includes(searchLower) ||
                    item.status.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let comparison = 0;
            
            if (sortConfig.key === 'amount') {
                comparison = a.amount - b.amount;
            } else if (sortConfig.key === 'dateTime') {
                comparison = new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
            } else {
                const aValue = String(a[sortConfig.key]);
                const bValue = String(b[sortConfig.key]);
                comparison = aValue.localeCompare(bValue);
            }
            
            return sortConfig.direction === 'asc' ? comparison : -comparison;
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

    // Format date for display
    const formatDate = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    // Get status badge color
    const getStatusColor = (status: TransactionStatus) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-500';
            case 'Declined':
                return 'bg-red-500';
            case 'Processing':
                return 'bg-yellow-500';
            case 'Error':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
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
                    <h1 className="text-2xl font-bold text-[#FFD700]">Transaction Details</h1>
                    <p className="text-white/60">View and manage transaction records</p>
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
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
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
                                            <label className="block text-sm text-white/60 mb-2">Message Type</label>
                                            <select
                                                value={filters.messageType}
                                                onChange={(e) => handleFilterChange('messageType', e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            >
                                                <option value="">All Types</option>
                                                {messageTypeOptions.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
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
                                            <label className="block text-sm text-white/60 mb-2">Transaction Type</label>
                                            <select
                                                value={filters.transactionType}
                                                onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            >
                                                <option value="">All Types</option>
                                                {transactionTypeOptions.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Status</label>
                                            <select
                                                value={filters.status}
                                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            >
                                                <option value="">All Statuses</option>
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Currency</label>
                                            <select
                                                value={filters.currency}
                                                onChange={(e) => handleFilterChange('currency', e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                                            >
                                                <option value="">All Currencies</option>
                                                {currencyOptions.map((currency) => (
                                                    <option key={currency} value={currency}>
                                                        {currency}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Date</label>
                                            <input
                                                type="date"
                                                value={filters.dateTime ? filters.dateTime.split('T')[0] : ''}
                                                onChange={(e) => handleFilterChange('dateTime', e.target.value)}
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
                                        onClick={() => handleSort('messageType')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Message Type
                                            {sortConfig.key === 'messageType' && (
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
                                        onClick={() => handleSort('amount')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Amount
                                            {sortConfig.key === 'amount' && (
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
                                        onClick={() => handleSort('pan')}
                                    >
                                        <div className="flex items-center gap-2">
                                            PAN
                                            {sortConfig.key === 'pan' && (
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
                                        onClick={() => handleSort('processingCode')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Processing Code
                                            {sortConfig.key === 'processingCode' && (
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
                                        onClick={() => handleSort('dateTime')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Date Time
                                            {sortConfig.key === 'dateTime' && (
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
                                        onClick={() => handleSort('currency')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Currency
                                            {sortConfig.key === 'currency' && (
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
                                        onClick={() => handleSort('track2')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Track 2
                                            {sortConfig.key === 'track2' && (
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
                                        onClick={() => handleSort('transactionType')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Trans action Type
                                            {sortConfig.key === 'transactionType' && (
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
                                        onClick={() => handleSort('transactionId')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Trans action ID
                                            {sortConfig.key === 'transactionId' && (
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
                                        onClick={() => handleSort('result')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Result
                                            {sortConfig.key === 'result' && (
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
                                                <span className="text-white">{item.messageType}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.terminalId}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{formatCurrency(item.amount, item.currency)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{maskPAN(item.pan)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.processingCode}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{formatDate(item.dateTime)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.currency}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white truncate max-w-[100px] inline-block">{maskPAN(item.track2)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.transactionType}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.transactionId}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{item.result}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2 py-1 rounded-full text-white text-xs ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
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
                                    Are you sure you want to delete {selectedItems.length} selected {selectedItems.length === 1 ? 'transaction' : 'transactions'}? This action cannot be undone.
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

export default TransactionDetails;

export { TransactionDetails };