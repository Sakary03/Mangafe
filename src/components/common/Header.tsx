import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, Dropdown, Input, List, InputRef } from 'antd';
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

// Define the interface for search results
interface SearchResult {
  id: number;
  title: string;
  posterUrl?: string;
  author?: string;
  genres?: string[];
}
import { NotificationProvider } from '../../context/NotificationContext';
import NotificationDropdown from './Notification/NotificationDropdown';
const { Header } = Layout;

const UserHeader = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<InputRef>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const userInfo = userStr ? JSON.parse(userStr) : null;
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
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(target) &&
        searchInputRef.current &&
        !searchInputRef.current.input?.contains(target)
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSearch(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
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
      label: <div className="py-1">Truyện đã đăng</div>,
      key: 'settings',
      onClick: () => navigate('/user/uploaded'),
    },
    {
      label: <div className="py-1">Đăng xuất</div>,
      key: 'logout',
      onClick: handleLogout,
    }
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
          <Link
            to="https://discord.com/invite/W7P8JwGArg"
            className="px-3 py-2 hover:text-white"
          >
            DISCORD
          </Link>
          <Link
            to="https://www.facebook.com/groups/cuutruyen2vn"
            className="px-3 py-2 hover:text-white"
          >
            HỘI KÍN
          </Link>
          {isLoggedIn && (
            <Link to="/upload" className="px-3 py-2 hover:text-white">
              ĐĂNG TRUYỆN
            </Link>
          )}
          <Link
            to="https://www.crunchyroll.com/news/manga?srsltid=AfmBOoriybvLcVPWQ6WhHOtPaunCGux_JK8HTLkvQGcrWRHaMNd85-4U"
            className="px-3 py-2 hover:text-white"
          >
            TIN TỨC
          </Link>
          <Link to="/search/manga" className="px-3 py-2 hover:text-white">
            TÌM TRUYỆN
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
              className="w-120 h-12 bg-gray-700 text-gray-100 border-gray-600 rounded-full pl-6 pr-24 text-lg"
              style={{
                color: '#1F2937',
                caretColor: 'white',
                fontSize: '1.125rem',
                lineHeight: '1.75rem',
              }}
              autoFocus
            />
            <div className="absolute right-0 flex">
              <Button
                icon={<SearchOutlined style={{ fontSize: '1.25rem' }} />}
                type="text"
                className="text-gray-200 flex items-center justify-center h-12 w-12"
                onClick={handleSearch}
              />
              <Button
                icon={<CloseOutlined style={{ fontSize: '1.25rem' }} />}
                type="text"
                className="text-gray-200 flex items-center justify-center h-12 w-12 mr-1"
                onClick={toggleSearch}
              />
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 w-full mt-3 bg-gray-800 border border-gray-600 rounded-md shadow-2xl z-50 overflow-hidden"
                style={{
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
                  animation: 'fadeIn 0.2s ease-out forwards',
                }}
              >
                <List
                  dataSource={suggestions}
                  renderItem={item => (
                    <List.Item
                      className="px-6 py-5 hover:bg-gray-700 cursor-pointer text-gray-100 transition-all duration-200 border-b border-gray-600 last:border-b-0 first:rounded-t-md last:rounded-b-md"
                      onClick={() => handleSuggestionClick(item)}
                      style={{
                        transition: 'all 0.3s ease-in-out',
                        fontSize: '1.125rem',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform =
                          'translateX(5px)';
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          '#374151';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform =
                          'translateX(0)';
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          '';
                      }}
                    >
                      <div className="flex items-center w-full">
                        {/* Manga Poster with shadow and better styling */}
                        <div
                          className="flex-shrink-0 w-20 h-28 mr-5 rounded-md overflow-hidden shadow-lg"
                          style={{
                            transition:
                              'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.transform =
                              'scale(1.08) rotate(1deg)';
                            (e.currentTarget as HTMLElement).style.boxShadow =
                              '0 10px 15px -3px rgba(0, 0, 0, 0.4)';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.transform =
                              'scale(1) rotate(0)';
                            (e.currentTarget as HTMLElement).style.boxShadow =
                              '0 4px 6px -1px rgba(0, 0, 0, 0.2)';
                          }}
                        >
                          {item.posterUrl ? (
                            <img
                              src={item.posterUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              style={{ filter: 'brightness(1.05)' }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-md flex items-center justify-center">
                              <span className="text-sm text-gray-300 font-medium">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Manga Info with better typography */}
                        <div className="flex flex-col overflow-hidden flex-1">
                          <div
                            className="font-medium text-lg text-white truncate mb-2"
                            style={{
                              background:
                                'linear-gradient(to right, #ffffff, #a5c9fd)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.transform =
                                'translateX(3px)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.transform =
                                'translateX(0)';
                            }}
                          >
                            {item.title}
                          </div>
                          {item.author && (
                            <div className="text-base text-gray-300 truncate flex items-center">
                              <span className="text-sm text-gray-400 mr-1 italic">
                                by
                              </span>
                              <span className="font-medium text-gray-200">
                                {item.author}
                              </span>
                            </div>
                          )}
                          {item.genres && item.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.genres.slice(0, 3).map((genre, idx) => (
                                <span
                                  key={idx}
                                  className="text-sm px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 rounded-full"
                                  style={{
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                    transition: 'all 0.2s ease',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                  }}
                                  onMouseEnter={e => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.transform = 'scale(1.08)';
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.boxShadow =
                                      '0 2px 4px rgba(0,0,0,0.3)';
                                  }}
                                  onMouseLeave={e => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.transform = 'scale(1)';
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.boxShadow =
                                      '0 1px 2px rgba(0,0,0,0.2)';
                                  }}
                                >
                                  {genre}
                                </span>
                              ))}
                              {item.genres.length > 3 && (
                                <span className="text-sm text-blue-300 font-medium px-2">
                                  +{item.genres.length - 3}
                                </span>
                              )}
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