import { createClient } from '@supabase/supabase-js'

// Note: Environment variables should be loaded via Next.js when running this in the development environment

// Test database connection
async function testDatabaseConnection() {
  console.log('Testing Supabase database connection...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables')
    console.error('Expected: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return
  }
  
  console.log('✅ Environment variables found')
  console.log(`Supabase URL: ${supabaseUrl}`)
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test basic connection by querying the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      console.error('Error details:', error)
      return
    }
    
    console.log('✅ Database connection successful!')
    console.log(`Profiles table accessible. Found ${data?.length || 0} records (limited query)`)
    
    // Test other tables
    const tables = ['posts', 'drafts', 'usage']
    
    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        if (tableError) {
          console.warn(`⚠️  Table '${table}' access issue:`, tableError.message)
        } else {
          console.log(`✅ Table '${table}' accessible`)
        }
      } catch (tableErr) {
        console.warn(`⚠️  Table '${table}' error:`, tableErr)
      }
    }
    
  } catch (err) {
    console.error('❌ Failed to create Supabase client:', err)
  }
}

// Run the test
testDatabaseConnection().catch(console.error)