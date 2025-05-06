import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input, Empty, Tabs, Checkbox, Dropdown, Space, Button, Tag } from 'antd';
import { 
  SearchOutlined, 
  CloseCircleOutlined,
  DownOutlined
} from '@ant-design/icons';
import * as mangaService from '../../../libs/mangaServices';
import { MangaGenres } from '../../../types/MangaGenres';
const SearchManga: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<mangaService.MangaItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreDropdownVisible, setGenreDropdownVisible] = useState(false);

  const allGenres = Object.values(MangaGenres);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q') || '';
    setSearchQuery(q);
  }, [location.search]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); 
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeTab, selectedGenres]);

  const performSearch = async (query: string) => {
    // if (!query.trim() && selectedGenres.length === 0) {
    //   setSearchResults([]);
    //   return;
    // }

    setLoading(true);
    try {
      const searchDto: mangaService.SearchMangaDTO = {};
      
        switch (activeTab) {
          case 'titles':
            searchDto.title = query;
            break;
          case 'authors':
            searchDto.author = query;
            break;
          default:
            searchDto.keyword = query;
            break;
        }
      
      searchDto.genres = selectedGenres.length > 0 ? selectedGenres : [];
      const results = await mangaService.searchManga(
        searchDto, 
        0, 
        20, 
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching manga:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };
  
  const clearGenres = () => {
    setSelectedGenres([]);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedGenres([]);
  };

  const renderGenres = (genres: string[]) => {
    return genres.map((genre, index) => {
      let bgColor = 'bg-gray-200 text-gray-800';
      
      if (['ACTION', 'ADVENTURE', 'SUPERNATURAL'].includes(genre)) {
        bgColor = 'bg-blue-100 text-blue-800';
      } else if (['ROMANCE', 'COMEDY', 'SLICE_OF_LIFE'].includes(genre)) {
        bgColor = 'bg-pink-100 text-pink-800';
      } else if (['SCHOOL_LIFE', 'SHOJO', 'SHONEN'].includes(genre)) {
        bgColor = 'bg-green-100 text-green-800';
      } else if (['DEMONS', 'FANTASY', 'MAGIC'].includes(genre)) {
        bgColor = 'bg-purple-100 text-purple-800';
      } else if (['HAREM', 'REVERSE_HAREM', 'ECCHI'].includes(genre)) {
        bgColor = 'bg-red-100 text-red-800';
      } else if (['MECHA', 'SCI_FI', 'SEINEN', 'JOSEI'].includes(genre)) {
        bgColor = 'bg-yellow-100 text-yellow-800';
      } else if (['GAME', 'SPORTS', 'MUSIC'].includes(genre)) {
        bgColor = 'bg-indigo-100 text-indigo-800';
      }
      
      const displayGenre = genre.replace(/_/g, ' ');
      
      return (
        <span 
          key={index} 
          className={`text-xs font-medium mr-2 px-2 py-0.5 rounded ${bgColor} uppercase`}
        >
          {displayGenre}
        </span>
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-500 hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Search</h1>
      </div>

      <div className="relative mb-4">
        <Input
          prefix={<SearchOutlined className="site-form-item-icon" />}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="large"
          className="pr-10"
          suffix={
            searchQuery ? (
              <CloseCircleOutlined
                onClick={clearSearch}
                style={{ color: 'rgba(0,0,0,.45)', cursor: 'pointer' }}
              />
            ) : null
          }
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="mb-0 flex-grow"
          items={[
            { label: 'All', key: 'all' },
            { label: 'Titles', key: 'titles' },
            { label: 'Users', key: 'users' },
            { label: 'Authors', key: 'authors' },
          ]}
        />
        
        <Dropdown
          open={genreDropdownVisible}
          onOpenChange={setGenreDropdownVisible}
          dropdownRender={() => (
            <div className="bg-white rounded shadow-lg p-4 w-64">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Filter by Genre</h3>
                {selectedGenres.length > 0 && (
                  <button 
                    onClick={() => {
                      clearGenres();
                      setGenreDropdownVisible(false);
                    }}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="max-h-60 overflow-y-auto mt-2">
                {allGenres.map(genre => (
                  <div key={genre} className="py-1">
                    <Checkbox
                      checked={selectedGenres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                    >
                      {genre.replace(/_/g, ' ')}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          )}
          trigger={['click']}
        >
          <Button>
            <Space>
              Genres
              {selectedGenres.length > 0 && ` (${selectedGenres.length})`}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>
      
      {/* Display selected genres */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedGenres.map(genre => (
            <Tag
              key={genre}
              closable
              onClose={() => toggleGenre(genre)}
              className="py-1"
            >
              {genre.replace(/_/g, ' ')}
            </Tag>
          ))}
        </div>
      )}

      {(
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Manga</h2>
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((manga) => (
                <div key={manga.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/manga/${manga.id}`} className="flex p-4">
                    <div className="w-24 h-32 flex-shrink-0 mr-4">
                      <img
                        src={manga.posterUrl || `/api/placeholder/96/128`}
                        alt={manga.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div className="flex-grow overflow-hidden">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-lg font-bold truncate">{manga.title}</h3>
                        <div className="flex items-center ml-2 flex-shrink-0">
                          {/* Displaying creation date instead of rating */}
                          <span className="text-xs text-gray-500">
                            {new Date(manga.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        {renderGenres(manga.genres)}
                      </div>
                      
                      {manga.overview && (
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {manga.overview}
                        </p>
                      )}
                      
                      {manga.author && (
                        <p className="text-sm text-gray-500 mt-1">
                          Author: {manga.author}
                        </p>
                      )}
                      
                      {/* Display number of chapters */}
                      <p className="text-xs text-gray-500 mt-1">
                        Chapters: {manga.chapters.length}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <Empty description="No results found" />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchManga;