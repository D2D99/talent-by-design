import api from "./axios";

export interface Question {
  _id: string;
  stakeholder: 'leader' | 'manager' | 'employee' | 'admin';
  domain: 'People Potential' | 'Operational Steadiness' | 'Digital Fluency';
  subdomain: string;
  questionType: 'Self-Rating' | 'Calibration' | 'Behavioural' | 'Forced-Choice';
  questionCode: string;
  questionStem: string;
  scale: 'SCALE_1_5' | 'NEVER_ALWAYS' | 'FORCED_CHOICE';
  insightPrompt?: string;
  forcedChoice?: {
    optionA: {
      label: string;
      insightPrompt: string;
    };
    optionB: {
      label: string;
      insightPrompt: string;
    };
    higherValueOption: 'A' | 'B';
  };
  subdomainWeight: number;
  isDeleted: boolean;
  orgName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionData {
  stakeholder: string;
  domain: string;
  subdomain: string;
  questionType: string;
  questionCode: string;
  questionStem: string;
  scale: string;
  insightPrompt?: string;
  forcedChoice?: any;
}

class QuestionService {
  private endpoint = "/questions";

  // Get all questions with optional filters
  async getAllQuestions(filters?: {
    stakeholder?: string;
    domain?: string;
    subdomain?: string;
    orgName?: string | null;
  }): Promise<Question[]> {
    const params = new URLSearchParams();
    if (filters?.stakeholder) params.append('stakeholder', filters.stakeholder);
    if (filters?.domain) params.append('domain', filters.domain);
    if (filters?.subdomain) params.append('subdomain', filters.subdomain);
    if (filters?.orgName !== undefined) {
      params.append('orgName', filters.orgName === null ? "" : filters.orgName);
    }

    const response = await api.get(`${this.endpoint}/all`, { params });
    return response.data.data;
  }

  // Get single question by ID
  async getQuestionById(id: string, orgName?: string | null): Promise<Question> {
    const params = new URLSearchParams();
    if (orgName !== undefined) {
      params.append('orgName', orgName === null ? "" : orgName);
    }
    const response = await api.get(`${this.endpoint}/${id}`, { params });
    return response.data.data;
  }

  // Create multiple questions
  async createQuestions(questions: Record<string, CreateQuestionData>, orgName?: string | null): Promise<Question[]> {
    const payload = orgName !== undefined ? { orgName, questions } : questions;
    const response = await api.post(`${this.endpoint}/multiple`, payload);
    return response.data.data;
  }

  // Update question
  async updateQuestion(id: string, updateData: {
    questionType: string;
    questionStem: string;
    scale: string;
    insightPrompt?: string;
    forcedChoice?: any;
    orgName?: string | null;
  }): Promise<Question> {
    const { orgName, ...rest } = updateData;
    const params = new URLSearchParams();
    if (orgName !== undefined) {
      params.append('orgName', orgName === null ? "" : orgName);
    }
    const response = await api.put(`${this.endpoint}/${id}`, rest, { params });
    return response.data.data;
  }

  // Delete question (soft delete)
  async deleteQuestion(id: string, orgName?: string | null): Promise<void> {
    const params = new URLSearchParams();
    if (orgName !== undefined) {
      params.append('orgName', orgName === null ? "" : orgName);
    }
    await api.delete(`${this.endpoint}/${id}`, { params });
  }

  // Batch reorder questions after drag and drop
  async reorderQuestions(updates: { id: string; order: number; subdomain?: string }[], orgName?: string | null): Promise<void> {
    const payload = orgName !== undefined ? { orgName, updates } : updates;
    await api.put(`${this.endpoint}/reorder`, payload);
  }

  // Clone master template to organization
  async cloneTemplate(orgName: string): Promise<{ success: boolean; message: string; count: number }> {
    const response = await api.post(`${this.endpoint}/clone`, { orgName });
    return response.data;
  }

  // Upload questions from Excel
  async uploadQuestions(file: File, orgName?: string | null): Promise<Question[]> {
    const formData = new FormData();
    formData.append("file", file);
    if (orgName) formData.append("orgName", orgName);

    const response = await api.post(`${this.endpoint}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  }

  // Delete all questions for an organization
  async deleteOrganizationQuestions(orgName?: string | null): Promise<void> {
    await api.delete(`${this.endpoint}/organization/all`, {
      data: { orgName: orgName === null ? "" : orgName }
    });
  }

  // Download Excel template
  async downloadTemplate(): Promise<void> {
    const response = await api.get(`${this.endpoint}/template/download`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Question_Upload_Template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export const questionService = new QuestionService();
