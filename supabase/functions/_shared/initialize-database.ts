
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function initializeDatabaseSettings() {
  try {
    // Check if AI model setting exists
    const { data: existingSettings, error: checkError } = await supabase
      .from('ani_database_settings')
      .select('*')
      .eq('setting_key', 'ai_model');
      
    if (checkError) {
      console.error('Error checking database settings:', checkError);
      return;
    }
    
    // If the setting doesn't exist, create it
    if (!existingSettings || existingSettings.length === 0) {
      const { error: insertError } = await supabase
        .from('ani_database_settings')
        .insert({
          setting_key: 'ai_model',
          setting_value: 'gemini-2.5-pro-exp-03-25',
          description: 'The AI model used for database queries and chat'
        });
        
      if (insertError) {
        console.error('Error inserting AI model setting:', insertError);
      } else {
        console.log('AI model setting initialized successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing database settings:', error);
  }
}
