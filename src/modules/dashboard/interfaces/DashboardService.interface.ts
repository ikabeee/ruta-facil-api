export interface DashboardStats {
    totalUsers: number;
    activeDrivers: number;
    totalRoutes: number;
    activeRoutes: number;
    totalVehicles: number;
    operationalVehicles: number;
    totalIncidents: number;
    recentIncidents: number;
    averageRating: number;
    lastUpdated: string;
}

export interface LiveRouteStatus {
    id: number;
    name: string;
    code: string | null;
    assignedUnits: number;
    activeIncidents: number;
    status: 'Operativa' | 'Limitada' | 'Suspendida' | 'Mantenimiento';
    lastUpdate: string;
    passengers: number;
    efficiency: number;
}

export interface IncidentSummary {
    id: number;
    type: string | null;
    title: string;
    description: string;
    priority: string;
    status: string;
    route: string;
    reportedBy: string | null;
    location: string | null;
    unit: string | null;
    time: string;
    createdAt: Date;
}

export interface RatingsSummary {
    id: string;
    category: string;
    rating: number;
    maxRating: number;
    trend: 'up' | 'down' | 'stable';
    description: string;
}

export interface EfficiencyData {
    drivers: Array<{
        id: number;
        name: string;
        efficiency: number;
        totalTrips: number;
        color: 'green' | 'yellow' | 'red';
    }>;
    routes: Array<{
        id: number;
        name: string;
        code: string | null;
        efficiency: number;
        dailyTrips: number;
        assignedUnits: number;
    }>;
    averageDriverEfficiency: number;
    averageRouteEfficiency: number;
}

export interface DashboardOverview {
    stats: DashboardStats;
    liveRoutes: LiveRouteStatus[];
    recentIncidents: IncidentSummary[];
    ratingsSummary: RatingsSummary[];
    lastUpdated: string;
}

export interface DashboardServiceInterface {
    getGeneralStats(): Promise<DashboardStats>;
    getLiveRoutesStatus(): Promise<LiveRouteStatus[]>;
    getRecentIncidents(limit?: number): Promise<IncidentSummary[]>;
    getRatingsSummary(): Promise<RatingsSummary[]>;
    getOverview(): Promise<DashboardOverview>;
    getEfficiencySummary(): Promise<EfficiencyData>;
}
