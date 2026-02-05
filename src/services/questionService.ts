const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '');

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
  private baseUrl = `${API_BASE_URL}/questions`;

  // Get all questions with optional filters
  async getAllQuestions(filters?: {
    stakeholder?: string;
    domain?: string;
    subdomain?: string;
  }): Promise<Question[]> {
    const queryParams = new URLSearchParams();

    if (filters?.stakeholder) queryParams.append('stakeholder', filters.stakeholder);
    if (filters?.domain) queryParams.append('domain', filters.domain);
    if (filters?.subdomain) queryParams.append('subdomain', filters.subdomain);

    const url = `${this.baseUrl}/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch questions');
    }

    const data = await response.json();
    return data.data;
  }

  // Get single question by ID
  async getQuestionById(id: string): Promise<Question> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch question');
    }

    const data = await response.json();
    return data.data;
  }

  // Create multiple questions
  async createQuestions(questions: Record<string, CreateQuestionData>): Promise<Question[]> {
    const response = await fetch(`${this.baseUrl}/multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(questions),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create questions');
    }

    const data = await response.json();
    return data.data;
  }

  // Update question
  async updateQuestion(id: string, updateData: {
    questionType: string;
    questionStem: string;
    scale: string;
    insightPrompt?: string;
    forcedChoice?: any;
  }): Promise<Question> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update question');
    }

    const data = await response.json();
    return data.data;
  }

  // Delete question (soft delete)
  async deleteQuestion(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete question');
    }
  }
}

export const questionService = new QuestionService();