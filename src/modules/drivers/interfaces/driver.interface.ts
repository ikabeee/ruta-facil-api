export interface Driver {
    id: number;
    userId: number;
    license?: string | null;
    licenseExpiration?: Date | null;
    experience?: string | null;
    rating?: number | null;
    totalTrips: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        id: number;
        name: string;
        email: string;
        phone?: string | null;
        status: string;
    };
}

export interface DriverStats {
    total: number;
    active: number;
    inactive: number;
    verified: number;
    averageRating: number;
    totalTrips: number;
    expiringLicenses: number;
}
