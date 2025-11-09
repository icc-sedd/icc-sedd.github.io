import React from 'react';

const Photos: React.FC = () => {
  // Gallery images from the src/images/gallery folder
  const galleryImages = [
    'MAT05252.jpg',
    'MAT05257.jpg',
    'MAT05343.jpg',
    'MAT05441.jpg',
    'MAT05504.jpg',
    'MAT05592.jpg',
    'MAT05614.jpg',
    'MAT05660.jpg',
    'MAT05797.jpg',
    'MAT05798.jpg',
    'MAT05895.jpg',
    'MAT05979.jpg',
    'MAT06063.jpg',
    'MAT06071.jpg',
    'MAT06172.jpg',
    'MAT06227.jpg',
    'MAT06244.jpg'
  ];

  return (
    <section id="photos" className="section">
      <div className="container photos-container">
        <h1 className="attire-main-title">OUR MEMORIES</h1>
        
        <div className="gallery-container">
          <div className="gallery-row">
            {galleryImages.map((image, index) => {
              let colClass = 'col-sm-6';
              if (index % 3 === 2) {
                colClass = 'col-sm-4';
              } else if (index % 2 === 0) {
                colClass = 'col-sm-6';
              }

              return (
                <div key={index} className={`gallery-col ${colClass}`}>
                  <div className="photo-zoom">
                    <img 
                      src={require(`../images/gallery/${image}`)} 
                      alt={`Gallery photo ${index + 1}`}
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Photos;
