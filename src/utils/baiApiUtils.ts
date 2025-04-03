
import { ChartTopicType, ChartTypeFormat } from '@/components/charts/ChartFactory';
import { isChartRequest as isChartRequestUtil, determineChartType as determineChartTypeUtil, determineTopic } from '@/utils/chartUtils';

// Helper function to determine if a request is for a chart visualization
export const isChartRequest = isChartRequestUtil;

// Helper function to determine the appropriate chart type from a request
export const determineChartType = determineChartTypeUtil;

// Helper function to determine chart topic
export const determineChartTopic = determineTopic;

// Function to send a request to the BAI API
export const sendBaiRequest = async ({ request, chatId }: { 
  request: string, 
  chatId?: string 
}) => {
  try {
    const response = await fetch('/api/bai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request,
        chatId
      })
    });

    if (!response.ok) {
      throw new Error('BAI API request failed');
    }

    const data = await response.json();
    return {
      id_chat: data.id_chat || chatId,
      intent_alias: data.intent_alias,
    };
  } catch (error) {
    console.error('Error in BAI API request:', error);
    throw error;
  }
};
