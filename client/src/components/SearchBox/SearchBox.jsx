import './SearchBox.css'
import { useState } from 'react';

const SearchBox = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch(value);
    };

    const handleClear = () => {
        setSearchValue("");
        onSearch("");
    };

    return (
        <div className="search-box-container">
            <div className="search-box-wrapper">
                <i className="bi bi-search search-icon"></i>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search items..."
                    value={searchValue}
                    onChange={handleInputChange}
                />
                {searchValue && (
                    <button className="search-clear-btn" onClick={handleClear}>
                        <i className="bi bi-x-circle-fill"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBox;