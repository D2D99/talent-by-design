import api from "./axios";

class OrganizationService {
  private endpoint = "/auth";

  // Get all organizations (SuperAdmin only)
  async getAllOrganizations(): Promise<string[]> {
    const response = await api.get(`${this.endpoint}/organizations`);
    return response.data.organizations;
  }

  // Get departments for an organization
  async getDepartments(orgName?: string | null): Promise<string[]> {
    const params = orgName ? { orgName } : {};
    const response = await api.get(`/organization/departments`, { params });
    return response.data.departments;
  }
}

export const organizationService = new OrganizationService();
