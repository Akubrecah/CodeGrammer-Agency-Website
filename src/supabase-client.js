
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://segefuamwyefwcwukkfh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZ2VmdWFtd3llZndjd3Vra2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MjM1NjYsImV4cCI6MjA4MjA5OTU2Nn0.FBHqMDcYWNsOZJ9_cMf7XBmWO_gu01TKiqYSkT52_PU'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch all projects
export async function getProjects() {
    const { data, error } = await supabase
        .from('company_projects')
        .select('*')
        .order('created_at', { ascending: false })
    
    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }
    return data
}

// Fetch all services
export async function getServices() {
    const { data, error } = await supabase
        .from('company_services')
        .select('*')
        .order('created_at', { ascending: true })
    
    if (error) {
        console.error('Error fetching services:', error)
        return []
    }
    return data
}

// Submit contact form
export async function submitContact(formData) {
    const { data, error } = await supabase
        .from('contact_messages')
        .insert([formData])
    
    if (error) {
        console.error('Error submitting form:', error)
        return { success: false, message: error.message }
    }
    return { success: true, message: 'Message sent successfully!' }
}
