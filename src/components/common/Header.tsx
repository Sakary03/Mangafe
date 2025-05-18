import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, Dropdown, Input, List } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { SearchMangaDTO } from '../../libs/mangaServices';
import * as mangaService from '../../libs/mangaServices';
import { NotificationProvider } from '../../context/NotificationContext';
import NotificationDropdown from './Notification/NotificationDropdown';
const { Header } = Layout;

const UserHeader = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!token);
    setUsername(userInfo?.username || 'Khoa');
  };

  useEffect(() => {
    checkAuthStatus();

    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('authStateChanged', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authStateChanged', checkAuthStatus);
    };
  }, []);

  // Focus on search input when it becomes visible
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Fetch search suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim()) {
        try {
          const searchDto = { title: searchQuery };
          const results = await mangaService.searchManga(searchDto, 0, 3);
          setSuggestions(results);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    // Debounce the API call
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    window.dispatchEvent(new Event('authStateChanged'));
    navigate('/auth/login');
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search/manga?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSuggestions([]);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSearch(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = suggestion => {
    navigate(`/manga/${suggestion.id}`);
    window.location.reload();
    setShowSearch(false);
    setSuggestions([]);
  };

  // Not logged in menu items
  const guestMenuItems = [
    {
      label: (
        <Link to="/auth/login" className="py-1">
          Đăng nhập
        </Link>
      ),
      key: 'login',
    },
    {
      label: (
        <Link to="/auth/register" className="py-1">
          Đăng ký
        </Link>
      ),
      key: 'register',
    },
    {
      label: (
        <Link to="/downloads" className="py-1">
          Truyện đã tải xuống
        </Link>
      ),
      key: 'downloads',
    },
  ];

  // Logged in user menu items
  const userMenuItems = [
    {
      label: (
        <Link to="/common/profile" className="py-2 px-4">
          <div className="font-semibold">ĐÃ ĐĂNG NHẬP LÀ:</div>
          <div className="text-blue-600 font-bold">{username}</div>
        </Link>
      ),
      key: 'user-info',
    },
    {
      type: 'divider',
    },
    {
      label: <div className="py-1">Danh sách theo dõi</div>,
      key: 'following',
      onClick: () => navigate('/user/following'),
    },
    {
      label: <div className="py-1">Lịch sử đọc truyện</div>,
      key: 'history',
      onClick: () => navigate('/user/history'),
    },
    {
      label: <div className="py-1">Thiết lập</div>,
      key: 'settings',
      onClick: () => navigate('/user/settings'),
    },
    {
      label: <div className="py-1">Đăng xuất</div>,
      key: 'logout',
      onClick: handleLogout,
    },
    {
      label: <div className="py-1">Truyện đã tải xuống</div>,
      key: 'downloads',
      onClick: () => navigate('/user/downloads'),
    },
  ];

  const dropdownItems = isLoggedIn ? userMenuItems : guestMenuItems;

  // Render the header content
  const renderHeaderContent = () => (
    <Header className="fixed top-0 left-0 w-full z-50 bg-gray-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-white">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="/logo.jpeg"
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-semibold">Mangaka</span>
        </Link>

        <div className="flex items-center text-gray-300">
          <Link to="/discord" className="px-3 py-2 hover:text-white">
            DISCORD
          </Link>
          <Link to="/community" className="px-3 py-2 hover:text-white">
            HỘI KÍN
          </Link>
          <Link to="/upload" className="px-3 py-2 hover:text-white">
            ĐĂNG TRUYỆN
          </Link>
          <Link to="/news" className="px-3 py-2 hover:text-white">
            TIN TỨC
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showSearch ? (
          <div className="relative flex items-center">
            <Input
              ref={searchInputRef}
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-80 h-10 bg-gray-700 text-gray-100 border-gray-600 rounded-full pl-4 pr-16"
              style={{ color: '#1F2937', caretColor: 'white' }}
              autoFocus
            />
            <div className="absolute right-0 flex">
              <Button
                icon={<SearchOutlined />}
                type="text"
                className="text-gray-200 flex items-center justify-center"
                onClick={handleSearch}
              />
              <Button
                icon={<CloseOutlined />}
                type="text"
                className="text-gray-200 flex items-center justify-center mr-1"
                onClick={toggleSearch}
              />
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-50"
              >
                <List
                  dataSource={suggestions}
                  renderItem={item => (
                    <List.Item
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-gray-100"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <div className="flex items-center w-full">
                        {/* Manga Poster */}
                        <div className="flex-shrink-0 w-12 h-16 mr-3">
                          {item.posterUrl ? (
                            <img
                              src={item.posterUrl}
                              alt={item.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Manga Info */}
                        <div className="flex flex-col overflow-hidden">
                          <div className="font-medium truncate">
                            {item.title}
                          </div>
                          {item.author && (
                            <div className="text-sm text-gray-400 truncate">
                              {item.author}
                            </div>
                          )}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        ) : (
          <Button
            icon={<SearchOutlined />}
            type="text"
            className="text-white flex items-center justify-center"
            shape="circle"
            size="large"
            onClick={toggleSearch}
          />
        )}

        {/* Only render NotificationDropdown if logged in */}
        {isLoggedIn && <NotificationDropdown />}

        <Dropdown
          menu={{ items: dropdownItems }}
          placement="bottomRight"
          trigger={['click']}
          overlayClassName="mt-1"
          overlayStyle={{ width: '220px' }}
        >
          <Button
            icon={isLoggedIn ? <UserOutlined /> : <MenuOutlined />}
            type="text"
            className={
              isLoggedIn
                ? 'bg-gray-200 flex items-center justify-center'
                : 'text-white flex items-center justify-center'
            }
            shape="circle"
            size="large"
          />
        </Dropdown>
      </div>
    </Header>
  );

  // Return the component with or without NotificationProvider based on login status
  return isLoggedIn ? (
    <NotificationProvider>{renderHeaderContent()}</NotificationProvider>
  ) : (
    renderHeaderContent()
  );
};

export default UserHeader;