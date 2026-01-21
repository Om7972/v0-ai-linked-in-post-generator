import { NextResponse } from "next/server";

// Import the Supabase client from the project
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    console.log('Testing Supabase database connection...');
    
    // Create a Supabase client
    const supabase = createServerSupabaseClient();
    
    // Test basic connection by querying the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.error('Error details:', error);
      
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: error.message
      }, { status: 500 });
    }
    
    console.log('✅ Database connection successful!');
    
    // Test other tables
    const tables = ['posts', 'drafts', 'usage'] as const;
    const tableStatuses: Record<string, { accessible: boolean; error?: string; recordCount?: number }> = {};
    
    for (const table of tables) {
      try {
        let selectField = 'id';
        if (table === 'usage') {
          selectField = 'user_id'; // usage table uses user_id as PK instead of id
        }
        
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select(selectField)
          .limit(1);
        
        if (tableError) {
          console.warn(`⚠️  Table '${table}' access issue:`, tableError.message);
          tableStatuses[table] = { accessible: false, error: tableError.message };
        } else {
          console.log(`✅ Table '${table}' accessible`);
          tableStatuses[table] = { accessible: true, recordCount: tableData?.length || 0 };
        }
      } catch (tableErr: any) {
        console.warn(`⚠️  Table '${table}' error:`, tableErr);
        tableStatuses[table] = { accessible: false, error: tableErr.message };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      tables: tableStatuses,
      profileRecordsFound: data?.length || 0
    });
  } catch (error: any) {
    console.error('❌ Failed to create Supabase client:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create Supabase client',
      error: error.message
    }, { status: 500 });
  }
}