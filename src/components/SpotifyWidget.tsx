import React from 'react';

const SpotifyWidget: React.FC = () => {
  return (
    <div className="spotify-widget">
      <iframe
        style={{
          borderRadius: '12px',
          width: '100%',
          height: '100%'
        }}
        src="https://open.spotify.com/embed/playlist/5kG49N0liAf1nvbCsM6EhF?utm_source=generator"
        frameBorder={0}
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyWidget;
