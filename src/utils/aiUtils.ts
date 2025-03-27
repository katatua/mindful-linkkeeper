
import { supabase } from '@/integrations/supabase/client';

export const getCurrentAIModel = async () => {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', { setting_key: 'ai_model' });
    
    if (error) {
      console.error('Error fetching AI model:', error);
      return 'Unknown';
    }
    
    return data || 'Not set';
  } catch (err) {
    console.error('Unexpected error fetching AI model:', err);
    return 'Error retrieving model';
  }
};
