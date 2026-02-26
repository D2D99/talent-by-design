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
  }): Promise<Question[]> {
    const params = new URLSearchParams();
    if (filters?.stakeholder) params.append('stakeholder', filters.stakeholder);
    if (filters?.domain) params.append('domain', filters.domain);
    if (filters?.subdomain) params.append('subdomain', filters.subdomain);

    const response = await api.get(`${this.endpoint}/all`, { params });
    return response.data.data;
  }

  // Get single question by ID
  async getQuestionById(id: string): Promise<Question> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data.data;
  }

  // Create multiple questions
  async createQuestions(questions: Record<string, CreateQuestionData>): Promise<Question[]> {
    const response = await api.post(`${this.endpoint}/multiple`, questions);
    return response.data.data;
  }

  // Update question
  async updateQuestion(id: string, updateData: {
    questionType: string;
    questionStem: string;
    scale: string;
    insightPrompt?: string;
    forcedChoice?: any;
  }): Promise<Question> {
    const response = await api.put(`${this.endpoint}/${id}`, updateData);
    return response.data.data;
  }

  // Delete question (soft delete)
  async deleteQuestion(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }

  // Batch reorder questions after drag and drop
  async reorderQuestions(updates: { id: string; order: number; subdomain?: string }[]): Promise<void> {
    await api.put(`${this.endpoint}/reorder`, updates);
  }
}

export const questionService = new QuestionService();
