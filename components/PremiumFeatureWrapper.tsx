import React, { useState, useEffect } from 'react';
import UpgradeModal from './UpgradeModal';
import { useUserPlan } from '../hooks/useUserPlan';

interface PremiumFeatureWrapperProps {
    children: React.ReactNode;
    featureName: string;
}

const PremiumFeatureWrapper: React.FC<PremiumFeatureWrapperProps> = ({ children, featureName }) => {
    const { isStart } = useUserPlan();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Show modal automatically when START user accesses premium feature
        if (isStart) {
            setShowModal(true);
        }
    }, [isStart]);

    // If user is premium, render children normally
    if (!isStart) {
        return <>{children}</>;
    }

    // If user is START, render blurred content with modal
    return (
        <div className="relative min-h-screen">
            {/* Blurred Content */}
            <div
                className="pointer-events-none select-none"
                style={{
                    filter: 'blur(10px)',
                    WebkitFilter: 'blur(10px)'
                }}
            >
                {children}
            </div>

            {/* Overlay to prevent interaction */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                featureName={featureName}
            />
        </div>
    );
};

export default PremiumFeatureWrapper;
