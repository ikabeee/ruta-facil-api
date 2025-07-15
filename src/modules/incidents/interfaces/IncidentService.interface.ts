export interface IncidentWithRoute {
    id: number;
    type: string | null;
    title: string;
    description: string;
    priority: string;
    location: string | null;
    unit: string | null;
    reportedBy: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date | null;
    routeId: number;
    route: {
        name: string;
        code: string | null;
    };
}

export interface IncidentStats {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    cancelled: number;
    byPriority: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
    byTimeRange: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    averageResolutionTime?: number; // en horas
    mostAffectedRoutes: Array<{
        routeId: number;
        routeName: string;
        incidentCount: number;
    }>;
}

export interface IncidentServiceInterface {
    create(incidentData: any): Promise<IncidentWithRoute>;
    findAll(filters?: IncidentFilters): Promise<IncidentWithRoute[]>;
    findOne(id: number): Promise<IncidentWithRoute>;
    update(id: number, updateData: any): Promise<IncidentWithRoute>;
    remove(id: number): Promise<boolean>;
    getStats(): Promise<IncidentStats>;
    getByStatus(status: string): Promise<IncidentWithRoute[]>;
    getByPriority(priority: string): Promise<IncidentWithRoute[]>;
    getByRoute(routeId: number): Promise<IncidentWithRoute[]>;
}

export interface IncidentFilters {
    status?: string;
    priority?: string;
    routeId?: number;
    startDate?: Date;
    endDate?: Date;
    type?: string;
    limit?: number;
    offset?: number;
}
