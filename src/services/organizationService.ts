import api from "./axios";

class OrganizationService {
    private endpoint = "/auth";

    // Get all organizations (SuperAdmin only)
    async getAllOrganizations(): Promise<string[]> {
        const response = await api.get(`${this.endpoint}/organizations`);
        return response.data.organizations;
    }
}

export const organizationService = new OrganizationService();
