export interface OAuthUserData {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    provider: string;
    providerId: string;
}

export interface OAuthStrategyInterface {
    validateUser(profile: any): Promise<OAuthUserData>;
}
