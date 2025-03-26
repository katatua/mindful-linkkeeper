
/**
 * Local Database Utilities
 * 
 * This file provides utilities for initializing and working with a local mock database
 * that simulates Supabase. It's used for development when Supabase connection is not available.
 */

// Sample data for the database
const mockData = {
  ani_database_status: [
    {
      id: '1',
      table_name: 'ani_metrics',
      record_count: 150,
      status: 'populated',
      last_populated: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      table_name: 'ani_projects',
      record_count: 35,
      status: 'populated',
      last_populated: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      table_name: 'ani_funding_programs',
      record_count: 12,
      status: 'populated',
      last_populated: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  ani_projects: [
    {
      id: "PRJ-2023-001",
      title: "AI-Powered Healthcare Diagnostics",
      description: "Developing an AI system for early disease detection using machine learning algorithms and clinical data.",
      status: "active",
      progress: 68,
      start_date: "2023-01-15",
      end_date: "2023-12-15",
      funding_amount: 1200000,
      sector: "Healthcare",
      region: "North",
      organization: "Team Alpha",
      created_at: new Date("2023-01-01").toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "PRJ-2023-002",
      title: "Sustainable Energy Storage Solutions",
      description: "Researching novel materials for high-capacity batteries with improved sustainability and reduced environmental impact.",
      status: "active",
      progress: 42,
      start_date: "2023-03-10",
      end_date: "2024-03-10",
      funding_amount: 850000,
      sector: "Energy",
      region: "Center",
      organization: "Green Energy Lab",
      created_at: new Date("2023-02-15").toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  ani_metrics: [
    {
      id: "1",
      name: "R&D Investment",
      value: 1250000000,
      unit: "EUR",
      category: "Investment",
      region: "Portugal",
      measurement_date: new Date("2023-01-01").toISOString(),
      created_at: new Date("2023-02-15").toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      name: "Patent Applications",
      value: 450,
      unit: "Count",
      category: "Patents",
      region: "Portugal",
      measurement_date: new Date("2023-01-01").toISOString(),
      created_at: new Date("2023-02-15").toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  pdf_reports: [
    {
      id: "report-1",
      report_title: "Innovation Metrics 2023",
      report_content: "<h2>Innovation Metrics 2023</h2><p>This report presents the key innovation metrics for Portugal in 2023.</p><ul><li>R&D Investment: €1.25B</li><li>Patent Applications: 450</li></ul>",
      report_status: "published",
      created_at: new Date("2023-03-15").toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

// Initialize the local database with mock data
export const initializeLocalDatabase = () => {
  console.log("Initializing local database with mock data...");
  localStorage.setItem('localDatabase', JSON.stringify(mockData));
  console.log("Local database initialized with the following tables:", Object.keys(mockData));
  return mockData;
};

// Get data from the local database
export const getLocalDatabaseData = (table: string) => {
  const dbJson = localStorage.getItem('localDatabase');
  if (!dbJson) {
    console.warn("Local database not initialized. Initializing now...");
    const db = initializeLocalDatabase();
    return db[table] || [];
  }
  
  const db = JSON.parse(dbJson);
  return db[table] || [];
};

// Clear the local database
export const clearLocalDatabase = () => {
  localStorage.removeItem('localDatabase');
  console.log("Local database cleared");
};

// Local database object that can be used for queries
export const localDatabase = {
  tables: mockData,
  select: (table: string) => {
    try {
      const data = getLocalDatabaseData(table);
      return data;
    } catch (error) {
      console.error(`Error selecting from ${table}:`, error);
      return [];
    }
  },
  insert: (table: string, data: any) => {
    try {
      const dbJson = localStorage.getItem('localDatabase');
      if (!dbJson) {
        console.warn("Local database not initialized. Initializing now...");
        initializeLocalDatabase();
      }
      
      const db = JSON.parse(localStorage.getItem('localDatabase') || '{}');
      
      if (!db[table]) {
        db[table] = [];
      }
      
      const newItem = {
        id: `${table}-${Date.now()}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      db[table].push(newItem);
      localStorage.setItem('localDatabase', JSON.stringify(db));
      
      return newItem;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      return null;
    }
  }
};
