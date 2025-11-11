

import React from 'react';
import type { Profile } from '../types';

const GamerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15 8V2H9v6l3 3 3-3z M8 9H2v6h6l3-3-3-3z M9 16v6h6v-6l-3-3-3 3z M16 9h6v6h-6l-3-3 3-3z"/>
    </svg>
);

const FamilyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);

const HomeOfficeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
    </svg>
);

const SmallBusinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
    </svg>
);

const GrowingBusinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
    </svg>
);


interface ProfileCardProps {
    profile: Profile;
    isSelected: boolean;
    onSelect: () => void;
}

const ICONS: Record<Profile['icon'], React.ReactNode> = {
    'gamer': <GamerIcon />,
    'family': <FamilyIcon />,
    'home-office': <HomeOfficeIcon />,
    'small-business': <SmallBusinessIcon />,
    'growing-business': <GrowingBusinessIcon />,
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isSelected, onSelect }) => {
    
    const cardBaseClasses = 'flex flex-col h-full rounded-xl p-6 border-2 transition-all duration-300 shadow-lg w-full transform hover:-translate-y-1 active:scale-95 text-center';
    const cardClasses = `${cardBaseClasses} ${isSelected 
        ? 'border-entre-purple-dark ring-4 ring-entre-purple-mid/30 bg-white' 
        : 'bg-white border-transparent'
    }`;
    
    const buttonText = isSelected ? 'Selecionado ✓' : 'Montar este combo';
    const buttonBaseClasses = 'w-full font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-auto';
    const buttonClasses = `${buttonBaseClasses} ${isSelected 
        ? 'bg-entre-purple-dark text-white'
        : 'bg-entre-purple-mid text-white hover:bg-entre-purple-dark'
    }`;
    
    return (
        <button
            onClick={onSelect}
            disabled={isSelected}
            className={cardClasses}
        >
            <div className="flex-grow">
                <div className="mx-auto text-entre-purple-mid w-16 h-16 flex items-center justify-center bg-entre-purple-light rounded-full mb-4">
                     {ICONS[profile.icon]}
                </div>
                <h3 className="text-2xl font-bold text-entre-purple-dark mb-2">{profile.name}</h3>
                <p className="text-sm text-gray-600 min-h-[40px]">{profile.description}</p>
            </div>
            
            <div className="mt-6">
                <div
                    className={buttonClasses}
                >
                    {buttonText}
                </div>
            </div>
        </button>
    );
};
