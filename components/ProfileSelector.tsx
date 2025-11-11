import React from 'react';
import { PROFILES } from '../data/products';
import type { PlanType, Profile } from '../types';
import { Section } from './Section';
import { ProfileCard } from './ProfileCard';

interface ProfileSelectorProps {
    planType: PlanType;
    selectedProfileId: string | null;
    onSelectProfile: (profile: Profile) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ planType, selectedProfileId, onSelectProfile }) => {
    const profiles = PROFILES[planType];

    if (!profiles || profiles.length === 0) {
        return null;
    }

    return (
        <Section
            title="Não sabe por onde começar?"
            subtitle="Escolha um perfil e nós montamos o combo ideal para você."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {profiles.map(profile => (
                    <ProfileCard
                        key={profile.id}
                        profile={profile}
                        isSelected={selectedProfileId === profile.id}
                        onSelect={() => onSelectProfile(profile)}
                    />
                ))}
            </div>
        </Section>
    );
};
