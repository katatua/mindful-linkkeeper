
import { supabase } from "@/integrations/supabase/client";

// Function to get the current AI model with error handling
export const getCurrentAIModel = async () => {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: 'ai_model'
    });
    
    if (error) throw error;
    return data || 'gemini-2.5-pro-exp-03-25';
  } catch (error) {
    console.error('Error fetching AI model:', error);
    return 'gemini-2.5-pro-exp-03-25';
  }
};

// Function to get the current AI provider
export const getCurrentAIProvider = async () => {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: 'ai_provider'
    });
    
    if (error) throw error;
    return data || 'gemini'; // Default to gemini if not set
  } catch (error) {
    console.error('Error fetching AI provider:', error);
    return 'gemini';
  }
};

// Function to get provider-specific model
export const getProviderModel = async (provider) => {
  try {
    const settingKey = provider === 'gemini' ? 'gemini_model' : 'openai_model';
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: settingKey
    });
    
    if (error) throw error;
    
    // Default models per provider
    const defaultModel = provider === 'gemini' 
      ? 'gemini-2.5-pro-exp-03-25' 
      : 'gpt-4o-2024-11-20';
      
    return data || defaultModel;
  } catch (error) {
    console.error(`Error fetching ${provider} model:`, error);
    return provider === 'gemini' ? 'gemini-2.5-pro-exp-03-25' : 'gpt-4o-2024-11-20';
  }
};

// Function to set the AI provider
export const setAIProvider = async (provider: 'gemini' | 'openai') => {
  try {
    // First, get the provider-specific model that was previously selected
    const providerModel = await getProviderModel(provider);
    console.log(`Setting provider to ${provider} with model ${providerModel}`);
    
    // First, update the AI provider setting
    const { error: providerError } = await supabase.from('ani_database_settings').upsert({ 
      setting_key: 'ai_provider', 
      setting_value: provider,
      updated_at: new Date().toISOString()
    });
    
    if (providerError) {
      console.error('Error updating provider setting:', providerError);
      return false;
    }
    
    // Then, update the AI model setting separately
    const { error: modelError } = await supabase.from('ani_database_settings').upsert({ 
      setting_key: 'ai_model', 
      setting_value: providerModel,
      updated_at: new Date().toISOString()
    });
    
    if (modelError) {
      console.error('Error updating model setting:', modelError);
      // Continue anyway since provider was updated successfully
    }
    
    return true;
  } catch (error) {
    console.error('Error setting AI provider:', error);
    return false;
  }
};

// Function to set the AI model
export const setAIModel = async (model: string) => {
  try {
    // First get the current provider to know which model setting to update
    const provider = await getCurrentAIProvider();
    console.log(`Setting model to ${model} for provider ${provider}`);
    
    // Update both the current model and the provider-specific model
    const promises = [
      // Update the main ai_model setting
      supabase.from('ani_database_settings').upsert({ 
        setting_key: 'ai_model', 
        setting_value: model,
        updated_at: new Date().toISOString()
      }),
      
      // Also update the provider-specific model setting for persistence
      supabase.from('ani_database_settings').upsert({ 
        setting_key: provider === 'gemini' ? 'gemini_model' : 'openai_model', 
        setting_value: model,
        updated_at: new Date().toISOString()
      })
    ];
    
    const results = await Promise.all(promises);
    const hasError = results.some(result => result.error);
    
    if (hasError) {
      console.error('Errors in updating model settings:', results.map(r => r.error));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting AI model:', error);
    return false;
  }
};
