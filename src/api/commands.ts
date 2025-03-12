import { authFetch } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL;

export interface CommandData {
    id: string;
    terminalId: string;
    command: Command;
    status: Status;
    startDate: string;
    endDate: string | null;
}

export type Command = 'Full Download' | 'Mini Download' | 'Check Download' | 'Open' | 'Supply Counter' | 'Sync' | 'Close';
export type Status = 'Started' | 'In-Progress' | 'Completed' | 'Stopped' | 'Error';

export interface CommandsResponse {
    data: CommandData[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface CommandsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    terminalId?: string;
    command?: Command;
    status?: Status;
    dateType?: 'specific' | 'range';
    specificDate?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export const fetchCommands = async (params: CommandsQueryParams): Promise<CommandsResponse> => {
    const queryParams = new URLSearchParams();
    
    // Add all params to query string
    Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
    });

    const response = await authFetch(`${API_URL}/api/commands?${queryParams.toString()}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch commands');
    }

    return response.json();
};

// Delete a single command
export const deleteCommand = async (id: string): Promise<void> => {
    const response = await authFetch(`${API_URL}/api/commands/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete command');
    }
};

// Delete multiple commands
export const deleteCommands = async (ids: string[]): Promise<void> => {
    const response = await authFetch(`${API_URL}/api/commands`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
        throw new Error('Failed to delete commands');
    }
};