const userProfile = {
    username: "T R A P S",
 memberSince: new Date('2020-03-31T12:00:00'),
    roles: [
        { name: 'Desarrollador de Javascript', color: '#f7df1e' },
        { name: 'Desarrollador de C++', color: '#5c8dbc' },
        { name: 'Desarrollador de C#', color: '#953dac' },
        { name: 'Programador', color: '#8b5cf6' },
        { name: 'Estudiante', color: '#f59e0b' },
        { name: 'Gamer', color: '#ef4444' }
    ]
};

function renderRoles() {
    const container = document.getElementById('rolesContainer');
    if (!container) return;

    container.innerHTML = userProfile.roles
        .map(role => `
            <div class="role-tag" style="background: ${role.color}20; border: 1px solid ${role.color}40;">
                <span class="role-dot" style="background: ${role.color};"></span>
                <span>${role.name}</span>
            </div>
        `)
        .join('');
}

function updateMemberSince() {
    const element = document.getElementById('memberSince');
    if (!element) return;

    element.textContent = userProfile.memberSince.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Cargar posts desde Supabase
async function loadPosts() {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        renderPosts(posts || []);
    } catch (error) {
        console.error('Error cargando posts:', error);
        document.getElementById('emptyBlog').style.display = 'block';
    }
}

function renderPosts(posts) {
    const container = document.getElementById('postsContainer');
    const emptyBlog = document.getElementById('emptyBlog');

    if (!posts || posts.length === 0) {
        emptyBlog.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    emptyBlog.style.display = 'none';
    container.innerHTML = posts.map(post => createPostHTML(post)).join('');
}

function createPostHTML(post) {
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const categoryIcons = {
        desarrollo: '💻',
        gaming: '🎮',
        aprendizaje: '📚',
        proyectos: '🚀',
        personal: '✨'
    };

    const imageHTML = post.image ? `
        <div class="post-image-container">
            <img src="${post.image}" alt="${post.title}" class="post-image" onclick="window.open(this.src)">
        </div>
    ` : '';

    return `
        <article class="blog-post">
            <div class="post-header-content">
                <div class="post-title-group">
                    <span class="post-category category-${post.category}">
                        ${categoryIcons[post.category]} ${post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                    <h3>${post.title}</h3>
                    <div class="post-meta">
                        <span>
                            <i class="fas fa-calendar"></i>
                            ${formattedDate}
                        </span>
                        <span>
                            <i class="fas fa-clock"></i>
                            ${formattedTime}
                        </span>
                        ${post.edited ? '<span><i class="fas fa-edit"></i> Editado</span>' : ''}
                    </div>
                </div>
            </div>
            ${imageHTML}
            <div class="post-content">${post.content}</div>
        </article>
    `;
}


document.addEventListener('DOMContentLoaded', () => {
    renderRoles();
    updateMemberSince();
    loadPosts();
    addAnimations();
});



