import React from 'react';
import { Search, Calendar, Filter } from 'lucide-react';

const SearchFilterBar = ({
    search,
    setSearch,
    date,
    setDate,
    status,
    setStatus,
    onExport
}) => {
    return (
        <div className="filter-bar">
            <div className="filter-group">
                <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search patient name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div className="date-input-wrapper">
                    <Calendar size={18} className="filter-icon" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div className="select-wrapper">
                    <Filter size={18} className="filter-icon" />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <button onClick={onExport} className="export-btn">
                Export to Excel
            </button>
        </div>
    );
};

export default SearchFilterBar;
