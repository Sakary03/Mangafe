// 📁 src/components/MangaDetail/MangaTags.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MangaTagsProps {
  genres: string[];
}

const MangaTags: React.FC<MangaTagsProps> = ({ genres }) => {
  const navigate = useNavigate();

  const handleGenreClick = (genre: string) => {
    navigate(`/search/manga?genres=${genre}`);
  };

  const genreNames: { [key: string]: string } = {
    SHONEN: 'Shonen',
    SHOJO: 'Shojo',
    SEINEN: 'Seinen',
    JOSEI: 'Josei',
    ISEKAI: 'Isekai',
    MECHA: 'Mecha',
    SLICE_OF_LIFE: 'Slice of Life',
    FANTASY: 'Fantasy',
    SCI_FI: 'Sci-Fi',
    HORROR: 'Horror',
    MYSTERY: 'Mystery',
    SUPERNATURAL: 'Supernatural',
    ROMANCE: 'Romance',
    COMEDY: 'Comedy',
    SPORTS: 'Sports',
    HISTORICAL: 'Historical',
    MARTIAL_ARTS: 'Martial Arts',
    PSYCHOLOGICAL: 'Psychological',
    MUSIC: 'Music',
    ADVENTURE: 'Adventure',
    HAREM: 'Harem',
    REVERSE_HAREM: 'Reverse Harem',
    GAME: 'Game',
    DEMONS: 'Demons',
    VAMPIRE: 'Vampire',
  };

  // Genre colors for visual distinction
  const genreColors: { [key: string]: { bg: string; text: string } } = {
    SHONEN: { bg: 'bg-orange-100', text: 'text-orange-800' },
    SHOJO: { bg: 'bg-pink-100', text: 'text-pink-800' },
    SEINEN: { bg: 'bg-gray-100', text: 'text-gray-800' },
    JOSEI: { bg: 'bg-purple-100', text: 'text-purple-800' },
    ISEKAI: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    MECHA: { bg: 'bg-slate-100', text: 'text-slate-800' },
    SLICE_OF_LIFE: { bg: 'bg-green-100', text: 'text-green-800' },
    FANTASY: { bg: 'bg-violet-100', text: 'text-violet-800' },
    SCI_FI: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    HORROR: { bg: 'bg-red-100', text: 'text-red-800' },
    MYSTERY: { bg: 'bg-amber-100', text: 'text-amber-800' },
    SUPERNATURAL: { bg: 'bg-teal-100', text: 'text-teal-800' },
    ROMANCE: { bg: 'bg-rose-100', text: 'text-rose-800' },
    COMEDY: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    SPORTS: { bg: 'bg-blue-100', text: 'text-blue-800' },
    HISTORICAL: { bg: 'bg-stone-100', text: 'text-stone-800' },
    MARTIAL_ARTS: { bg: 'bg-red-100', text: 'text-red-800' },
    PSYCHOLOGICAL: { bg: 'bg-neutral-100', text: 'text-neutral-800' },
    MUSIC: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800' },
    ADVENTURE: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    HAREM: { bg: 'bg-pink-100', text: 'text-pink-800' },
    REVERSE_HAREM: { bg: 'bg-rose-100', text: 'text-rose-800' },
    GAME: { bg: 'bg-lime-100', text: 'text-lime-800' },
    DEMONS: { bg: 'bg-red-100', text: 'text-red-800' },
    VAMPIRE: { bg: 'bg-purple-100', text: 'text-purple-800' },
  };

  return (
    <div className="flex flex-wrap gap-3 my-8">
      {genres.map((genre, index) => {
        const colorClass = genreColors[genre] || {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
        };
        return (
          <span
            key={index}
            onClick={() => handleGenreClick(genre)}
            className={`${colorClass.bg} ${
              colorClass.text
            } text-sm font-semibold px-4 py-2 rounded-full 
              shadow-md cursor-pointer transition-all duration-300 
              hover:shadow-lg hover:scale-110 
              animate-float relative z-10
              border-2 border-opacity-20 ${colorClass.text.replace(
                'text',
                'border',
              )}`}
            style={{
              animation: `float ${
                2 + (index % 3) * 0.5
              }s ease-in-out infinite alternate`,
            }}
          >
            {genreNames[genre] || genre.replace('_', ' ')}
          </span>
        );
      })}
    </div>
  );

  // Add this style to make the tags float
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        100% {
          transform: translateY(-5px);
        }
      }
      .animate-float {
        animation: float 3s ease-in-out infinite alternate;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
};

export default MangaTags;