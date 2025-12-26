
import React from 'react';
import { PROFILES } from '../data/products';
import type { PlanType, Profile } from '../types';
import { Section } from './Section';
import { ProfileCard } from './ProfileCard';

interface ProfileSelectorProps {
    planType: PlanType;
    selectedProfileId: string | null;
    onSelectProfile: (profile: Profile) => void;
    simpleMode?: boolean;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ planType, selectedProfileId, onSelectProfile, simpleMode = false }) => {
    const profiles = PROFILES[planType];

    if (!profiles || profiles.length === 0) {
        return null;
    }

    const gridContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in-scale">
            {profiles.map(profile => (
                <ProfileCard
                    key={profile.id}
                    profile={profile}
                    planType={planType}
                    isSelected={selectedProfileId === profile.id}
                    onSelect={(p) => onSelectProfile(p)}
                />
            ))}
        </div>
    );

    if (simpleMode) {
        return gridContent;
    }

    return (
        <Section
            title="Não sabe por onde começar?"
            subtitle="Escolha um perfil e nós montamos o combo ideal para você."
        >
            {gridContent}
        </Section>
    );
};
