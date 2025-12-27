
import { supabase } from './supabase-client.js';

// Fetch blogs from Supabase and render them
async function loadBlogs() {
    const blogGrid = document.querySelector('.blog-item-grid .row');
    const recentPosts = document.querySelector('.sidebar-widget h4 + .recent-post')?.parentElement;
    
    if (!blogGrid) return;

    try {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Clear existing content
        blogGrid.innerHTML = '';
        
        // Render blog cards
        blogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.className = 'col-md-6';
            blogCard.innerHTML = `
                <div class="single-blog">
                    <div class="blog-thumb">
                        <a href="/blog/${blog.slug}/"><img src="${blog.thumbnail}" alt="${blog.title}"></a>
                        <div class="tag">
                            <a href="/blog/category/${blog.category?.toLowerCase()}/">${blog.category || 'General'}</a>
                        </div>
                    </div>
                    <div class="blog-inner">
                        <div class="author-date">
                            <a href="#">By, ${blog.author || 'Admin'}</a>
                            <a href="#">${new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</a>
                        </div>
                        <h4><a href="/blog/${blog.slug}/">${blog.title}</a></h4>
                    </div>
                </div>
            `;
            blogGrid.appendChild(blogCard);
        });

        // Update Recent Posts in Sidebar
        if (recentPosts) {
            // Clear existing recent posts (keep the h4)
            const h4 = recentPosts.querySelector('h4');
            recentPosts.innerHTML = '';
            if (h4) recentPosts.appendChild(h4);
            
            // Add recent posts (first 3)
            blogs.slice(0, 3).forEach(blog => {
                const postEl = document.createElement('div');
                postEl.className = 'recent-post';
                postEl.innerHTML = `
                    <div class="recent-thumb">
                        <a href="/blog/${blog.slug}/"><img src="${blog.thumbnail}" style="border-radius:5px;" alt="thumbnail"></a>
                    </div>
                    <div class="recent-post-cnt">
                        <span>${new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <h5><a href="/blog/${blog.slug}/">${blog.title}</a></h5>
                    </div>
                `;
                recentPosts.appendChild(postEl);
            });
        }

    } catch (err) {
        console.error('Error loading blogs:', err);
        blogGrid.innerHTML = `<div class="col-12"><p class="text-danger">Error loading blogs. Please try again later.</p></div>`;
    }
}

// Fetch blog categories
async function loadCategories() {
    const categoriesList = document.querySelector('.sidebar-widget .category');
    
    if (!categoriesList) return;

    try {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select('category');

        if (error) throw error;

        // Get unique categories
        const categories = [...new Set(blogs.map(b => b.category).filter(Boolean))];
        
        // Clear and render
        categoriesList.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/blog/category/${category.toLowerCase()}/">${category}<i class="bi bi-arrow-right"></i></a>`;
            categoriesList.appendChild(li);
        });

    } catch (err) {
        console.error('Error loading categories:', err);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Only run on blog pages
    if (window.location.pathname.includes('/blogs') || window.location.pathname.includes('/blog')) {
        loadBlogs();
        loadCategories();
    }
});

export { loadBlogs, loadCategories };
