let isAuthenticated = false;
let posts = [];
let editingPostId = null;
let currentImage = null;


function checkPassword() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        isAuthenticated = true;
        document.getElementById('authPanel').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadPosts();
        setupEventListeners();
    } else {
        alert('❌ Contraseña incorrecta');
        document.getElementById('adminPassword').value = '';
    }
}


function logout() {
    isAuthenticated = false;
    document.getElementById('authPanel').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}


function setupEventListeners() {
    document.getElementById('btnNewPost').onclick = showForm;
    document.getElementById('btnCloseForm').onclick = hideForm;
    document.getElementById('btnCancel').onclick = hideForm;
    document.getElementById('btnPublish').onclick = publishPost;
    document.getElementById('postImage').onchange = handleImageUpload;
    document.getElementById('btnRemoveImage').onclick = removeImage;
}


function showForm() {
    document.getElementById('postForm').style.display = 'block';
    document.getElementById('postTitle').focus();
}


function hideForm() {
    document.getElementById('postForm').style.display = 'none';
    clearForm();
}


function clearForm() {
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postCategory').value = 'desarrollo';
    removeImage();
    editingPostId = null;
}


// ✅ FUNCIÓN AGREGADA - Redimensionar imagen a 16:9
async function resizeImageTo16x9(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onerror = () => reject(new Error('Error al cargar la imagen'));
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calcular dimensiones 16:9
                const targetRatio = 16 / 9;
                let width = img.width;
                let height = img.height;
                const imgRatio = width / height;
                
                // Ajustar al ratio 16:9 (crop center)
                if (imgRatio > targetRatio) {
                    // Imagen muy ancha, recortar los lados
                    width = height * targetRatio;
                } else {
                    // Imagen muy alta, recortar arriba/abajo
                    height = width / targetRatio;
                }
                
                // Establecer tamaño del canvas (máximo 1920px de ancho)
                const maxWidth = 1920;
                canvas.width = Math.min(width, maxWidth);
                canvas.height = canvas.width / targetRatio;
                
                // Calcular offset para centrar el crop
                const offsetX = (img.width - width) / 2;
                const offsetY = (img.height - height) / 2;
                
                // Dibujar imagen redimensionada y recortada
                ctx.drawImage(
                    img,
                    offsetX, offsetY, width, height,  // source
                    0, 0, canvas.width, canvas.height  // destination
                );
                
                // Convertir a base64 (JPEG con 85% calidad)
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    });
}


async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('⚠️ Selecciona una imagen');
        e.target.value = '';
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ Imagen muy grande. Máximo 5MB');
        e.target.value = '';
        return;
    }

    try {
        // Redimensionar a 16:9
        currentImage = await resizeImageTo16x9(file);
        document.getElementById('previewImg').src = currentImage;
        document.getElementById('imagePreview').style.display = 'block';
    } catch (error) {
        console.error('Error al procesar imagen:', error);
        alert('❌ Error al procesar la imagen');
        e.target.value = '';
    }
}


function removeImage() {
    currentImage = null;
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('postImage').value = '';
}


async function publishPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const category = document.getElementById('postCategory').value;

    if (!title || !content) {
        alert('⚠️ Completa título y contenido');
        return;
    }

    try {
        if (editingPostId) {
            await updatePost(editingPostId, title, content, category, currentImage);
        } else {
            await createPost(title, content, category, currentImage);
        }

        hideForm();
        await loadPosts();
        alert('✅ Post guardado correctamente');
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('❌ Error al guardar el post: ' + error.message);
    }
}


async function createPost(title, content, category, image) {
    const { data, error } = await supabase
        .from('posts')
        .insert([
            {
                title,
                content,
                category,
                image,
                date: new Date().toISOString(),
                edited: false
            }
        ])
        .select();

    if (error) throw error;
    return data;
}


async function updatePost(id, title, content, category, image) {
    const updateData = {
        title,
        content,
        category,
        edited: true
    };

    if (image !== null) {
        updateData.image = image;
    }

    const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
}


async function deletePost(id) {
    if (!confirm('¿Eliminar esta publicación?')) return;
    
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await loadPosts();
        alert('✅ Post eliminado');
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('❌ Error al eliminar: ' + error.message);
    }
}


async function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postCategory').value = post.category;
    
    if (post.image) {
        currentImage = post.image;
        document.getElementById('previewImg').src = post.image;
        document.getElementById('imagePreview').style.display = 'block';
    }
    
    editingPostId = id;
    showForm();
}


async function loadPosts() {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        posts = data || [];
        renderPosts();
    } catch (error) {
        console.error('Error al cargar posts:', error);
        alert('❌ Error al cargar posts: ' + error.message);
        posts = [];
        renderPosts();
    }
}


function renderPosts() {
    const container = document.getElementById('postsContainer');
    const emptyBlog = document.getElementById('emptyBlog');

    if (posts.length === 0) {
        container.innerHTML = '';
        emptyBlog.style.display = 'block';
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
            <img src="${post.image}" alt="${post.title}" class="post-image">
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
                        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="fas fa-clock"></i> ${formattedTime}</span>
                        ${post.edited ? '<span><i class="fas fa-edit"></i> Editado</span>' : ''}
                    </div>
                </div>
            </div>
            ${imageHTML}
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <button class="btn-edit" onclick="editPost(${post.id})">
                    <i class="fas fa-pen"></i> Editar
                </button>
                <button class="btn-delete" onclick="deletePost(${post.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </article>
    `;
}

