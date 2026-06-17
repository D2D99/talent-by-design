import api from "./axios";

export type ContactFormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export const sendContactEmail = async (data: ContactFormFields) => {
  const response = await api.post("/contact", data);
  return response.data;
};
