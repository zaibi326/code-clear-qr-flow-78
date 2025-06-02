
import React from 'react';

const HeroTrustedBy = () => {
  return (
    <div className="mb-12">
      <p className="text-slate-600 mb-8 font-semibold text-lg">Trusted by 50,000+ businesses worldwide</p>
      <div className="flex justify-center items-center space-x-16 opacity-70">
        <img 
          src="/lovable-uploads/b4c3c62e-0d2e-40ad-b6b5-53c875ec53d1.png" 
          alt="Amazon" 
          className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
        />
        <img 
          src="/lovable-uploads/02a40581-58f3-4a8f-9289-addc9f13cab0.png" 
          alt="KitKat" 
          className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
        />
        <img 
          src="/lovable-uploads/be72ecde-71f8-48bc-bf62-2eca4a681d94.png" 
          alt="Pepsi" 
          className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
        />
        <img 
          src="/lovable-uploads/eaf3b04c-dd24-42ad-9c40-e965dcff4a0f.png" 
          alt="Toyota" 
          className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
        />
      </div>
    </div>
  );
};

export default HeroTrustedBy;
