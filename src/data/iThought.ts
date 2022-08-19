export interface iThought {
  id: string;
  name: string;
  url?: string;
  color?: string;
  children?: iThought[];
  parents?: iThought[];
  siblings?: iThought[];
  jumps?: iThought[];
  attachments?: any[];
  brainId?: string;
}
