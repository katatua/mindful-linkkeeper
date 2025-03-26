
import { v4 as uuidv4 } from 'uuid';
import { localDatabase } from "@/utils/localDatabase";

// A simplified mock of the Supabase client for local development
export const mockClient = {
  from: (table: string) => ({
    select: (columns?: string) => {
      return {
        eq: async (column: string, value: any) => {
          const data = localDatabase.select(table);
          if (!data) return { data: null, error: { message: "No data found" } };
          
          const filtered = data.filter(row => row[column] === value);
          return { data: filtered, error: null };
        },
        neq: async (column: string, value: any) => {
          const data = localDatabase.select(table);
          if (!data) return { data: null, error: { message: "No data found" } };
          
          const filtered = data.filter(row => row[column] !== value);
          return { data: filtered, error: null };
        },
        then: (callback: any) => {
          const data = localDatabase.select(table);
          return Promise.resolve({ data, error: null }).then(callback);
        }
      };
    },
    insert: (data: any) => {
      return {
        then: (callback: any) => {
          const result = localDatabase.insert(table, data);
          return Promise.resolve({ data: result, error: null }).then(callback);
        }
      };
    }
  }),
  functions: {
    invoke: (functionName: string, { body }: { body: any }) => {
      // Simulate edge function behavior
      if (functionName === 'execute-sql') {
        const { sqlQuery } = body;
        console.log('Mock execute-sql function called with:', sqlQuery);
        
        // For metrics or funding-related queries, return some sample data
        if (sqlQuery.toLowerCase().includes('metrics') || 
            sqlQuery.toLowerCase().includes('funding') ||
            sqlQuery.toLowerCase().includes('investment')) {
          return Promise.resolve({
            data: {
              result: [
                { year: 2023, value: 1200000, unit: "EUR", category: "Investment" },
                { year: 2022, value: 980000, unit: "EUR", category: "Investment" },
                { year: 2021, value: 870000, unit: "EUR", category: "Investment" }
              ]
            },
            error: null
          });
        }
        
        // For project-related queries
        if (sqlQuery.toLowerCase().includes('project')) {
          return Promise.resolve({
            data: {
              result: [
                { title: "AI Healthcare Project", status: "active", funding_amount: 350000 },
                { title: "Smart Grid Research", status: "completed", funding_amount: 275000 },
                { title: "Sustainable Materials Development", status: "active", funding_amount: 420000 }
              ]
            },
            error: null
          });
        }
        
        // Default fallback
        return Promise.resolve({
          data: { result: [] },
          error: null
        });
      }
      
      if (functionName === 'generate-sql') {
        const { question } = body;
        console.log('Mock generate-sql function called with:', question);
        
        // Generate a reasonable SQL query based on the question
        let sql = "";
        
        if (question.toLowerCase().includes('investment') || 
            question.toLowerCase().includes('funding')) {
          sql = `SELECT EXTRACT(YEAR FROM measurement_date) as year, 
                 SUM(value) as value, unit 
                 FROM ani_metrics 
                 WHERE category = 'Investment' 
                 GROUP BY year, unit 
                 ORDER BY year DESC`;
        } 
        else if (question.toLowerCase().includes('project')) {
          sql = `SELECT title, status, funding_amount 
                 FROM ani_projects 
                 ORDER BY funding_amount DESC 
                 LIMIT 10`;
        }
        else {
          sql = `SELECT * FROM ani_metrics LIMIT 5`;
        }
        
        return Promise.resolve({
          data: { sql },
          error: null
        });
      }
      
      // Default mock response
      return Promise.resolve({
        data: null,
        error: { message: `Mock function ${functionName} not implemented` }
      });
    }
  }
};
