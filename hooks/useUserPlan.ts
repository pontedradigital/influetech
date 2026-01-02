import { useState, useEffect } from 'react';

interface UserPlan {
    plan: string;
    isPremium: boolean;
    isStart: boolean;
}

export const useUserPlan = (): UserPlan => {
    const [userPlan, setUserPlan] = useState<UserPlan>({
        plan: 'START',
        isPremium: false,
        isStart: true
    });

    useEffect(() => {
        // Get user from localStorage
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                const plan = user.plan || 'START';
                const isPremium = plan === 'CREATOR_PLUS' || plan === 'CREATOR+';
                const isStart = plan === 'START';

                setUserPlan({
                    plan,
                    isPremium,
                    isStart
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    return userPlan;
};
