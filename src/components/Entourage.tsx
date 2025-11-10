import React from 'react';
import glass from '../images/champagne-glass.png';
import goldLeave1 from '../images/gold-leaves-1.png';
import goldLeave2 from '../images/gold-leaves-2.png';
import goldflower from '../images/gold-flower.png';

const Entourage: React.FC = () => {
  return (
    <section id="entourage" className="section entourage-section">   
        <img src={glass} alt="champagne-glass" className="champagne-glass" />
        <img src={goldLeave1} alt="gold-leaves-1" className="gold-leaves-1" />
        <img src={goldLeave2} alt="gold-leaves-2" className="gold-leaves-2" />
        <img src={goldflower} alt="gold-flower" className="gold-flower-half" />   
      <div className='container entourage-container'>
        <h1 className="entourage-main-title">ENTOURAGE</h1>        
        {/* Parents Section */}
        <div className="entourage-parents-wrapper">
          <div className="entourage-parent-card">
            <h3 className="entourage-parent-title">Parents of the Bride</h3>
            <p className="entourage-guest-name">Mrs. Norma R. De Leon</p>
            <p className="entourage-guest-name">The late Mr. Ramil De Leon</p>
          </div>          
          <div className="entourage-parent-card">
            <h3 className="entourage-parent-title">Parents of the Groom</h3>
            <p className="entourage-guest-name">Mrs. Jesusa Z. Ramos</p>
            <p className="entourage-guest-name">The late Mr. Segundino Ramos Jr.</p>
          </div>
        </div>
        
        {/* Principal Sponsors Section */}
        <div className="entourage-sponsors-wrapper">
          <h2 className="entourage-sponsors-title">Principal Sponsors</h2>
          
          <div className="entourage-sponsors-columns">
            {/* Left Column */}
            <div className="entourage-sponsors-column">
              <p className="entourage-sponsors-name">Mr. Noly Pascua</p>
              <p className="entourage-sponsors-name">Mr. Morris Perdon</p>
              <p className="entourage-sponsors-name">Mr. Dennis Perido</p>
              <p className="entourage-sponsors-name">Mr. Jonas Cerdan</p>
              <p className="entourage-sponsors-name">Mr. Jeffrey Zapatero</p>
              <p className="entourage-sponsors-name">Mr. Jesus Zapatero Jr.</p>
              <p className="entourage-sponsors-name">Mr. Onofre Fababier</p>
              <p className="entourage-sponsors-name">Mr. Ernesto Macarrubo</p>
              <p className="entourage-sponsors-name">Mr. Romy Fababier</p>
              <p className="entourage-sponsors-name">Mr. Arnel Celis</p>
              <p className="entourage-sponsors-name">Mr. Renwil Fababier</p>
              <p className="entourage-sponsors-name">Mr. Noel Bermas</p>
            </div>
            
            {/* Right Column */}
            <div className="entourage-sponsors-column">
              <p className="entourage-sponsors-name">Mrs. Rowena Pascua</p>
              <p className="entourage-sponsors-name">Mrs. Julita Nicolas</p>
              <p className="entourage-sponsors-name">Mrs. Penny Perido</p>
              <p className="entourage-sponsors-name">Mrs. Grace Dizon</p>
              <p className="entourage-sponsors-name">Mrs. Faye Zapatero</p>
              <p className="entourage-sponsors-name">Mrs. Juliebee Tinamisan</p>
              <p className="entourage-sponsors-name">Mrs. Lourdes Fababier</p>
              <p className="entourage-sponsors-name">Ms. Janette Rosario</p>
              <p className="entourage-sponsors-name">Ms. Joje Fababier</p>
              <p className="entourage-sponsors-name">Mrs. Aillen Caguiwa</p>
              <p className="entourage-sponsors-name">Ms. Marilou Dela Gracia</p>
              <p className="entourage-sponsors-name">Mrs. Margie Bermas</p>
            </div>
          </div>
        </div>

        {/* Wedding Party Section */}
        <div className="entourage-wedding-party-wrapper">
          {/* Top Row - Honor Attendants */}
          <div className="entourage-party-row">
            <div className="entourage-party-section">
              <h3 className="entourage-party-title">Maid of Honor</h3>
              <p className="entourage-party-name">Janine Fababier</p>
            </div>
            
            <div className="entourage-party-section">
              <h3 className="entourage-party-title">Best Man</h3>
              <p className="entourage-party-name">Aljohn Ramos</p>
            </div>
            
            <div className="entourage-party-section">
              <h3 className="entourage-party-title">Matron of Honor</h3>
              <p className="entourage-party-name">Danica Rose Francia</p>
            </div>
          </div>

          {/* Second Row - To Bind Us Together & To Clothe Us As One */}
          <div className="entourage-party-row">
            <div className="entourage-party-section">
              <h3 className="entourage-party-subtitle">To bind us together</h3>
              <p className="entourage-party-name">Bryan Roger Bernardo</p>
              <p className="entourage-party-name">Janine Fababier</p>
            </div>
            
            <div className="entourage-party-section">
              <h3 className="entourage-party-subtitle">To light our path</h3>
              <p className="entourage-party-name">Maverick Lewis Fiel</p>
              <p className="entourage-party-name">Nor-Anne Fiel</p>
            </div>
            
            <div className="entourage-party-section">
              <h3 className="entourage-party-subtitle">To cloth us as one</h3>
              <p className="entourage-party-name">John Adrian Ramos</p>
              <p className="entourage-party-name">Joselle Ann Ramos</p>
            </div>
          </div>

          {/* Third Row - Groomsmen & Bridesmaids */}
          <div className="entourage-party-row">
            <div className="entourage-party-section">
              <h3 className="entourage-party-label">Groomsmen</h3>
              <p className="entourage-party-name">Bryan Roger Bernardo</p>
              <p className="entourage-party-name">Gerald Rafael Francia</p>
              <p className="entourage-party-name">Ritz Oville Alonzo</p>
              <p className="entourage-party-name">Carlo Tienzo</p>
              <p className="entourage-party-name">Christian Kurt Agao</p>
              <p className="entourage-party-name">Maverick Lewis Fiel</p>
              <p className="entourage-party-name">John Adrian Ramos</p>
              <p className="entourage-party-name">Kyle Nathaniel Camua</p>
            </div>
            
            <div className="entourage-party-section">
              <h3 className="entourage-party-label">Bridesmaids</h3>
              <p className="entourage-party-name">Mikee Mae De Leon</p>
              <p className="entourage-party-name">Faye Valle</p>
              <p className="entourage-party-name">Monica Solas</p>
              <p className="entourage-party-name">Rosemarie Cortado</p>
              <p className="entourage-party-name">Prances Ann Roxas</p>
              <p className="entourage-party-name">Nor-Anne Marie Fiel</p>
              <p className="entourage-party-name">Joselle Ann Ramos</p>
              <p className="entourage-party-name">Janelle Ramos</p>
            </div>
          </div>
        </div>

        {/* Special Roles Section */}
        <div className="entourage-special-roles-wrapper">
          {/* Top Row - Coin Bearer, Ring Bearer, Bible Bearer */}
          <div className="entourage-special-roles-row">
            <div className="entourage-special-role-section">
              <h3 className="entourage-special-role-title">Coin Bearer</h3>
              <p className="entourage-special-role-name">Juan Crisson Bautista</p>
            </div>
            
            <div className="entourage-special-role-section">
              <h3 className="entourage-special-role-title">Ring Bearer</h3>
              <p className="entourage-special-role-name">Jio Aedrious Ramos</p>
            </div>
            
            <div className="entourage-special-role-section">
              <h3 className="entourage-special-role-title">Bible Bearer</h3>
              <p className="entourage-special-role-name">Zachary Mikhael Gonzaga</p>
            </div>
          </div>

          {/* Bottom Row - Flower Girls */}
          <div className="entourage-special-roles-row-bottom">
            <div className="entourage-special-role-section">
              <h3 className="entourage-special-role-subtitle">Flower Girls</h3>
              <p className="entourage-special-role-name">Alexandra Margarette Ramos</p>
              <p className="entourage-special-role-name">Leticia Ambrose Francia</p>
              <p className="entourage-special-role-name">Shazeah Kylie Sanchez</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Entourage;
