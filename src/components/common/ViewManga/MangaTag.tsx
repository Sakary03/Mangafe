// 📁 src/components/MangaDetail/MangaTags.tsx
import React from 'react';

interface MangaTagsProps {
  genres: string[];
}

const MangaTags: React.FC<MangaTagsProps> = ({ genres }) => {
  const genreNames: { [key: string]: string } = {
    SHOJO: 'shoujo',
    MECHA: 'mecha',
    SEINEN: 'seinen',
    ADVENTURE: 'adventure',
    VAMPIRE: 'vampire',
    HAREM: 'harem',
    GAME: 'game',
    PSYCHOLOGICAL: 'psychological',
    ROMANCE: 'romance',
    SPORTS: 'sports',
    SUPERNATURAL: 'supernatural',
    SCI_FI: 'sci-fi'
  };

  return (
    <div className="flex flex-wrap gap-2 my-6">
      {genres.map((genre, index) => (
        <span 
          key={index}
          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
        >
          {genreNames[genre] || genre.toLowerCase()}
        </span>
      ))}
    </div>
  );
};

export default MangaTags;